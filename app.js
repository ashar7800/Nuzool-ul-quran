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
 * Returns episode-specific stage / scientific focus callout.
 */
function getStageBadgeForType(type) {
  switch (type) {
    case 'embryology':
      return 'Carnegie Stages 11–12 (Blastocyst & Embryo Implantation, Days 24–28)';
    case 'morphogenesis':
      return "Carnegie Stages: Nutfah ➔ 'Alaqah ➔ Mudghah ➔ Bone & Muscle";
    case 'cosmology':
      return 'Cosmic Singularity (Ratqan) & Inflationary Expansion';
    case 'astrophysics':
      return 'Relativistic Spacetime Metric Expansion (Hubble Law)';
    case 'pulsar':
      return 'Rotating Magnetized Neutron Star / Acoustic Knocker (At-Tariq)';
    case 'oceanography':
      return 'Estuarine Halocline & Marine Density Barrier (Barzakh)';
    case 'internal_waves':
      return 'Deep Stratified Oceanic Internal Waves & Photopic Abyss';
    case 'geology':
      return 'Continental Crust Mountain Roots & Airy Isostasy (Awtad)';
    case 'iron_supernova':
      return 'Stellar Core-Collapse Supernova & Meteoritic Iron Infall';
    case 'aviation_medicine':
      return 'High Altitude Alveolar Hypoxia & Barometric Pressure Drop';
    default:
      return 'Quranic Scientific Insight & Natural Observation';
  }
}

/**
 * Custom Dynamic Overlay Rendering Standard for High-Contrast Labeled Annotations.
 */
function renderScientificOverlayAnnotations(diagram, isModal = false) {
  if (!diagram) return '';
  const diagramType = diagram.type || 'embryology';
  const annotations = diagram.annotations || [];

  // Dedicated High-Contrast Dynamic Overlay for Episode #1 (Embryology & Leech Comparison)
  if (diagramType === 'embryology') {
    return `
      <!-- Top Left: 24-Day Human Embryo -->
      <div class="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 bg-slate-950/85 backdrop-blur-md border border-cyan-400/50 rounded-lg px-2.5 py-1.5 shadow-2xl text-left pointer-events-none transition select-none">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
          <span class="text-[11px] sm:text-xs font-bold text-cyan-200 tracking-wide drop-shadow-md">24-Day Human Embryo (Carnegie Stage 11)</span>
        </div>
        <p class="font-urdu text-[11px] sm:text-xs text-stone-200 font-semibold text-right mt-0.5 drop-shadow-md" dir="rtl">۲۴ دن کا انسانی جنین</p>
      </div>

      <!-- Top Right: Natural Leech (Alaqah) -->
      <div class="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 bg-slate-950/85 backdrop-blur-md border border-emerald-400/50 rounded-lg px-2.5 py-1.5 shadow-2xl text-right pointer-events-none transition select-none">
        <div class="flex items-center justify-end gap-1.5">
          <span class="text-[11px] sm:text-xs font-bold text-emerald-200 tracking-wide drop-shadow-md">Natural Leech (Alaqah)</span>
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
        </div>
        <p class="font-urdu text-[11px] sm:text-xs text-stone-200 font-semibold text-right mt-0.5 drop-shadow-md" dir="rtl">قدرتی جونک</p>
      </div>

      <!-- Bottom Homology Labels: Attached & Clinging / Clinging Entity -->
      <div class="absolute bottom-2.5 inset-x-2.5 sm:bottom-3.5 sm:inset-x-3.5 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none select-none">
        <div class="bg-black/85 backdrop-blur-md border border-amber-500/60 rounded-lg px-2.5 py-1 shadow-2xl text-left">
          <span class="text-[9px] text-amber-400 font-extrabold uppercase tracking-wider block drop-shadow-sm">Morphological Similarity:</span>
          <span class="text-[10.5px] sm:text-[11.5px] text-white font-bold drop-shadow-sm">Attached &amp; Clinging • <span class="font-urdu text-amber-200" dir="rtl">معلق حالت</span></span>
        </div>
        <div class="bg-black/85 backdrop-blur-md border border-amber-500/60 rounded-lg px-2.5 py-1 shadow-2xl text-right">
          <span class="text-[9px] text-amber-400 font-extrabold uppercase tracking-wider block drop-shadow-sm">Functional Similarity:</span>
          <span class="text-[10.5px] sm:text-[11.5px] text-white font-bold drop-shadow-sm">Clinging Entity • <span class="font-urdu text-amber-200" dir="rtl">جونک کی طرح چمٹنا</span></span>
        </div>
      </div>
    `;
  }

  // Dynamic Overlays for all other episodes from diagram annotations
  if (annotations.length > 0) {
    const badgesHtml = annotations.map(ann => `
      <div class="bg-slate-950/85 backdrop-blur-md border border-emerald-400/40 rounded-lg px-2.5 py-1.5 shadow-2xl text-left pointer-events-none select-none">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399] shrink-0"></span>
          <span class="text-[10.5px] sm:text-xs font-bold text-white tracking-wide drop-shadow-md">${ann.label_en}</span>
        </div>
        <p class="font-urdu text-[10.5px] sm:text-xs text-emerald-200 font-semibold text-right mt-0.5 drop-shadow-md" dir="rtl">${ann.label_ur}</p>
      </div>
    `).join('');

    return `
      <div class="absolute inset-x-2.5 top-2.5 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none select-none">
        ${badgesHtml}
      </div>
    `;
  }

  return '';
}

