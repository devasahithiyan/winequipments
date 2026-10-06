"""Pull IndiaMART enquiries through the CRM Pull API into a local CSV, and summarise them.

Setup (once): put the CRM key from the IndiaMART seller panel in
~/.config/seo-keys/indiamart_crm_key  (one line, never commit it).

  /opt/homebrew/bin/python3 Reports/seo/indiamart/lead_sync.py            # new leads since last run
  /opt/homebrew/bin/python3 Reports/seo/indiamart/lead_sync.py --days 90  # backfill (7-day windows, 5 min apart)
  /opt/homebrew/bin/python3 Reports/seo/indiamart/lead_sync.py --summary  # leads by product, state, city, month

Leads contain buyers' names and phone numbers, so leads/ is git-ignored.
IndiaMART limits: one call every 5 minutes, at most 7 days per call. A faster
call gets an error and blocks the key for a while, so the script waits.
"""
import argparse
import csv
import json
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "leads"
CSV = OUT / "indiamart_leads.csv"
STATE = OUT / "state.json"
KEY = Path.home() / ".config/seo-keys/indiamart_crm_key"
API = "https://mapi.indiamart.com/wservce/crm/crmListing/v2/"
FIELDS = [
    "UNIQUE_QUERY_ID", "QUERY_TYPE", "QUERY_TIME", "QUERY_PRODUCT_NAME", "QUERY_MCAT_NAME", "SUBJECT",
    "QUERY_MESSAGE", "SENDER_NAME", "SENDER_COMPANY", "SENDER_MOBILE", "SENDER_EMAIL",
    "SENDER_CITY", "SENDER_STATE", "SENDER_PINCODE", "SENDER_COUNTRY_ISO", "CALL_DURATION", "RECEIVER_MOBILE",
]
GAP = 300  # seconds between calls
FMT = "%d-%b-%Y %H:%M:%S"


def fetch(key, start, end):
    q = urllib.parse.urlencode({"glusr_crm_key": key, "start_time": start.strftime(FMT), "end_time": end.strftime(FMT)})
    with urllib.request.urlopen(f"{API}?{q}", timeout=60) as r:
        data = json.load(r)
    if str(data.get("CODE")) != "200":
        # 204 = no leads in the window; anything else is an error (bad key, too frequent, bad dates)
        if str(data.get("CODE")) == "204":
            return []
        sys.exit(f"IndiaMART API error {data.get('CODE')}: {data.get('MESSAGE')}")
    return data.get("RESPONSE") or []


def load():
    if not CSV.exists():
        return {}
    return {r["UNIQUE_QUERY_ID"]: r for r in csv.DictReader(open(CSV, encoding="utf-8"))}


def save(rows):
    OUT.mkdir(exist_ok=True)
    with open(CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, FIELDS, extrasaction="ignore")
        w.writeheader()
        w.writerows(sorted(rows.values(), key=lambda r: r.get("QUERY_TIME", "")))


def sync(days):
    if not KEY.exists():
        sys.exit(f"No CRM key. Save it to {KEY} first.")
    key = KEY.read_text().strip()
    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    end = datetime.now()
    if days:
        start = end - timedelta(days=days)
    elif state.get("last_end"):
        start = datetime.strptime(state["last_end"], FMT)
    else:
        start = end - timedelta(days=7)
    rows, added, first = load(), 0, True
    while start < end:
        stop = min(start + timedelta(days=7), end)
        if not first:
            print(f"  waiting {GAP}s (IndiaMART allows one call per 5 minutes)")
            time.sleep(GAP)
        first = False
        got = fetch(key, start, stop)
        for r in got:
            if r["UNIQUE_QUERY_ID"] not in rows:
                added += 1
            rows[r["UNIQUE_QUERY_ID"]] = r
        print(f"{start:%d %b %Y} → {stop:%d %b %Y}: {len(got)} leads")
        save(rows)
        STATE.write_text(json.dumps({"last_end": stop.strftime(FMT)}))
        start = stop
    print(f"{added} new, {len(rows)} total in {CSV}")


def summary():
    rows = list(load().values())
    if not rows:
        sys.exit("No leads yet. Run a sync first.")
    print(f"{len(rows)} leads, {min(r['QUERY_TIME'] for r in rows)[:10]} to {max(r['QUERY_TIME'] for r in rows)[:10]}\n")
    for title, col in [("Product", "QUERY_PRODUCT_NAME"), ("Category", "QUERY_MCAT_NAME"), ("State", "SENDER_STATE"),
                       ("City", "SENDER_CITY"), ("Lead type", "QUERY_TYPE")]:
        print(title)
        for v, n in Counter((r.get(col) or "(blank)").strip() for r in rows).most_common(15):
            print(f"  {n:4}  {v}")
        print()
    print("Month")
    for v, n in sorted(Counter(r["QUERY_TIME"][:7] for r in rows).items()):
        print(f"  {v}  {n}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, help="backfill this many days")
    ap.add_argument("--summary", action="store_true")
    a = ap.parse_args()
    summary() if a.summary else sync(a.days)
