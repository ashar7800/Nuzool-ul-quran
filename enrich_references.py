import json
import re

def enrich_hadith(h):
    if not h:
        return h
    
    src = h.get('source', '')
    num_match = re.search(r'#(\d+)', src)
    num = num_match.group(1) if num_match else None
    
    book = ""
    ref_url = ""
    
    if "Bukhari" in src:
        book = "Sahih al-Bukhari"
        if num:
            ref_url = f"https://sunnah.com/bukhari:{num}"
        else:
            ref_url = "https://sunnah.com/bukhari"
    elif "Muslim" in src:
        book = "Sahih Muslim"
        if num:
            ref_url = f"https://sunnah.com/muslim:{num}"
        else:
            ref_url = "https://sunnah.com/muslim"
    elif "Tirmidhi" in src:
        book = "Jami` at-Tirmidhi"
        if num:
            ref_url = f"https://sunnah.com/tirmidhi:{num}"
        else:
            ref_url = "https://sunnah.com/tirmidhi"
    elif "Abi Dawud" in src:
        book = "Sunan Abi Dawud"
        if num:
            ref_url = f"https://sunnah.com/abudawud:{num}"
        else:
            ref_url = "https://sunnah.com/abudawud"
    elif "Musnad Ahmad" in src:
        book = "Musnad Ahmad bin Hanbal"
        if num:
            ref_url = f"https://sunnah.com/ahmad:{num}"
        else:
            ref_url = "https://sunnah.com/ahmad"
    elif "Mustadrak" in src:
        book = "Al-Mustadrak 'ala al-Sahihayn (Al-Hakim)"
        ref_url = "https://shamela.ws/book/2266"
    elif "Sunan al-Kubra" in src:
        book = "As-Sunan al-Kubra (Al-Bayhaqi)"
        ref_url = "https://shamela.ws/book/6450"
    elif "Dalail" in src:
        book = "Dala'il an-Nubuwwah (Al-Bayhaqi)"
        ref_url = "https://shamela.ws/book/12028"
    elif "Tafsir al-Tabari" in src:
        book = "Jami' al-Bayan (At-Tabari)"
        ref_url = "https://shamela.ws/book/43"
    elif "Seerah Ibn Hisham" in src:
        book = "As-Seerah an-Nabawiyyah (Ibn Hisham)"
        ref_url = "https://shamela.ws/book/23833"
    else:
        book = src.split(":")[0] if ":" in src else src
        ref_url = "https://sunnah.com"
        
    h['book'] = book
    if num:
        h['hadithNumber'] = num
    h['ref_url'] = ref_url
    return h

def enrich_context(ctx, surah_no, ayah_no):
    if not ctx:
        return ctx
    # Altafsir Asbab an-Nuzul (Al-Wahidi)
    ref_url = f"https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=86&tSoraNo={surah_no}&tAyahNo={ayah_no}&tDisplay=yes&LanguageId=2"
    ctx['ref_url'] = ref_url
    return ctx

def enrich_tafseers(tafseers, surah_no, ayah_no):
    if not tafseers:
        return tafseers
    
    # 1. Ibn Kathir (Quran.com)
    if 'ibnKathir' in tafseers and tafseers['ibnKathir']:
        tafseers['ibnKathir']['ref_url'] = f"https://quran.com/{surah_no}:{ayah_no}/tafsirs/en-tafisr-ibn-kathir"
        
    # 2. Al-Tabari (Altafsir.com)
    if 'tabari' in tafseers and tafseers['tabari']:
        tafseers['tabari']['ref_url'] = f"https://www.altafsir.com/Tafasir.asp?tMadhNo=1&tTafsirNo=1&tSoraNo={surah_no}&tAyahNo={ayah_no}&tDisplay=yes&LanguageId=1"
        
    # 3. Maududi (QuranX)
    if 'maududi' in tafseers and tafseers['maududi']:
        tafseers['maududi']['ref_url'] = f"https://quranx.com/tafsir/maududi/{surah_no}.{ayah_no}"
        
    return tafseers

def process_episodes():
    print("Enriching data/wahi_episodes.json ...")
    with open('data/wahi_episodes.json', 'r', encoding='utf-8') as f:
        eps = json.load(f)
        
    for ep in eps:
        s_no = ep.get('surahNumber', 1)
        a_no = ep.get('fromAyah', 1)
        
        if 'hadith' in ep:
            ep['hadith'] = enrich_hadith(ep['hadith'])
        if 'context' in ep and isinstance(ep['context'], dict):
            ep['context'] = enrich_context(ep['context'], s_no, a_no)
        if 'tafseers' in ep:
            ep['tafseers'] = enrich_tafseers(ep['tafseers'], s_no, a_no)
            
    with open('data/wahi_episodes.json', 'w', encoding='utf-8') as f:
        json.dump(eps, f, ensure_ascii=False, indent=2)
        
    with open('data/wahi_episodes.js', 'w', encoding='utf-8') as f:
        f.write('// Complete 100% Chronological Quran Wahi Units Dataset (All 6,236 Verses) with Enriched Live Hyperlinks\n')
        f.write('window.WAHI_EPISODES = ')
        json.dump(eps, f, ensure_ascii=False, indent=2)
        f.write(';\n')
        
    print(f"Successfully enriched {len(eps)} Wahi Episodes.")

def process_surahs():
    print("Enriching data/surahs.json ...")
    with open('data/surahs.json', 'r', encoding='utf-8') as f:
        surahs = json.load(f)
        
    for s in surahs:
        s_no = s.get('surahNumber', 1)
        a_no = 1
        
        if 'hadith' in s:
            s['hadith'] = enrich_hadith(s['hadith'])
        if 'context' in s and isinstance(s['context'], dict):
            s['context'] = enrich_context(s['context'], s_no, a_no)
        if 'tafseers' in s:
            s['tafseers'] = enrich_tafseers(s['tafseers'], s_no, a_no)
            
    with open('data/surahs.json', 'w', encoding='utf-8') as f:
        json.dump(surahs, f, ensure_ascii=False, indent=2)
        
    with open('data/surahs.js', 'w', encoding='utf-8') as f:
        f.write('// Complete 114 Surahs Dataset with Enriched Live Hyperlinks\n')
        f.write('window.SURAH_DATA = ')
        json.dump(surahs, f, ensure_ascii=False, indent=2)
        f.write(';\n')
        
    print(f"Successfully enriched {len(surahs)} Surahs.")

if __name__ == '__main__':
    process_episodes()
    process_surahs()
    print("All datasets enriched successfully!")
