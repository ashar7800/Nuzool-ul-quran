import json
import re

AUDITED_HADITH_MAP = {
    # Sahih Muslim (Exact Authenticated International Reference - Matching Exact Incident)
    "Sahih Muslim: Hadees #746": {
        "book": "Sahih Muslim",
        "chapter": "Kitab Salat al-Musafirin wa Qasruha (باب جامع صلاة الليل ومن نام عنه أو مرض)",
        "ref_url": "https://sunnah.com/muslim:746a"
    },
    "Sahih Muslim: Hadees #395": {
        "book": "Sahih Muslim",
        "chapter": "Kitab as-Salat (باب وجوب قراءة الفاتحة في كل ركعة)",
        "ref_url": "https://sunnah.com/muslim:395a"
    },
    "Sahih Muslim: Hadees #450": {
        "book": "Sahih Muslim",
        "chapter": "Kitab as-Salat (باب الجهر بالقراءة في الصبح والقراءة على الجن)",
        "ref_url": "https://sunnah.com/muslim:450a"
    },
    "Sahih Muslim: Hadees #1598": {
        "book": "Sahih Muslim",
        "chapter": "Kitab al-Musaqah (باب لعن آكل الربا وموكله)",
        "ref_url": "https://sunnah.com/muslim:1598"
    },
    "Sahih Muslim: Hadees #1763": {
        "book": "Sahih Muslim",
        "chapter": "Kitab al-Jihad was-Siyar (باب الإمداد بالملائكة في غزوة بدر واستحلال الغنائم)",
        "ref_url": "https://sunnah.com/muslim:1763"
    },
    "Sahih Muslim: Hadees #1856": {
        "book": "Sahih Muslim",
        "chapter": "Kitab al-Imarah (باب فضيلة بيعة الرضوان تحت الشجرة)",
        "ref_url": "https://sunnah.com/muslim:1856"
    },
    "Sahih Muslim: Hadees #2424": {
        "book": "Sahih Muslim",
        "chapter": "Kitab Faza'il as-Sahabah (باب فضائل أهل بيت النبي صلى الله عليه وسلم)",
        "ref_url": "https://sunnah.com/muslim:2424"
    },
    "Sahih Muslim: Hadees #2797": {
        "book": "Sahih Muslim",
        "chapter": "Kitab Sifat al-Qiyamah wal-Jannah wan-Nar (باب قوله: كَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ)",
        "ref_url": "https://sunnah.com/muslim:2797"
    },
    "Sahih Muslim: Hadees #3005": {
        "book": "Sahih Muslim",
        "chapter": "Kitab az-Zuhd war-Raqa'iq (باب قصة أصحاب الأخدود والساحر والراهب والغلام)",
        "ref_url": "https://sunnah.com/muslim:3005"
    },

    # Jami' at-Tirmidhi (Exact Authenticated Reference)
    "Jami' at-Tirmidhi: Hadees #3331": {
        "book": "Jami` at-Tirmidhi",
        "chapter": "Kitab Tafsir al-Quran (باب ومن سورة عبس)",
        "ref_url": "https://sunnah.com/tirmidhi:3331"
    },
    "Jami' at-Tirmidhi: Hadees #3681": {
        "book": "Jami` at-Tirmidhi",
        "chapter": "Kitab al-Manaqib (باب مناقب عمر بن الخطاب رضي الله عنه)",
        "ref_url": "https://sunnah.com/tirmidhi:3681"
    },
    "Sunan at-Tirmidhi: Hadees #3026": {
        "book": "Jami` at-Tirmidhi",
        "chapter": "Kitab Tafsir al-Quran (باب ومن سورة البقرة - تحريم الخمر)",
        "ref_url": "https://sunnah.com/tirmidhi:3026"
    },
    "Sunan at-Tirmidhi: Hadees #3171": {
        "book": "Jami` at-Tirmidhi",
        "chapter": "Kitab Tafsir al-Quran (باب ومن سورة الحج - أذن للذين يقاتلون)",
        "ref_url": "https://sunnah.com/tirmidhi:3171"
    },
    "Sunan at-Tirmidhi: Hadees #3701": {
        "book": "Jami` at-Tirmidhi",
        "chapter": "Kitab al-Manaqib (باب مناقب عثمان بن عفان رضي الله عنه وتجهيز جيش العسرة)",
        "ref_url": "https://sunnah.com/tirmidhi:3701"
    },
    "Sunan at-Tirmidhi: Hadees #3942": {
        "book": "Jami` at-Tirmidhi",
        "chapter": "Kitab al-Manaqib (باب في فضل ثقيف والدعاء لهم)",
        "ref_url": "https://sunnah.com/tirmidhi:3942"
    },

    # Sunan Abi Dawud (Exact Authenticated Reference)
    "Sunan Abi Dawud: Hadees #1342": {
        "book": "Sunan Abi Dawud",
        "chapter": "Kitab al-Tatwwu' (باب قيام الليل)",
        "ref_url": "https://sunnah.com/abudawud:1342"
    },
    "Sunan Abi Dawud: Hadees #3001": {
        "book": "Sunan Abi Dawud",
        "chapter": "Kitab al-Kharaj wal-Imarah wal-Fai' (باب في خبر بني قينقاع)",
        "ref_url": "https://sunnah.com/abudawud:3001"
    },
    "Sunan Abi Dawud: Hadees #4474": {
        "book": "Sunan Abi Dawud",
        "chapter": "Kitab al-Hudood (باب في حد القذف)",
        "ref_url": "https://sunnah.com/abudawud:4474"
    },

    # Musnad Ahmad bin Hanbal (Mohaddis.com Urdu Edition)
    "Musnad Ahmad: Hadees #1740": {
        "book": "Musnad Ahmad bin Hanbal",
        "chapter": "Musnad al-Kufiyyin (حديث جعفر بن أبي طالب عند النجاشي)",
        "ref_url": "https://mohaddis.com/View/Musnad-Ahmad/T2/1740"
    },
    "Musnad Ahmad: Hadees #2483": {
        "book": "Musnad Ahmad bin Hanbal",
        "chapter": "Musnad Bani Hashim (مسند عبد الله بن عباس - مؤامرة دار الندوة)",
        "ref_url": "https://mohaddis.com/View/Musnad-Ahmad/T2/2483"
    },
    "Musnad Ahmad: Hadees #22978": {
        "book": "Musnad Ahmad bin Hanbal",
        "chapter": "Musnad al-Ansar (خطبة وداع النبي - لا فضل لعربي على أعجمي)",
        "ref_url": "https://mohaddis.com/View/Musnad-Ahmad/T2/22978"
    },

    # Classical Reference Works (Shamela Library Authenticated References)
    "Mustadrak al-Hakim: Hadees #3362": {
        "book": "Al-Mustadrak 'ala al-Sahihayn (Al-Hakim)",
        "chapter": "Kitab at-Tafseer (تفسير سورة النحل - استضعاف عمار)",
        "ref_url": "https://shamela.ws/book/2266"
    },
    "Sunan al-Kubra by Bayhaqi: Hadees #21002": {
        "book": "As-Sunan al-Kubra (Al-Bayhaqi)",
        "chapter": "Kitab ash-Shahadat (باب ما جاء في لهو الحديث)",
        "ref_url": "https://shamela.ws/book/6450"
    },
    "Sunan al-Kubra lil-Bayhaqi: Hadees #18276": {
        "book": "As-Sunan al-Kubra (Al-Bayhaqi)",
        "chapter": "Kitab as-Siyar (باب فتح مكة والأمان لأهلها)",
        "ref_url": "https://shamela.ws/book/6450"
    },
    "Dalail an-Nubuwwah by Bayhaqi Vol 2: Hadees #473": {
        "book": "Dala'il an-Nubuwwah (Al-Bayhaqi)",
        "chapter": "Hijrat an-Nabi ﷺ (خروج النبي من بين المشركين وإلقاء التراب)",
        "ref_url": "https://shamela.ws/book/12028"
    },
    "Tafsir al-Tabari Vol 8: Hadees #13778": {
        "book": "Jami' al-Bayan fi Ta'wil al-Qur'an (At-Tabari)",
        "chapter": "Tafsir Surah Al-An'am (أومن كان ميتا فأحييناه)",
        "ref_url": "https://shamela.ws/book/43"
    },
    "Seerah Ibn Hisham Vol 1": {
        "book": "As-Seerah an-Nabawiyyah (Ibn Hisham)",
        "chapter": "Zikr Asbab an-Nuzul wa Bidayat ad-Da'wah",
        "ref_url": "https://shamela.ws/book/23833"
    },
    "Seerah Ibn Hisham Vol 2": {
        "book": "As-Seerah an-Nabawiyyah (Ibn Hisham)",
        "chapter": "Ghazwa Tabook wa Jaish-ul-Usrah",
        "ref_url": "https://shamela.ws/book/23833"
    }
}

def get_exact_hadith_ref(h):
    if not h: return h
    src = h.get('source', '').strip()
    
    # 1. Exact map check
    if src in AUDITED_HADITH_MAP:
        meta = AUDITED_HADITH_MAP[src]
        h['book'] = meta['book']
        if meta.get('chapter'): h['chapter'] = meta['chapter']
        h['ref_url'] = meta['ref_url']
        num_m = re.search(r'#(\d+)', src)
        if num_m: h['hadithNumber'] = num_m.group(1)
        return h

    # 2. Sahih Bukhari (Standard worldwide Sunnah.com reference)
    if "Bukhari" in src:
        num_m = re.search(r'#(\d+)', src)
        num = num_m.group(1) if num_m else None
        h['book'] = "Sahih al-Bukhari"
        if num:
            h['hadithNumber'] = num
            h['ref_url'] = f"https://sunnah.com/bukhari:{num}"
        else:
            h['ref_url'] = "https://sunnah.com/bukhari"
        return h

    # Safe Fallback
    h['book'] = src.split(":")[0] if ":" in src else src
    h['ref_url'] = "https://sunnah.com"
    return h
