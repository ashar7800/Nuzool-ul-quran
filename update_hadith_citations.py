import json

BOOK_MAP = {
    'Sahih al-Bukhari': 'Sahih Bukhari',
    'Sunan Abi Dawud': 'Sunan Abi Dawood',
    'Jami` at-Tirmidhi': "Jami' at-Tirmidhi",
    'Musnad Ahmad bin Hanbal': 'Musnad Ahmad',
    'As-Seerah an-Nabawiyyah (Ibn Hisham)': 'Seerah Ibn Hisham',
    'As-Sunan al-Kubra (Al-Bayhaqi)': 'Sunan al-Kubra (Al-Bayhaqi)',
    "Al-Mustadrak 'ala al-Sahihayn (Al-Hakim)": 'Mustadrak al-Hakim',
    "Dala'il an-Nubuwwah (Al-Bayhaqi)": 'Dalail an-Nubuwwah (Al-Bayhaqi)',
    "Jami' al-Bayan fi Ta'wil al-Qur'an (At-Tabari)": 'Tafsir al-Tabari',
    'Sahih Muslim': 'Sahih Muslim'
}

def format_citation(h):
    if not h:
        return ''
    raw_book = h.get('book') or ''
    if not raw_book and h.get('source'):
        raw_book = h['source'].replace('Reference:', '').split('(')[0].split(':')[0].strip()
    book = BOOK_MAP.get(raw_book, raw_book)
    
    details = []
    num = h.get('hadithNumber')
    jild = h.get('jild') or h.get('volume')
    safha = h.get('safha')
    page = h.get('page') or h.get('pageNo')
    
    if num:
        details.append(f"Hadees No: {num}")
    if jild:
        details.append(f"Jild: {jild}")
    if safha:
        details.append(f"Safha: {safha}")
    elif page:
        details.append(f"Page No: {page}")
        
    details_str = f" ({', '.join(details)})" if details else ""
    return f"Reference: {book}{details_str}"

# 1. Update data/wahi_episodes.json
with open('data/wahi_episodes.json', 'r', encoding='utf-8') as f:
    eps = json.load(f)

for ep in eps:
    h = ep.get('hadith')
    if h:
        raw_src = h.get('source', '')
        # Check if Jild/Vol in source
        if 'Vol 1' in raw_src:
            h['jild'] = '1'
        elif 'Vol 2' in raw_src:
            h['jild'] = '2'
        elif 'Vol 8' in raw_src:
            h['jild'] = '8'
            
        raw_book = h.get('book') or ''
        h['book'] = BOOK_MAP.get(raw_book, raw_book)
        h['source'] = format_citation(h)

with open('data/wahi_episodes.json', 'w', encoding='utf-8') as f:
    json.dump(eps, f, ensure_ascii=False, indent=2)

with open('data/wahi_episodes.js', 'w', encoding='utf-8') as f:
    f.write('// Complete 100% Chronological Quran Wahi Units Dataset with Standard Academic Hadith Citations\n')
    f.write('window.WAHI_EPISODES = ')
    json.dump(eps, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f"Updated {len(eps)} wahi episodes.")

# 2. Update data/surahs.json
with open('data/surahs.json', 'r', encoding='utf-8') as f:
    surahs = json.load(f)

for s in surahs:
    h = s.get('hadith')
    if h:
        raw_book = h.get('book') or ''
        h['book'] = BOOK_MAP.get(raw_book, raw_book)
        h['source'] = format_citation(h)

with open('data/surahs.json', 'w', encoding='utf-8') as f:
    json.dump(surahs, f, ensure_ascii=False, indent=2)

with open('data/surahs.js', 'w', encoding='utf-8') as f:
    f.write('// Complete 114 Surahs Dataset with Standard Academic Hadith Citations\n')
    f.write('window.SURAH_DATA = ')
    json.dump(surahs, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f"Updated {len(surahs)} surahs.")
