"""
SLA Monitoring and Telemetry Engine.
Records and aggregates performance against research targets in LLM_SLA.docx.
"""

from typing import List, Dict, Any
from ..models.schemas import SLATelemetryRecord

class SLAMonitor:
    def __init__(self):
        self.records: List[SLATelemetryRecord] = []

    def record_transaction(
        self,
        endpoint: str,
        llm_latency_ms: float,
        gov_latency_ms: float,
        structured_valid: bool = True,
        governance_enforced: bool = True,
        audit_logged: bool = True
    ) -> SLATelemetryRecord:
        record = SLATelemetryRecord(
            endpoint=endpoint,
            llm_latency_ms=llm_latency_ms,
            gov_latency_ms=gov_latency_ms,
            structured_output_valid=structured_valid,
            governance_enforced=governance_enforced,
            audit_logged=audit_logged,
            llm_target_met=(llm_latency_ms <= 5000.0),
            gov_target_met=(gov_latency_ms <= 500.0)
        )
        self.records.append(record)
        return record

    def get_aggregated_metrics(self) -> Dict[str, Any]:
        if not self.records:
            return {
                "total_evaluations": 0,
                "gov_p95_ms": None,
                "llm_p95_s": None,
                "gov_compliance_pct": None,
                "llm_compliance_pct": None,
                "validity_pct": None,
                "enforcement_pct": None,
                "audit_completeness_pct": None,
                "status": "NO_DATA"
            }

        total = len(self.records)
        gov_latencies = sorted([r.gov_latency_ms for r in self.records])
        llm_latencies = sorted([r.llm_latency_ms for r in self.records])

        p95_idx = int(total * 0.95)
        gov_p95 = gov_latencies[min(p95_idx, total - 1)]
        llm_p95 = llm_latencies[min(p95_idx, total - 1)] / 1000.0  # In seconds

        gov_met = sum(1 for r in self.records if r.gov_target_met)
        llm_met = sum(1 for r in self.records if r.llm_target_met)
        valid = sum(1 for r in self.records if r.structured_output_valid)
        enforced = sum(1 for r in self.records if r.governance_enforced)
        logged = sum(1 for r in self.records if r.audit_logged)
        gov_compliance_pct = round((gov_met / total) * 100.0, 1)
        llm_compliance_pct = round((llm_met / total) * 100.0, 1)
        validity_pct = round((valid / total) * 100.0, 1)
        enforcement_pct = round((enforced / total) * 100.0, 1)
        audit_completeness_pct = round((logged / total) * 100.0, 1)
        all_targets_met = (
            gov_compliance_pct == 100.0
            and llm_compliance_pct == 100.0
            and validity_pct >= 95.0
            and enforcement_pct == 100.0
            and audit_completeness_pct == 100.0
        )

        return {
            "total_evaluations": total,
            "gov_p95_ms": round(gov_p95, 2),
            "gov_target_ms": 500.0,
            "gov_compliance_pct": gov_compliance_pct,
            "llm_p95_s": round(llm_p95, 2),
            "llm_target_s": 5.0,
            "llm_compliance_pct": llm_compliance_pct,
            "validity_pct": validity_pct,
            "enforcement_pct": enforcement_pct,
            "audit_completeness_pct": audit_completeness_pct,
            "status": "ALL_TARGETS_HEALTHY" if all_targets_met else "TARGETS_AT_RISK"
        }

# Global singleton monitor
sla_monitor = SLAMonitor()

