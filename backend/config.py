"""
Production Configuration Module for Cairn Governance Platform.
Reads from environment variables with safe defaults for local dev.
"""
import os
from typing import List


class Settings:
    # ── App Identity ───────────────────────────────────────────────────
    APP_NAME: str = "Cairn Agentic Commerce Governance API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development | production

    # ── CORS ───────────────────────────────────────────────────────────
    # In production, set ALLOWED_ORIGINS="https://your-domain.com,https://www.your-domain.com"
    _raw_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173")
    ALLOWED_ORIGINS: List[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

    # ── Database ───────────────────────────────────────────────────────
    # Set DATABASE_URL=postgresql+asyncpg://user:pass@host/db for production PostgreSQL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'cairn.db')}"
    )

    # ── API Keys / Secrets ─────────────────────────────────────────────
    # Generate a strong random key: python -c "import secrets; print(secrets.token_hex(32))"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE-ME-IN-PRODUCTION-USE-32-BYTES-MIN")
    API_KEY_HEADER: str = "X-Cairn-API-Key"
    INTERNAL_API_KEY: str = os.getenv("INTERNAL_API_KEY", "dev-internal-key")

    # ── Rate Limiting ──────────────────────────────────────────────────
    # Requests per minute per client IP
    RATE_LIMIT_CHAT: str = os.getenv("RATE_LIMIT_CHAT", "20/minute")
    RATE_LIMIT_GOVERNANCE: str = os.getenv("RATE_LIMIT_GOVERNANCE", "60/minute")
    RATE_LIMIT_DEFAULT: str = os.getenv("RATE_LIMIT_DEFAULT", "120/minute")

    # ── LLM / Ollama ──────────────────────────────────────────────────
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:1b")
    LLM_TIMEOUT_SECONDS: float = float(os.getenv("LLM_TIMEOUT_SECONDS", "20.0"))

    # ── Governance SLA Thresholds ──────────────────────────────────────
    GOV_LATENCY_SLA_MS: float = float(os.getenv("GOV_LATENCY_SLA_MS", "500.0"))
    LLM_LATENCY_SLA_S: float = float(os.getenv("LLM_LATENCY_SLA_S", "5.0"))

    # ── Logging ───────────────────────────────────────────────────────
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT", "json")  # json | text

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def cors_origins(self) -> List[str]:
        """Return wildcard only in dev; strict list in production."""
        if self.is_production:
            return self.ALLOWED_ORIGINS
        return ["*"]


settings = Settings()

