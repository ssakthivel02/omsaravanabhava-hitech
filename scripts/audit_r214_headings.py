#!/usr/bin/env python3
"""Audit Tiruppugazh PDF headings. Does not certify canonical verses or publication rights.

python scripts/audit_r214_headings.py source.pdf --output heading-audit.json
Requires PyMuPDF (fitz). Do not commit source PDFs or raw verses.
"""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re

STANDARD = re.compile(r"பாடல்[ \t]+([0-9][0-9 \t]{0,9})\s*\(")
INVOCATION = re.compile(r"பாடல்[ \t]+([1-5])\s+(?:--\s*)?விநாயகர்")
EXPECTED = set(range(1, 1327))


def scan(pdf_path):
    import fitz
    pdf_path = Path(pdf_path)
    source_hash = hashlib.sha256(pdf_path.read_bytes()).hexdigest()
    result = []
    with fitz.open(pdf_path) as pdf:
        pages = len(pdf)
        for page_index, page in enumerate(pdf):
            content = page.get_text()
            for kind, pattern in (("place_heading", STANDARD), ("invocation", INVOCATION)):
                for match in pattern.finditer(content):
                    raw = match.group(1)
                    number = int(re.sub(r"\s+", "", raw))
                    if number not in EXPECTED:
                        continue
                    result.append({"number": number, "pdfPage": page_index + 1,
                                   "rawNumber": raw, "kind": kind})
    counts = Counter(row["number"] for row in result)
    return {"schemaVersion": "r214-headings-reproducible-v1",
            "purpose": "AUDIT_ONLY_NOT_PUBLICATION",
            "sourceSha256": source_hash, "pdfPages": pages,
            "parserPatterns": [STANDARD.pattern, INVOCATION.pattern],
            "occurrences": len(result), "uniqueNumbers": len(counts),
            "unmatchedNumbers": sorted(EXPECTED - counts.keys()),
            "repeatedNumbers": {str(n): count for n, count in sorted(counts.items()) if count > 1},
            "records": result}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    output = scan(args.pdf)
    Path(args.output).write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: output[k] for k in (
        "sourceSha256", "pdfPages", "occurrences", "uniqueNumbers",
        "unmatchedNumbers", "repeatedNumbers")}, indent=2))


if __name__ == "__main__":
    main()
