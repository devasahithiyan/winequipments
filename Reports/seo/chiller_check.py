"""Chiller baseline and re-check from the Search Console API (read-only).

Usage: python3 Reports/seo/chiller_check.py START END LABEL
Writes Reports/seo/chiller_<LABEL>.csv with every query containing "chill"
and every page whose URL contains "chiller" or "chill", plus a summary.
Credentials stay outside the repo in ~/.config/seo-keys/.
"""
import csv
import sys
from urllib.parse import quote

from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account

KEY = "/Users/devasahithiyan/.config/seo-keys/service-account.json"
SITE = "https://winequipments.com/"


def main(start, end, label):
    creds = service_account.Credentials.from_service_account_file(
        KEY, scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    session = AuthorizedSession(creds)
    url = ("https://searchconsole.googleapis.com/webmasters/v3/sites/"
           f"{quote(SITE, safe='')}/searchAnalytics/query")
    body = {"startDate": start, "endDate": end,
            "dimensions": ["query", "page"], "rowLimit": 5000}
    rows = session.post(url, json=body).json().get("rows", [])

    chill = [r for r in rows if "chill" in r["keys"][0]
             or "chill" in r["keys"][1]]
    out = f"Reports/seo/chiller_{label}.csv"
    with open(out, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["query", "page", "impressions", "clicks", "ctr", "position"])
        for r in sorted(chill, key=lambda r: -r["impressions"]):
            w.writerow([r["keys"][0], r["keys"][1].replace(SITE.rstrip("/"), ""),
                        r["impressions"], r["clicks"],
                        round(r["ctr"], 4), round(r["position"], 1)])
    q_rows = [r for r in chill if "chill" in r["keys"][0]]
    p_rows = [r for r in chill if "chill" in r["keys"][1]]
    for name, rs in (("queries containing 'chill'", q_rows),
                     ("rows on pages containing 'chill'", p_rows)):
        print(f"{label}: {name}: {len(rs)} rows, "
              f"{sum(r['impressions'] for r in rs)} impressions, "
              f"{sum(r['clicks'] for r in rs)} clicks")
    print(f"written: {out}")


if __name__ == "__main__":
    main(*sys.argv[1:4])
