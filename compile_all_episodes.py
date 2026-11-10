# -*- coding: utf-8 -*-
"""
Compiler for Comprehensive Seerah Wahi Episodes (Makki + Madani)
Combines data_makki_episodes and data_madani_episodes into:
- data/wahi_episodes.json
- data/wahi_episodes.js
"""

import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_JSON = os.path.join(DATA_DIR, "wahi_episodes.json")
OUTPUT_JS = os.path.join(DATA_DIR, "wahi_episodes.js")
SURAHS_JSON = os.path.join(DATA_DIR, "surahs.json")

with open(SURAHS_JSON, "r", encoding="utf-8") as f:
    surahs = json.load(f)

surah_map = {s["surahNumber"]: s for s in surahs}
episodes = []

def add_ep(
    ep_id, title, title_urdu, year, period, seerah_stage,
    surah_num, from_ayah, to_ayah,
    theme, ctx_urdu, ctx_roman, ctx_ref,
    hadith_ar, hadith_ur, hadith_ro, hadith_src, hadith_chap, hadith_rawi, hadith_grade, hadith_auth,
    ik_ur, ik_ro, ik_ref,
    tab_ur, tab_ro, tab_ref,
    md_ur, md_ro, md_ref,
    extra_passages=None
):
    if surah_num not in surah_map:
        raise ValueError(f"Surah #{surah_num} not found in surahs.json!")

    s = surah_map[surah_num]
    surah_name = s["nameEn"]
    surah_name_ar = s["nameAr"]

    # Verify ayah range
    max_ayah = len(s["verses"])
    if from_ayah < 1 or to_ayah > max_ayah or from_ayah > to_ayah:
        raise ValueError(f"Invalid ayah range {from_ayah}-{to_ayah} for Surah {surah_name} (max: {max_ayah})")

    passages = [{
        "surahNumber": surah_num,
        "fromAyah": from_ayah,
        "toAyah": to_ayah,
        "label": f"{surah_name} ({from_ayah}–{to_ayah})"
    }]

    if extra_passages:
        for ep_p in extra_passages:
            p_snum = ep_p["surahNumber"]
            p_s = surah_map[p_snum]
            p_from = ep_p["fromAyah"]
            p_to = ep_p["toAyah"]
            p_max = len(p_s["verses"])
            if p_from < 1 or p_to > p_max or p_from > p_to:
                raise ValueError(f"Invalid extra passage {p_from}-{p_to} for Surah {p_s['nameEn']} (max: {p_max})")
            passages.append({
                "surahNumber": p_snum,
                "fromAyah": p_from,
                "toAyah": p_to,
                "label": f"{p_s['nameEn']} ({p_from}–{p_to})"
            })

    episodes.append({
        "id": ep_id,
        "title": title,
        "titleUrdu": title_urdu,
        "year": year,
        "period": period,
        "seerahStage": seerah_stage,
        "surahNumber": surah_num,
        "surahName": surah_name,
        "surahNameAr": surah_name_ar,
        "fromAyah": from_ayah,
        "toAyah": to_ayah,
        "passages": passages,
        "theme": theme,
        "context": {
            "urdu": ctx_urdu,
            "roman": ctx_roman,
            "reference": ctx_ref
        },
        "hadith": {
            "arabic": hadith_ar,
            "urdu": hadith_ur,
            "roman": hadith_ro,
            "source": hadith_src,
            "chapter": hadith_chap,
            "narrator": hadith_rawi,
            "grade": hadith_grade,
            "gradingAuthority": hadith_auth
        },
        "tafseers": {
            "ibnKathir": {
                "author": "Hafiz Imaduddin Ibn Kathir (774H)",
                "reference": ik_ref,
                "urdu": ik_ur,
                "roman": ik_ro
            },
            "tabari": {
                "author": "Imam Abu Ja'far Muhammad bin Jarir al-Tabari (310H)",
                "reference": tab_ref,
                "urdu": tab_ur,
                "roman": tab_ro
            },
            "maududi": {
                "author": "Syed Abul A'la Maududi (1979)",
                "reference": md_ref,
                "urdu": md_ur,
                "roman": md_ro
            }
        }
    })

def main():
    print("Compiling Makki episodes...")
    from data_makki_episodes import register_makki_episodes
    register_makki_episodes(add_ep)
    makki_count = len(episodes)
    print(f"Loaded {makki_count} Makki episodes.")

    print("Compiling Madani episodes...")
    from data_madani_episodes import register_madani_episodes
    register_madani_episodes(add_ep)
    total_count = len(episodes)
    madani_count = total_count - makki_count
    print(f"Loaded {madani_count} Madani episodes. Total: {total_count} episodes.")

    # Sort episodes by id
    episodes.sort(key=lambda x: x["id"])

    # Write JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(episodes, f, ensure_ascii=False, indent=2)
    print(f"Successfully generated {OUTPUT_JSON} ({os.path.getsize(OUTPUT_JSON):,} bytes)")

    # Write JS
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write("// Comprehensive Seerah Wahi Episodes Dataset (Makki + Madani)\n")
        f.write("// Auto-generated for zero-CORS browser support\n")
        f.write("window.WAHI_EPISODES = ")
        json.dump(episodes, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"Successfully generated {OUTPUT_JS} ({os.path.getsize(OUTPUT_JS):,} bytes)")

    print("\n--- Summary of Generated Episodes ---")
    for ep in episodes:
        print(f"Ep #{ep['id']:02d}: {ep['title']} [{ep['surahName']} {ep['fromAyah']}-{ep['toAyah']}] - {ep['year']} ({ep['period']})")

if __name__ == "__main__":
    main()
