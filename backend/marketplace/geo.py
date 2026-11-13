"""
Geolocation utilities for Cairn hyperlocal commerce.

- Haversine distance (km) — no external dependency.
- Service-area check via configurable radius (km) around vendor coordinates.
- Locality → coordinate resolution for Bengaluru demo localities.
- Buyer location resolution: explicit coords > locality name > IP fallback.

Privacy: buyer coordinates are used only for allocation scoring and are never
forwarded to LLM agents or vendors (vendors see locality + rounded distance).
"""

import math
from typing import Optional, Tuple, Dict, Any

EARTH_RADIUS_KM = 6371.0

# Approximate centroids of Bengaluru localities (synthetic demo data).
# These are NOT real business addresses — vendors are clearly labelled synthetic.
LOCALITY_COORDS: Dict[str, Tuple[float, float]] = {
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "indiranagar": (12.9716, 77.6412),
    "100ft road indiranagar": (12.9716, 77.6412),
    "koramangala": (12.9352, 77.6245),
    "hsr layout": (12.9116, 77.6474),
    "hsr": (12.9116, 77.6474),
    "whitefield": (12.9698, 77.7500),
    "jayanagar": (12.9250, 77.5938),
    "malleshwaram": (12.9856, 77.5700),
    "rajajinagar": (12.9970, 77.5580),
    "electronic city": (12.8456, 77.6600,
    ),
    "marathahalli": (12.9591, 77.7011),
    "btm layout": (12.9166, 77.6101),
    "btm": (12.9166, 77.6101),
    "jayanagar 4th block": (12.9260, 77.5950),
    "domlur": (12.9562, 77.6408),
    "sadashivanagar": (12.9790, 77.6400),
    "basavanagudi": (12.9400, 77.5700),
    "banashankari": (12.9250, 77.5400),
    "yelahanka": (13.1000, 77.5960),
    "hebbal": (13.0358, 77.5970),
}


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in kilometres."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(a))


def locality_to_coords(locality: str) -> Optional[Tuple[float, float]]:
    """Resolve a free-text locality/postal-area name to coordinates."""
    if not locality:
        return None
    key = locality.strip().lower()
    if key in LOCALITY_COORDS:
        return LOCALITY_COORDS[key]
    # Partial match fallback (e.g. "Indiranagar, Bengaluru")
    for name, coords in LOCALITY_COORDS.items():
        if name in key or key in name:
            return coords
    return None


def resolve_buyer_location(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Resolve buyer location from request payload.
    Priority: explicit lat/lng > locality name > IP geolocation (caller may pass).
    Returns dict with lat, lng, locality, source, precision ('exact'|'locality'|'ip').
    """
    lat = payload.get("lat") or payload.get("latitude")
    lng = payload.get("lng") or payload.get("longitude") or payload.get("lon")
    locality = payload.get("locality") or payload.get("delivery_locality") or payload.get("address")

    if lat is not None and lng is not None:
        try:
            return {
                "lat": float(lat), "lng": float(lng),
                "locality": locality or "Shared location",
                "source": "device", "precision": "exact",
            }
        except (TypeError, ValueError):
            pass

    coords = locality_to_coords(str(locality)) if locality else None
    if coords:
        return {
            "lat": coords[0], "lng": coords[1],
            "locality": str(locality), "source": "locality", "precision": "locality",
        }

    # IP-based fallback (Bengaluru default for demo)
    return {
        "lat": 12.9716, "lng": 77.5946,
        "locality": locality or "Bengaluru (approximate)",
        "source": "ip_fallback", "precision": "ip",
    }


def vendor_serves_buyer(vendor: Dict[str, Any], buyer: Dict[str, Any],
                       max_radius_km: Optional[float] = None) -> Tuple[bool, float]:
    """
    Check whether a vendor's service area covers the buyer location.
    Returns (eligible, distance_km). Vendor service radius defaults to its
    configured service_radius_km; max_radius_km can tighten it further.
    """
    vlat, vlng = vendor.get("lat"), vendor.get("lng")
    if vlat is None or vlng is None:
        return False, float("inf")
    dist = haversine_km(float(buyer["lat"]), float(buyer["lng"]), float(vlat), float(vlng))
    radius = float(vendor.get("service_radius_km") or 15.0)
    if max_radius_km is not None:
        radius = min(radius, float(max_radius_km))
    return dist <= radius, dist
