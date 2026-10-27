"""Adversarial unit tests for heading-audit consistency gate."""
import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "verify_r214_audit.py"
spec = importlib.util.spec_from_file_location("r214_verify", SCRIPT)
verify = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verify)


def example():
    return {"schemaVersion": "r214-headings-reproducible-v1", "purpose": "AUDIT_ONLY_NOT_PUBLICATION",
            "sourceSha256": "a"*64, "pdfPages": 3, "records": [
                {"number": 1, "pdfPage": 1, "rawNumber": "1", "kind": "invocation"},
                {"number": 97, "pdfPage": 2, "rawNumber": "9 7", "kind": "place_heading"}],
            "occurrences": 2, "uniqueNumbers": 2,
            "unmatchedNumbers": sorted(set(range(1, 1327)) - {1, 97}), "repeatedNumbers": {}}


class TestAuditGate(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(verify.validate(example()), [])

    def test_count_tampering(self):
        data = example(); data["uniqueNumbers"] = 1326
        self.assertTrue(verify.validate(data))

    def test_spaced_digit_corruption(self):
        data = example(); data["records"][1]["number"] = 9
        self.assertTrue(any("rawNumber" in e for e in verify.validate(data)))

    def test_rights_claim_is_not_audit(self):
        data = example(); data["purpose"] = "PUBLISHABLE"
        self.assertTrue(verify.validate(data))

    def test_out_of_range_page(self):
        data = example(); data["records"][1]["pdfPage"] = 9
        self.assertTrue(verify.validate(data))

    def test_invented_duplicate(self):
        data = example(); data["repeatedNumbers"] = {"97": 2}
        self.assertTrue(verify.validate(data))

    def test_malformed_record(self):
        data = example(); data["records"].append("invalid")
        self.assertTrue(verify.validate(data))


if __name__ == "__main__":
    unittest.main()
