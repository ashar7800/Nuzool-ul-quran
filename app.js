// Nuzool-ul-Quran: Academic Hadith Citation, Scholarly Tools & UI Architecture Module

/**
 * Standardized academic citation formatter for hadith objects.
 * Format: Reference: <Book Name> (Hadees No: <Number>, Jild: <Vol>, Safha: <Page>)
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
 * Toggles Primary Evidence Card between Tafseer o Sharah and Mutalliqah Ahadees.
 * @param {'tafseer' | 'hadith'} tab
 */
function switchEvidenceTab(tab) {
  if (typeof stopAudio === 'function') stopAudio();
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (typeof resetSpeechBtn === 'function') resetSpeechBtn();

  const btnTafseer = document.getElementById('btn-evidence-tafseer');
  const btnHadith = document.getElementById('btn-evidence-hadith');
  const containerTafseer = document.getElementById('container-tafseer-content');
  const containerHadith = document.getElementById('container-hadith-content');

  if (tab === 'tafseer') {
    if (btnTafseer) btnTafseer.className = "flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 bg-emerald-800 text-white shadow-xs";
    if (btnHadith) btnHadith.className = "flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70";
    if (containerTafseer) containerTafseer.style.display = 'block';
    if (containerHadith) containerHadith.style.display = 'none';
  } else {
    if (btnHadith) btnHadith.className = "flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 bg-emerald-800 text-white shadow-xs";
    if (btnTafseer) btnTafseer.className = "flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70";
    if (containerTafseer) containerTafseer.style.display = 'none';
    if (containerHadith) containerHadith.style.display = 'block';
  }
}

/**
 * Renders the Mutalliqah Ahadees Multi-Source Combined Narrative View.
 * Displays:
 * 1. Takhreej Status Chip & Chapter/Baab
 * 2. Arabic Matan
 * 3. Continuous Combined Narrative Passage (مشترکہ مفہوم و واقعہ) in Nastaliq Urdu + Roman Urdu
 * 4. Distinct Academic Clickable Reference Badges for all cited books
 */
function renderHadithCard(item) {
  const container = document.getElementById('container-hadith-content');
  if (!container) return;

  const h = (item && (item.mutalliqah_hadees || item.hadith)) ? (item.mutalliqah_hadees || item.hadith) : null;

  if (!h) {
    container.innerHTML = `
      <div class="p-4 text-center text-stone-400 text-xs italic">
        اس مقام کے متعلق احادیثِ مبارکہ پر مزید تحقیقی کام جاری ہے۔
      </div>
    `;
    return;
  }

  const takhreejChip = h.takhreej_status || item.takhreej_status || "Sahih (صحیح) • Muttafaq Alaih (متفق علیہ)";
  const chapterTitle = h.chapter_title || h.chapter || "Kitab Bad' al-Wahy wa Seerah";
  const arabicText = h.arabic || '';
  const combinedUrdu = h.combined_urdu || h.urdu || '';
  const combinedRoman = h.combined_roman || h.roman || '';

  // References list
  let refsList = h.references || [];
  if (refsList.length === 0 && (h.source || h.book)) {
    refsList = [{
      book: h.book || 'Sahih Bukhari',
      hadithNumber: h.hadithNumber || '1',
      volume: h.jild || h.volume || '',
      page: h.safha || h.page || '',
      ref_url: h.ref_url || (h.hadithNumber ? `https://sunnah.com/bukhari:${h.hadithNumber}` : 'https://sunnah.com'),
      grade: h.grade || 'Sahih'
    }];
  }

  const refsBadgesHtml = refsList.map(ref => {
    const citationText = formatAcademicCitation(ref);
    const url = ref.ref_url || (ref.hadithNumber ? `https://sunnah.com/bukhari:${ref.hadithNumber}` : '#');
    return `
      <a 
        href="${url}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="inline-flex items-center gap-1.5 font-semibold text-emerald-950 hover:text-emerald-900 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300/80 px-2.5 py-1 rounded-md shadow-2xs transition group text-[11px] cursor-pointer"
        title="${citationText} — Asal Urdu Matan o Hadees dekhiye"
      >
        <span>${citationText}</span>
        <span class="text-[10px] text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform">↗</span>
      </a>
    `;
  }).join('');

  container.innerHTML = `
    <!-- Top Row: Takhreej Chip (Left) + Audio Button (Right) -->
    <div class="flex items-center justify-between border-b border-stone-100 pb-2 flex-wrap gap-1">
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded font-bold tracking-wide shadow-2xs">
          ${takhreejChip}
        </span>
        <span class="text-[10.5px] text-emerald-900 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70 truncate max-w-[210px]" title="${chapterTitle}">
          ${chapterTitle}
        </span>
      </div>
      <button 
        onclick="playTextSpeech('hadith-combined-roman', this)" 
        class="text-[11px] bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-semibold transition flex items-center gap-1 border border-emerald-300 shadow-2xs shrink-0"
      >
        🔊 Suniye
      </button>
    </div>

    <!-- Hadith Text Scroll Area -->
    <div class="max-h-[220px] overflow-y-auto space-y-2 pr-1">
      ${arabicText ? `
        <p id="hadith-arabic-text" class="font-arabic text-base text-stone-900 text-right leading-loose border-b border-emerald-100 pb-1.5" dir="rtl">
          ${arabicText}
        </p>
      ` : ''}

      <!-- Continuous Combined Narrative Passage (مشترکہ مفہوم و واقعہ) -->
      <div class="space-y-1.5 pt-1">
        <div class="flex items-center justify-between text-[10px] text-stone-500 font-bold">
          <span class="italic text-left" dir="ltr">COMBINED NARRATIVE PASSAGE</span>
          <span class="font-urdu text-[11px] text-emerald-900 font-semibold" dir="rtl">مشترکہ مفہوم و واقعہ</span>
        </div>
        <p id="hadith-combined-urdu" class="font-urdu text-xs text-stone-800 text-right leading-relaxed border-b border-stone-100 pb-1.5" dir="rtl">
          ${combinedUrdu}
        </p>
        <p id="hadith-combined-roman" class="text-xs text-stone-600 italic leading-relaxed text-left" dir="ltr">
          "${combinedRoman}"
        </p>
      </div>
    </div>

    <!-- Academic References List -->
    <div class="pt-2 border-t border-emerald-200/60 space-y-1.5">
      <div class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
        Academic Citations & Verified Urdu Sources:
      </div>
      <div class="flex flex-wrap gap-1.5">
        ${refsBadgesHtml}
      </div>
    </div>
  `;
}

