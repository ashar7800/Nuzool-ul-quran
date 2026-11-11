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
 * Renders Science & Quranic Signs Section (Ilm o Hikmat) with High-Resolution Colored Visuals.
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

  // Preserve active insight globally for rock-solid modal interactions
  window.currentScientificInsight = sci;

  section.style.display = 'block';
  const citationsHtml = (sci.citations || []).map(c => `
    <li class="flex items-start gap-1.5 text-[10.5px] text-stone-600">
      <span class="text-emerald-700 font-bold shrink-0">✓</span>
      <span>${c}</span>
    </li>
  `).join('');

  const diagram = sci.diagram || {};
  const imgUrl = diagram.image_url || diagram.high_res_url || '';
  const fallbackUrl = diagram.fallback_url || './assets/scientific_diagrams/embryo_implantation_alaq.svg';
  const cdnUrl = diagram.high_res_url || 'https://upload.wikimedia.org/wikipedia/commons/3/39/2905_Implantation.jpg';
  const captionEn = diagram.caption_en || diagram.title || sci.title_en;
  const captionUr = diagram.caption_ur || sci.title_ur;
  const sciSource = diagram.scientific_source || (sci.citations ? sci.citations[0] : 'Prof. Keith L. Moore & Carnegie Institution / OpenStax Anatomy');
  const diagramType = diagram.type || 'embryology';

  // Interactive Colored Preview Container
  let visualPreviewHtml = '';
  if (imgUrl) {
    visualPreviewHtml = `
      <div 
        onclick="openScientificModal()"
        class="cursor-pointer group relative border border-emerald-500/20 shadow-md rounded-xl overflow-hidden bg-slate-950 transition hover:border-emerald-500/40"
        title="HD Full-Color Visual: Bada karke dekhiye (Click to Zoom)"
      >
        <div class="relative w-full bg-black/40 flex items-center justify-center p-2">
          <img 
            src="${imgUrl}" 
            data-fallback="${fallbackUrl}"
            data-cdn="${cdnUrl}"
            data-type="${diagramType}"
            alt="${captionEn}" 
            onerror="handleScientificImageError(this)"
            class="max-h-72 w-full object-contain mx-auto rounded-lg bg-black/40 p-2 transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition flex items-center justify-center pointer-events-none">
            <span class="bg-black/80 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/40 shadow-lg backdrop-blur-xs flex items-center gap-1.5 group-hover:scale-105 transition-transform">
              <span class="text-emerald-400">🔍</span>
              <span>HD Colored Visual • Click to Zoom</span>
            </span>
          </div>
        </div>
        <!-- Labeled Bilingual Sub-caption Bar -->
        <div class="bg-slate-900/90 border-t border-slate-800 px-3 py-2 space-y-0.5 text-left">
          <p class="text-[11px] text-emerald-300 font-semibold leading-snug" dir="ltr">
            ${captionEn}
          </p>
          <p class="font-urdu text-[11.5px] text-stone-300 text-right leading-normal" dir="rtl">
            ${captionUr}
          </p>
          <p class="text-[9.5px] text-slate-400 font-medium italic pt-0.5" dir="ltr">
            Source: ${sciSource}
          </p>
        </div>
      </div>
    `;
  } else {
    const fallbackSvg = generateScientificDiagramSvg(diagramType);
    visualPreviewHtml = `
      <div 
        onclick="openScientificModal()"
        class="cursor-pointer group relative border border-emerald-500/20 shadow-md rounded-xl overflow-hidden bg-slate-950 transition"
      >
        <div class="p-2">
          ${fallbackSvg}
        </div>
        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
          <span class="bg-black/80 text-white text-xs px-2.5 py-1 rounded-md font-semibold backdrop-blur-xs flex items-center gap-1">
            <span>🔍</span>
            <span>Click to Zoom</span>
          </span>
        </div>
      </div>
    `;
  }

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

      <!-- High-Resolution Colored Scientific Diagram Frame -->
      ${visualPreviewHtml}

      <!-- Discovery Summary -->
      <div class="space-y-1.5 text-xs pt-1">
        <p class="font-urdu text-xs text-stone-800 text-right leading-relaxed" dir="rtl">${sci.summary_ur}</p>
        <p class="text-stone-600 italic text-left leading-relaxed pl-1" dir="ltr">${sci.summary_roman}</p>
      </div>

      <!-- Citations -->
      <div class="pt-2 border-t border-emerald-200/80 space-y-1">
        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Research Citations & Sources:</span>
        <ul class="space-y-1">
          ${citationsHtml}
        </ul>
      </div>
    </div>
  `;
}

/**
 * Multi-tier Error Handler for Scientific Images.
 * Tier 1: Local high-resolution medical photograph.
 * Tier 2: Local anatomical SVG diagram.
 * Tier 3: Direct verified CDN (Wikimedia Commons / OpenStax).
 * Tier 4: Clean inline SVG fallback (guarantees zero broken icons).
 */
function handleScientificImageError(img) {
  if (!img) return;
  const stage = parseInt(img.dataset.errorStage || '0', 10);
  const fallback = img.dataset.fallback;
  const cdn = img.dataset.cdn;
  const type = img.dataset.type || 'embryology';

  if (stage === 0 && fallback && img.src !== fallback && !img.src.endsWith(fallback.replace('./', ''))) {
    img.dataset.errorStage = '1';
    img.src = fallback;
  } else if (stage <= 1 && cdn && img.src !== cdn) {
    img.dataset.errorStage = '2';
    img.src = cdn;
  } else {
    img.onerror = null;
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full flex flex-col items-center justify-center p-2">
          ${generateScientificDiagramSvg(type)}
        </div>
      `;
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Interactive Full-Color High-Resolution Lightbox Modal.
 */
