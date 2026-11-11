// Nuzool-ul-Quran: Academic Hadith Citation & Utility Module

/**
 * Formats a hadith object into a standardized academic citation.
 * Example outputs:
 * - Reference: Sahih Bukhari (Hadees No: 4953)
 * - Reference: Sahih Muslim (Hadees No: 160, Jild: 1, Safha: 97)
 * - Reference: Sunan Abi Dawood (Hadees No: 3991)
 *
 * @param {Object} hadith - Hadith data object
 * @returns {string} Standardized academic citation string
 */
function formatAcademicCitation(hadith) {
  if (!hadith) return '';
  
  const bookMap = {
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
  };
  
  let book = hadith.book || '';
  if (!book && hadith.source) {
    book = hadith.source.replace(/^Reference:\s*/i, '').split('(')[0].split(':')[0].trim();
  }
  book = bookMap[book] || book;

  const details = [];
  if (hadith.hadithNumber) {
    details.push(`Hadees No: ${hadith.hadithNumber}`);
  }
  if (hadith.jild || hadith.volume) {
    details.push(`Jild: ${hadith.jild || hadith.volume}`);
  }
  if (hadith.safha) {
    details.push(`Safha: ${hadith.safha}`);
  } else if (hadith.page || hadith.pageNo) {
    details.push(`Page No: ${hadith.page || hadith.pageNo}`);
  }

  const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
  return `Reference: ${book}${detailsStr}`;
}

/**
 * Renders the Themes & Actionable Lessons card.
 * Maintains clean dual-direction layout:
 * - English/Roman Topic on Left (LTR) vs Urdu Topic on Right (RTL)
 * - Number badges (1, 2, 3) on Left, Urdu text RTL on Right, Roman text LTR below
 *
 * @param {Object} item - Surah or Episode object
 */
function renderLessonsCard(item) {
  if (!item) return;
  const themeRoman = document.getElementById('theme-roman');
  const themeUrdu = document.getElementById('theme-urdu');
  const lessonsContainer = document.getElementById('lessons-container');
  
  const romanTopic = item.theme || item.title || (item.nameEn ? `${item.nameEn} — Dawat o Hidayat` : 'Dawat-e-Tawheed o Hidayat');
  const urduTopic = item.themeUrdu || item.titleUrdu || (item.nameAr ? `${item.nameAr} — دعوت و ہدایت` : 'دعوتِ توحید و ہدایت');
  
  if (themeRoman) themeRoman.innerText = romanTopic;
  if (themeUrdu) themeUrdu.innerText = urduTopic;

  if (lessonsContainer) {
    const lessons = item.lessons || [];
    if (lessons.length > 0) {
      lessonsContainer.innerHTML = lessons.map((l, idx) => `
        <div class="bg-white/95 p-2.5 sm:p-3 rounded-lg border border-stone-200/80 shadow-2xs space-y-1.5">
          <!-- Top Row: Number Badge (Left) and Urdu Nastaliq Text (Right, RTL) -->
          <div class="flex items-start justify-between gap-2.5">
            <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs" dir="ltr">
              ${idx + 1}
            </span>
            <p class="font-urdu text-xs text-stone-800 leading-relaxed text-right flex-1" dir="rtl">
              ${l.urdu}
            </p>
          </div>

          <!-- Bottom Row: Roman Urdu / English Explanation (Always Left-aligned) -->
          <div class="pl-7 text-left" dir="ltr">
            <p class="text-[11px] text-stone-600 leading-normal italic text-left" dir="ltr">
              ${l.roman}
            </p>
          </div>
        </div>
      `).join('');
    } else {
      lessonsContainer.innerHTML = '<div class="text-xs text-stone-400 italic">اسباق دستیاب ہیں۔</div>';
    }
  }
}

if (typeof window !== 'undefined') {
  window.formatAcademicCitation = formatAcademicCitation;
  window.renderLessonsCard = renderLessonsCard;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatAcademicCitation, renderLessonsCard };
}