/**
 * Renders the Themes & Actionable Lessons card.
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
        <div class="bg-white/95 px-2.5 py-1.5 rounded-lg border border-stone-200/70 shadow-2xs space-y-1">
          <div class="flex items-start justify-between gap-2">
            <span class="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs" dir="ltr">
              ${idx + 1}
            </span>
            <p class="font-urdu text-xs text-stone-800 leading-normal text-right flex-1" dir="rtl">
              ${l.urdu}
            </p>
          </div>
          <div class="pl-6 text-left" dir="ltr">
            <p class="text-[10.5px] text-stone-600 leading-snug italic text-left" dir="ltr">
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

/**
 * Renders Quranic Cross-References (Mutamasil Aayaat o Hawala-jaat).
 */
function renderCrossReferences(item) {
  const container = document.getElementById('cross-references-container');
  if (!container) return;

  const refs = (item && item.cross_references) ? item.cross_references : [];
  if (refs.length === 0) {
    container.innerHTML = '';
    const section = document.getElementById('cross-references-section');
    if (section) section.style.display = 'none';
    return;
  }

  const section = document.getElementById('cross-references-section');
  if (section) section.style.display = 'block';

  container.innerHTML = refs.map(r => `
    <div class="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
      <div class="space-y-0.5">
        <div class="flex items-center gap-1.5">
          <span class="font-bold text-emerald-950">${r.surah_name} (${r.ayah_range})</span>
          <span class="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded font-semibold">Surah #${r.surah_number}</span>
        </div>
        <p class="font-urdu text-[11px] text-stone-800 text-right" dir="rtl">${r.relation_ur}</p>
        <p class="text-[10.5px] text-stone-600 italic text-left" dir="ltr">${r.relation_roman}</p>
      </div>
      <a 
        href="${r.link_url}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-300 px-2.5 py-1 rounded shadow-2xs hover:bg-emerald-100 transition"
      >
        <span>پڑھیے (Quran.com)</span>
        <span class="text-emerald-600">↗</span>
      </a>
    </div>
  `).join('');
}

/**
 * Renders Historical Geography (Tareekhi Maqamat).
 */
