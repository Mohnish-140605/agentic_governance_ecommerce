"""
PDF Catalog Ingestion & Extraction Service.
100% Free & Local - Requires Zero API Keys.
Extracts product listings, pricing, specs, categories, and inventory counts from PDF documents.
Supports both structured PDF tables and semi-structured text blocks.
"""

import io
import re
import uuid
from typing import List, Dict, Any, Optional

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    import pypdf
except ImportError:
    pypdf = None


def _clean_price(val: Any) -> Optional[float]:
    """Extract numeric price in INR from string or number."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val) if val > 0 else None
    
    text = str(val).strip()
    # Remove currency symbols and comma separators
    cleaned = re.sub(r'[₹$€£,]|(?:rs\.?|inr)\s*', '', text, flags=re.IGNORECASE).strip()
    # Find decimal or integer pattern
    match = re.search(r'\b\d+(?:\.\d+)?\b', cleaned)
    if match:
        try:
            num = float(match.group(0))
            return num if num > 0 else None
        except ValueError:
            pass
    return None


def _clean_stock(val: Any, default: int = 10) -> int:
    """Extract numeric inventory quantity."""
    if val is None:
        return default
    if isinstance(val, int):
        return max(0, val)
    if isinstance(val, float):
        return max(0, int(val))
    
    match = re.search(r'\b\d+\b', str(val))
    if match:
        try:
            return max(0, int(match.group(0)))
        except ValueError:
            pass
    return default


def _infer_category(title: str, existing_cat: Optional[str] = None) -> str:
    """Infer product category from title or existing hint."""
    if existing_cat and len(existing_cat.strip()) > 1:
        clean_c = existing_cat.strip().capitalize()
        if clean_c.lower() not in ("item", "product", "general", "n/a", "none"):
            return clean_c

    t = title.lower()
    if any(k in t for k in ["laptop", "macbook", "thinkpad", "desktop", "notebook", "intel", "ryzen", "pc"]):
        return "Hardware"
    if any(k in t for k in ["headphone", "earphone", "audio", "speaker", "soundbar", "mic", "anc"]):
        return "Audio"
    if any(k in t for k in ["monitor", "display", "screen", "keyboard", "mouse", "hub", "dock", "adapter", "cable", "stand"]):
        return "Display & Accessories"
    if any(k in t for k in ["phone", "mobile", "iphone", "pixel", "galaxy", "smartphone"]):
        return "Electronics"
    if any(k in t for k in ["coffee", "tea", "brewer", "mug", "cup", "ceramic", "kettle", "carafe", "kitchen", "pantry"]):
        return "Kitchen & Pantry"
    if any(k in t for k in ["desk", "chair", "shelf", "lamp", "clock", "table", "mat", "decor", "cushion"]):
        return "Living & Home"
    if any(k in t for k in ["shirt", "t-shirt", "hoodie", "apparel", "wear", "shoes", "jacket"]):
        return "Apparel"
    
    return "Living"


def _extract_from_tables(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """Extract products from PDF table elements using pdfplumber."""
    if not pdfplumber:
        return []
    
    products: List[Dict[str, Any]] = []
    
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    if not table or len(table) < 2:
                        continue
                    
                    # Normalize header row
                    headers = [str(c or "").strip().lower() for c in table[0]]
                    
                    # Identify column indices
                    name_idx = None
                    price_idx = None
                    cat_idx = None
                    stock_idx = None
                    specs_idx = None

                    for i, h in enumerate(headers):
                        if any(k in h for k in ["product", "name", "title", "item", "description"]) and name_idx is None:
                            name_idx = i
                        elif any(k in h for k in ["price", "mrp", "cost", "rate", "inr", "₹", "amount"]) and price_idx is None:
                            price_idx = i
                        elif any(k in h for k in ["category", "type", "dept", "department"]) and cat_idx is None:
                            cat_idx = i
                        elif any(k in h for k in ["stock", "qty", "quantity", "inventory", "available"]) and stock_idx is None:
                            stock_idx = i
                        elif any(k in h for k in ["spec", "details", "features", "configuration", "notes"]) and specs_idx is None:
                            specs_idx = i
                    
                    # If we found at least name and price columns
                    if name_idx is not None and price_idx is not None:
                        for row in table[1:]:
                            if not row or len(row) <= max(name_idx, price_idx):
                                continue
                            raw_name = re.sub(r'\s+', ' ', str(row[name_idx] or '')).strip()
                            raw_price = row[price_idx]
                            
                            # Skip header re-matches or empty rows
                            if not raw_name or len(raw_name) < 2 or raw_name.lower() in ("product", "name", "title", "total"):
                                continue
                            
                            price = _clean_price(raw_price)
                            if not price or price <= 0:
                                continue
                            
                            raw_cat = re.sub(r'\s+', ' ', str(row[cat_idx] or '')).strip() if cat_idx is not None and len(row) > cat_idx else None
                            category = _infer_category(raw_name, raw_cat)
                            
                            raw_stock = row[stock_idx] if stock_idx is not None and len(row) > stock_idx else None
                            stock = _clean_stock(raw_stock, default=10)
                            
                            raw_specs = re.sub(r'\s+', ' ', str(row[specs_idx] or '')).strip() if specs_idx is not None and len(row) > specs_idx else ""
                            if not raw_specs:
                                raw_specs = f"{category} · Verified Merchant Specification"
                            
                            slug = re.sub(r'[^a-z0-9]+', '-', raw_name.lower()).strip('-')[:20]
                            sku_id = f"prod-pdf-{slug}-{uuid.uuid4().hex[:6]}"
                            
                            products.append({
                                "id": sku_id,
                                "name": raw_name,
                                "price": round(price, 2),
                                "category": category,
                                "stock": stock,
                                "specs": raw_specs,
                                "badge": "PDF Catalog Verified",
                                "status": "Verified & Active"
                            })
    except Exception as e:
        print(f"[pdf_catalog_parser] Table extraction notice: {e}")
        
    return products


def _extract_from_text(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """Extract products from freeform text lines using pattern recognition."""
    full_text = ""
    
    # 1. Try pdfplumber text extraction
    if pdfplumber:
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for page in pdf.pages:
                    txt = page.extract_text()
                    if txt:
                        full_text += txt + "\n"
        except Exception:
            pass

    # 2. Try pypdf fallback if empty
    if not full_text.strip() and pypdf:
        try:
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            for page in reader.pages:
                txt = page.extract_text()
                if txt:
                    full_text += txt + "\n"
        except Exception:
            pass
            
    if not full_text.strip():
        return []

    products: List[Dict[str, Any]] = []
    lines = [line.strip() for line in full_text.splitlines() if line.strip()]

    # Pattern A: Structured key-value blocks
    # e.g.,
    # Product: ThinkPad T14
    # Price: ₹85,000
    # Specs: 16GB RAM, 512GB SSD
    # Stock: 8
    # Category: Hardware
    current_product: Dict[str, Any] = {}
    
    for line in lines:
        lower = line.lower()
        if re.match(r'^(?:product|name|item|title)\s*[:\-]\s*(.+)', line, re.I):
            if current_product.get("name") and current_product.get("price"):
                current_product["category"] = _infer_category(current_product["name"], current_product.get("category"))
                current_product["stock"] = _clean_stock(current_product.get("stock"), 10)
                slug = re.sub(r'[^a-z0-9]+', '-', current_product["name"].lower()).strip('-')[:20]
                current_product["id"] = f"prod-pdf-{slug}-{uuid.uuid4().hex[:6]}"
                current_product["badge"] = "PDF Catalog Verified"
                current_product["status"] = "Verified & Active"
                products.append(current_product)
                current_product = {}
            m = re.match(r'^(?:product|name|item|title)\s*[:\-]\s*(.+)', line, re.I)
            current_product["name"] = m.group(1).strip()
        elif re.match(r'^(?:price|mrp|cost|rate)\s*[:\-]\s*(.+)', line, re.I):
            m = re.match(r'^(?:price|mrp|cost|rate)\s*[:\-]\s*(.+)', line, re.I)
            p = _clean_price(m.group(1))
            if p:
                current_product["price"] = p
        elif re.match(r'^(?:specs|specifications|details|features)\s*[:\-]\s*(.+)', line, re.I):
            m = re.match(r'^(?:specs|specifications|details|features)\s*[:\-]\s*(.+)', line, re.I)
            current_product["specs"] = m.group(1).strip()
        elif re.match(r'^(?:category|type)\s*[:\-]\s*(.+)', line, re.I):
            m = re.match(r'^(?:category|type)\s*[:\-]\s*(.+)', line, re.I)
            current_product["category"] = m.group(1).strip()
        elif re.match(r'^(?:stock|quantity|qty)\s*[:\-]\s*(.+)', line, re.I):
            m = re.match(r'^(?:stock|quantity|qty)\s*[:\-]\s*(.+)', line, re.I)
            current_product["stock"] = _clean_stock(m.group(1))

    if current_product.get("name") and current_product.get("price"):
        current_product["category"] = _infer_category(current_product["name"], current_product.get("category"))
        current_product["stock"] = _clean_stock(current_product.get("stock"), 10)
        slug = re.sub(r'[^a-z0-9]+', '-', current_product["name"].lower()).strip('-')[:20]
        current_product["id"] = f"prod-pdf-{slug}-{uuid.uuid4().hex[:6]}"
        current_product["badge"] = "PDF Catalog Verified"
        current_product["status"] = "Verified & Active"
        products.append(current_product)

    # Pattern B: Pipe or hyphen delimited lines (e.g., "ThinkPad X1 Carbon | ₹125,000 | 16GB RAM 1TB SSD | 5 units")
    if not products:
        for line in lines:
            parts = [p.strip() for p in re.split(r'\s*[|•;]\s*', line) if p.strip()]
            if len(parts) >= 2:
                # Test which part has price
                name = None
                price = None
                specs = []
                for idx, part in enumerate(parts):
                    p = _clean_price(part)
                    if p and p > 100 and price is None:
                        price = p
                    elif idx == 0 and not _clean_price(part):
                        name = part
                    else:
                        specs.append(part)
                
                if name and price and len(name) > 3:
                    cat = _infer_category(name)
                    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')[:20]
                    products.append({
                        "id": f"prod-pdf-{slug}-{uuid.uuid4().hex[:6]}",
                        "name": name,
                        "price": round(price, 2),
                        "category": cat,
                        "stock": 10,
                        "specs": " · ".join(specs) if specs else f"{cat} · Verified Listing",
                        "badge": "PDF Catalog Verified",
                        "status": "Verified & Active"
                    })

    # Pattern C: Line with Product Name followed by line with ₹ Price or Price in line
    if not products:
        i = 0
        while i < len(lines):
            line = lines[i]
            # Check if line has name and price: "Product Name - ₹12,999" or "Product Name: 12999"
            inline_match = re.search(r'^(.*?)\s*(?:[-–—:]|at)\s*(?:[₹$]|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\b', line, re.I)
            if inline_match:
                candidate_name = inline_match.group(1).strip()
                p = _clean_price(inline_match.group(2))
                if p and len(candidate_name) > 3 and not candidate_name.lower().startswith(("total", "subtotal", "tax", "page", "shipping")):
                    cat = _infer_category(candidate_name)
                    # Next line might be specs
                    specs = ""
                    if i + 1 < len(lines) and not re.search(r'[₹$]|rs\.?|inr|\b\d{4,}\b', lines[i + 1]):
                        specs = lines[i + 1].strip()
                        i += 1
                    slug = re.sub(r'[^a-z0-9]+', '-', candidate_name.lower()).strip('-')[:20]
                    products.append({
                        "id": f"prod-pdf-{slug}-{uuid.uuid4().hex[:6]}",
                        "name": candidate_name,
                        "price": round(p, 2),
                        "category": cat,
                        "stock": 10,
                        "specs": specs or f"{cat} · Verified Merchant Specification",
                        "badge": "PDF Catalog Verified",
                        "status": "Verified & Active"
                    })
            i += 1

    return products


def parse_pdf_catalog(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Main entry point: parses PDF bytes and extracts product listings.
    Tries table extraction first, falls back to text parsing.
    Deduplicates products by normalized name.
    """
    results = _extract_from_tables(pdf_bytes)
    
    if not results or len(results) < 2:
        text_results = _extract_from_text(pdf_bytes)
        # Combine or prefer text results if more were found
        if len(text_results) > len(results):
            results = text_results
        elif not results and text_results:
            results = text_results

    # Deduplicate by normalized name
    seen_names = set()
    deduped: List[Dict[str, Any]] = []
    for p in results:
        norm = re.sub(r'\s+', ' ', p["name"].strip().lower())
        if norm not in seen_names:
            seen_names.add(norm)
            deduped.append(p)
            
    return deduped
