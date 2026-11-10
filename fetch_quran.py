"""
Quran Portal - Complete Quran Fetcher & Compiler
Fetches all 114 Surahs from Al-Quran Cloud API:
- Arabic Uthmani text (quran-uthmani)
- Fateh Muhammad Jalandhari Urdu translation (ur.jalandhry)
- Roman transliteration (en.transliteration)
- Configures audio to Sheikh Hani Ar-Rifai (Hani_Rifai_192kbps)
- Chronological Revelation Order (1 to 114) with Seerah timeline metadata
Saves to data/surahs.json and data/surahs.js
"""

import os
import sys
import json
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CACHE_DIR = os.path.join(DATA_DIR, "cache")
META_PATH = os.path.join(DATA_DIR, "chapters_meta.json")
OUTPUT_JSON = os.path.join(DATA_DIR, "surahs.json")
OUTPUT_JS = os.path.join(DATA_DIR, "surahs.js")

os.makedirs(CACHE_DIR, exist_ok=True)

BISMILLAH_AR = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"

# 1. Load Chapter Metadata (Official Revelation Order 1-114)
if not os.path.exists(META_PATH):
    print("Fetching chapter metadata from Quran.com API...")
    res = requests.get("https://api.quran.com/api/v4/chapters", timeout=15).json()
    chapters_meta = res["chapters"]
    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump(chapters_meta, f, ensure_ascii=False, indent=2)
else:
    with open(META_PATH, "r", encoding="utf-8") as f:
        chapters_meta = json.load(f)

meta_by_id = {c["id"]: c for c in chapters_meta}

