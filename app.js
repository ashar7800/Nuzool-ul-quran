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
 * Episode-Specific Scientific SVG Generators (Self-Contained & Valid XML).
 */
function generateAnatomicalEmbryoComparisonSvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="embBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#030712"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#030712"/>
        </linearGradient>
        <linearGradient id="endoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </linearGradient>
        <radialGradient id="capGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#9f1239" stop-opacity="0.2"/>
        </radialGradient>
        <linearGradient id="embGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="35%" stop-color="#f59e0b"/>
          <stop offset="70%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#92400e"/>
        </linearGradient>
        <linearGradient id="leechGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6ee7b7"/>
          <stop offset="40%" stop-color="#10b981"/>
          <stop offset="80%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="50%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <rect width="860" height="400" rx="14" fill="url(#embBg)"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.25"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#020617" opacity="0.9"/>
      <rect x="18" y="10" width="130" height="24" rx="5" fill="#047857"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">🔬 CLINICAL ANATOMY</text>
      <text x="160" y="27" fill="#f8fafc" font-size="12.5" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif">EMBRYO (24–28 DAYS) vs. 'ALAQAH (LEECH MORPHOLOGY)</text>
      <text x="842" y="28" fill="#34d399" font-size="15" font-weight="bold" font-family="'Amiri', serif" text-anchor="end">خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ (سورۃ العلق: ۲)</text>

      <!-- LEFT PANEL: HUMAN EMBRYO (24-28 DAYS) -->
      <g transform="translate(18, 52)">
        <rect x="0" y="0" width="310" height="295" rx="10" fill="#090d16" stroke="#1e293b" stroke-width="1.2"/>
        <rect x="10" y="10" width="290" height="24" rx="5" fill="#1e293b"/>
        <text x="18" y="26" fill="#fbbf24" font-size="11" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">Carnegie Stage 11–12 (24–28 Days)</text>
        <text x="292" y="26" fill="#fef08a" font-size="11" font-weight="bold" font-family="'Amiri', serif" text-anchor="end">انسانی جنین (۲۴ تا ۲۸ دن)</text>
        <path d="M 10 42 Q 100 36 190 42 T 300 42 L 300 88 Q 150 82 10 88 Z" fill="url(#endoGrad)"/>
        <text x="18" y="58" fill="#fca5a5" font-size="9" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">Uterine Endometrium (رحم کی دیوار)</text>
        <circle cx="90" cy="72" r="10" fill="url(#capGlow)"/>
        <circle cx="160" cy="68" r="12" fill="url(#capGlow)"/>
        <circle cx="230" cy="74" r="11" fill="url(#capGlow)"/>
        <text x="110" y="84" fill="#fecdd3" font-size="8" font-style="italic">Maternal Blood Lacunae (خون کی خوراک)</text>
        <path d="M 160 86 L 160 135" stroke="#f59e0b" stroke-width="7" stroke-linecap="round"/>
        <text x="60" y="112" fill="#fef08a" font-size="8.5" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">Connecting Stalk ➔</text>
        <path d="M 160 135 C 110 145, 100 215, 145 240 C 190 260, 205 215, 185 180 C 175 160, 185 140, 160 135 Z" fill="url(#embGrad)" stroke="#fef08a" stroke-width="1.8" filter="url(#softGlow)"/>
        <circle cx="142" cy="155" r="14" fill="#fef08a" opacity="0.95"/>
        <text x="35" y="158" fill="#93c5fd" font-size="8.5" font-weight="bold">Brain Fold ➔</text>
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
        <circle cx="155" cy="178" r="9" fill="#dc2626"/>
        <circle cx="155" cy="178" r="4.5" fill="#f87171"/>
        <text x="175" y="178" fill="#fca5a5" font-size="8" font-weight="bold">⬅ Heart Bulge</text>
        <rect x="10" y="258" width="290" height="26" rx="4" fill="#0f172a" stroke="#1e293b"/>
        <text x="18" y="274" fill="#94a3b8" font-size="8.5" font-family="'Plus Jakarta Sans', sans-serif">Size: 2.5–3.5mm • Curved Body • Endometrial Siphon</text>
      </g>

      <!-- CENTER PANEL: MORPHOLOGICAL IDENTITY BADGE -->
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

      <!-- RIGHT PANEL: FRESHWATER LEECH ('ALAQAH) -->
      <g transform="translate(532, 52)">
        <rect x="0" y="0" width="310" height="295" rx="10" fill="#090d16" stroke="#1e293b" stroke-width="1.2"/>
        <rect x="10" y="10" width="290" height="24" rx="5" fill="#1e293b"/>
        <text x="18" y="26" fill="#34d399" font-size="11" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">Freshwater Leech (Hirudo)</text>
        <text x="292" y="26" fill="#a7f3d0" font-size="11" font-weight="bold" font-family="'Amiri', serif" text-anchor="end">جونک کی ساخت (عَلَق)</text>
        <path d="M 10 42 Q 100 36 190 42 T 300 42 L 300 88 Q 150 82 10 88 Z" fill="#064e3b" opacity="0.6"/>
        <ellipse cx="155" cy="88" rx="15" ry="9" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
        <text x="180" y="92" fill="#6ee7b7" font-size="8.5" font-weight="bold">⬅ Oral Clinging Sucker</text>
        <path d="M 155 94 C 205 125, 205 210, 160 235 C 115 255, 95 205, 125 155 C 140 125, 150 98, 155 94 Z" fill="url(#leechGrad)" stroke="#34d399" stroke-width="1.8" filter="url(#softGlow)"/>
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
        <ellipse cx="138" cy="242" rx="15" ry="9" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
        <text x="25" y="240" fill="#6ee7b7" font-size="8.5" font-weight="bold">Posterior Sucker ➔</text>
        <rect x="10" y="258" width="290" height="26" rx="4" fill="#0f172a" stroke="#1e293b"/>
        <text x="18" y="274" fill="#94a3b8" font-size="8.5" font-family="'Plus Jakarta Sans', sans-serif">Annelida • Dual Suction Discs • Blood-feeding Ectoparasite</text>
      </g>

      <g transform="translate(18, 354)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#38bdf8" font-size="9" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">SCHOLARLY SOURCE:</text>
        <text x="115" y="21" fill="#94a3b8" font-size="8.5" font-family="'Plus Jakarta Sans', sans-serif">Prof. Keith L. Moore (The Developing Human: Clinically Oriented Embryology, 8th Ed., Saunders) &amp; Carnegie Institution</text>
      </g>
    </svg>
  `;
}

function generateMorphogenesisSvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="morphBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="860" height="400" rx="14" fill="url(#morphBg)"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.25"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="165" height="24" rx="5" fill="#059669"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">&#129516; DEVELOPMENTAL STAGES</text>
      <text x="195" y="27" fill="#f8fafc" font-size="12" font-weight="700">CARNEGIE MORPHOGENESIS: NUTFAH ➔ 'ALAQAH ➔ MUDGHAH ➔ SKELETON</text>
      <text x="842" y="28" fill="#34d399" font-size="14" font-weight="bold" text-anchor="end">ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً (المؤمنون: ۱۴)</text>
      <g transform="translate(18, 55)">
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="195" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
          <rect x="10" y="10" width="175" height="24" rx="4" fill="#0369a1"/>
          <text x="18" y="26" fill="#ffffff" font-size="10.5" font-weight="bold">1. NUTFAH (نُطْفَةً)</text>
          <circle cx="97" cy="100" r="38" fill="#0284c7" opacity="0.25" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="85" cy="92" r="14" fill="#38bdf8"/>
          <circle cx="110" cy="92" r="14" fill="#38bdf8"/>
          <circle cx="97" cy="115" r="14" fill="#38bdf8"/>
          <text x="97" y="165" fill="#bae6fd" font-size="10" font-weight="bold" text-anchor="middle">Zygote &amp; Morula (Day 1–4)</text>
          <text x="15" y="190" fill="#94a3b8" font-size="8.5">Fertilized diploid cell undergoing cleavage and blastogenesis.</text>
        </g>
        <g transform="translate(210, 0)">
          <rect x="0" y="0" width="195" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
          <rect x="10" y="10" width="175" height="24" rx="4" fill="#b45309"/>
          <text x="18" y="26" fill="#ffffff" font-size="10.5" font-weight="bold">2. 'ALAQAH (عَلَقَةً)</text>
          <path d="M 97 65 C 65 85, 65 140, 97 150 C 130 155, 130 105, 110 75 Z" fill="#d97706" stroke="#fde047" stroke-width="2"/>
          <text x="97" y="165" fill="#fde68a" font-size="10" font-weight="bold" text-anchor="middle">Leech-like Clinging (Day 15–24)</text>
          <text x="15" y="190" fill="#94a3b8" font-size="8.5">Suspended in gestational sac, clinging to maternal endometrium.</text>
        </g>
        <g transform="translate(420, 0)">
          <rect x="0" y="0" width="195" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
          <rect x="10" y="10" width="175" height="24" rx="4" fill="#7e22ce"/>
          <text x="18" y="26" fill="#ffffff" font-size="10.5" font-weight="bold">3. MUDGHAH (مُضْغَةً)</text>
          <path d="M 97 65 C 55 85, 55 140, 97 150 C 140 155, 140 105, 115 70 Z" fill="#7e22ce" stroke="#d8b4fe" stroke-width="2"/>
          <circle cx="78" cy="95" r="4.5" fill="#fae8ff"/>
          <circle cx="82" cy="107" r="4.5" fill="#fae8ff"/>
          <circle cx="88" cy="119" r="4.5" fill="#fae8ff"/>
          <circle cx="98" cy="129" r="4.5" fill="#fae8ff"/>
          <text x="97" y="165" fill="#e9d5ff" font-size="10" font-weight="bold" text-anchor="middle">Chewed Lump (Day 24–32)</text>
          <text x="15" y="190" fill="#94a3b8" font-size="8.5">Somite segments resemble distinctive dental bite impressions.</text>
        </g>
        <g transform="translate(630, 0)">
          <rect x="0" y="0" width="195" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
          <rect x="10" y="10" width="175" height="24" rx="4" fill="#047857"/>
          <text x="18" y="26" fill="#ffffff" font-size="10.5" font-weight="bold">4. 'IZAM &amp; LAHM (عِظَامًا)</text>
          <line x1="85" y1="80" x2="85" y2="135" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>
          <line x1="110" y1="80" x2="110" y2="135" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>
          <path d="M 72 90 Q 85 85 98 90 T 123 90" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
          <path d="M 72 115 Q 85 110 98 115 T 123 115" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
          <text x="97" y="165" fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle">Bone &amp; Flesh (Day 35–45)</text>
          <text x="15" y="190" fill="#94a3b8" font-size="8.5">Cartilaginous skeleton formed and clothed with myogenic tissue.</text>
        </g>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#38bdf8" font-size="9" font-weight="bold">CLINICAL REFERENCE:</text>
        <text x="125" y="21" fill="#94a3b8" font-size="8.5">Prof. Keith L. Moore &amp; Prof. T.V.N. Persaud (Developing Human, 8th Ed., Saunders) • Carnegie Stages 1 to 18</text>
      </g>
    </svg>
  `;
}

function generateCosmologySvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cosBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <rect width="860" height="400" rx="14" fill="url(#cosBg)"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#6366f1" stroke-width="1.2" stroke-opacity="0.3"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="150" height="24" rx="5" fill="#4338ca"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">&#127756; COSMOLOGY &amp; ORIGINS</text>
      <text x="180" y="27" fill="#f8fafc" font-size="12" font-weight="700">BIG BANG SINGULARITY (RATQAN) ➔ INFLATION &amp; WATER RATIO</text>
      <text x="842" y="28" fill="#a5b4fc" font-size="14" font-weight="bold" text-anchor="end">أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا (الأنبياء: ۳۰)</text>
      <g transform="translate(18, 55)">
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="260" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
          <rect x="10" y="10" width="240" height="24" rx="4" fill="#312e81"/>
          <text x="18" y="26" fill="#c7d2fe" font-size="10.5" font-weight="bold">1. RATQAN (رَتْقًا / Singularity)</text>
          <circle cx="130" cy="115" r="28" fill="#fbbf24" stroke="#f59e0b" stroke-width="3"/>
          <circle cx="130" cy="115" r="14" fill="#ffffff"/>
          <text x="130" y="175" fill="#fde68a" font-size="11" font-weight="bold" text-anchor="middle">Bound Spacetime Mass</text>
          <text x="15" y="205" fill="#94a3b8" font-size="8.5">Initial cosmic state: all primordial matter and spacetime fused together in an infinitely dense primeval atom.</text>
        </g>
        <g transform="translate(280, 0)">
          <rect x="0" y="0" width="260" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
          <rect x="10" y="10" width="240" height="24" rx="4" fill="#1e1b4b"/>
          <text x="18" y="26" fill="#c7d2fe" font-size="10.5" font-weight="bold">2. FAFATAQNAHUMA (فَفَتَقْنَاهُمَا)</text>
          <ellipse cx="90" cy="100" rx="28" ry="14" fill="#6366f1" transform="rotate(25 90 100)" stroke="#a5b4fc" stroke-width="1.5"/>
          <ellipse cx="170" cy="130" rx="32" ry="16" fill="#4f46e5" transform="rotate(-30 170 130)" stroke="#818cf8" stroke-width="1.5"/>
          <path d="M 50 115 L 210 115" stroke="#818cf8" stroke-width="2" stroke-dasharray="4,2"/>
          <text x="130" y="175" fill="#c7d2fe" font-size="11" font-weight="bold" text-anchor="middle">Separation &amp; Expansion</text>
          <text x="15" y="205" fill="#94a3b8" font-size="8.5">Inflationary cosmic cleavage separating fundamental forces, creating baryonic matter, stars, and galaxies.</text>
        </g>
        <g transform="translate(560, 0)">
          <rect x="0" y="0" width="260" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
          <rect x="10" y="10" width="240" height="24" rx="4" fill="#0c4a6e"/>
          <text x="18" y="26" fill="#7dd3fc" font-size="10.5" font-weight="bold">3. WATER MATRIX (مِنَ الْمَاءِ كُلَّ شَيْءٍ)</text>
          <circle cx="130" cy="105" r="24" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="106" cy="80" r="13" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
          <circle cx="154" cy="80" r="13" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="130" y="110" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">O</text>
          <text x="106" y="85" fill="#0369a1" font-size="9" font-weight="bold" text-anchor="middle">H</text>
          <text x="154" y="85" fill="#0369a1" font-size="9" font-weight="bold" text-anchor="middle">H</text>
          <text x="130" y="175" fill="#bae6fd" font-size="11" font-weight="bold" text-anchor="middle">Protoplasmic Solvent (H₂O)</text>
          <text x="15" y="205" fill="#94a3b8" font-size="8.5">70–85% of cellular cytoplasm is aqueous. Water is the thermodynamic prerequisite for all bio-molecular life.</text>
        </g>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#38bdf8" font-size="9" font-weight="bold">ASTROPHYSICAL CITATION:</text>
        <text x="145" y="21" fill="#94a3b8" font-size="8.5">Georges Lemaître (Primeval Atom) &amp; Arno Penzias / Robert Wilson (Cosmic Microwave Background Radiation - Nobel Prize)</text>
      </g>
    </svg>
  `;
}

function generateAstrophysicsSvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="astroBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="860" height="400" rx="14" fill="url(#astroBg)"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#0284c7" stroke-width="1.2" stroke-opacity="0.3"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="175" height="24" rx="5" fill="#0284c7"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">🔭 RELATIVISTIC ASTROPHYSICS</text>
      <text x="205" y="27" fill="#f8fafc" font-size="12" font-weight="700">CONTINUOUS ACCELERATING METRIC EXPANSION OF SPACETIME</text>
      <text x="842" y="28" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="end">وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ (الذاریات: ۴۷)</text>
      <g transform="translate(18, 55)">
        <rect x="0" y="0" width="824" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
        <g stroke="#334155" stroke-width="1.2" opacity="0.7">
          <path d="M 60 40 Q 412 80 764 40"/>
          <path d="M 40 100 Q 412 140 784 100"/>
          <path d="M 30 170 Q 412 210 794 170"/>
          <path d="M 20 240 Q 412 280 804 240"/>
          <path d="M 120 20 Q 80 140 120 260"/>
          <path d="M 270 20 Q 240 140 270 260"/>
          <path d="M 412 20 Q 412 140 412 260"/>
          <path d="M 554 20 Q 584 140 554 260"/>
          <path d="M 704 20 Q 744 140 704 260"/>
        </g>
        <circle cx="270" cy="100" r="14" fill="#6366f1"/>
        <circle cx="554" cy="100" r="18" fill="#ec4899"/>
        <circle cx="270" cy="200" r="16" fill="#3b82f6"/>
        <circle cx="554" cy="200" r="20" fill="#f59e0b"/>
        <line x1="250" y1="95" x2="190" y2="80" stroke="#ef4444" stroke-width="2.5"/>
        <line x1="575" y1="95" x2="635" y2="80" stroke="#ef4444" stroke-width="2.5"/>
        <line x1="250" y1="205" x2="190" y2="220" stroke="#ef4444" stroke-width="2.5"/>
        <line x1="575" y1="205" x2="635" y2="220" stroke="#ef4444" stroke-width="2.5"/>
        <rect x="260" y="130" width="304" height="36" rx="6" fill="#0f172a" stroke="#38bdf8"/>
        <text x="412" y="152" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">وَإِنَّا لَمُوسِعُونَ (Cosmic Metric Expansion)</text>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#38bdf8" font-size="9" font-weight="bold">OBSERVATIONAL SOURCE:</text>
        <text x="145" y="21" fill="#94a3b8" font-size="8.5">Edwin Hubble (1929 Redshift Law) &amp; Saul Perlmutter (Accelerating Universe via Type Ia Supernovae - Nobel Prize 2011)</text>
      </g>
    </svg>
  `;
}

function generatePulsarSvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pulBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
      </defs>
      <rect width="860" height="400" rx="14" fill="url(#pulBg)"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#818cf8" stroke-width="1.2" stroke-opacity="0.3"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="150" height="24" rx="5" fill="#6366f1"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">🌟 RADIO ASTRONOMY</text>
      <text x="180" y="27" fill="#f8fafc" font-size="12" font-weight="700">PULSARS &amp; NEUTRON STARS: THE PIERCING KNOCKER (AT-TARIQ)</text>
      <text x="842" y="28" fill="#a5b4fc" font-size="14" font-weight="bold" text-anchor="end">وَالسَّمَاءِ وَالطَّارِقِ النَّجْمُ الثَّاقِبُ (الطارق: ۱-۳)</text>
      <g transform="translate(18, 55)">
        <rect x="0" y="0" width="824" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
        <g transform="translate(412, 140)">
          <polygon points="0,0 -70,-120 70,-120" fill="#38bdf8" opacity="0.45"/>
          <polygon points="0,0 -70,120 70,120" fill="#38bdf8" opacity="0.45"/>
          <ellipse cx="0" cy="0" rx="100" ry="50" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="4,2"/>
          <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#60a5fa" stroke-width="3"/>
          <text x="0" y="4" fill="#0f172a" font-size="9.5" font-weight="900" text-anchor="middle">NEUTRON</text>
        </g>
        <text x="412" y="32" fill="#e0f2fe" font-size="11" font-weight="bold" text-anchor="middle">Relativistic Jet: The Piercing Star (النَّجْمُ الثَّاقِبُ)</text>
        <text x="412" y="265" fill="#fde047" font-size="10.5" font-weight="bold" text-anchor="middle">Periodic Acoustic Pulsation Waveform (الطَّارِقِ / The Knocker)</text>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#38bdf8" font-size="9" font-weight="bold">DISCOVERY SOURCE:</text>
        <text x="135" y="21" fill="#94a3b8" font-size="8.5">Dame Jocelyn Bell Burnell &amp; Antony Hewish (Nobel Prize in Physics) • Max Planck Institute for Radio Astronomy</text>
      </g>
    </svg>
  `;
}

function generateOceanographySvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="freshGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
        <linearGradient id="salineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f766e"/>
          <stop offset="100%" stop-color="#134e4a"/>
        </linearGradient>
      </defs>
      <rect width="860" height="400" rx="14" fill="#020617"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#0d9488" stroke-width="1.2" stroke-opacity="0.3"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="150" height="24" rx="5" fill="#0d9488"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">🌊 MARINE OCEANOGRAPHY</text>
      <text x="180" y="27" fill="#f8fafc" font-size="12" font-weight="700">HALOCLINE &amp; PYCNOCLINE DENSITY BARRIER (MARAJA AL-BAHRAYN)</text>
      <text x="842" y="28" fill="#5eead4" font-size="14" font-weight="bold" text-anchor="end">مَرَجَ الْبَحْرَيْنِ... بَيْنَهُمَا بَرْزَخٌ لَّا يَبْغِيَانِ (الفرقان: ۵۳)</text>
      <g transform="translate(18, 55)">
        <rect x="0" y="0" width="824" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
        <rect x="10" y="10" width="390" height="260" rx="6" fill="url(#freshGrad)" opacity="0.8"/>
        <text x="205" y="45" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Freshwater River / عَذْبٌ فُرَاتٌ</text>
        <text x="205" y="70" fill="#e0f2fe" font-size="10" text-anchor="middle">Salinity: &lt; 0.5 PSU • Low Density</text>
        <rect x="390" y="10" width="44" height="260" fill="#0f172a" stroke="#2dd4bf" stroke-width="2"/>
        <text x="412" y="145" fill="#2dd4bf" font-size="11" font-weight="bold" text-anchor="middle" transform="rotate(-90 412 145)">بَرْزَخٌ (HALOCLINE)</text>
        <rect x="424" y="10" width="390" height="260" rx="6" fill="url(#salineGrad)" opacity="0.85"/>
        <text x="619" y="45" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Saline Oceanic Sea / مِلْحٌ أُجَاجٌ</text>
        <text x="619" y="70" fill="#ccfbf1" font-size="10" text-anchor="middle">Salinity: 35 PSU • High Density &amp; Surface Tension</text>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#2dd4bf" font-size="9" font-weight="bold">OCEANOGRAPHIC REFERENCE:</text>
        <text x="165" y="21" fill="#94a3b8" font-size="8.5">Dr. Hayao Kawai (Physical Oceanography, University of Tokyo) &amp; Scripps Institution of Oceanography</text>
      </g>
    </svg>
  `;
}

function generateInternalWavesSvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <rect width="860" height="400" rx="14" fill="#020617"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#0284c7" stroke-width="1.2" stroke-opacity="0.3"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="165" height="24" rx="5" fill="#0369a1"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">🌊 DEEP MARINE PHYSICS</text>
      <text x="195" y="27" fill="#f8fafc" font-size="12" font-weight="700">INTERNAL WAVES &amp; PHOTOPIC EXTINCTION (BAHR LUJJIYY)</text>
      <text x="842" y="28" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="end">فِي بَحْرٍ لُّجِّيٍّ يَغْشَاهُ مَوْجٌ مِّن فَوْقِهِ مَوْجٌ (النور: ۴۰)</text>
      <g transform="translate(18, 55)">
        <rect x="0" y="0" width="824" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
        <path d="M 0 30 Q 206 10 412 30 T 824 30 L 824 90 Q 412 70 0 90 Z" fill="#0284c7" opacity="0.6"/>
        <text x="412" y="45" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">1. Surface Waves &amp; Epipelagic Photic Zone (مَوْجٌ عَلَى السَّطْحِ)</text>
        <path d="M 0 130 Q 206 90 412 130 T 824 130 L 824 190 Q 412 150 0 190 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="412" y="145" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">2. Deep Internal Waves at Pycnocline (مَوْجٌ مِّن فَوْقِهِ مَوْجٌ)</text>
        <rect x="0" y="190" width="824" height="90" fill="#000000"/>
        <text x="412" y="245" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">3. Aphotic Abyss: Total Darkness at Depth &gt; 200m (ظُلُمَاتٌ بَعْضُهَا فَوْقَ بَعْضٍ)</text>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#38bdf8" font-size="9" font-weight="bold">SCIENTIFIC CITATION:</text>
        <text x="135" y="21" fill="#94a3b8" font-size="8.5">Prof. Rao (Physical Oceanography, India) &amp; Woods Hole Oceanographic Institution</text>
      </g>
    </svg>
  `;
}

function generateGeologySvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <rect width="860" height="400" rx="14" fill="#070c14"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.3"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="160" height="24" rx="5" fill="#047857"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">🌍 GEOPHYSICS &amp; ISOSTASY</text>
      <text x="190" y="27" fill="#f8fafc" font-size="12" font-weight="700">CONTINENTAL CRUST MOUNTAIN ROOTS (PEGS / AWTAD)</text>
      <text x="842" y="28" fill="#6ee7b7" font-size="14" font-weight="bold" text-anchor="end">وَالْجِبَالَ أَوْتَادًا (النبأ: ۷)</text>
      <g transform="translate(18, 55)">
        <rect x="0" y="0" width="824" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
        <polygon points="120,130 220,50 320,130" fill="#78716c" stroke="#d6d3d1" stroke-width="1.5"/>
        <polygon points="280,130 412,30 544,130" fill="#57534e" stroke="#d6d3d1" stroke-width="2"/>
        <polygon points="504,130 604,60 704,130" fill="#78716c" stroke="#d6d3d1" stroke-width="1.5"/>
        <text x="412" y="25" fill="#fef08a" font-size="11" font-weight="bold" text-anchor="middle">Visible Mountain Peaks (جبل ظاہری)</text>
        <rect x="10" y="130" width="804" height="20" fill="#44403c"/>
        <text x="30" y="145" fill="#d6d3d1" font-size="9.5" font-weight="bold">Continental Crust (قشرۃ الأرض)</text>
        <polygon points="300,150 412,260 524,150" fill="#292524" stroke="#fca5a5" stroke-width="2"/>
        <text x="412" y="200" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">أَوْتَادًا (Deep Crustal Peg)</text>
        <text x="412" y="220" fill="#e7e5e4" font-size="9.5" text-anchor="middle">Airy Isostatic Root sinks deep into Asthenosphere</text>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#34d399" font-size="9" font-weight="bold">GEOLOGICAL SOURCE:</text>
        <text x="135" y="21" fill="#94a3b8" font-size="8.5">Sir George Biddell Airy (Isostasy Hypothesis) &amp; Prof. Frank Press (Earth, W.H. Freeman &amp; Co.)</text>
      </g>
    </svg>
  `;
}

function generateIronSupernovaSvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <rect width="860" height="400" rx="14" fill="#030712"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-opacity="0.3"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="175" height="24" rx="5" fill="#b45309"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">☄️ NUCLEAR ASTROPHYSICS</text>
      <text x="205" y="27" fill="#f8fafc" font-size="12" font-weight="700">SUPERNOVA NUCLEOSYNTHESIS &amp; EXTRA-TERRESTRIAL IRON DESCENT</text>
      <text x="842" y="28" fill="#fde047" font-size="14" font-weight="bold" text-anchor="end">وَأَنزَلْنَا الْحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ (الحدید: ۲۵)</text>
      <g transform="translate(18, 55)">
        <rect x="0" y="0" width="824" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
        <circle cx="230" cy="140" r="50" fill="#f59e0b" opacity="0.4"/>
        <circle cx="230" cy="140" r="28" fill="#ef4444"/>
        <circle cx="230" cy="140" r="14" fill="#ffffff"/>
        <text x="230" y="215" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Supernova Blast: Core Collapse</text>
        <text x="230" y="235" fill="#cbd5e1" font-size="9" text-anchor="middle">Requires &gt; 10⁹ Kelvin heat to synthesize Fe-56</text>
        <path d="M 330 140 L 510 140" stroke="#f59e0b" stroke-width="4" stroke-dasharray="6,3"/>
        <text x="420" y="125" fill="#fde047" font-size="11" font-weight="bold" text-anchor="middle">وَأَنزَلْنَا (Sent Down)</text>
        <circle cx="610" cy="140" r="42" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <text x="610" y="145" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Proto-Earth</text>
        <text x="610" y="215" fill="#93c5fd" font-size="11" font-weight="bold" text-anchor="middle">Meteoritic Iron Bombardment</text>
        <text x="610" y="235" fill="#cbd5e1" font-size="9" text-anchor="middle">Earth's crust could not generate iron locally</text>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#f59e0b" font-size="9" font-weight="bold">ASTROCHEMICAL CITATION:</text>
        <text x="155" y="21" fill="#94a3b8" font-size="8.5">Dr. Neil deGrasse Tyson (Astrophysics for People in a Hurry) &amp; Royal Astronomical Society</text>
      </g>
    </svg>
  `;
}

function generateAviationMedicineSvg() {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <rect width="860" height="400" rx="14" fill="#020617"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-opacity="0.3"/>
      <rect x="0" y="0" width="860" height="44" rx="14" fill="#030712" opacity="0.9"/>
      <rect x="18" y="10" width="175" height="24" rx="5" fill="#b91c1c"/>
      <text x="26" y="26" fill="#ffffff" font-size="11" font-weight="bold">✈️ AEROSPACE PHYSIOLOGY</text>
      <text x="205" y="27" fill="#f8fafc" font-size="12" font-weight="700">ALTITUDE HYPOXIA &amp; CHEST CONSTRICTION (DYSPNEA)</text>
      <text x="842" y="28" fill="#fca5a5" font-size="14" font-weight="bold" text-anchor="end">يَجْعَلْ صَدْرَهُ ضَيِّقًا حَرَجًا (الأنعام: ۱۲۵)</text>
      <g transform="translate(18, 55)">
        <rect x="0" y="0" width="824" height="280" rx="8" fill="#030712" stroke="#1e293b"/>
        <line x1="120" y1="240" x2="120" y2="40" stroke="#ef4444" stroke-width="3"/>
        <polygon points="120,30 112,45 128,45" fill="#ef4444"/>
        <text x="110" y="45" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="end">10,000m (Death Zone)</text>
        <text x="110" y="140" fill="#fde047" font-size="10" font-weight="bold" text-anchor="end">5,000m (Hypoxia Zone)</text>
        <text x="110" y="235" fill="#86efac" font-size="10" font-weight="bold" text-anchor="end">0m (Sea Level: 760 mmHg)</text>
        <path d="M 120 235 C 280 230, 400 130, 600 50" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="680" cy="90" r="32" fill="#991b1b" stroke="#f87171" stroke-width="2"/>
        <text x="680" y="85" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">ضَيِّقًا</text>
        <text x="680" y="102" fill="#fca5a5" font-size="9" text-anchor="middle">Chest Dyspnea</text>
        <text x="412" y="260" fill="#cbd5e1" font-size="10" text-anchor="middle">Ascending into the atmosphere drops barometric pressure, starving alveolar gas exchange.</text>
      </g>
      <g transform="translate(18, 350)">
        <rect x="0" y="0" width="824" height="34" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="14" y="21" fill="#f87171" font-size="9" font-weight="bold">AVIATION MEDICINE REFERENCE:</text>
        <text x="175" y="21" fill="#94a3b8" font-size="8.5">FAA Aerospace Medical Education &amp; Prof. John B. West (High Altitude Physiology, UCSD)</text>
      </g>
    </svg>
  `;
}

