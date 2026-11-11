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
 * Generates a self-contained, high-resolution colored medical graphic / SVG
 * showing the anatomical comparison between the 24-28 day human embryo
 * (Carnegie Stage 11-12) and the freshwater leech ('Alaqah).
 */
function generateAnatomicalEmbryoComparisonSvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="embBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#030712"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#030712"/>
        </linearGradient>

        <!-- Uterine Endometrium Gradient -->
        <linearGradient id="endoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </linearGradient>

        <!-- Maternal Capillary Glow -->
        <radialGradient id="capGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#9f1239" stop-opacity="0.2"/>
        </radialGradient>

        <!-- Embryo Body Gradient -->
        <linearGradient id="embGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="35%" stop-color="#f59e0b"/>
          <stop offset="70%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#92400e"/>
        </linearGradient>

        <!-- Leech Anatomy Gradient -->
        <linearGradient id="leechGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6ee7b7"/>
          <stop offset="40%" stop-color="#10b981"/>
          <stop offset="80%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>

        <!-- Center Badge Gradient -->
        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="50%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>

        <!-- Soft Glow Filter -->
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <!-- Deep Slate Outer Canvas -->
      <rect width="860" height="400" rx="14" fill="url(#embBg)"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.25"/>

      <!-- Top Title Bar -->
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#020617" opacity="0.9"/>
      <rect x="18" y="10" width="130" height="24" rx="5" fill="#047857"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">🔬 CLINICAL ANATOMY</text>
      <text x="160" y="27" fill="#f8fafc" font-size="12.5" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif">EMBRYO (24–28 DAYS) vs. 'ALAQAH (LEECH MORPHOLOGY)</text>
      <text x="842" y="28" fill="#34d399" font-size="15" font-weight="bold" font-family="'Amiri', serif" text-anchor="end">خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ (سورۃ العلق: ۲)</text>

      <!-- ================= LEFT PANEL: HUMAN EMBRYO (24-28 DAYS) ================= -->
      <g transform="translate(18, 52)">
        <rect x="0" y="0" width="310" height="295" rx="10" fill="#090d16" stroke="#1e293b" stroke-width="1.2"/>
        
        <rect x="10" y="10" width="290" height="24" rx="5" fill="#1e293b"/>
        <text x="18" y="26" fill="#fbbf24" font-size="11" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">Carnegie Stage 11–12 (24–28 Days)</text>
        <text x="292" y="26" fill="#fef08a" font-size="11" font-weight="bold" font-family="'Amiri', serif" text-anchor="end">انسانی جنین (۲۴ تا ۲۸ دن)</text>

        <!-- Uterine Endometrial Wall -->
        <path d="M 10 42 Q 100 36 190 42 T 300 42 L 300 88 Q 150 82 10 88 Z" fill="url(#endoGrad)"/>
        <text x="18" y="58" fill="#fca5a5" font-size="9" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">Uterine Endometrium (رحم کی دیوار)</text>
        
        <circle cx="90" cy="72" r="10" fill="url(#capGlow)"/>
        <circle cx="160" cy="68" r="12" fill="url(#capGlow)"/>
        <circle cx="230" cy="74" r="11" fill="url(#capGlow)"/>
        <text x="110" y="84" fill="#fecdd3" font-size="8" font-style="italic">Maternal Blood Lacunae (خون کی خوراک)</text>

        <!-- Connecting Stalk -->
        <path d="M 160 86 L 160 135" stroke="#f59e0b" stroke-width="7" stroke-linecap="round"/>
        <text x="60" y="112" fill="#fef08a" font-size="8.5" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">Connecting Stalk ➔</text>
        <text x="60" y="123" fill="#cbd5e1" font-size="7.5" font-family="'Amiri', serif">(تعلق / نالی سے چمٹنا)</text>

        <!-- Curved C-shaped Embryo Body -->
        <path d="M 160 135 C 110 145, 100 215, 145 240 C 190 260, 205 215, 185 180 C 175 160, 185 140, 160 135 Z" fill="url(#embGrad)" stroke="#fef08a" stroke-width="1.8" filter="url(#softGlow)"/>

        <!-- Brain Fold -->
        <circle cx="142" cy="155" r="14" fill="#fef08a" opacity="0.95"/>
        <text x="35" y="158" fill="#93c5fd" font-size="8.5" font-weight="bold">Brain Fold ➔</text>

        <!-- Somites -->
        <g fill="#78350f" stroke="#fef3c7" stroke-width="0.9">
          <rect x="118" y="172" width="7" height="4.5" rx="1.2"/>
          <rect x="120" y="181" width="7" height="4.5" rx="1.2"/>
          <rect x="124" y="190" width="7" height="4.5" rx="1.2"/>
          <rect x="129" y="199" width="7" height="4.5" rx="1.2"/>
          <rect x="137" y="208" width="7" height="4.5" rx="1.2"/>
          <rect x="147" y="214" width="7" height="4.5" rx="1.2"/>
          <rect x="158" y="215" width="7" height="4.5" rx="1.2"/>
          <rect x="169" y="210" width="7" height="4.5" rx="1.2"/>
        </g>
        <text x="25" y="195" fill="#fef08a" font-size="8.5" font-weight="bold">Somites ➔</text>
        <text x="25" y="206" fill="#cbd5e1" font-size="8" font-family="'Amiri', serif">(عضلاتی قطعات / لوتھڑا)</text>

        <!-- Primitive Heart Bulge -->
        <circle cx="155" cy="178" r="9" fill="#dc2626"/>
        <circle cx="155" cy="178" r="4.5" fill="#f87171"/>
        <text x="175" y="178" fill="#fca5a5" font-size="8" font-weight="bold">⬅ Heart Bulge</text>

        <rect x="10" y="258" width="290" height="26" rx="4" fill="#0f172a" stroke="#1e293b"/>
        <text x="18" y="274" fill="#94a3b8" font-size="8.5" font-family="'Plus Jakarta Sans', sans-serif">Size: 2.5–3.5mm • Curved Body • Endometrial Siphon</text>
      </g>

      <!-- ================= CENTER PANEL: MORPHOLOGICAL IDENTITY BADGE ================= -->
      <g transform="translate(340, 52)">
        <rect x="0" y="0" width="180" height="295" rx="10" fill="#090d16" stroke="#10b981" stroke-width="1.5"/>

        <rect x="10" y="10" width="160" height="46" rx="6" fill="url(#badgeGrad)"/>
        <text x="90" y="28" fill="#ffffff" font-size="11" font-weight="bold" font-family="'Amiri', serif" text-anchor="middle">معلق کیفیت اور جونک نما ساخت</text>
        <text x="90" y="44" fill="#a7f3d0" font-size="7.5" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle">(Clinging &amp; Segmented Morphology)</text>

        <g transform="translate(10, 68)">
          <rect x="0" y="0" width="160" height="48" rx="6" fill="#0f172a" stroke="#1e293b"/>
          <text x="80" y="16" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">1. CLINGING ATTACHMENT</text>
          <text x="80" y="30" fill="#fef08a" font-size="9" font-family="'Amiri', serif" text-anchor="middle">تعلق اور معلق گرفت</text>
          <text x="80" y="42" fill="#94a3b8" font-size="7.5" text-anchor="middle">Anchored to host wall for blood</text>
        </g>

        <g transform="translate(10, 126)">
          <rect x="0" y="0" width="160" height="48" rx="6" fill="#0f172a" stroke="#1e293b"/>
          <text x="80" y="16" fill="#34d399" font-size="8.5" font-weight="bold" text-anchor="middle">2. SEGMENTED PROFILE</text>
          <text x="80" y="30" fill="#a7f3d0" font-size="9" font-family="'Amiri', serif" text-anchor="middle">حلقہ دار ساخت (سومائٹس)</text>
          <text x="80" y="42" fill="#94a3b8" font-size="7.5" text-anchor="middle">Somites mirror Metamere rings</text>
        </g>

        <g transform="translate(10, 184)">
          <rect x="0" y="0" width="160" height="48" rx="6" fill="#0f172a" stroke="#1e293b"/>
          <text x="80" y="16" fill="#f43f5e" font-size="8.5" font-weight="bold" text-anchor="middle">3. BLOOD SIPHON / CLOT</text>
          <text x="80" y="30" fill="#fca5a5" font-size="9" font-family="'Amiri', serif" text-anchor="middle">خون پینا اور جما لوتھڑا</text>
          <text x="80" y="42" fill="#94a3b8" font-size="7.5" text-anchor="middle">Internal blood-filled tubules</text>
        </g>

        <circle cx="90" cy="260" r="18" fill="#047857" stroke="#34d399" stroke-width="1.5"/>
        <text x="90" y="265" fill="#f8fafc" font-size="11" font-weight="bold" font-family="'Amiri', serif" text-anchor="middle">عَلَق</text>
      </g>

      <!-- ================= RIGHT PANEL: FRESHWATER LEECH ('ALAQAH) ================= -->
      <g transform="translate(532, 52)">
        <rect x="0" y="0" width="310" height="295" rx="10" fill="#090d16" stroke="#1e293b" stroke-width="1.2"/>

        <rect x="10" y="10" width="290" height="24" rx="5" fill="#1e293b"/>
        <text x="18" y="26" fill="#34d399" font-size="11" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">Freshwater Leech (Hirudo)</text>
        <text x="292" y="26" fill="#a7f3d0" font-size="11" font-weight="bold" font-family="'Amiri', serif" text-anchor="end">جونک کی ساخت (عَلَق)</text>

        <!-- Substrate / Host Wall -->
        <path d="M 10 42 Q 100 36 190 42 T 300 42 L 300 88 Q 150 82 10 88 Z" fill="#064e3b" opacity="0.6"/>
        <text x="18" y="58" fill="#a7f3d0" font-size="9" font-weight="bold">Host / Substrate Surface (جس سے جونک چمٹتی ہے)</text>

        <!-- Anterior / Oral Sucker -->
        <ellipse cx="155" cy="88" rx="15" ry="9" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
        <text x="180" y="92" fill="#6ee7b7" font-size="8.5" font-weight="bold">⬅ Oral Clinging Sucker</text>
        <text x="180" y="103" fill="#cbd5e1" font-size="8" font-family="'Amiri', serif">(دہانی چوسنی / گرفت)</text>

        <!-- Segmented Curved Leech Body -->
        <path d="M 155 94 C 205 125, 205 210, 160 235 C 115 255, 95 205, 125 155 C 140 125, 150 98, 155 94 Z" fill="url(#leechGrad)" stroke="#34d399" stroke-width="1.8" filter="url(#softGlow)"/>

        <!-- Metameric Annuli -->
        <g stroke="#064e3b" stroke-width="2.2">
          <line x1="150" y1="125" x2="175" y2="132"/>
          <line x1="145" y1="140" x2="178" y2="148"/>
          <line x1="135" y1="155" x2="175" y2="164"/>
          <line x1="125" y1="170" x2="168" y2="180"/>
          <line x1="118" y1="185" x2="158" y2="196"/>
          <line x1="115" y1="200" x2="148" y2="210"/>
          <line x1="120" y1="215" x2="142" y2="222"/>
        </g>
        <text x="185" y="160" fill="#34d399" font-size="8.5" font-weight="bold">⬅ Segmented Body</text>
        <text x="185" y="171" fill="#cbd5e1" font-size="8" font-family="'Amiri', serif">(حلقہ دار ساخت / Metameres)</text>

        <!-- Caudal / Posterior Sucker -->
        <ellipse cx="138" cy="242" rx="15" ry="9" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
        <text x="25" y="240" fill="#6ee7b7" font-size="8.5" font-weight="bold">Posterior Sucker ➔</text>
        <text x="25" y="251" fill="#cbd5e1" font-size="8" font-family="'Amiri', serif">(دموی چوسنی / گرفت)</text>

        <rect x="10" y="258" width="290" height="26" rx="4" fill="#0f172a" stroke="#1e293b"/>
        <text x="18" y="274" fill="#94a3b8" font-size="8.5" font-family="'Plus Jakarta Sans', sans-serif">Annelida • Dual Suction Discs • Blood-feeding Ectoparasite</text>
      </g>

      <!-- ================= BOTTOM CITATION BAR ================= -->
      <g transform="translate(18, 354)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#38bdf8" font-size="9" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">SCHOLARLY SOURCE:</text>
        <text x="115" y="21" fill="#94a3b8" font-size="8.5" font-family="'Plus Jakarta Sans', sans-serif">Prof. Keith L. Moore (The Developing Human: Clinically Oriented Embryology, 8th Ed., Saunders) &amp; Carnegie Institution</text>
        <text x="810" y="21" fill="#34d399" font-size="9" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="end">Nuzool-ul-Quran Scientific Visual Series</text>
      </g>
    </svg>
  `;
}

/**
 * Generates an inline SVG diagram based on the scientific domain type.
 */
function generateScientificDiagramSvg(type) {
  switch (type) {
    case 'embryology':
    case 'morphogenesis':
      return generateAnatomicalEmbryoComparisonSvg();
    case 'cosmology':
      return `
        <svg viewBox="0 0 860 380" class="w-full h-auto max-h-[360px] object-contain rounded-lg bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-indigo-300 p-3 shadow-inner" xmlns="http://www.w3.org/2000/svg">
          <rect width="860" height="380" fill="#050714" rx="12"/>
          <text x="30" y="38" fill="#38bdf8" font-size="13" font-weight="bold">COSMIC SINGULARITY &amp; EXPANSION (BIG BANG &amp; ORIGIN OF WATER)</text>
          <text x="830" y="38" fill="#a5b4fc" font-size="16" font-weight="bold" font-family="'Amiri', serif" text-anchor="end">أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا (الأنبياء: ۳۰)</text>
          
          <circle cx="160" cy="200" r="28" fill="#fbbf24" stroke="#f59e0b" stroke-width="4"/>
          <circle cx="160" cy="200" r="14" fill="#ffffff"/>
          <text x="160" y="255" fill="#fde68a" font-size="13" font-weight="bold" text-anchor="middle">رَتْقًا (Gravitational Singularity)</text>
          <text x="160" y="275" fill="#cbd5e1" font-size="10" text-anchor="middle">All matter &amp; spacetime bound together</text>
          
          <path d="M 210 200 L 410 120" stroke="#818cf8" stroke-width="3" stroke-dasharray="5,3"/>
          <path d="M 210 200 L 410 200" stroke="#818cf8" stroke-width="3"/>
          <path d="M 210 200 L 410 280" stroke="#818cf8" stroke-width="3" stroke-dasharray="5,3"/>
          
          <rect x="290" y="180" width="140" height="38" rx="6" fill="#1e1b4b" stroke="#6366f1"/>
          <text x="360" y="204" fill="#c7d2fe" font-size="11" font-weight="bold" text-anchor="middle">فَفَتَقْنَاهُمَا (Inflation)</text>
          
          <ellipse cx="560" cy="130" rx="45" ry="22" fill="#4338ca" transform="rotate(25 560 130)" stroke="#a5b4fc" stroke-width="2"/>
          <ellipse cx="600" cy="260" rx="55" ry="25" fill="#3730a3" transform="rotate(-30 600 260)" stroke="#818cf8" stroke-width="2"/>
          <text x="580" y="320" fill="#e0e7ff" font-size="11" font-weight="bold">Expanding Universe (Hubble Law)</text>
          
          <g transform="translate(710, 160)">
            <circle cx="35" cy="40" r="26" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
            <text x="35" y="45" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Oxygen</text>
            <circle cx="10" cy="12" r="14" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="10" y="16" fill="#0369a1" font-size="10" font-weight="bold" text-anchor="middle">H</text>
            <circle cx="60" cy="12" r="14" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="60" y="16" fill="#0369a1" font-size="10" font-weight="bold" text-anchor="middle">H</text>
            <text x="35" y="85" fill="#bae6fd" font-size="11" font-weight="bold" text-anchor="middle">وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ</text>
          </g>
        </svg>
      `;
    case 'geology':
      return `
        <svg viewBox="0 0 860 380" class="w-full h-auto max-h-[360px] object-contain rounded-lg bg-gradient-to-r from-slate-950 via-stone-900 to-slate-950 text-emerald-300 p-3 shadow-inner" xmlns="http://www.w3.org/2000/svg">
          <rect width="860" height="380" fill="#070c14" rx="12"/>
          <text x="30" y="38" fill="#34d399" font-size="13" font-weight="bold">GEOPHYSICS &amp; ISOSTASY: DEEP CRUSTAL MOUNTAIN ROOTS (PEGS)</text>
          <text x="830" y="38" fill="#6ee7b7" font-size="16" font-weight="bold" font-family="'Amiri', serif" text-anchor="end">وَالْجِبَالَ أَوْتَادًا (النبأ: ۷)</text>
          <polygon points="120,200 240,90 360,200" fill="#78716c" stroke="#d6d3d1" stroke-width="2"/>
          <polygon points="320,200 480,70 640,200" fill="#57534e" stroke="#d6d3d1" stroke-width="2"/>
          <polygon points="580,200 700,105 820,200" fill="#78716c" stroke="#d6d3d1" stroke-width="2"/>
          <text x="480" y="60" fill="#fef08a" font-size="11" font-weight="bold" text-anchor="middle">Visible Mountain Peak (جبل ظاہری)</text>
          
          <rect x="20" y="200" width="820" height="25" fill="#44403c"/>
          <text x="40" y="217" fill="#d6d3d1" font-size="10" font-weight="bold">Continental Earth Crust (قشرۃ الأرض)</text>
          
          <polygon points="340,225 480,360 620,225" fill="#292524" stroke="#a8a29e" stroke-width="2"/>
          <text x="480" y="295" fill="#fca5a5" font-size="13" font-weight="bold" text-anchor="middle">أَوْتَادًا (Deep Root Peg)</text>
          <text x="480" y="320" fill="#e7e5e4" font-size="10" text-anchor="middle">Airy Isostasy Root (10x depth into Asthenospheric Mantle)</text>
          
          <rect x="20" y="360" width="820" height="15" fill="#991b1b" opacity="0.4"/>
        </svg>
      `;
    default:
      return generateAnatomicalEmbryoComparisonSvg();
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
  const captionEn = diagram.caption_en || diagram.title || sci.title_en;
  const captionUr = diagram.caption_ur || sci.title_ur;
  const sciSource = diagram.scientific_source || (sci.citations ? sci.citations[0] : 'Prof. Keith L. Moore & Carnegie Institution / OpenStax Anatomy');
  const diagramType = diagram.type || 'embryology';

  // Self-Contained High-Resolution Colored Anatomical Visual Component
  const visualPreviewHtml = `
    <div 
      onclick="openScientificModal()"
      class="cursor-pointer group relative bg-slate-900 border border-emerald-500/30 shadow-md rounded-xl p-2 sm:p-3 overflow-hidden transition hover:border-emerald-500/60"
      title="HD Scientific Graphic: Bada karke dekhiye (Click to Zoom)"
    >
      <div class="w-full max-h-[380px] object-contain flex items-center justify-center">
        ${generateScientificDiagramSvg(diagramType)}
      </div>
      <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition flex items-center justify-center pointer-events-none">
        <span class="bg-black/85 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-lg border border-emerald-500/50 shadow-xl backdrop-blur-xs flex items-center gap-1.5 group-hover:scale-105 transition-transform">
          <span class="text-emerald-400">🔍</span>
          <span>HD Anatomical Diagram • Click to Zoom</span>
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

  // Self-Contained High-Resolution Dynamic Medical Graphic / SVG Diagram
  const visualElementHtml = `
    <div class="w-full max-h-[380px] bg-slate-900 border border-emerald-500/30 rounded-xl p-2 sm:p-4 flex items-center justify-center shadow-2xl overflow-hidden">
      ${generateScientificDiagramSvg(fallbackType)}
    </div>
  `;

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
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-[11px] font-semibold">
            <span>Morphology:</span>
            <span class="text-white">معلق کیفیت اور جونک نما ساخت (Clinging & Segmented Morphology)</span>
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
    renderScientificInsights
  };
}
