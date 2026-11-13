import json
import urllib.error

from backend.agents.llm_client import LLMClient


class FakeResponse:
    def __init__(self, data):
        self.data = json.dumps(data).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return None

    def read(self):
        return self.data


def test_generate_agent_thought_uses_configured_ollama_endpoint_and_model(monkeypatch):
    client = LLMClient(
        model_name="llama3.2:1b",
        base_url="http://ollama.test/",
        timeout_seconds=2.0
    )
    captured = {}

    def fake_urlopen(request, timeout):
        captured["url"] = request.full_url
        captured["timeout"] = timeout
        captured["payload"] = json.loads(request.data.decode("utf-8"))
        return FakeResponse({"response": "Ready."})

    monkeypatch.setattr("backend.agents.llm_client.urllib.request.urlopen", fake_urlopen)

    result = client.generate_agent_thought("Say ready.", "Reply briefly.")

    assert captured["url"] == "http://ollama.test/api/generate"
    assert captured["timeout"] == 2.0
    assert captured["payload"]["model"] == "llama3.2:1b"
    assert captured["payload"]["stream"] is False
    assert result["text"] == "Ready."
    assert result["provider"] == "ollama/llama3.2:1b"
    assert result["fallback_used"] is False


def test_generate_agent_thought_reports_fallback_when_ollama_is_unreachable(monkeypatch):
    client = LLMClient(model_name="llama3.2:1b", base_url="http://ollama.test")

    def fail_urlopen(request, timeout):
        raise urllib.error.URLError("connection refused")

    monkeypatch.setattr("backend.agents.llm_client.urllib.request.urlopen", fail_urlopen)

    result = client.generate_agent_thought("Say ready.", "Reply briefly.")

    assert result["fallback_used"] is True
    assert result["fallback_reason"] == "service_unreachable"
    assert result["provider"] == "cairn-deterministic-fallback"
    assert "Ollama inference was unavailable" in result["text"]


def test_health_check_reports_configured_model_availability(monkeypatch):
    client = LLMClient(model_name="llama3.2:1b", base_url="http://ollama.test")

    def fake_urlopen(request, timeout):
        return FakeResponse({"models": [{"name": "llama3.2:1b"}]})

    monkeypatch.setattr("backend.agents.llm_client.urllib.request.urlopen", fake_urlopen)

    result = client.health_check()

    assert result == {
        "provider": "ollama",
        "model": "llama3.2:1b",
        "available": True,
        "reason": None
    }