function generateGenericScientificSignSvg(type) {
  return `
    <svg viewBox="0 0 860 400" width="100%" height="100%" class="w-full max-h-[360px] object-contain select-none" xmlns="http://www.w3.org/2000/svg">
      <rect width="860" height="400" rx="14" fill="#0f172a"/>
      <rect width="860" height="400" rx="14" fill="none" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.3"/>
      <circle cx="430" cy="200" r="80" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,4"/>
      <circle cx="430" cy="200" r="40" fill="#065f46" opacity="0.6"/>
      <text x="430" y="195" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle">سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ</text>
      <text x="430" y="220" fill="#bae6fd" font-size="11" text-anchor="middle">Quranic Scientific Sign • ${type || 'Cosmic Reflection'}</text>
    </svg>
  `;
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
      return 'Rotating Magnetized Neutron Star / Acoustic Knocker';
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
 * Dynamic Diagram Dispatcher based on active episode type.
 */
function generateScientificDiagramSvg(type) {
  switch (type) {
    case 'embryology':
      return generateAnatomicalEmbryoComparisonSvg();
    case 'morphogenesis':
      return generateMorphogenesisSvg();
    case 'cosmology':
      return generateCosmologySvg();
    case 'astrophysics':
      return generateAstrophysicsSvg();
    case 'pulsar':
      return generatePulsarSvg();
    case 'oceanography':
      return generateOceanographySvg();
    case 'internal_waves':
      return generateInternalWavesSvg();
    case 'geology':
      return generateGeologySvg();
    case 'iron_supernova':
      return generateIronSupernovaSvg();
    case 'aviation_medicine':
      return generateAviationMedicineSvg();
    default:
      return generateGenericScientificSignSvg(type);
  }
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

  // Dynamic episode-specific SVG component
  const svgContent = generateScientificDiagramSvg(diagramType);

  const visualPreviewHtml = `
    <div 
      onclick="renderScientificModal(window.currentScientificItem)"
      class="cursor-pointer group relative bg-slate-900 border border-emerald-500/30 shadow-md rounded-xl p-2 sm:p-3 overflow-hidden transition hover:border-emerald-500/60"
      title="HD Scientific Graphic: Bada karke dekhiye (Click to Zoom)"
    >
      <div class="w-full max-h-[380px] object-contain flex items-center justify-center">
        ${svgContent}
      </div>
      <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition flex items-center justify-center pointer-events-none">
        <span class="bg-black/85 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-lg border border-emerald-500/50 shadow-xl backdrop-blur-xs flex items-center gap-1.5 group-hover:scale-105 transition-transform">
          <span class="text-emerald-400">🔍</span>
          <span>HD ${sci.domain ? sci.domain.split('/')[0].trim() : 'Scientific'} Diagram • Click to Zoom</span>
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
 * Multi-tier Error Handler for Scientific Images (Fallback to dynamic SVG).
 */
function handleScientificImageError(img) {
  if (!img) return;
  img.onerror = null;
  const type = img.dataset.type || 'embryology';
  const parent = img.parentElement;
  if (parent) {
    parent.innerHTML = `
      <div class="w-full flex flex-col items-center justify-center p-2">
        ${generateScientificDiagramSvg(type)}
      </div>
    `;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Interactive Full-Color High-Resolution Dynamic Modal.
 * Dynamically binds to active episode's scientific_insights and diagram.
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
      ${generateScientificDiagramSvg(diagramType)}
    </div>
  `;

  modal.innerHTML = `
    <div class="bg-slate-950 text-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-emerald-500/30 max-h-[92vh] overflow-y-auto" onclick="event.stopPropagation()">
      <!-- Modal Top Bar -->
      <div class="flex items-start justify-between border-b border-slate-800 pb-3 gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
              <span>${icon}</span>
              <span>${domain}</span>
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

      <!-- High-Resolution Episode-Specific Colored Visual -->
      ${visualElementHtml}

      <!-- Detailed Caption, Domain Badge & Scientific Source Attribution -->
      <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
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
        </div>
        <p class="text-[11px] text-slate-400 italic pt-1">
          <strong class="text-slate-300">Scientific Attribution:</strong> ${sciSource}
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
