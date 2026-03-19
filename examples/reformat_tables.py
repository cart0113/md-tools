"""Example: reformat all markdown tables in a folder to fixed-width alignment."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

import md_tools.table_formatter as table_formatter
import md_tools.walker as walker


def reformat(text, file_path):
    return table_formatter.reformat_tables(text, max_line_width=120)


target_folder = sys.argv[1]
modified = walker.walk_and_apply(target_folder, reformat)

for path in modified:
    print(f"reformatted: {path}")

if not modified:
    print("no tables needed reformatting")