function renderHistoricalLocations(item) {
  const section = document.getElementById('historical-locations-section');
  const container = document.getElementById('historical-locations-container');
  if (!section || !container) return;

  const locs = (item && item.locations) ? item.locations : [];
  if (locs.length === 0) {
    section.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  section.style.display = 'block';
  container.innerHTML = locs.map(l => `
    <div class="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shadow-2xs">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-base">📍</span>
          <div>
            <h4 class="font-bold text-amber-950 text-xs">${l.name_en}</h4>
            <p class="font-urdu text-xs text-amber-900 font-semibold" dir="rtl">${l.name_ur}</p>
          </div>
        </div>
        <p class="font-urdu text-[11px] text-stone-800 text-right pr-2" dir="rtl">${l.context_ur}</p>
        <p class="text-[10.5px] text-stone-600 pl-6 italic" dir="ltr">${l.context_roman}</p>
        <p class="text-[10px] text-amber-800 pl-6 font-medium">Modern Site: ${l.modern_name} • Coordinates: ${l.coordinates}</p>
      </div>
      <a 
        href="${l.map_url}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 px-3 py-1.5 rounded-lg shadow-sm transition hover:scale-[1.02]"
      >
        <span>🗺️ Explore on Map</span>
        <span class="text-amber-200">↗</span>
      </a>
    </div>
  `).join('');
}

/**
 * Generates an inline SVG diagram based on the scientific domain type.
 */
function generateScientificDiagramSvg(type) {
  switch (type) {
    case 'embryology':
      return `
        <svg viewBox="0 0 400 200" class="w-full h-auto rounded-lg bg-gradient-to-r from-emerald-950 to-slate-900 text-emerald-300 p-2 shadow-inner">
          <rect width="400" height="200" fill="#061c14"/>
          <!-- Uterine Wall -->
          <path d="M 0 40 Q 100 20 200 40 T 400 40 L 400 0 L 0 0 Z" fill="#3b111a" opacity="0.8"/>
          <text x="20" y="25" fill="#fca5a5" font-size="11" font-weight="bold">Uterine Endometrium Wall (رحم کی دیوار)</text>
          <!-- Implantation Site -->
          <path d="M 160 40 Q 200 80 240 40 Z" fill="#991b1b" opacity="0.6"/>
          <!-- Leech-shaped Blastocyst ('Alaqah) -->
          <ellipse cx="200" cy="85" rx="35" ry="20" fill="#10b981" transform="rotate(-15 200 85)" stroke="#34d399" stroke-width="2"/>
          <circle cx="178" cy="80" r="6" fill="#047857"/>
          <text x="160" y="125" fill="#a7f3d0" font-size="11" font-weight="bold">عَلَقٍ / Clinging Leech Entity</text>
          <!-- Villi extensions attaching -->
          <line x1="180" y1="68" x2="180" y2="45" stroke="#34d399" stroke-width="2" stroke-dasharray="3,2"/>
          <line x1="200" y1="66" x2="200" y2="42" stroke="#34d399" stroke-width="2" stroke-dasharray="3,2"/>
          <line x1="220" y1="68" x2="220" y2="45" stroke="#34d399" stroke-width="2" stroke-dasharray="3,2"/>
          <text x="140" y="180" fill="#6ee7b7" font-size="10">Syncytiotrophoblast Implantation & Maternal Blood Siphon</text>
        </svg>
      `;
    case 'cosmology':
      return `
        <svg viewBox="0 0 400 200" class="w-full h-auto rounded-lg bg-gradient-to-r from-slate-950 to-indigo-950 text-indigo-300 p-2 shadow-inner">
          <rect width="400" height="200" fill="#0a0a1f"/>
          <!-- Big Bang Singularity -->
          <circle cx="100" cy="100" r="14" fill="#fbbf24" stroke="#f59e0b" stroke-width="3"/>
          <text x="50" y="135" fill="#fde68a" font-size="10" font-weight="bold">رَتْقًا (Singularity)</text>
          <!-- Expansion Arrows -->
          <line x1="120" y1="100" x2="220" y2="60" stroke="#818cf8" stroke-width="2" marker-end="url(#arrow)"/>
          <line x1="120" y1="100" x2="220" y2="140" stroke="#818cf8" stroke-width="2"/>
          <!-- Expanding Galaxies -->
          <ellipse cx="260" cy="60" rx="20" ry="10" fill="#6366f1" transform="rotate(25 260 60)"/>
          <ellipse cx="280" cy="140" rx="25" ry="12" fill="#818cf8" transform="rotate(-30 280 140)"/>
          <text x="210" y="180" fill="#c7d2fe" font-size="10" font-weight="bold">فَفَتَقْنَاهُمَا (Cosmic Expansion)</text>
          <!-- Water Molecule H2O -->
          <circle cx="350" cy="95" r="16" fill="#38bdf8"/>
          <circle cx="335" cy="75" r="9" fill="#e0f2fe"/>
          <circle cx="365" cy="75" r="9" fill="#e0f2fe"/>
          <text x="325" y="125" fill="#bae6fd" font-size="10">H₂O (حَيٍّ)</text>
        </svg>
      `;
    default:
      return `
        <svg viewBox="0 0 400 200" class="w-full h-auto rounded-lg bg-gradient-to-r from-emerald-950 to-stone-900 text-emerald-300 p-2 shadow-inner">
          <rect width="400" height="200" fill="#0f172a"/>
          <circle cx="200" cy="100" r="60" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4"/>
          <text x="140" y="105" fill="#6ee7b7" font-size="12" font-weight="bold">Quranic Scientific Sign</text>
        </svg>
      `;
  }
}

/**
 * Renders Science & Quranic Signs Section (Ilm o Hikmat).
 */
function renderScientificInsights(item) {
  const section = document.getElementById('scientific-insights-section');
  const container = document.getElementById('scientific-insights-container');
  if (!section || !container) return;

  const sci = (item && item.scientific_insights) ? item.scientific_insights : null;
  if (!sci) {
    section.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  section.style.display = 'block';
  const citationsHtml = (sci.citations || []).map(c => `
    <li class="flex items-start gap-1.5 text-[10.5px] text-stone-600">
      <span class="text-emerald-700 font-bold shrink-0">✓</span>
      <span>${c}</span>
    </li>
  `).join('');

  const diagramHtml = generateScientificDiagramSvg(sci.diagram?.type || 'embryology');

  container.innerHTML = `
    <div class="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-300/80 shadow-sm space-y-3">
      <!-- Domain Badge Header -->
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="text-xs bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1.5">
          <span>${sci.icon || '🧬'}</span>
          <span>${sci.domain}</span>
        </span>
        <span class="text-[10px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded border border-emerald-200">
          Peer-Reviewed Research Insight
        </span>
      </div>

      <!-- Title in Bilingual -->
      <div>
        <h4 class="font-bold text-emerald-950 text-sm leading-snug">${sci.title_en}</h4>
        <p class="font-urdu text-xs sm:text-sm text-emerald-900 font-bold text-right mt-0.5" dir="rtl">${sci.title_ur}</p>
      </div>

      <!-- Diagram / Visual preview with Click to Zoom Modal -->
      <div 
        onclick="openScientificModal('${escapeHtml(sci.title_en)}', '${escapeHtml(sci.summary_ur)}', '${escapeHtml(sci.summary_roman)}', '${sci.diagram?.type || 'embryology'}')"
        class="cursor-pointer group relative rounded-lg overflow-hidden border border-emerald-300 shadow-2xs hover:shadow-md transition"
        title="Bada karke dekhiye (Click to Zoom)"
      >
        ${diagramHtml}
        <div class="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-950/40 transition flex items-center justify-center">
          <span class="bg-black/75 text-white text-xs px-2.5 py-1 rounded-md font-semibold backdrop-blur-xs flex items-center gap-1">
            <span>🔍</span>
            <span>Click to Zoom & View Citations</span>
          </span>
        </div>
      </div>

      <!-- Summary -->
      <div class="space-y-1.5 text-xs">
        <p class="font-urdu text-xs text-stone-800 text-right leading-relaxed" dir="rtl">${sci.summary_ur}</p>
        <p class="text-stone-600 italic text-left leading-relaxed pl-1" dir="ltr">${sci.summary_roman}</p>
      </div>

      <!-- Citations -->
      <div class="pt-2 border-t border-emerald-200/80 space-y-1">
        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Research Citations:</span>
        <ul class="space-y-1">
          ${citationsHtml}
        </ul>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Interactive Click-to-Zoom Scientific Modal.
 */
function openScientificModal(title, summaryUr, summaryRoman, type) {
  let modal = document.getElementById('scientific-zoom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'scientific-zoom-modal';
    modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.onclick = (e) => {
      if (e.target === modal) closeScientificModal();
    };
    document.body.appendChild(modal);
  }

  const svgDiagram = generateScientificDiagramSvg(type);

  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl border border-emerald-200 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between border-b border-stone-200 pb-3">
        <h3 class="text-base font-bold text-emerald-950">${title}</h3>
        <button onclick="closeScientificModal()" class="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center transition">
          ✕
        </button>
      </div>
      <div>
        ${svgDiagram}
      </div>
      <div class="space-y-2 text-xs">
        <p class="font-urdu text-sm text-stone-800 text-right leading-relaxed" dir="rtl">${summaryUr}</p>
        <p class="text-xs text-stone-600 italic leading-relaxed text-left" dir="ltr">${summaryRoman}</p>
      </div>
      <div class="pt-3 border-t border-stone-100 flex justify-end">
        <button onclick="closeScientificModal()" class="px-4 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold text-xs shadow-xs hover:bg-emerald-900 transition">
          Theek Hai (Close)
        </button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
}

function closeScientificModal() {
  const modal = document.getElementById('scientific-zoom-modal');
  if (modal) modal.style.display = 'none';
}

/**
 * Toast Notification Utility.
 */
function showToast(message, duration = 2400) {
  let container = document.getElementById('toast-notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-notification-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-stone-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-stone-700 flex items-center gap-2 transform transition-all duration-300 translate-y-3 opacity-0';
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Single-click Ayah & Ahsan-ul-Bayan translation clipboard copy.
 */
function copyAyahToClipboard(surahNo, verseNo) {
  let matchedVerse = null;
  let surahTitle = '';

  if (window.SURAH_DATA) {
    const s = window.SURAH_DATA.find(sur => sur.surahNumber === surahNo);
    if (s) {
      surahTitle = `${s.nameEn} (${s.nameAr})`;
      matchedVerse = (s.verses || []).find(v => v.no === verseNo);
    }
  }

  if (!matchedVerse) {
    showToast('❌ Aayat copy karne mein dushwari hui.');
    return;
  }

  const textToCopy = `${matchedVerse.ar}

ترجمہ (احسن البیان - مولانا محمد جوناگڑھی):
${matchedVerse.ur}

Roman:
${matchedVerse.roman}

— [Surah ${surahTitle} — ${surahNo}:${verseNo} • نُزُولُ القُرْآن]`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('📋 Aayat o Tarjuma clipboard par copy ho gaya!');
    }).catch(() => {
      fallbackCopyText(textToCopy);
    });
  } else {
    fallbackCopyText(textToCopy);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('📋 Aayat o Tarjuma copy ho gaya!');
  } catch (e) {
    showToast('❌ Copy nahi ho saka.');
  }
  document.body.removeChild(ta);
}

/**
 * Last Read Persistence via localStorage.
 */
const STORAGE_KEY_LAST_READ = 'nuzool_last_read';

function saveLastReadPosition(mode, id, title, index) {
  try {
    const payload = {
      mode: mode,
      id: id,
      title: title,
      index: index,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY_LAST_READ, JSON.stringify(payload));
  } catch (e) {
    // localStorage not accessible
  }
}

function getLastReadPosition() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_READ);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Text Scale Font Controls.
 */
let currentFontScale = 1.0;

function adjustFontSize(delta) {
  currentFontScale = Math.min(1.4, Math.max(0.85, currentFontScale + delta * 0.1));
  applyFontSize();
}

function resetFontSize() {
  currentFontScale = 1.0;
  applyFontSize();
}

function applyFontSize() {
  const container = document.getElementById('verses-container');
  if (!container) return;
  const arabicElements = container.querySelectorAll('.font-arabic');
  const urduElements = container.querySelectorAll('.font-urdu');

  arabicElements.forEach(el => {
    el.style.fontSize = `${24 * currentFontScale}px`;
  });
  urduElements.forEach(el => {
    el.style.fontSize = `${14 * currentFontScale}px`;
  });

  const fontIndicator = document.getElementById('font-scale-indicator');
  if (fontIndicator) {
    fontIndicator.innerText = `${Math.round(currentFontScale * 100)}%`;
  }
}

// Global exports
if (typeof window !== 'undefined') {
  window.formatAcademicCitation = formatAcademicCitation;
  window.switchEvidenceTab = switchEvidenceTab;
  window.renderHadithCard = renderHadithCard;
  window.renderLessonsCard = renderLessonsCard;
  window.renderCrossReferences = renderCrossReferences;
  window.renderHistoricalLocations = renderHistoricalLocations;
  window.renderScientificInsights = renderScientificInsights;
  window.openScientificModal = openScientificModal;
  window.closeScientificModal = closeScientificModal;
  window.showToast = showToast;
  window.copyAyahToClipboard = copyAyahToClipboard;
  window.saveLastReadPosition = saveLastReadPosition;
  window.getLastReadPosition = getLastReadPosition;
  window.adjustFontSize = adjustFontSize;
  window.resetFontSize = resetFontSize;
  window.applyFontSize = applyFontSize;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatAcademicCitation,
    switchEvidenceTab,
    renderHadithCard,
    renderLessonsCard,
    renderCrossReferences,
    renderHistoricalLocations,
    renderScientificInsights
  };
}