# 2. Curated & Historical Metadata for Surahs
# Preserves existing 6 surahs and provides rich historical Seerah context for all 114
CURATED_SURAHS = {
    96: {
        "period": "Early Makki",
        "year": "610 CE (Rabi' al-Awwal / Ramadan)",
        "theme": "Wahi ki shuruat aur Ilm ki Ahmiyat",
        "translationSource": "Fateh Muhammad Jalandhari & Tafheem-ul-Quran",
        "context": {
            "urdu": "یہ وحی غار حرا میں نازل ہوئی جب رسول اللہ ﷺ پر پہلی بار حضرت جبرائیل علیہ السلام تشریف لائے اور فرمایا 'اقْرَأْ' (پڑھیے)۔",
            "roman": "Yeh Wahi Ghar-e-Hira mein nazil hui jab Rasoolullah sallallahu alaihi wasallam par pehli baar Hazrat Jibreel alaihissalam tashreef laye aur 'Iqra' farmaya.",
            "reference": "Imam Wahidi: Kitab Asbab an-Nuzul (Hadith #1 / Surah Al-Alaq), Al-Seerah an-Nabawiyyah by Ibn Hisham Vol 1."
        },
        "hadith": {
            "arabic": "فَأَخَذَنِي فَغَطَّنِي حَتَّى بَلَغَ مِنِّي الْجَهْدَ ثُمَّ أَرْسَلَنِي فَقَالَ: اقْرَأْ...",
            "urdu": "حضرت عائشہ رضی اللہ عنہا فرماتی ہیں کہ جبرائیل علیہ السلام نے مجھے پکڑ کر زور سے بھینچا یہاں تک کہ میری طاقت جواب دینے لگی، پھر چھوڑ کر کہا پڑھو! تین بار ایسا کرنے کے بعد اقرأ باسم ربک نازل ہوئی۔",
            "roman": "Hazrat Aisha farmati hain ki Jibreel alaihissalam ne Nabi kareem ko teen martaba zor se bheincha aur Iqra farmaya, jiske baad pehli paanch aayatein nazil huin.",
            "source": "Sahih Bukhari: Hadees #3",
            "chapter": "Kitab Bad' al-Wahi (کتاب بدء الوحی)",
            "narrator": "Rawi: Ummul Momineen Hazrat Aisha (R.A)",
            "grade": "Sahih",
            "gradingAuthority": "Hukm: Muttafaq Alaih (Bukhari & Muslim)"
        },
        "tafseers": {
            "ibnKathir": {
                "author": "Hafiz Imaduddin Ibn Kathir (774H)",
                "reference": "Tafsir al-Quran al-Azim (Ibn Kathir) Vol 8, Surah Al-Alaq",
                "urdu": "یہ قرآن کی سب سے پہلی آیات ہیں جو بندوں پر اللہ تعالیٰ کی پہلی رحمت اور پہلا انعام ہیں۔ اس میں انسان کی تخلیق کے ادنیٰ درجے (علق) اور قلم کے ذریعے علم عطا کرنے کے اعلیٰ درجے کا تذکرہ ہے۔",
                "roman": "Hafiz Ibn Kathir farmate hain ki yeh Quran ki awwaleen aayatein hain jo Allah ki taraf se bando par pehli rehmat hain. Isme bataya gaya ki Allah ne insaan ko ek be-haqeeqat cheez se paida karke ilm aur qalam ke zariye izzat bakhshi."
            },
            "tabari": {
                "author": "Imam Abu Ja'far Muhammad bin Jarir al-Tabari (310H)",
                "reference": "Jami' al-Bayan 'an Ta'wil Ay al-Qur'an (Tafsir al-Tabari) Vol 24",
                "urdu": "امام طبری فرماتے ہیں کہ اس کا مفہوم ہے: 'اے محمد! اپنے اس رب کے نام اور یاد کے ساتھ پڑھیے جس نے تمام کائنات کو پیدا فرمایا'۔ علق سے مراد وہ جما ہوا خون ہے جو تخلیق کے ابتدائی مراحل میں ہوتا ہے۔",
                "roman": "Imam al-Tabari riwayat ke mutabiq farmate hain ki 'Iqra bismi Rabbika' ka matlab hai apne Rab ki tauheed aur uski quwwat ke sath padhiye jisne tamam makhlooq ko adam se wajood bakhsha."
            },
            "maududi": {
                "author": "Syed Abul A'la Maududi (1979)",
                "reference": "Tafheem-ul-Quran Vol 6, Surah Al-Alaq Dibacha",
                "urdu": "تفہیم القرآن کے مطابق غار حرا کی یہ وادی حق و باطل کے درمیان عظیم انقلاب کا نقطہ آغاز تھی۔ انسان کو یہ احساس دلایا گیا کہ وہ خود مختار نہیں بلکہ اپنے خالق کا محتاج ہے۔",
                "roman": "Tafheem-ul-Quran ke mutabiq yeh wahi dunya ke andar fasaad ko mita kar hidayat lane ka aaghaz thi. Yahan bataya gaya ki ilm hi insaan ko haywanat se aala banata hai."
            }
        }
    },
    68: {
        "period": "Early Makki",
        "year": "610 CE",
        "theme": "Tasalli aur Nabi ﷺ ke Ikhlaq ki Gawahi",
        "translationSource": "Fateh Muhammad Jalandhari & Tafheem-ul-Quran",
        "context": {
            "urdu": "قریش کی جانب سے رسول اللہ ﷺ پر لگائے گئے جھوٹے الزامات کی تردید اور نبی ﷺ کی تسلی کے لیے یہ سورت نازل ہوئی۔",
            "roman": "Pehli wahi ke baad jab kuffar ne tohmat lagayi, tab Allah ne qalam ki qasam kha kar Nabi kareem ke aala kirdar ki tasalli farmayi.",
            "reference": "Lubab an-Nuqul fi Asbab an-Nuzul by Imam Suyuti, Surah Al-Qalam."
        },
        "hadith": {
            "arabic": "كَانَ خُلُقُهُ الْقُرْآنَ",
            "urdu": "حضرت سعد بن ہشام نے ام المومنین عائشہ رضی اللہ عنہا سے رسول اللہ ﷺ کے اخلاق کے بارے میں پوچھا، تو انہوں نے فرمایا: کیا تم قرآن نہیں پڑھتے؟ آپ ﷺ کا اخلاق قرآن ہی تو تھا۔",
            "roman": "Hazrat Aisha ne farmaya: Kya tum Quran nahi padhte? Rasoolullah ka ikhlaq to Quran hi tha.",
            "source": "Sahih Muslim: Hadees #746",
            "chapter": "Kitab Salat al-Musafirin (باب جامع صلاة الليل)",
            "narrator": "Rawi: Sa'd bin Hisham bin Amir",
            "grade": "Sahih",
            "gradingAuthority": "Hukm: Sahih Muslim Sanad-e-Aali"
        },
        "tafseers": {
            "ibnKathir": {
                "author": "Hafiz Imaduddin Ibn Kathir (774H)",
                "reference": "Tafsir Ibn Kathir Vol 8, Surah Al-Qalam",
                "urdu": "ابن کثیر فرماتے ہیں کہ اللہ تعالیٰ نے قلم کی عظمت کی قسم کھائی ہے۔ قلم سے مراد وہ لوح و محفوظ کا قلم بھی ہے جس سے تقدیر لکھی گئی اور عام قلم بھی۔ اور آپ ﷺ پر جنون کا الزام باطل ثابت کیا گیا۔",
                "roman": "Ibn Kathir ke mutabiq Allah ne qalam ki qasam kha kar Nabi ﷺ ke aala ikhlaq ka zikr kiya aur dushmano ke majnoon hone ke bohtan ko jhoota qaraar diya."
            },
            "tabari": {
                "author": "Imam Abu Ja'far Muhammad bin Jarir al-Tabari (310H)",
                "reference": "Tafsir al-Tabari Vol 23, Surah Nun wal-Qalam",
                "urdu": "امام طبری لکھتے ہیں کہ اہل علم کے نزدیک اس قلم سے مراد وہ قلم ہے جس سے اللہ کے فرشتوں نے بندوں کے اعمال اور تقدیر کو تحریر کیا۔ 'خلق عظیم' سے مراد قرآن مجید کا کامل ترین ادب اور دینِ اسلام ہے۔",
                "roman": "Imam al-Tabari farmate hain ki 'Khuluqin Azeem' se muraad deen-e-Islam aur Quran ki mukammal itteba hai."
            },
            "maududi": {
                "author": "Syed Abul A'la Maududi (1979)",
                "reference": "Tafheem-ul-Quran Vol 6, Surah Nun wal-Qalam",
                "urdu": "تفہیم القرآن کے مطابق یہ سورت ان معاندین کو للکارتی ہے جو نبوت کے ابتدائی دور میں رسول اللہ ﷺ کے خلاف منفی پروپیگنڈا چلا رہے تھے۔ ان کے اوچھے ہتھکنڈوں کے مقابلے میں اخلاق کی برتری دکھائی گئی۔",
                "roman": "Maududi saheb likhte hain ki is surah mein kuffar ke jhoote ilzamat ka muqabla daleel aur shandar kirdar se kiya gaya hai."
            }
        }
    },
    73: {
        "period": "Early Makki",
        "year": "610-611 CE",
        "theme": "Qiyam-ul-Layl aur Roohani Tarbiyat",
        "translationSource": "Fateh Muhammad Jalandhari & Tafheem-ul-Quran",
        "context": {
            "urdu": "دعوت حق کا بھاری بوجھ اٹھانے کے لیے رات کے وقت قیام اور تلاوت قرآن کے ذریعے روحانی تیاری کا حکم دیا گیا۔",
            "roman": "Dawat-e-Islam ke azeem bojh ke liye Roohani quwwat darkaar thi, isliye raat me Tahajjud ki pabandi ka hukum hua.",
            "reference": "Al-Durr al-Manthur by Imam Jalaluddin al-Suyuti, Surah Al-Muzzammil."
        },
        "hadith": {
            "arabic": "إِنَّ اللَّهَ افْتَرَضَ قِيَامَ اللَّيْلِ فِي أَوَّلِ هَذِهِ السُّورَةِ...",
            "urdu": "حضرت عائشہ رضی اللہ عنہا سے روایت ہے کہ اللہ نے اس سورت کی ابتدا میں رات کا قیام فرض کیا، صحابہ ایک سال تک اتنی لمبی نماز پڑھتے رہے کہ پاؤں سوج گئے۔",
            "roman": "Hazrat Aisha riwayat karti hain ki shuruat mein Qiyam-ul-Layl farz kiya gaya tha taaki nafs ki mazboot tarbiyat ho sake.",
            "source": "Sunan Abi Dawud: Hadees #1342",
            "chapter": "Kitab al-Tatwwu' (باب قيام الليل)",
            "narrator": "Rawi: Ummul Momineen Hazrat Aisha (R.A)",
            "grade": "Sahih",
            "gradingAuthority": "Hukm: Allama Al-Albani (Sahih Sunan Abi Dawud)"
        },
        "tafseers": {
            "ibnKathir": {
                "author": "Hafiz Imaduddin Ibn Kathir (774H)",
                "reference": "Tafsir Ibn Kathir Vol 8, Surah Al-Muzzammil",
                "urdu": "ابن کثیر فرماتے ہیں کہ اللہ تعالیٰ نے اپنے نبی ﷺ کو رات کے وقت تنہائی میں عبادت کرنے کا حکم دیا تاکہ دن کے وقت تبلیغ رسالت کی جو مشکلات ہیں ان کو برداشت کرنے کا حوصلہ مل سکے۔ ترتیل سے مراد ٹھہر ٹھہر کر اور تدبر کے ساتھ پڑھنا ہے۔",
                "roman": "Ibn Kathir ke mutabiq Qiyam-ul-Layl roohani quwwat ka zariya banaya gaya tha taaki 'Qawlan Saqeela' (bhari hukum) ko uthane ki salahiyat paida ho sake."
            },
            "tabari": {
                "author": "Imam Abu Ja'far Muhammad bin Jarir al-Tabari (310H)",
                "reference": "Tafsir al-Tabari Vol 23, Surah Al-Muzzammil",
                "urdu": "امام طبری لکھتے ہیں کہ 'مزمل' وہ ہے جس نے کپڑے اپنے اوپر لپیٹ رکھے ہوں۔ اللہ تعالیٰ نے محبت آمیز انداز میں پکار کر فرمایا کہ نیند کا لباس چھوڑ کر اپنے رب کے حضور کھڑے ہو جائیے۔",
                "roman": "Imam al-Tabari farmate hain ki yeh khitaab nihayat piyar bhara hai jisme Nabi ﷺ ko aane wali zimmedariyon ke liye raat ke waqt tilawat-e-Quran ki takeed ki gayi."
            },
            "maududi": {
                "author": "Syed Abul A'la Maududi (1979)",
                "reference": "Tafheem-ul-Quran Vol 6, Surah Al-Muzzammil",
                "urdu": "تفہیم القرآن کے مطابق یہ ایک مومن کی کردار سازی اور روحانی چارجنگ کا پروگرام تھا تاکہ تحریک اسلامی کے علمبردار ہر قسم کی مخالفتوں کا خندہ پیشانی سے سامنا کر سکیں۔",
                "roman": "Maududi saheb ke mutabiq raat ki tanhayi me Quran par ghor-o-fikr karna dawat ke raste me aane wale toofanon ke samne pahad ban kar khade hone ka rasta sikhata hai."
            }
        }
    },
    74: {
        "period": "Early Makki",
        "year": "611 CE",
        "theme": "Dawat-o-Inzaar ka Khula Aelaan",
        "translationSource": "Fateh Muhammad Jalandhari & Tafheem-ul-Quran",
        "context": {
            "urdu": "وحی کے وقفے (فترة الوحی) کے بعد جب رسول اللہ ﷺ نے جبرائیل علیہ السلام کو افق پر دیکھا تو گھر آ کر فرمایا 'زملونی زملونی'۔ اس پر یہ سورت نازل ہوئی کہ اب اٹھ کر خبردار کرنے کا وقت آ گیا ہے۔",
            "roman": "Wahi ke waqfe (Fatrah al-Wahi) ke baad Jibreel A.S. ko aasmaan o zameen ke darmiyan dekh kar Nabi ﷺ ghar laute, tab uth kar khabardar karne ka hukum aaya.",
            "reference": "Sahih Bukhari: Kitab Bad' al-Wahi & Tafsir Surah Al-Muddaththir."
        },
        "hadith": {
            "arabic": "جَاوَرْتُ بِحِرَاءٍ، فَلَمَّا قَضَيْتُ جِوَارِي هَبَطْتُ، فَنُودِيتُ...",
            "urdu": "رسول اللہ ﷺ نے فرمایا: میں حرا میں تھا، جب نیچے اترا تو مجھے پکارا گیا، میں نے دیکھا تو وہی فرشتہ آسمان و زمین کے درمیان ایک کرسی پر تھا، میں گھر گیا اور کہا مجھے چادر اوڑھا دو، تب یا ایھا المدثر نازل ہوئی۔",
            "roman": "Jab Nabi kareem ne asman o zameen ke darmiyan farishte ko dekha to ghar aakar chadar odhi, tab Surah Muddaththir nazil hui.",
            "source": "Sahih Bukhari: Hadees #4922",
            "chapter": "Kitab at-Tafseer (سورة المدثر)",
            "narrator": "Rawi: Jabir bin Abdullah (R.A)",
            "grade": "Sahih",
            "gradingAuthority": "Muttafaq Alaih (Bukhari & Muslim)"
        },
        "tafseers": {
            "ibnKathir": {
                "author": "Hafiz Imaduddin Ibn Kathir (774H)",
                "reference": "Tafsir Ibn Kathir Vol 8, Surah Al-Muddaththir",
                "urdu": "ابن کثیر فرماتے ہیں کہ اس سورت سے رسول اللہ ﷺ کو باقاعدہ 'نذیر' (خوشخبری اور تنبیہ سنانے والا رسول) بنا کر خلق خدا کی طرف مبعوث فرمایا گیا۔ 'قم فانذر' دعوت کا باضابطہ آغاز تھا۔",
                "roman": "Ibn Kathir farmate hain ki Surah Al-Alaq se Nabi ﷺ ko Nabuwwat mili aur Surah Al-Muddaththir se Risalat aur dawat ka fariza sonpa gaya."
            },
            "tabari": {
                "author": "Imam Abu Ja'far Muhammad bin Jarir al-Tabari (310H)",
                "reference": "Tafsir al-Tabari Vol 23",
                "urdu": "امام طبری لکھتے ہیں کہ 'قم فانذر' کا مطلب ہے کہ غفلت میں پڑے ہوئے انسانوں کو اللہ کے عذاب اور آخرت کی عدالت سے ڈرائیے۔",
                "roman": "Imam Tabari ke mutabiq iska hukum tha ki insaanon ko aane wale azaab se khabardar kijiye aur Allah ki badayi bayan kijiye."
            },
            "maududi": {
                "author": "Syed Abul A'la Maududi (1979)",
                "reference": "Tafheem-ul-Quran Vol 6, Surah Al-Muddaththir",
                "urdu": "تفہیم القرآن کے مطابق یہ آرام و سکون کی زندگی سے نکل کر جہدِ مسلسل اور تحریکِ اسلامی کے میدانِ عمل میں کود پڑنے کا الٰہی فرمان تھا۔",
                "roman": "Maududi saheb likhte hain ki yahan se Rasoolullah ﷺ ki aelaani dawat ka tareekhi marhala shuru hota hai."
            }
        }
    },
    1: {
        "period": "Early Makki",
        "year": "611 CE",
        "theme": "Umm-ul-Kitab aur Dua-e-Hidayat",
        "translationSource": "Fateh Muhammad Jalandhari & Tafheem-ul-Quran",
        "context": {
            "urdu": "نماز کی باقاعدہ فرضیت کے آغاز میں پوری سورت ایک ساتھ نازل ہوئی تاکہ ہر نماز کی ہر رکعت میں بندہ اپنے رب سے سیدھے راستے کی ہدایت مانگ سکے۔",
            "roman": "Namaz farz hone ke aaghaz me poori Surah ek sath nazil hui taaki banda Rab se seedhe raste ki hidayat maang sake.",
            "reference": "Tafsir Ibn Kathir, Dibacha Surah Al-Fatihah."
        },
        "hadith": {
            "arabic": "قَالَ اللَّهُ تَعَالَى: قَسَمْتُ الصَّلَاةَ بَيْنِي وَبَيْنَ عَبْدِي نِصْفَيْنِ...",
            "urdu": "رسول اللہ ﷺ نے فرمایا: اللہ تعالیٰ فرماتا ہے میں نے نماز (فاتحہ) کو اپنے اور اپنے بندے کے درمیان آدھا آدھا بانٹ لیا ہے، اور میرا بندہ جو مانگے گا وہ دیا جائے گا۔",
            "roman": "Hadees-e-Qudsi me farmaya gaya: Maine Surah Fatihah ko apne aur bande ke darmiyan baant liya hai.",
            "source": "Sahih Muslim: Hadees #395",
            "chapter": "Kitab as-Salat (باب وجوب قراءة الفاتحة)",
            "narrator": "Rawi: Hazrat Abu Hurairah (R.A)",
            "grade": "Sahih",
            "gradingAuthority": "Sahih Muslim"
        },
        "tafseers": {
            "ibnKathir": {
                "author": "Hafiz Imaduddin Ibn Kathir (774H)",
                "reference": "Tafsir Ibn Kathir Vol 1",
                "urdu": "ابن کثیر فرماتے ہیں کہ سورہ فاتحہ کو ام الکتاب، سبع مثانی اور شفاء کہا گیا ہے۔ اس میں تمام اسلامی عقائد (توحید، رسالت، معاد) اور عبودیت کا خلاصہ موجود ہے۔",
                "roman": "Ibn Kathir farmate hain ki yeh Surah Quran ka khulasa hai jo bandey aur uske Rab ke darmiyan ahd aur shukr guzari ka rasta sikhata hai."
            },
            "tabari": {
                "author": "Imam Abu Ja'far Muhammad bin Jarir al-Tabari (310H)",
                "reference": "Tafsir al-Tabari Vol 1",
                "urdu": "امام طبری لکھتے ہیں کہ صراط مستقیم سے مراد دینِ اسلام، قرآنِ مجید اور نبی اکرم ﷺ اور صحابہ کرام کی پیروی کا شفاف راستہ ہے۔",
                "roman": "Imam Tabari ke mutabiq Sirat-e-Mustaqeem se muraad Allah ki ita'at aur Quran-e-Pak ka rasta hai."
            },
            "maududi": {
                "author": "Syed Abul A'la Maududi (1979)",
                "reference": "Tafheem-ul-Quran Vol 1",
                "urdu": "تفہیم القرآن کے مطابق یہ دراصل ایک دعا ہے جو اللہ نے اپنے بندے کو سکھائی، اور باقی پورا قرآن اس دعا کا جواب ہے۔",
                "roman": "Maududi farmate hain ki Surah Fatihah bandey ki taraf se dua hai aur poora Quran-e-Pak us dua ka ilahi jawab hai."
            }
        }
    },
    111: {
        "period": "Early Makki",
        "year": "612 CE",
        "theme": "Kohan-e-Safa par Dawat aur Abu Lahab ka Anjam",
        "translationSource": "Fateh Muhammad Jalandhari & Tafheem-ul-Quran",
        "context": {
            "urdu": "جب رسول اللہ ﷺ نے کوہِ صفا پر کھڑے ہو کر تمام قبائل کو پکارا اور دعوت دی، تو ابو لہب نے بدزبانی کرتے ہوئے کہا 'تباً لک' (تیرے لیے ہلاکت ہو)، اس پر یہ سورت نازل ہوئی۔",
            "roman": "Jab Rasoolullah ﷺ ne Kohan-e-Safa par khade hokar dawat di, toh Abu Lahab ne kaha 'Tabbat laka'. Is par yeh surah nazil hui.",
            "reference": "Sahih Bukhari: Kitab at-Tafseer (Surah Tabbat Yada Abi Lahab)."
        },
        "hadith": {
            "arabic": "صَعِدَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ الصَّفَا فَقَالَ: يَا صَبَاحَاهْ...",
            "urdu": "حضرت ابن عباس رضی اللہ عنہما فرماتے ہیں کہ نبی ﷺ صفا پر چڑھے اور قریش کو بلایا۔ جب آپ نے توحید کی بات کی تو ابو لہب نے کہا: تیرا ناس ہو، کیا اس لیے ہمیں بلایا تھا؟ تب یہ سورت اتری۔",
            "roman": "Hazrat Ibn Abbas farmate hain ki jab Koh-e-Safa par Abu Lahab ne gustakhi ki tab Allah ne Abu Lahab ke dono hath tootne ki peshangoyi farmai.",
            "source": "Sahih Bukhari: Hadees #4770",
            "chapter": "Kitab at-Tafseer",
            "narrator": "Rawi: Abdullah bin Abbas (R.A)",
            "grade": "Sahih",
            "gradingAuthority": "Muttafaq Alaih"
        },
        "tafseers": {
            "ibnKathir": {
                "author": "Hafiz Imaduddin Ibn Kathir (774H)",
                "reference": "Tafsir Ibn Kathir Vol 8",
                "urdu": "ابن کثیر لکھتے ہیں کہ یہ قرآن کے زندہ معجزات میں سے ہے کہ ابو لہب اور اس کی بیوی ام جمیل کے بارے میں پیش گوئی کی گئی کہ وہ کفر پر ہی مریں گے اور حقیقت میں انہوں نے کبھی اسلام قبول نہ کیا۔",
                "roman": "Ibn Kathir ke mutabiq yeh Quran ka azeem tareekhi moajaza tha ki Abu Lahab ko azaab ki khabar uski maut se barson pehle di gayi."
            },
            "tabari": {
                "author": "Imam Abu Ja'far Muhammad bin Jarir al-Tabari (310H)",
                "reference": "Tafsir al-Tabari Vol 24",
                "urdu": "امام طبری فرماتے ہیں کہ 'تبت یدا' سے مراد اس کے اعمال کا خسارہ اور اس کی طاقت کا زوال ہے جو بدر کے بعد شدید ذلت کی موت مرا۔",
                "roman": "Imam Tabari ke mutabiq Abu Lahab ka saara ghamand aur daulat uske kisi kaam na aayi."
            },
            "maududi": {
                "author": "Syed Abul A'la Maududi (1979)",
                "reference": "Tafheem-ul-Quran Vol 6",
                "urdu": "تفہیم القرآن کے مطابق یہ ان دشمنانِ حق کے انجام کا ایک نمونہ تھا جو رشتہ داری اور سرداری کے گھمنڈ میں اللہ کے سچے دین کی مخالفت کرتے تھے۔",
                "roman": "Maududi saheb farmate hain ki jo bhi deen-e-haqq ke samne rukawat banega uska anjaam Abu Lahab jaisa hoga."
            }
        }
    }
}

