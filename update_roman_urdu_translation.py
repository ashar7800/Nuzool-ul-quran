# -*- coding: utf-8 -*-
"""
Update all 6,236 verses in data/surahs.json and data/surahs.js to have
genuine Roman Urdu Translation (Abul A'la Maududi / Tafheem-ul-Quran)
instead of Arabic transliteration.
"""

import os
import json
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
SURAHS_JSON = os.path.join(DATA_DIR, "surahs.json")
SURAHS_JS = os.path.join(DATA_DIR, "surahs.js")

# 1. Fetch Maududi Roman Urdu translation
URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/urd-abulaalamaududi-la.min.json"
print(f"Downloading Roman Urdu dataset from {URL}...")

req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode("utf-8"))

quran_items = data.get("quran", [])
print(f"Downloaded {len(quran_items)} Roman Urdu verses.")

# Map by (chapter, verse)
roman_map = {(item["chapter"], item["verse"]): item["text"].strip() for item in quran_items}

# 2. Load surahs.json
with open(SURAHS_JSON, "r", encoding="utf-8") as f:
    surahs = json.load(f)

updated_count = 0
for s in surahs:
    sn = s["surahNumber"]
    s["romanTranslationSource"] = "Abul A'la Maududi (Tafheem-ul-Quran Roman Urdu)"
    for v in s["verses"]:
        vn = v["no"]
        if (sn, vn) in roman_map:
            v["roman"] = roman_map[(sn, vn)]
            updated_count += 1
        else:
            print(f"Warning: Missing Roman Urdu for ({sn}, {vn})")

print(f"Successfully updated {updated_count} / 6236 verses with Roman Urdu Translation.")

# 3. Save surahs.json
with open(SURAHS_JSON, "w", encoding="utf-8") as f:
    json.dump(surahs, f, ensure_ascii=False, indent=2)
print(f"Saved {SURAHS_JSON} ({os.path.getsize(SURAHS_JSON):,} bytes)")

# 4. Save surahs.js
with open(SURAHS_JS, "w", encoding="utf-8") as f:
    f.write("// Complete 114 Surahs Dataset with Arabic Uthmani, Noto Nastaliq Urdu, and Roman Urdu Translation\n")
    f.write("// Auto-generated for zero-CORS browser support\n")
    f.write("window.SURAH_DATA = ")
    json.dump(surahs, f, ensure_ascii=False, indent=2)
    f.write(";\n")
print(f"Saved {SURAHS_JS} ({os.path.getsize(SURAHS_JS):,} bytes)")

# 5. Re-run compile_100_percent_quran_wahi.py
print("Recompiling wahi_episodes with updated dataset...")
import compile_100_percent_quran_wahi
print("Wahi episodes successfully refreshed.")
