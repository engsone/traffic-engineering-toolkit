# -*- coding: utf-8 -*-
"""Watch Google Sheet changes and regenerate the safety performance card.
Silent on success/no change. Prints only when --verbose or on errors.
"""
from __future__ import annotations

import argparse
import io
import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

from googleapiclient.http import MediaIoBaseDownload

HERMES_SCRIPTS = Path(r"C:/Users/Lenovo-P51/AppData/Local/hermes/skills/productivity/google-workspace/scripts")
sys.path.insert(0, str(HERMES_SCRIPTS))
from google_api import build_service  # noqa: E402

SPREADSHEET_ID = "1VCIPGV7T-hUA4rvmK9kpBbz5Tx6-tPuvhfARsAiSB6U"
LOCAL_XLSX = Path(r"C:/Users/Lenovo-P51/OneDrive/Desktop/بطاقة الاداء/شيت تحديث بطاقة الاداء.xlsx")
GENERATOR = Path(r"C:/Users/Lenovo-P51/Downloads/ppt_achievement_inspect/update_card_named.py")
STATE_FILE = Path(r"C:/Users/Lenovo-P51/Downloads/ppt_achievement_inspect/performance_card_watch_state.json")
LOCK_FILE = Path(r"C:/Users/Lenovo-P51/Downloads/ppt_achievement_inspect/performance_card_watch.lock")

XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


def read_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def write_state(state: dict) -> None:
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def get_modified_time() -> str:
    drive = build_service("drive", "v3")
    meta = drive.files().get(fileId=SPREADSHEET_ID, fields="id,name,modifiedTime,webViewLink").execute()
    return meta["modifiedTime"]


def export_sheet_to_xlsx() -> None:
    drive = build_service("drive", "v3")
    request = drive.files().export_media(fileId=SPREADSHEET_ID, mimeType=XLSX_MIME)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        _status, done = downloader.next_chunk()
    LOCAL_XLSX.parent.mkdir(parents=True, exist_ok=True)
    LOCAL_XLSX.write_bytes(fh.getvalue())


def regenerate_card() -> str:
    proc = subprocess.run(
        [sys.executable, str(GENERATOR)],
        cwd=str(GENERATOR.parent),
        capture_output=True,
        text=True,
        timeout=300,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Card generation failed\nSTDOUT:\n{proc.stdout}\nSTDERR:\n{proc.stderr}")
    return proc.stdout


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="Regenerate even if modifiedTime is unchanged")
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args()

    if LOCK_FILE.exists():
        # Avoid overlapping cron runs. If stale, user can delete it manually.
        if args.verbose:
            print("SKIP: lock exists")
        return 0

    LOCK_FILE.write_text(str(datetime.now()), encoding="utf-8")
    try:
        modified = get_modified_time()
        state = read_state()
        if not args.force and state.get("last_processed_modifiedTime") == modified:
            return 0

        export_sheet_to_xlsx()
        output = regenerate_card()
        state.update({
            "spreadsheet_id": SPREADSHEET_ID,
            "last_processed_modifiedTime": modified,
            "last_success": datetime.now().isoformat(timespec="seconds"),
            "local_xlsx": str(LOCAL_XLSX),
        })
        write_state(state)
        if args.verbose:
            print("UPDATED")
            print(output)
        return 0
    finally:
        try:
            LOCK_FILE.unlink()
        except FileNotFoundError:
            pass


if __name__ == "__main__":
    raise SystemExit(main())