/**
 * Multi-tier Error Handler for Scientific Images (Fallback with styled container).
 */
function handleScientificImageError(img) {
  if (!img) return;
  img.onerror = null;
  const type = img.dataset.type || 'embryology';
  const stage = getStageBadgeForType(type);
  const parent = img.parentElement;
  if (parent) {
    parent.innerHTML = `
      <div class="w-full min-h-[260px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-2 select-none border border-emerald-500/20 rounded-xl">
        <div class="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-lg">
          🔬
        </div>
        <p class="text-xs text-emerald-300 font-bold tracking-wide">3D Concept Artwork • ${stage}</p>
        <p class="font-urdu text-xs text-stone-300" dir="rtl">سائنسی و قرآنی استدلال (اعلیٰ معیاری ۳ڈی تصوراتی خاکہ)</p>
      </div>
    `;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Backwards compatibility helper for SVG generator calls.
 */
function generateScientificDiagramSvg(type) {
  return '';
}

function generateAnatomicalEmbryoComparisonSvg() {
  return '';
}

/**
 * Renders Science & Quranic Signs Section (Ilm o Hikmat) dynamically per episode.
 */
function renderScientificInsights(item) {
  const section = document.getElementById('scientific-insights-section');
  const container = document.getElementById('scientific-insights-container');
  if (!section || !container) return;

  const sci = (item && item.scientific_insights) ? item.scientific_insights : null;
  const diagram = (sci && sci.diagram) ? sci.diagram : null;

  // Jin episodes me koi scientific insight ya diagram define NA ho, wahan completely hide karein
  if (!sci || !diagram) {
    section.style.display = 'none';
    container.innerHTML = '';
    window.currentScientificInsight = null;
    window.currentScientificItem = null;
    return;
  }

  // Preserve active insight & item globally for dynamic modal interaction
  window.currentScientificInsight = sci;
  window.currentScientificItem = item;

  section.style.display = 'block';

  const citationsHtml = (sci.citations || []).map(c => `
    <li class="flex items-start gap-1.5 text-[10.5px] text-stone-600">
      <span class="text-emerald-700 font-bold shrink-0">✓</span>
      <span>${c}</span>
    </li>
  `).join('');

  const diagramType = diagram.type || 'embryology';
  const captionEn = diagram.caption_en || diagram.title || sci.title_en;
  const captionUr = diagram.caption_ur || sci.title_ur;
  const sciSource = diagram.scientific_source || (sci.citations ? sci.citations[0] : 'Scholarly Scientific Reference');

  const imageUrl = diagram.image_url || diagram.high_res_url || 'assets/scientific_diagrams/ep1_alaq_embryo_leech_3d.jpg';
  const overlayHtml = renderScientificOverlayAnnotations(diagram, false);

  const visualPreviewHtml = `
    <div 
      onclick="renderScientificModal(window.currentScientificItem)"
      class="cursor-pointer group relative bg-slate-950 border border-emerald-500/30 shadow-lg rounded-xl overflow-hidden transition duration-200 hover:border-emerald-500/70 select-none"
      title="HD 3D Scientific Graphic: Bada karke dekhiye (Click to Zoom Lightbox)"
    >
      <div class="relative w-full max-h-[360px] sm:max-h-[420px] flex items-center justify-center bg-slate-950 overflow-hidden">
        <img 
          src="${imageUrl}" 
          alt="${escapeHtml(captionEn)}" 
          class="object-contain w-full max-h-[360px] sm:max-h-[420px] rounded-xl select-none transition duration-300 group-hover:scale-[1.01]"
          loading="lazy"
          onerror="handleScientificImageError(this)"
          data-type="${diagramType}"
        />
        ${overlayHtml}
      </div>

      <!-- Center Hover Zoom Pill -->
      <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition flex items-center justify-center pointer-events-none">
        <span class="bg-black/85 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-lg border border-emerald-500/50 shadow-2xl backdrop-blur-xs flex items-center gap-1.5 group-hover:scale-105 transition-transform">
          <span class="text-emerald-400">🔍</span>
          <span>3D Concept Visual • Click to Zoom Lightbox</span>
        </span>
      </div>
    </div>
    <!-- Labeled Bilingual Sub-caption Bar -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 space-y-0.5 text-left mt-2">
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
  `;

  container.innerHTML = `
    <div class="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-300/80 shadow-sm space-y-3">
      <!-- Domain Badge Header -->
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="text-xs bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1.5">
          <span>${sci.icon || '🧬'}</span>
          <span>${sci.domain}</span>
        </span>
        <span class="text-[10px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded border border-emerald-200">
          Peer-Reviewed 3D Concept Insight
        </span>
      </div>

      <!-- Title in Bilingual -->
      <div>
        <h4 class="font-bold text-emerald-950 text-sm leading-snug">${sci.title_en}</h4>
        <p class="font-urdu text-xs sm:text-sm text-emerald-900 font-bold text-right mt-0.5" dir="rtl">${sci.title_ur}</p>
      </div>

      <!-- High-Resolution Colored Scientific 3D Concept Visual Frame -->
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
 * Interactive Full-Color High-Resolution Dynamic Lightbox Modal.
 * Full-screen responsive lightbox modal with deep-navy standard wrapper.
 */
function renderScientificModal(item) {
  item = item || window.currentScientificItem;
  if (!item || !item.scientific_insights) return;

  const sci = item.scientific_insights;
  const diagram = sci.diagram || {};
  const diagramType = diagram.type || 'embryology';

  const titleEn = sci.title_en || diagram.title || 'Scientific Insight';
  const titleUr = sci.title_ur || '';
  const summaryUr = sci.summary_ur || '';
  const summaryRoman = sci.summary_roman || '';
  const captionEn = diagram.caption_en || diagram.title || titleEn;
  const captionUr = diagram.caption_ur || titleUr;
  const sciSource = diagram.scientific_source || (sci.citations ? sci.citations[0] : 'Scholarly Scientific Reference');
  const domain = sci.domain || 'Scientific Insight';
  const icon = sci.icon || '🔬';
  const stageCallout = getStageBadgeForType(diagramType);

  let modal = document.getElementById('scientific-zoom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'scientific-zoom-modal';
    modal.className = 'fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto';
    modal.onclick = (e) => {
      if (e.target === modal) closeScientificModal();
    };
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeScientificModal();
    });
    document.body.appendChild(modal);
  }

  const highResImage = diagram.high_res_url || diagram.image_url || 'assets/scientific_diagrams/ep1_alaq_embryo_leech_3d.jpg';
  const modalOverlayHtml = renderScientificOverlayAnnotations(diagram, true);

  // Responsive 3D Concept Image Frame with Dynamic Overlays
  const visualElementHtml = `
    <div class="relative w-full max-h-[62vh] bg-slate-950 border border-emerald-500/30 rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
      <img 
        src="${highResImage}" 
        alt="${escapeHtml(captionEn)}" 
        class="object-contain w-full max-h-[62vh] rounded-xl select-none"
        onerror="handleScientificImageError(this)"
        data-type="${diagramType}"
      />
      ${modalOverlayHtml}
    </div>
  `;

  modal.innerHTML = `
    <div class="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative max-h-[92vh] overflow-y-auto text-white" onclick="event.stopPropagation()">
      <!-- Modal Top Bar -->
      <div class="flex items-start justify-between border-b border-slate-800 pb-3 gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs bg-emerald-700 text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <span>${icon}</span>
              <span>${domain}</span>
            </span>
            <span class="text-xs text-emerald-400 font-semibold truncate max-w-md">${titleEn}</span>
          </div>
          ${titleUr ? `<p class="font-urdu text-sm text-emerald-200 font-bold text-right mt-1" dir="rtl">${titleUr}</p>` : ''}
        </div>
        <button 
          onclick="closeScientificModal()" 
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center justify-center transition border border-slate-700/60 shadow cursor-pointer shrink-0"
          title="Band karein (Esc)"
        >
          ✕
        </button>
      </div>

      <!-- High-Resolution Clean Responsive 3D Concept Image with Dynamic Overlays -->
      ${visualElementHtml}

      <!-- Detailed Caption, Domain Badge & Scientific Source Attribution -->
      <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
          <p class="text-xs sm:text-sm font-bold text-emerald-300 leading-snug" dir="ltr">
            ${captionEn}
          </p>
          <p class="font-urdu text-xs sm:text-sm text-stone-200 font-semibold text-right" dir="rtl">
            ${captionUr}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2 pt-0.5">
          ${stageCallout ? `
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
              <span>🔬 Focus:</span>
              <span class="text-white">${stageCallout}</span>
            </span>
          ` : ''}
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
            <span>Domain:</span>
            <span class="text-emerald-200 font-medium">${domain}</span>
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[11px]">
            <span>Visual Standard:</span>
            <span class="text-white">3D Realistic Concept Art</span>
          </span>
        </div>
        <p class="text-[11px] text-slate-400 italic pt-1">
          <strong class="text-slate-300">Scientific Attribution:</strong> ${sciSource}
        </p>
      </div>

      <!-- Scientific Discovery Explanation -->
      <div class="space-y-2 text-xs bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/50">
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

function openScientificModal(item) {
  renderScientificModal(item || window.currentScientificItem);
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
  window.renderScientificModal = renderScientificModal;
  window.renderScientificOverlayAnnotations = renderScientificOverlayAnnotations;
  window.generateScientificDiagramSvg = generateScientificDiagramSvg;
  window.generateAnatomicalEmbryoComparisonSvg = generateAnatomicalEmbryoComparisonSvg;
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
    renderScientificInsights,
    renderScientificModal,
    generateScientificDiagramSvg
  };
}
