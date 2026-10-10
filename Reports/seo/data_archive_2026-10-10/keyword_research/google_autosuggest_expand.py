import csv, json, time, urllib.parse, urllib.request, string, sys
seeds = ["chiller","water chiller","industrial chiller","process chiller","air cooled chiller","water cooled chiller","chiller machine",
 "mini chiller","chiller manufacturers","chiller price","chiller plant","milk chiller","soda chiller","ice flake machine","acid chiller",
 "chiller 5 ton","chiller 10 ton","cooling tower","cooling tower manufacturers","frp cooling tower","cooling tower price","cooling tower fills",
 "compressed air dryer","refrigerated air dryer","air dryer price","moisture separator","automatic drain valve","air receiver tank",
 "shell and tube heat exchanger","heat exchanger manufacturers"]
prefixes = ["best ","how to ","what is ","why ","cheap ","top ","buy ","which ","can ","does "]
suffix_words = ["in coimbatore","in chennai","in bangalore","in pune","in hyderabad","in ahmedabad","in mumbai","in delhi","near me","price","cost","for plastic","for injection moulding","for dairy","for pharma","working principle","manufacturers","supplier","dealers","amc","service","repair","specification","capacity calculation","vs","1 ton","2 ton","3 ton","5 ton","10 ton","20 ton"]
out = {}
import concurrent.futures as cf, threading
lock = threading.Lock()
def ask(q):
    url = "https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=in&q=" + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(3):
        try:
            return json.loads(urllib.request.urlopen(req, timeout=15).read().decode("utf-8", "replace"))[1]
        except Exception:
            time.sleep(1 + attempt)
    return []
jobs = []
for seed in seeds:
    qs = [seed] + [seed + " " + c for c in string.ascii_lowercase] + [p + seed for p in prefixes] + [seed + " " + w for w in suffix_words]
    jobs += [(seed, q) for q in qs]
print("jobs", len(jobs), flush=True)
done = 0
def work(job):
    seed, q = job
    res = ask(q)
    with lock:
        for s in res:
            s = s.strip().lower()
            if s and s not in out: out[s] = [seed, q]
    return 1
with cf.ThreadPoolExecutor(max_workers=10) as ex:
    for i, _ in enumerate(ex.map(work, jobs), 1):
        if i % 200 == 0: print("progress", i, "unique", len(out), flush=True)
with open("autosuggest_raw.csv", "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh); w.writerow(["suggestion", "seed", "query_used"])
    for k, v in out.items(): w.writerow([k] + v)
print("FINISHED", len(out), flush=True)
