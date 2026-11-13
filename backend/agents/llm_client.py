"""
LLM Client supporting local open-weights inference (Ollama / HuggingFace)
with automatic fallback and SLA latency monitoring.
Aligned with LLM_SLA.docx Section 1 & 2.
"""

import time
import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

from ..config import settings

logger = logging.getLogger("cairn.llm")

class LLMClient:
    def __init__(
        self,
        model_name: Optional[str] = None,
        timeout_seconds: Optional[float] = None,
        base_url: Optional[str] = None
    ):
        self.model_name = model_name or settings.OLLAMA_MODEL
        self.timeout_seconds = timeout_seconds or settings.LLM_TIMEOUT_SECONDS
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")

    def health_check(self, timeout_seconds: float = 1.0) -> Dict[str, Any]:
        request = urllib.request.Request(f"{self.base_url}/api/tags")
        try:
            with urllib.request.urlopen(request, timeout=timeout_seconds) as response:
                data = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            return {
                "provider": "ollama",
                "model": self.model_name,
                "available": False,
                "reason": f"http_{error.code}"
            }
        except urllib.error.URLError:
            return {
                "provider": "ollama",
                "model": self.model_name,
                "available": False,
                "reason": "service_unreachable"
            }
        except (OSError, json.JSONDecodeError, UnicodeDecodeError):
            return {
                "provider": "ollama",
                "model": self.model_name,
                "available": False,
                "reason": "health_check_failed"
            }

        models = data.get("models", []) if isinstance(data, dict) else []
        installed_models = {
            model.get("name")
            for model in models
            if isinstance(model, dict)
        }
        available = self.model_name in installed_models
        return {
            "provider": "ollama",
            "model": self.model_name,
            "available": available,
            "reason": None if available else "model_not_installed"
        }

    def generate_agent_thought(self, prompt: str, system_prompt: str) -> Dict[str, Any]:
        """
        Executes inference against local open-weight LLM runtime (Ollama)
        with strict bounded timeout and graceful fallback to satisfy SLA response time.
        """
        t_start = time.perf_counter()
        
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False,
            "keep_alive": "5m",
            "options": {
                "temperature": 0.2,
                "top_p": 0.9,
                "num_predict": 128
            }
        }

        try:
            req = urllib.request.Request(
                f"{self.base_url}/api/generate",
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=self.timeout_seconds) as response:
                data = json.loads(response.read().decode("utf-8"))
            if isinstance(data, dict) and isinstance(data.get("response"), str) and data["response"].strip():
                latency_ms = round((time.perf_counter() - t_start) * 1000.0, 2)
                return {
                    "text": data["response"].strip(),
                    "provider": f"ollama/{self.model_name}",
                    "latency_ms": latency_ms,
                    "fallback_used": False,
                    "fallback_reason": None
                }
            fallback_reason = "invalid_response"
        except urllib.error.HTTPError as error:
            fallback_reason = f"http_{error.code}"
            logger.warning("Ollama returned HTTP %s", error.code)
        except urllib.error.URLError as error:
            fallback_reason = "service_unreachable"
            logger.warning("Ollama request failed: %s", error.reason)
        except TimeoutError:
            fallback_reason = "timeout"
            logger.warning("Ollama request timed out after %.1f seconds", self.timeout_seconds)
        except OSError as error:
            fallback_reason = "network_error"
            logger.warning("Ollama network error: %s", type(error).__name__)
        except (json.JSONDecodeError, UnicodeDecodeError):
            fallback_reason = "invalid_response"
            logger.warning("Ollama returned an invalid response")

        latency_ms = round((time.perf_counter() - t_start) * 1000.0, 2)
        return {
            "text": "Ollama inference was unavailable; deterministic catalog and governance checks remain active.",
            "provider": "cairn-deterministic-fallback",
            "latency_ms": latency_ms,
            "fallback_used": True,
            "fallback_reason": fallback_reason
        }

llm_client = LLMClient()