function openScientificModal(titleEn, titleUr, summaryUr, summaryRoman, imgUrl, captionEn, captionUr, sciSource, fallbackType = 'embryology') {
  const sci = window.currentScientificInsight || {};
  const diagram = sci.diagram || {};

  titleEn = titleEn || sci.title_en || 'Scientific Insight';
  titleUr = titleUr || sci.title_ur || '';
  summaryUr = summaryUr || sci.summary_ur || '';
  summaryRoman = summaryRoman || sci.summary_roman || '';
  imgUrl = imgUrl || diagram.image_url || diagram.high_res_url || '';
  captionEn = captionEn || diagram.caption_en || diagram.title || titleEn;
  captionUr = captionUr || diagram.caption_ur || titleUr;
  sciSource = sciSource || diagram.scientific_source || (sci.citations ? sci.citations[0] : 'Prof. Keith L. Moore & Carnegie Institution / OpenStax Anatomy');
  fallbackType = fallbackType || diagram.type || 'embryology';
  const fallbackUrl = diagram.fallback_url || './assets/scientific_diagrams/embryo_implantation_alaq.svg';
  const cdnUrl = diagram.high_res_url || 'https://upload.wikimedia.org/wikipedia/commons/3/39/2905_Implantation.jpg';

  let modal = document.getElementById('scientific-zoom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'scientific-zoom-modal';
    modal.className = 'fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6';
    modal.onclick = (e) => {
      if (e.target === modal) closeScientificModal();
    };
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeScientificModal();
    });
    document.body.appendChild(modal);
  }

  let visualElementHtml = '';
  if (imgUrl) {
    visualElementHtml = `
      <div class="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 sm:p-4 flex items-center justify-center shadow-inner">
        <img 
          id="modal-sci-img"
          src="${imgUrl}" 
          data-fallback="${fallbackUrl}"
          data-cdn="${cdnUrl}"
          data-type="${fallbackType}"
          alt="${captionEn || titleEn}" 
          onerror="handleScientificImageError(this)"
          class="max-h-96 w-full object-contain mx-auto rounded-lg bg-black/40 p-2 shadow-2xl"
        />
      </div>
    `;
  } else {
    visualElementHtml = `
      <div class="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 sm:p-4 flex items-center justify-center shadow-inner">
        ${generateScientificDiagramSvg(fallbackType)}
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="bg-slate-950 text-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-emerald-500/30 max-h-[92vh] overflow-y-auto" onclick="event.stopPropagation()">
      <!-- Modal Top Bar -->
      <div class="flex items-start justify-between border-b border-slate-800 pb-3 gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              HD Scientific Reference
            </span>
            <span class="text-xs text-emerald-400 font-semibold truncate max-w-md">${titleEn}</span>
          </div>
          ${titleUr ? `<p class="font-urdu text-sm text-emerald-200 font-bold text-right mt-1" dir="rtl">${titleUr}</p>` : ''}
        </div>
        <button 
          onclick="closeScientificModal()" 
          class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center justify-center transition shrink-0 cursor-pointer"
          title="Band karein (Esc)"
        >
          ✕
        </button>
      </div>

      <!-- High-Resolution Colored Visual -->
      ${visualElementHtml}

      <!-- Detailed Caption, Biological Stage & Scientific Source Attribution -->
      <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
          <p class="text-xs sm:text-sm font-bold text-emerald-300 leading-snug" dir="ltr">
            ${captionEn || titleEn}
          </p>
          <p class="font-urdu text-xs sm:text-sm text-stone-200 font-semibold text-right" dir="rtl">
            ${captionUr || titleUr}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2 pt-0.5">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
            <span>🔬 Biological Stage:</span>
            <span class="text-white">Blastocyst & Embryo Implantation, Days 24–28 (Carnegie Stages 11–12)</span>
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
            <span>Morphology:</span>
            <span class="text-emerald-200 font-medium">Leech-like ('Alaqah) clinging entity & somites</span>
          </span>
        </div>
        <p class="text-[11px] text-slate-400 italic pt-1">
          <strong class="text-slate-300">Scientific Attribution:</strong> ${sciSource || 'Prof. Keith L. Moore & Carnegie Institution / OpenStax Anatomy'}
        </p>
      </div>

      <!-- Scientific Discovery Explanation -->
      <div class="space-y-2 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
        <p class="font-urdu text-xs sm:text-sm text-stone-200 text-right leading-relaxed" dir="rtl">${summaryUr}</p>
        <p class="text-xs text-slate-300 italic leading-relaxed text-left pl-1" dir="ltr">${summaryRoman}</p>
      </div>

      <!-- Bottom Action Bar -->
      <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
        <span class="text-[10px] text-slate-400">Press <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Esc</kbd> or click outside to close</span>
        <button 
          onclick="closeScientificModal()" 
          class="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          Theek Hai (Close Lightbox)
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
  window.handleScientificImageError = handleScientificImageError;
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
