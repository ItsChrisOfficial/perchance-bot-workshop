import subprocess
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = REPO_ROOT / "scripts" / "validate-perchance-export.js"
VALID_FIXTURE = REPO_ROOT / "tests" / "fixtures" / "valid" / "canonical-valid.json"
INVALID_FIXTURES = {
    "broken-json": "broken-json.json",
    "missing-table": "missing-table.json",
    "rowcount-mismatch": "rowcount-mismatch.json",
    "invalid-message-author": "invalid-message-author.json",
    "invalid-shortcut-insertion-type": "invalid-shortcut-insertion-type.json",
    "malformed-customcode": "malformed-customcode.json",
    "customcode-not-string": "customcode-not-string.json",
}


def run_validator(fixture_path: Path):
    return subprocess.run(
        ["node", str(VALIDATOR), str(fixture_path)],
        cwd=REPO_ROOT,
        text=True,
        capture_output=True,
        check=False,
    )


class ValidatePerchanceExportTests(unittest.TestCase):
    def test_accepts_valid_fixture(self):
        result = run_validator(VALID_FIXTURE)
        self.assertEqual(result.returncode, 0, msg=result.stderr or result.stdout)
        self.assertIn("OK:", result.stdout)

    def test_rejects_invalid_fixtures(self):
        for name, filename in INVALID_FIXTURES.items():
            with self.subTest(name=name):
                result = run_validator(REPO_ROOT / "tests" / "fixtures" / "invalid" / filename)
                self.assertNotEqual(result.returncode, 0, msg=result.stdout)
                self.assertIn("ERROR:", result.stderr)


if __name__ == "__main__":
    unittest.main()
