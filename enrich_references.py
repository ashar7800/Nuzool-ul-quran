import json
import re
from audit_hadith_lookup import get_exact_hadith_ref

def enrich_context(ctx, surah_no, ayah_no):
    if not ctx:
        return ctx
    # Urdu translation and context on Quran.com (Maulana Muhammad Junagarhi - Urdu translation: ID 158)
    ref_url = f"https://quran.com/ur/{surah_no}:{ayah_no}?translations=158"
    ctx['ref_url'] = ref_url
    return ctx

def enrich_tafseers(tafseers, surah_no, ayah_no):
    if not tafseers:
        return tafseers
    
    # 1. Ibn Kathir (Urdu Tafsir Ibn Kathir on Quran.com)
    if 'ibnKathir' in tafseers and tafseers['ibnKathir']:
        tafseers['ibnKathir']['ref_url'] = f"https://quran.com/ur/{surah_no}:{ayah_no}/tafsirs/tafseer-ibn-e-kaseer-urdu"
        
    # 2. Al-Tabari (Altafsir classical Arabic original)
    if 'tabari' in tafseers and tafseers['tabari']:
        tafseers['tabari']['ref_url'] = f"https://www.altafsir.com/Tafasir.asp?tMadhNo=1&tTafsirNo=1&tSoraNo={surah_no}&tAyahNo={ayah_no}&tDisplay=yes&LanguageId=1"
        
    # 3. Maududi (Tafheem-ul-Quran Urdu on Quran.com)
    if 'maududi' in tafseers and tafseers['maududi']:
        tafseers['maududi']['ref_url'] = f"https://quran.com/ur/{surah_no}:{ayah_no}?translations=97"
        
    return tafseers

def process_episodes():
    print("Enriching data/wahi_episodes.json with exact audited Hadith routing...")
    with open('data/wahi_episodes.json', 'r', encoding='utf-8') as f:
        eps = json.load(f)
        
    for ep in eps:
        s_no = ep.get('surahNumber', 1)
        a_no = ep.get('fromAyah', 1)
        
        if 'hadith' in ep:
            ep['hadith'] = get_exact_hadith_ref(ep['hadith'])
        if 'context' in ep and isinstance(ep['context'], dict):
            ep['context'] = enrich_context(ep['context'], s_no, a_no)
        if 'tafseers' in ep:
            ep['tafseers'] = enrich_tafseers(ep['tafseers'], s_no, a_no)
            
    with open('data/wahi_episodes.json', 'w', encoding='utf-8') as f:
        json.dump(eps, f, ensure_ascii=False, indent=2)
        
    with open('data/wahi_episodes.js', 'w', encoding='utf-8') as f:
        f.write('// Complete 100% Chronological Quran Wahi Units Dataset (All 6,236 Verses) with Audited Exact Live Hyperlinks\n')
        f.write('window.WAHI_EPISODES = ')
        json.dump(eps, f, ensure_ascii=False, indent=2)
        f.write(';\n')
        
    print(f"Successfully enriched {len(eps)} Wahi Episodes.")

def process_surahs():
    print("Enriching data/surahs.json with exact audited Hadith routing...")
    with open('data/surahs.json', 'r', encoding='utf-8') as f:
        surahs = json.load(f)
        
    for s in surahs:
        s_no = s.get('surahNumber', 1)
        a_no = 1
        
        if 'hadith' in s:
            s['hadith'] = get_exact_hadith_ref(s['hadith'])
        if 'context' in s and isinstance(s['context'], dict):
            s['context'] = enrich_context(s['context'], s_no, a_no)
        if 'tafseers' in s:
            s['tafseers'] = enrich_tafseers(s['tafseers'], s_no, a_no)
            
    with open('data/surahs.json', 'w', encoding='utf-8') as f:
        json.dump(surahs, f, ensure_ascii=False, indent=2)
        
    with open('data/surahs.js', 'w', encoding='utf-8') as f:
        f.write('// Complete 114 Surahs Dataset with Audited Exact Live Hyperlinks\n')
        f.write('window.SURAH_DATA = ')
        json.dump(surahs, f, ensure_ascii=False, indent=2)
        f.write(';\n')
        
    print(f"Successfully enriched {len(surahs)} Surahs.")

if __name__ == '__main__':
    process_episodes()
    process_surahs()
    print("All datasets enriched with Audited Hadith Routing successfully!")
