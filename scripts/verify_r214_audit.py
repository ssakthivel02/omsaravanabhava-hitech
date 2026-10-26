#!/usr/bin/env python3
"""Fail-closed heading-audit consistency check; NOT a canonical-text or rights approval."""
import argparse
from collections import Counter
import json
from pathlib import Path
import re

EXPECTED = set(range(1, 1327))
SHA256 = re.compile(r"[0-9a-f]{64}\Z")


def validate(payload):
    errors = []
    if not isinstance(payload, dict):
        return ["audit document must be an object"]
    if payload.get("schemaVersion") != "r214-headings-reproducible-v1":
        errors.append("unsupported schemaVersion")
    if payload.get("purpose") != "AUDIT_ONLY_NOT_PUBLICATION":
        errors.append("audit-only purpose marker missing")
    source = payload.get("sourceSha256")
    if not isinstance(source, str) or not SHA256.fullmatch(source):
        errors.append("sourceSha256 must be lowercase SHA-256")
    pages = payload.get("pdfPages")
    if type(pages) is not int or pages <= 0:
        errors.append("pdfPages must be positive integer")
    records = payload.get("records")
    if not isinstance(records, list):
        return errors + ["records must be an array"]
    seen = Counter()
    for i, record in enumerate(records):
        if not isinstance(record, dict):
            errors.append(f"records[{i}] must be object")
            continue
        num, page, raw, kind = (record.get(k) for k in ("number", "pdfPage", "rawNumber", "kind"))
        if type(num) is not int or num not in EXPECTED:
            errors.append(f"records[{i}]: number outside reference range")
            continue
        if type(page) is not int or type(pages) is not int or not 1 <= page <= pages:
            errors.append(f"records[{i}]: invalid PDF page")
        if kind not in ("place_heading", "invocation"):
            errors.append(f"records[{i}]: unrecognized heading kind")
        if not isinstance(raw, str) or not re.fullmatch(r"[0-9][0-9 \t]*", raw) or int(re.sub(r"\s+", "", raw)) != num:
            errors.append(f"records[{i}]: rawNumber disagrees with number")
        seen[num] += 1
    if payload.get("occurrences") != len(records):
        errors.append("occurrences does not match record count")
    if payload.get("uniqueNumbers") != len(seen):
        errors.append("uniqueNumbers does not match recorded numbers")
    if payload.get("unmatchedNumbers") != sorted(EXPECTED - seen.keys()):
        errors.append("unmatchedNumbers does not match records")
    if payload.get("repeatedNumbers") != {str(k): v for k, v in sorted(seen.items()) if v > 1}:
        errors.append("repeatedNumbers does not match records")
    return errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("audit_json")
    args = parser.parse_args()
    report = json.loads(Path(args.audit_json).read_text(encoding="utf-8"))
    errors = validate(report)
    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        raise SystemExit(1)
    print(f"PASS: {report['uniqueNumbers']} distinct detected heading numbers; AUDIT ONLY")


if __name__ == "__main__":
    main()
