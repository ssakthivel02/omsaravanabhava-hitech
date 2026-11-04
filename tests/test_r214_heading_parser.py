"""Regression tests for R2.14 PDF heading audit. Never certify publication rights."""
import importlib.util
import os
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "audit_r214_headings.py"
spec = importlib.util.spec_from_file_location("audit_r214_headings", SCRIPT)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class HeadingPatternTests(unittest.TestCase):
    def test_spaced_digits_recover_exact_numbers(self):
        examples = {"9 7": 97, "23 1": 231, "49 0": 490,
                    "55 7": 557, "118 0": 1180, "124 0": 1240}
        for raw, expected in examples.items():
            with self.subTest(raw=raw):
                match = audit.STANDARD.search(f"பாடல் {raw} (திருத்தணி)")
                self.assertIsNotNone(match)
                self.assertEqual(int("".join(match.group(1).split())), expected)

    def test_malformed_numeric_heading_not_treated_as_114(self):
        self.assertIsNone(audit.STANDARD.search("பாடல் 114த (பொதுப்பாடல்கள்)"))

    def test_numeric_114_heading_detected(self):
        self.assertIsNotNone(audit.STANDARD.search("பாடல் 114 (பொதுப்பாடல்கள்)"))

    def test_invocation_heading(self):
        self.assertIsNotNone(audit.INVOCATION.search("பாடல் 1 விநாயகர்"))

    @unittest.skipUnless(os.environ.get("R214_SOURCE_PDF"), "Set R214_SOURCE_PDF for source-backed audit")
    def test_original_pdf_invariants(self):
        report = audit.scan(os.environ["R214_SOURCE_PDF"])
        self.assertEqual(report["sourceSha256"], "d4133d7e32625f49d5184d624f07ae131639f1d8d9d817c91d007ad53ee16e9f")
        self.assertEqual(report["pdfPages"], 2191)
        self.assertEqual(report["occurrences"], 1330)
        self.assertEqual(report["uniqueNumbers"], 1320)
        self.assertEqual(report["unmatchedNumbers"], [93, 102, 203, 206, 1141, 1199])
        self.assertEqual(len(report["repeatedNumbers"]), 10)
        self.assertEqual(report["purpose"], "AUDIT_ONLY_NOT_PUBLICATION")


if __name__ == "__main__":
    unittest.main()