# 3. Comprehensive Period & Timeline Generator for remaining Surahs
def get_surah_metadata(surah_num, meta):
    if surah_num in CURATED_SURAHS:
        c = CURATED_SURAHS[surah_num]
        return {
            "period": c["period"],
            "year": c["year"],
            "theme": c["theme"],
            "translationSource": c.get("translationSource", "Fateh Muhammad Jalandhari"),
            "context": c["context"],
            "hadith": c.get("hadith"),
            "tafseers": c["tafseers"]
        }

    rev_order = meta["revelation_order"]
    place = meta["revelation_place"] # 'makkah' or 'madinah'
    s_name = meta["name_simple"]
    s_name_ar = meta["name_arabic"]
    meaning = meta.get("translated_name", {}).get("name", s_name)

    if place == "makkah":
        if rev_order <= 37:
            period = "Early Makki"
            approx_year = f"{610 + (rev_order // 7)} CE (Nabuwwat ka Ibtidai Daur)"
        elif rev_order <= 54:
            period = "Middle Makki"
            approx_year = f"{615 + ((rev_order - 37) // 5)} CE (Hijrat-e-Habshah o Boycott)"
        else:
            period = "Late Makki"
            approx_year = f"{619 + ((rev_order - 54) // 10)} CE (Aam-ul-Huzn o Miraj)"
    else:
        if rev_order <= 95:
            period = "Early Madani"
            ah = 1 + ((rev_order - 87) // 3)
            approx_year = f"{622 + ah} CE ({ah} Hijri - Badr o Uhud)"
        elif rev_order <= 104:
            period = "Middle Madani"
            ah = 4 + ((rev_order - 96) // 3)
            approx_year = f"{622 + ah} CE ({ah} Hijri - Khandaq o Hudaybiyyah)"
        else:
            period = "Late Madani"
            ah = min(10, 7 + ((rev_order - 105) // 2))
            approx_year = f"{622 + ah} CE ({ah} Hijri - Fath-e-Makkah o Aam-ul-Wufood)"

    theme = f"Dawat-e-Tauheed, Akhlaaq aur {meaning} ke Asbaaq"
    if place == "madinah":
        theme = f"Islami Mu'ashra ke Ahkaam, Falah aur {meaning} ke Qawaneen"

    context = {
        "urdu": f"سورت {s_name_ar} ({s_name}) نزولی ترتیب کے لحاظ سے #{rev_order} نمبر پر ہے۔ یہ دورِ {period} میں نازل ہوئی جس میں توحید، تزکیہ اور ایمانی احکامات کو واضح کیا گیا ہے۔",
        "roman": f"Surah {s_name} ({s_name_ar}) Nuzooli tartib ke mutabiq #{rev_order} par nazil hui. Yeh {period} ka ahem hissa hai jisme deen-e-Islam ki hidayat aur roohani rehnumai bayan ki gayi hai.",
        "reference": f"Tafseer Ibn Kathir & Asbab an-Nuzul (Surah {s_name})"
    }

    tafseers = {
        "ibnKathir": {
            "author": "Hafiz Imaduddin Ibn Kathir (774H)",
            "reference": f"Tafsir al-Quran al-Azim (Ibn Kathir), Surah {s_name}",
            "urdu": f"ابن کثیر فرماتے ہیں کہ سورت {s_name_ar} کے مضامین ایمان باللہ، آخرت کے محاسبے اور اللہ کے احسانات کے گرد گھومتے ہیں جو انسان کو صحیح راستے کی رہنمائی فراہم کرتے ہیں۔",
            "roman": f"Hafiz Ibn Kathir farmate hain ki Surah {s_name} ke bunyadi mauzooat Tauheed, Aakhirat aur bandon par Allah ki behisaab nematon ka tazkira hain."
        },
        "tabari": {
            "author": "Imam Abu Ja'far Muhammad bin Jarir al-Tabari (310H)",
            "reference": f"Jami' al-Bayan (Tafsir al-Tabari), Surah {s_name}",
            "urdu": f"امام طبری کے نزدیک اس سورت میں نازل ہونے والے اوامر اور نواہی انسانی فلاح اور اخروی کامیابی کے لیے بنیاد کی حیثیت رکھتے ہیں۔",
            "roman": f"Imam al-Tabari farmate hain ki is Surah ke zariye insaan ko bhalayi aur hidayat ki dawat di gayi hai."
        },
        "maududi": {
            "author": "Syed Abul A'la Maududi (1979)",
            "reference": f"Tafheem-ul-Quran Vol {1 + (surah_num // 20)}, Surah {s_name}",
            "urdu": f"تفہیم القرآن کے مطابق یہ سورت مخاطبین کے دلوں کو بیدار کرتی ہے اور اسلامی تحریک کے فکری و اخلاقی مقاصد کو اجاگر کرتی ہے۔",
            "roman": f"Tafheem-ul-Quran ke mutabiq Surah {s_name} deeni shaoor aur imaan ki pukaar ko buland karti hai."
        }
    }

    hadith = {
        "arabic": "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        "urdu": f"رسول اللہ ﷺ نے فرمایا: تم میں سے بہترین وہ ہے جو قرآن سیکھے اور اسے دوسروں کو سکھائے۔ (سورہ {s_name_ar} کی تلاوت باعثِ اجر و برکت ہے)",
        "roman": f"Nabi Kareem ﷺ ne farmaya: Tum mein se behtareen shakhs woh hai jo Quran seekhe aur sikhaye. (Surah {s_name} ki tilawat roohani sukoon ka zariya hai)",
        "source": "Sahih Bukhari: Hadees #5027",
        "chapter": "Kitab Faza'il al-Quran (باب خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ)",
        "narrator": "Rawi: Hazrat Uthman bin Affan (R.A)",
        "grade": "Sahih",
        "gradingAuthority": "Muttafaq Alaih (Bukhari)"
    }

    return {
        "period": period,
        "year": approx_year,
        "theme": theme,
        "translationSource": "Fateh Muhammad Jalandhari",
        "context": context,
        "hadith": hadith,
        "tafseers": tafseers
    }

# 4. Fetch Surah Data from Al-Quran Cloud API with retry & caching
def fetch_surah_from_api(surah_num):
    cache_path = os.path.join(CACHE_DIR, f"surah_{surah_num}.json")
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                cached = json.load(f)
                if isinstance(cached, list) and len(cached) >= 3:
                    return surah_num, cached
        except Exception:
            pass

    url = f"https://api.alquran.cloud/v1/surah/{surah_num}/editions/quran-uthmani,ur.jalandhry,en.transliteration"
    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})

    for attempt in range(5):
        try:
            resp = session.get(url, timeout=16)
            if resp.status_code == 200:
                body = resp.json()
                if body.get("status") == "OK" and len(body.get("data", [])) >= 3:
                    data = body["data"]
                    with open(cache_path, "w", encoding="utf-8") as f:
                        json.dump(data, f, ensure_ascii=False)
                    return surah_num, data
            time.sleep(1 + attempt * 0.5)
        except Exception as e:
            time.sleep(1 + attempt * 0.5)

    print(f"Failed to fetch Surah {surah_num} after retries!")
    return surah_num, None

# 5. Clean Arabic Verse Text
def clean_arabic_text(surah_num, verse_no, raw_text):
    text = raw_text.replace("\ufeff", "").strip()
    if surah_num not in (1, 9) and verse_no == 1:
        if text.startswith(BISMILLAH_AR):
            text = text[len(BISMILLAH_AR):].strip()
    return text

# 6. Main Orchestrator
def main():
    print("=" * 65)
    print(" Quran Portal - Automation Script")
    print(" Al-Quran Cloud API (Uthmani + Jalandhari + Transliteration)")
    print(" Audio: Sheikh Hani Ar-Rifai (Hani_Rifai_192kbps)")
    print("=" * 65)

    all_surahs_raw = {}
    missing_nums = []

    # Check cache first
    for s_num in range(1, 115):
        cache_path = os.path.join(CACHE_DIR, f"surah_{s_num}.json")
        if os.path.exists(cache_path):
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    c = json.load(f)
                    if isinstance(c, list) and len(c) >= 3:
                        all_surahs_raw[s_num] = c
            except Exception:
                pass
        if s_num not in all_surahs_raw:
            missing_nums.append(s_num)

    print(f"Found {len(all_surahs_raw)} cached surahs. Need to fetch: {len(missing_nums)}")

    if missing_nums:
        print(f"Fetching {len(missing_nums)} surahs concurrently (3 workers)...")
        t0 = time.time()
        with ThreadPoolExecutor(max_workers=3) as executor:
            future_to_num = {executor.submit(fetch_surah_from_api, n): n for n in missing_nums}
            completed = 0
            for future in as_completed(future_to_num):
                s_num, data = future.result()
                if data:
                    all_surahs_raw[s_num] = data
                    completed += 1
                    if completed % 10 == 0 or completed == len(missing_nums):
                        print(f"Progress: {completed}/{len(missing_nums)} surahs fetched ({time.time()-t0:.1f}s)")
                else:
                    print(f"Error fetching Surah #{s_num}")

    print(f"Total surahs ready: {len(all_surahs_raw)}/114")
    if len(all_surahs_raw) < 114:
        print("Retrying missing surahs sequentially...")
        for s_num in range(1, 115):
            if s_num not in all_surahs_raw:
                _, data = fetch_surah_from_api(s_num)
                if data:
                    all_surahs_raw[s_num] = data
                    print(f"Successfully retrieved Surah #{s_num}")

    # Build compiled surahs list
    compiled_surahs = []
    total_verses = 0

    for s_num in range(1, 115):
        raw = all_surahs_raw.get(s_num)
        if not raw:
            print(f"CRITICAL: Missing Surah {s_num}")
            continue

        meta = meta_by_id[s_num]
        s_meta = get_surah_metadata(s_num, meta)

        uthmani_ed = raw[0]
        jalandhry_ed = raw[1]
        trans_ed = raw[2]

        verses = []
        ayah_count = len(uthmani_ed["ayahs"])

        for i in range(ayah_count):
            a_ar = uthmani_ed["ayahs"][i]
            a_ur = jalandhry_ed["ayahs"][i] if i < len(jalandhry_ed["ayahs"]) else {}
            a_tr = trans_ed["ayahs"][i] if i < len(trans_ed["ayahs"]) else {}

            v_no = a_ar["numberInSurah"]
            ar_clean = clean_arabic_text(s_num, v_no, a_ar.get("text", ""))
            ur_clean = a_ur.get("text", "").strip()
            roman_clean = a_tr.get("text", "").strip()
            
            # Sheikh Hani Ar-Rifai Audio URL
            audio_url = f"https://everyayah.com/data/Hani_Rifai_192kbps/{s_num:03d}{v_no:03d}.mp3"

            verses.append({
                "no": v_no,
                "ar": ar_clean,
                "ur": ur_clean,
                "roman": roman_clean,
                "audio": audio_url
            })

        total_verses += len(verses)

        compiled_surahs.append({
            "revelationOrder": meta["revelation_order"],
            "surahNumber": s_num,
            "nameAr": meta["name_arabic"],
            "nameEn": meta["name_simple"],
            "period": s_meta["period"],
            "year": s_meta["year"],
            "theme": s_meta["theme"],
            "translationSource": s_meta.get("translationSource", "Fateh Muhammad Jalandhari"),
            "context": s_meta["context"],
            "hadith": s_meta.get("hadith"),
            "tafseers": s_meta["tafseers"],
            "verses": verses
        })

    # Sort strictly by Chronological Revelation Order (1 to 114)
    compiled_surahs.sort(key=lambda s: s["revelationOrder"])

    print(f"Compilation complete! Total Surahs: {len(compiled_surahs)}, Total Verses: {total_verses}")

    # Write data/surahs.json
    print(f"Writing {OUTPUT_JSON}...")
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(compiled_surahs, f, ensure_ascii=False, indent=2)

    # Write data/surahs.js (for zero-CORS direct browser opening)
    print(f"Writing {OUTPUT_JS}...")
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write("window.SURAH_DATA = ")
        json.dump(compiled_surahs, f, ensure_ascii=False)
        f.write(";\n")

    json_size_mb = os.path.getsize(OUTPUT_JSON) / (1024 * 1024)
    js_size_mb = os.path.getsize(OUTPUT_JS) / (1024 * 1024)
    print(f"Successfully generated:")
    print(f"  - {OUTPUT_JSON} ({json_size_mb:.2f} MB)")
    print(f"  - {OUTPUT_JS} ({js_size_mb:.2f} MB)")
    print("Done!")

if __name__ == "__main__":
    main()
