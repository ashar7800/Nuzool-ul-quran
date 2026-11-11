# -*- coding: utf-8 -*-
"""
Generate High-Resolution Original Coloured Scientific Reference Visual Assets
for Nuzool-ul-Quran Portal in assets/scientific_diagrams/
"""

import os

os.makedirs('assets/scientific_diagrams', exist_ok=True)

# 1. Embryo Implantation & 'Alaqah Comparison (Surah 96: Al-Alaq)
svg_embryology = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070b14"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0a101f"/>
    </linearGradient>
    <linearGradient id="endoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#881337"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>
    <radialGradient id="vesselGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#be123c" stop-opacity="0.2"/>
    </radialGradient>
    <linearGradient id="embryoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="80%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="leechGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="40%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="900" height="520" fill="url(#bgGrad)"/>
  
  <!-- Subtle Grid Overlay -->
  <g stroke="#1e293b" stroke-width="0.75" opacity="0.4">
    <line x1="0" y1="60" x2="900" y2="60"/>
    <line x1="0" y1="460" x2="900" y2="460"/>
    <line x1="450" y1="60" x2="450" y2="460"/>
    <line x1="0" y1="160" x2="900" y2="160"/>
    <line x1="0" y1="260" x2="900" y2="260"/>
    <line x1="0" y1="360" x2="900" y2="360"/>
  </g>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="160" height="28" rx="6" fill="#047857"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">🧬 CLINICAL EMBRYOLOGY</text>
  <text x="200" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700">HUMAN EMBRYO AT 24–28 DAYS vs. 'ALAQAH (LEECH-LIKE CLINGING ENTITY)</text>
  <text x="875" y="35" fill="#34d399" font-family="'Amiri', serif" font-size="18" font-weight="bold" text-anchor="end">خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ (العلق: ۲)</text>

  <!-- LEFT PANEL: Carnegie Stage 11-12 Embryo Implantation in Uterine Wall -->
  <g transform="translate(30, 75)">
    <!-- Section Title -->
    <rect x="0" y="0" width="395" height="28" rx="6" fill="#1e293b"/>
    <text x="12" y="18" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="bold">STAGE 1: BLASTOCYST IMPLANTATION & MATERNAL BLOOD SIPHON</text>

    <!-- Uterine Endometrial Wall -->
    <path d="M 0 38 Q 120 28 240 38 T 395 38 L 395 140 Q 200 130 0 140 Z" fill="url(#endoGrad)"/>
    <text x="12" y="58" fill="#fda4af" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600">Maternal Endometrium Wall (رحم کی دیوار)</text>

    <!-- Maternal Capillaries & Sinusoids -->
    <circle cx="80" cy="95" r="14" fill="url(#vesselGlow)"/>
    <circle cx="160" cy="85" r="18" fill="url(#vesselGlow)"/>
    <circle cx="280" cy="90" r="16" fill="url(#vesselGlow)"/>
    <circle cx="340" cy="100" r="12" fill="url(#vesselGlow)"/>
    <path d="M 60 95 Q 80 115 110 95 T 160 85 T 210 100 T 280 90 T 350 105" fill="none" stroke="#f43f5e" stroke-width="3" stroke-linecap="round"/>
    <text x="120" y="125" fill="#fecdd3" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-style="italic">Maternal Sinusoids / Blood Lacunae (خون کے تالاب)</text>

    <!-- Syncytiotrophoblast Villi Invasive Anchoring Rootlets -->
    <g stroke="#f59e0b" stroke-width="2.5" opacity="0.9">
      <path d="M 170 135 L 160 170 Q 150 185 165 200"/>
      <path d="M 195 135 L 195 175 Q 195 190 205 200"/>
      <path d="M 220 135 L 230 168 Q 240 185 225 200"/>
    </g>
    <text x="110" y="165" fill="#fbbf24" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="bold">Trophoblast Villi (چمٹنے والے ریشے)</text>

    <!-- Suspended Embryo (Carnegie Stage 11, ~24 Days) -->
    <!-- Connecting stalk -->
    <path d="M 185 190 L 185 240" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
    <text x="75" y="225" fill="#fef08a" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="bold">Connecting Stalk (حبل السری کی بنیاد) ➔</text>

    <!-- Embryo Body C-Shape Curve -->
    <path d="M 185 240 C 130 250, 120 320, 170 345 C 220 365, 235 320, 215 285 C 205 265, 215 245, 185 240 Z" fill="url(#embryoGrad)" stroke="#fef08a" stroke-width="1.5" filter="url(#glow)"/>

    <!-- Neural Tube & Brain Vesicle Prominence -->
    <circle cx="165" cy="260" r="16" fill="#fef08a" opacity="0.9"/>
    <text x="40" y="265" fill="#93c5fd" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="bold">Brain Prominence ➔</text>

    <!-- Somites (Segmented Blocks along Dorsal axis) -->
    <g fill="#78350f" stroke="#fef3c7" stroke-width="1">
      <rect x="138" y="280" width="8" height="5" rx="1.5"/>
      <rect x="140" y="290" width="8" height="5" rx="1.5"/>
      <rect x="144" y="300" width="8" height="5" rx="1.5"/>
      <rect x="150" y="310" width="8" height="5" rx="1.5"/>
      <rect x="160" y="320" width="8" height="5" rx="1.5"/>
      <rect x="172" y="326" width="8" height="5" rx="1.5"/>
      <rect x="185" y="326" width="8" height="5" rx="1.5"/>
      <rect x="198" y="320" width="8" height="5" rx="1.5"/>
    </g>
    <text x="35" y="305" fill="#fef08a" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="bold">Somites (سومائٹس / لوتھڑا) ➔</text>

    <!-- Heart Primordium Bulge -->
    <ellipse cx="178" cy="285" rx="12" ry="10" fill="#dc2626" opacity="0.9"/>
    <circle cx="178" cy="285" r="5" fill="#ef4444"/>
    <text x="200" y="285" fill="#fca5a5" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="bold">⬅ Primitive Heart Tube</text>

    <!-- Dimensions & Carnegie Callout -->
    <rect x="15" y="345" width="365" height="26" rx="4" fill="#0f172a" stroke="#334155"/>
    <text x="25" y="362" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Carnegie Stage 11–12 • Length: 2.5–3.5 mm • Age: 24–26 Postovulatory Days</text>
  </g>

  <!-- RIGHT PANEL: Microscopic Morphological Comparison with Leech ('Alaqah) -->
  <g transform="translate(475, 75)">
    <!-- Section Title -->
    <rect x="0" y="0" width="395" height="28" rx="6" fill="#1e293b"/>
    <text x="12" y="18" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="bold">STAGE 2: MORPHOLOGICAL IDENTITY: EMBRYO vs. LEECH ('ALAQAH)</text>

    <!-- Comparison Container Frame -->
    <rect x="0" y="38" width="395" height="335" rx="8" fill="#090d16" stroke="#1e293b" stroke-width="1.5"/>

    <!-- Top Label: 24-Day Human Embryo Profile -->
    <rect x="15" y="50" width="175" height="22" rx="4" fill="#854d0e" opacity="0.4"/>
    <text x="25" y="65" fill="#fef08a" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">Human Embryo (24 Days)</text>

    <!-- Embryo Silhouette Profile -->
    <path d="M 60 110 C 30 140, 40 220, 80 240 C 130 260, 160 210, 130 160 C 110 130, 90 90, 60 110 Z" fill="url(#embryoGrad)" stroke="#fef08a" stroke-width="2"/>
    <!-- Somite ridges -->
    <g stroke="#78350f" stroke-width="2">
      <line x1="50" y1="150" x2="62" y2="152"/>
      <line x1="53" y1="165" x2="66" y2="167"/>
      <line x1="58" y1="180" x2="72" y2="182"/>
      <line x1="68" y1="195" x2="82" y2="195"/>
      <line x1="82" y1="210" x2="95" y2="208"/>
      <line x1="100" y1="220" x2="112" y2="216"/>
    </g>

    <!-- VS Divider -->
    <circle cx="195" cy="180" r="16" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
    <text x="195" y="185" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900" text-anchor="middle">VS</text>

    <!-- Right Label: Freshwater Leech (Hirudo Medicinalis) -->
    <rect x="215" y="50" width="165" height="22" rx="4" fill="#065f46" opacity="0.4"/>
    <text x="225" y="65" fill="#a7f3d0" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">Leech / عَلَقٍ (Hirudo)</text>

    <!-- Freshwater Leech Anatomy -->
    <path d="M 330 100 C 365 130, 360 220, 310 245 C 260 270, 240 210, 270 160 C 290 125, 310 80, 330 100 Z" fill="url(#leechGrad)" stroke="#34d399" stroke-width="2"/>
    <!-- Leech metameric annuli / segments -->
    <g stroke="#064e3b" stroke-width="2">
      <line x1="335" y1="140" x2="350" y2="145"/>
      <line x1="330" y1="155" x2="353" y2="160"/>
      <line x1="320" y1="170" x2="352" y2="175"/>
      <line x1="305" y1="185" x2="345" y2="190"/>
      <line x1="290" y1="200" x2="330" y2="205"/>
      <line x1="275" y1="215" x2="310" y2="220"/>
    </g>
    <!-- Posterior sucker attachment -->
    <ellipse cx="295" cy="245" rx="14" ry="9" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
    <text x="245" y="270" fill="#6ee7b7" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="600">Posterior Sucker (چمٹنے والا حصہ)</text>

    <!-- 3 Core Tripartite Linguistic / Anatomical Meanings of 'Alaqah' -->
    <rect x="15" y="285" width="365" height="75" rx="6" fill="#0f172a" stroke="#334155"/>
    <text x="25" y="302" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">TRIPARTITE ANATOMICAL ACCURACY OF 'ALAQAH' (عَلَق):</text>
    <text x="25" y="318" fill="#e2e8f0" font-family="'Plus Jakarta Sans', sans-serif" font-size="9">1. <tspan fill="#fbbf24" font-weight="bold">Leech-like Shape:</tspan> Identical dorsal curvature, body segment annuli, and head bulb.</text>
    <text x="25" y="332" fill="#e2e8f0" font-family="'Plus Jakarta Sans', sans-serif" font-size="9">2. <tspan fill="#34d399" font-weight="bold">Clinging / Suspended:</tspan> Firmly anchored to the uterine wall via the connecting stalk.</text>
    <text x="25" y="346" fill="#e2e8f0" font-family="'Plus Jakarta Sans', sans-serif" font-size="9">3. <tspan fill="#f43f5e" font-weight="bold">Blood Clot / Siphon:</tspan> Internal cardiovascular tubules filled with stagnant maternal blood.</text>
  </g>

  <!-- Bottom Academic Citation & Credit Bar -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & CLINICAL CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Prof. Keith L. Moore, B.A., M.Sc., Ph.D., F.I.A.C., F.A.A.A. — "The Developing Human: Clinically Oriented Embryology", 8th Edition (Saunders/Elsevier).</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series • Labeled Anatomical Reference</text>
</svg>'''

with open('assets/scientific_diagrams/embryo_implantation_alaq.svg', 'w', encoding='utf-8') as f:
    f.write(svg_embryology)
print("Created assets/scientific_diagrams/embryo_implantation_alaq.svg")

# 2. Cosmic Singularity Big Bang & Water Cytology (Surah 21: Al-Anbiya 21:30)
svg_cosmology = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="bgCosmo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="singularityGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="15%" stop-color="#fbbf24"/>
      <stop offset="40%" stop-color="#f97316"/>
      <stop offset="70%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="waterGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="60%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </radialGradient>
  </defs>

  <rect width="900" height="520" fill="url(#bgCosmo)"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="165" height="28" rx="6" fill="#4338ca"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">🌌 COSMOLOGY & CYTOLOGY</text>
  <text x="205" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">COSMIC SINGULARITY SEPARATION (BIG BANG) & AQUEOUS CELLULAR LIFE</text>
  <text x="875" y="35" fill="#818cf8" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">رَتْقًا فَفَتَقْنَاهُمَا وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ (الأنبیاء: ۳۰)</text>

  <!-- Left: Cosmic Singularity Split (Ratqan Fa-Fataqnahuma) -->
  <g transform="translate(30, 75)">
    <rect x="0" y="0" width="410" height="28" rx="6" fill="#1e293b"/>
    <text x="12" y="18" fill="#fbbf24" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="bold">1. COSMIC SINGULARITY EXPANSION (رَتْقًا فَفَتَقْنَاهُمَا)</text>

    <rect x="0" y="38" width="410" height="335" rx="8" fill="#030712" stroke="#1e293b"/>

    <!-- Central Singularity Core -->
    <circle cx="80" cy="190" r="50" fill="url(#singularityGlow)"/>
    <circle cx="80" cy="190" r="12" fill="#ffffff"/>
    <text x="35" y="260" fill="#fde68a" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">Singularity (رَتْقًا / Unified State)</text>

    <!-- Expansion Jets & Particle Tracks -->
    <path d="M 80 190 Q 180 110 320 80" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,2"/>
    <path d="M 80 190 Q 200 160 360 140" stroke="#ec4899" stroke-width="2"/>
    <path d="M 80 190 Q 220 220 380 230" stroke="#818cf8" stroke-width="2.5"/>
    <path d="M 80 190 Q 180 270 340 310" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,2"/>

    <!-- Emerging Galaxies & CMB Radiations -->
    <ellipse cx="280" cy="95" rx="22" ry="11" fill="#c084fc" transform="rotate(35 280 95)"/>
    <ellipse cx="340" cy="150" rx="26" ry="12" fill="#818cf8" transform="rotate(-25 340 150)"/>
    <ellipse cx="320" cy="245" rx="24" ry="10" fill="#38bdf8" transform="rotate(40 320 245)"/>
    <ellipse cx="270" cy="315" rx="20" ry="9" fill="#f43f5e" transform="rotate(-30 270 315)"/>

    <text x="210" y="350" fill="#e2e8f0" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">13.8 Billion Year Expansion Timeline ➔</text>
  </g>

  <!-- Right: Cellular Aqueous Cytology (Kulla Shay'in Hayy) -->
  <g transform="translate(460, 75)">
    <rect x="0" y="0" width="410" height="28" rx="6" fill="#1e293b"/>
    <text x="12" y="18" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="bold">2. AQUEOUS ORIGIN OF ALL CELLULAR LIFE (مِنَ الْمَاءِ حَيٍّ)</text>

    <rect x="0" y="38" width="410" height="335" rx="8" fill="#030712" stroke="#1e293b"/>

    <!-- Living Biological Cell Anatomy -->
    <ellipse cx="205" cy="180" rx="140" ry="115" fill="#082f49" stroke="#38bdf8" stroke-width="2.5"/>
    <text x="110" y="85" fill="#bae6fd" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold">Cell Membrane & Cytoplasm (سائٹوپلازم)</text>

    <!-- Nucleus -->
    <ellipse cx="205" cy="180" rx="45" ry="38" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
    <text x="180" y="185" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">Nucleus (مرکزہ)</text>

    <!-- Water H2O Molecules Grid in Cytosol -->
    <g fill="#38bdf8">
      <circle cx="120" cy="130" r="10" fill="url(#waterGlow)"/>
      <circle cx="110" cy="120" r="5" fill="#e0f2fe"/>
      <circle cx="130" cy="120" r="5" fill="#e0f2fe"/>

      <circle cx="280" cy="140" r="10" fill="url(#waterGlow)"/>
      <circle cx="270" cy="130" r="5" fill="#e0f2fe"/>
      <circle cx="290" cy="130" r="5" fill="#e0f2fe"/>

      <circle cx="130" cy="230" r="10" fill="url(#waterGlow)"/>
      <circle cx="120" cy="220" r="5" fill="#e0f2fe"/>
      <circle cx="140" cy="220" r="5" fill="#e0f2fe"/>

      <circle cx="275" cy="225" r="10" fill="url(#waterGlow)"/>
      <circle cx="265" cy="215" r="5" fill="#e0f2fe"/>
      <circle cx="285" cy="215" r="5" fill="#e0f2fe"/>
    </g>

    <!-- Protoplasm Ratio Badge -->
    <rect x="35" y="305" width="340" height="48" rx="6" fill="#0c4a6e" stroke="#0284c7"/>
    <text x="45" y="324" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">CYTOLOGICAL FACT: 70% – 85% of Active Cytosol is Water (H₂O)</text>
    <text x="45" y="340" fill="#bae6fd" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Every metabolic process and genetic replication strictly requires water solvent.</text>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Stephen Hawking & Roger Penrose (Singularity Theorems) • Alberts et al., "Molecular Biology of the Cell" (Garland Science).</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/cosmic_singularity_bigbang.svg', 'w', encoding='utf-8') as f:
    f.write(svg_cosmology)
print("Created assets/scientific_diagrams/cosmic_singularity_bigbang.svg")

# 3. Expanding Universe (Surah 51: Az-Zariyat 51:47)
svg_astrophysics = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="astroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="spectrumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="25%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#22c55e"/>
      <stop offset="75%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  </defs>

  <rect width="900" height="520" fill="url(#astroBg)"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="180" height="28" rx="6" fill="#0284c7"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">🔭 RELATIVISTIC ASTROPHYSICS</text>
  <text x="215" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">CONTINUOUS ACCELERATED METRIC EXPANSION OF THE UNIVERSE</text>
  <text x="875" y="35" fill="#38bdf8" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ (الذاریات: ۴۷)</text>

  <!-- Left: Metric Expansion Grid -->
  <g transform="translate(30, 75)">
    <rect x="0" y="0" width="410" height="28" rx="6" fill="#1e293b"/>
    <text x="12" y="18" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="bold">1. SPACETIME METRIC EXPANSION (وَإِنَّا لَمُوسِعُونَ)</text>

    <rect x="0" y="38" width="410" height="335" rx="8" fill="#030712" stroke="#1e293b"/>

    <!-- Grid Lines expanding outwards -->
    <g stroke="#334155" stroke-width="1" opacity="0.8">
      <path d="M 60 80 Q 205 100 350 80"/>
      <path d="M 40 140 Q 205 160 370 140"/>
      <path d="M 25 210 Q 205 230 385 210"/>
      <path d="M 15 280 Q 205 300 395 280"/>
      <path d="M 80 60 Q 60 205 80 340"/>
      <path d="M 160 60 Q 150 205 160 340"/>
      <path d="M 250 60 Q 260 205 250 340"/>
      <path d="M 330 60 Q 350 205 330 340"/>
    </g>

    <!-- Galaxies separating away from each other -->
    <circle cx="160" cy="140" r="14" fill="#6366f1"/>
    <circle cx="260" cy="140" r="18" fill="#ec4899"/>
    <circle cx="160" cy="230" r="16" fill="#3b82f6"/>
    <circle cx="260" cy="230" r="22" fill="#f59e0b"/>

    <!-- Expansion Velocity Vectors -->
    <g stroke="#ef4444" stroke-width="3" stroke-linecap="round">
      <line x1="140" y1="130" x2="105" y2="105"/>
      <line x1="280" y1="130" x2="320" y2="105"/>
      <line x1="140" y1="240" x2="105" y2="270"/>
      <line x1="285" y1="245" x2="330" y2="280"/>
    </g>
    <text x="80" y="360" fill="#fca5a5" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">Hubble's Law: Recession Velocity v = H₀ × d</text>
  </g>

  <!-- Right: Cosmological Redshift Spectrum -->
  <g transform="translate(460, 75)">
    <rect x="0" y="0" width="410" height="28" rx="6" fill="#1e293b"/>
    <text x="12" y="18" fill="#f43f5e" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="bold">2. OBSERVATIONAL PROOF: COSMIC REDSHIFT</text>

    <rect x="0" y="38" width="410" height="335" rx="8" fill="#030712" stroke="#1e293b"/>

    <!-- Rest Spectrum (Laboratory Standard) -->
    <text x="25" y="70" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">Stationary Terrestrial Spectral Lines (Laboratory):</text>
    <rect x="25" y="80" width="360" height="36" rx="4" fill="url(#spectrumGrad)"/>
    <g stroke="#000000" stroke-width="3">
      <line x1="90" y1="80" x2="90" y2="116"/>
      <line x1="120" y1="80" x2="120" y2="116"/>
      <line x1="220" y1="80" x2="220" y2="116"/>
    </g>

    <!-- Redshifted Spectrum (Distant Galaxies) -->
    <text x="25" y="150" fill="#f87171" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">Redshifted Spectrum from Distant Receding Galaxies (z > 0):</text>
    <rect x="25" y="160" width="360" height="36" rx="4" fill="url(#spectrumGrad)"/>
    <g stroke="#000000" stroke-width="3">
      <!-- Shifted lines toward red -->
      <line x1="140" y1="160" x2="140" y2="196"/>
      <line x1="170" y1="160" x2="170" y2="196"/>
      <line x1="270" y1="160" x2="270" y2="196"/>
    </g>
    <!-- Shift Indicator Arrows -->
    <g stroke="#ef4444" stroke-width="2">
      <line x1="90" y1="120" x2="140" y2="155"/>
      <line x1="120" y1="120" x2="170" y2="155"/>
      <line x1="220" y1="120" x2="270" y2="155"/>
    </g>
    <text x="280" y="225" fill="#fca5a5" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">Redshift (Δλ / λ)</text>

    <!-- Nobel Prize Callout -->
    <rect x="20" y="245" width="370" height="110" rx="6" fill="#1e1b4b" stroke="#4338ca"/>
    <text x="32" y="268" fill="#fde047" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">2011 NOBEL PRIZE IN PHYSICS (ACCELERATING EXPANSION):</text>
    <text x="32" y="288" fill="#e2e8f0" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Observations of Type Ia Supernovae confirmed that the universe is not only</text>
    <text x="32" y="303" fill="#e2e8f0" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">expanding, but its expansion rate is continually accelerating driven by Dark Energy.</text>
    <text x="32" y="335" fill="#a5b4fc" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-style="italic">Exact Arabic Active Participle: 'وَإِنَّا لَمُوسِعُونَ' (We are indeed continuously expanding it).</text>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Edwin Hubble (1929, PNAS) • Perlmutter, Schmidt, &amp; Riess (Nobel Prize in Physics 2011) • NASA WMAP &amp; Planck Mission.</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/cosmic_expansion_hubble.svg', 'w', encoding='utf-8') as f:
    f.write(svg_astrophysics)
print("Created assets/scientific_diagrams/cosmic_expansion_hubble.svg")

# 4. Sequential Carnegie Morphogenesis (Surah 23: Al-Mu'minun 23:12-14)
svg_carnegie = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
  </defs>

  <rect width="900" height="520" fill="url(#cGrad)"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="180" height="28" rx="6" fill="#059669"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">🧬 DEVELOPMENTAL BIOLOGY</text>
  <text x="215" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">CARNEGIE STAGES: NUTFAH ➔ 'ALAQAH ➔ MUDGHAH ➔ BONE &amp; FLESH</text>
  <text x="875" y="35" fill="#34d399" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً فَخَلَقْنَا الْعَلَقَةَ مُضْغَةً (المؤمنون: ۱۴)</text>

  <!-- 4 Sequential Stages Display -->
  <g transform="translate(30, 80)">
    <!-- Stage 1: Nutfah Amshaj -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="195" height="340" rx="8" fill="#030712" stroke="#1e293b"/>
      <rect x="10" y="10" width="175" height="24" rx="4" fill="#0369a1"/>
      <text x="18" y="26" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">1. NUTFAH (نُطْفَةً)</text>
      <!-- Zygote & Morula graphic -->
      <circle cx="97" cy="120" r="45" fill="#0284c7" opacity="0.2" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="85" cy="110" r="16" fill="#38bdf8"/>
      <circle cx="110" cy="110" r="16" fill="#38bdf8"/>
      <circle cx="97" cy="135" r="16" fill="#38bdf8"/>
      <text x="30" y="195" fill="#bae6fd" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="bold">Zygote &amp; Morula (Day 1-4)</text>
      <text x="15" y="225" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9">Fertilized ovum with complete 46-chromosome diploid genome determining biological sex and traits.</text>
    </g>

    <!-- Stage 2: 'Alaqah -->
    <g transform="translate(215, 0)">
      <rect x="0" y="0" width="195" height="340" rx="8" fill="#030712" stroke="#1e293b"/>
      <rect x="10" y="10" width="175" height="24" rx="4" fill="#b45309"/>
      <text x="18" y="26" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">2. 'ALAQAH (عَلَقَةً)</text>
      <!-- Leech-like embryo -->
      <path d="M 97 75 C 65 95, 65 155, 97 165 C 130 170, 130 115, 110 85 Z" fill="#d97706" stroke="#fde047" stroke-width="2"/>
      <text x="25" y="195" fill="#fde68a" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="bold">Leech-like Entity (Day 15-24)</text>
      <text x="15" y="225" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9">Suspended in gestational sac, clinging to endometrium, primitive cardiovascular heart tube beating.</text>
    </g>

    <!-- Stage 3: Mudghah -->
    <g transform="translate(430, 0)">
      <rect x="0" y="0" width="195" height="340" rx="8" fill="#030712" stroke="#1e293b"/>
      <rect x="10" y="10" width="175" height="24" rx="4" fill="#9333ea"/>
      <text x="18" y="26" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">3. MUDGHAH (مُضْغَةً)</text>
      <!-- Chewed lump appearance with prominent somites -->
      <path d="M 97 75 C 55 95, 55 155, 97 165 C 140 170, 140 115, 115 80 Z" fill="#7e22ce" stroke="#d8b4fe" stroke-width="2"/>
      <g fill="#fae8ff" stroke="#581c87" stroke-width="1">
        <circle cx="78" cy="110" r="5"/>
        <circle cx="82" cy="122" r="5"/>
        <circle cx="88" cy="134" r="5"/>
        <circle cx="98" cy="144" r="5"/>
      </g>
      <text x="18" y="195" fill="#e9d5ff" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="bold">Somite-Segmented (Day 24-32)</text>
      <text x="15" y="225" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9">Microscopic somites resemble distinctive dental teeth impressions on chewed gum or flesh.</text>
    </g>

    <!-- Stage 4: Bone & Flesh -->
    <g transform="translate(645, 0)">
      <rect x="0" y="0" width="195" height="340" rx="8" fill="#030712" stroke="#1e293b"/>
      <rect x="10" y="10" width="175" height="24" rx="4" fill="#e11d48"/>
      <text x="18" y="26" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">4. 'IZAM &amp; LAHM (عِظَامًا وَلَحْمًا)</text>
      <!-- Skeleton clothed in muscle tissue -->
      <ellipse cx="97" cy="120" rx="35" ry="45" fill="#be123c" stroke="#fecdd3" stroke-width="1.5"/>
      <line x1="97" y1="90" x2="97" y2="150" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
      <text x="15" y="195" fill="#fecdd3" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="bold">Osteo &amp; Myogenesis (Wk 7-8+)</text>
      <text x="15" y="225" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9">Primary cartilaginous bone models differentiate first, subsequently surrounded by myoblast muscular sheets.</text>
    </g>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Carnegie Institution of Washington (Human Embryo Stages 1-23) • Prof. T.V.N. Persaud &amp; Prof. Keith Moore (Saunders).</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/embryonic_carnegie_stages.svg', 'w', encoding='utf-8') as f:
    f.write(svg_carnegie)
print("Created assets/scientific_diagrams/embryonic_carnegie_stages.svg")

# 5. Halocline Ocean Barrier (Surah 25: Al-Furqan 25:53 & 55:19-20)
svg_halocline = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="medGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
    <linearGradient id="atlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>

  <rect width="900" height="520" fill="#090d16"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="165" height="28" rx="6" fill="#0284c7"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">🌊 PHYSICAL OCEANOGRAPHY</text>
  <text x="200" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">HALOCLINE &amp; PYCNOCLINE BARRIER BETWEEN CONFLUENT SEAS</text>
  <text x="875" y="35" fill="#38bdf8" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ بَيْنَهُمَا بَرْزَخٌ لَّا يَبْغِيَانِ (الرحمن: ۱۹-۲۰)</text>

  <!-- Cross-sectional Ocean Basin Diagram -->
  <g transform="translate(40, 80)">
    <rect x="0" y="0" width="820" height="340" rx="10" fill="#030712" stroke="#1e293b"/>

    <!-- Left Sea (Mediterranean Sea: Salinity 38.5‰, Density 1.028 g/cm³) -->
    <path d="M 0 50 L 410 80 L 410 340 L 0 340 Z" fill="url(#medGrad)"/>
    <text x="30" y="85" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold">MEDITERRANEAN SEA WATER MASS</text>
    <text x="30" y="105" fill="#bae6fd" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Salinity: 38.5 ‰ • High Density: 1.028 g/cm³ • Warmer Saline Core</text>

    <!-- Right Sea (Atlantic Ocean: Salinity 35.5‰, Density 1.026 g/cm³) -->
    <path d="M 410 80 L 820 50 L 820 340 L 410 340 Z" fill="url(#atlGrad)"/>
    <text x="450" y="85" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold">ATLANTIC OCEAN WATER MASS</text>
    <text x="450" y="105" fill="#a7f3d0" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Salinity: 35.5 ‰ • Lower Density: 1.026 g/cm³ • Fresher Inflow</text>

    <!-- The Barrier / Pycnocline Front (بَرْزَخٌ) -->
    <line x1="410" y1="50" x2="410" y2="340" stroke="#facc15" stroke-width="4" stroke-dasharray="8,4"/>
    <rect x="330" y="180" width="160" height="36" rx="6" fill="#ca8a04" stroke="#fef08a" stroke-width="1.5"/>
    <text x="410" y="202" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">بَرْزَخٌ (BARRIER FRONT)</text>

    <text x="410" y="240" fill="#fef08a" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold" text-anchor="middle">Thermodynamic Hydrostatic Equilibrium Prevents Total Mixing</text>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Dr. William Hay (University of Colorado) • Pickard &amp; Emery, "Descriptive Physical Oceanography" (Pergamon Press).</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/halocline_marine_barrier.svg', 'w', encoding='utf-8') as f:
    f.write(svg_halocline)
print("Created assets/scientific_diagrams/halocline_marine_barrier.svg")

# 6. Mountain Roots Isostasy (Surah 78: An-Naba 78:6-7)
svg_geology = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="geoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="crustGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78716c"/>
      <stop offset="100%" stop-color="#44403c"/>
    </linearGradient>
    <linearGradient id="mantleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>

  <rect width="900" height="520" fill="url(#geoBg)"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="165" height="28" rx="6" fill="#b45309"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">🌍 GEOPHYSICS &amp; TECTONICS</text>
  <text x="200" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">CONTINENTAL CRUST ISOSTASY &amp; DEEP MOUNTAIN ROOTS (أَوْتَادًا)</text>
  <text x="875" y="35" fill="#fde047" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">وَالْجِبَالَ أَوْتَادًا (النبأ: ۷)</text>

  <!-- Cross-sectional Crust & Mantle Peg Diagram -->
  <g transform="translate(40, 80)">
    <rect x="0" y="0" width="820" height="340" rx="10" fill="#030712" stroke="#1e293b"/>

    <!-- Mantle Asthenosphere Base (Dense Liquid Magma Layer) -->
    <rect x="0" y="160" width="820" height="180" fill="url(#mantleGrad)"/>
    <text x="25" y="315" fill="#fde68a" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold">Upper Mantle / Asthenosphere (کثیف میگما کی پرت)</text>

    <!-- Continental Crust Baseline -->
    <rect x="0" y="100" width="820" height="60" fill="url(#crustGrad)"/>
    <text x="25" y="125" fill="#f5f5f4" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">Standard Continental Crust (قشرِ ارض ~35 km)</text>

    <!-- Mountain Peak (Surface Elevation ~5 km) -->
    <polygon points="320,100 410,25 500,100" fill="#a8a29e" stroke="#f5f5f4" stroke-width="2"/>
    <text x="410" y="55" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Mountain Peak (+5 km)</text>

    <!-- Deep Peg-like Root Penetrating into Dense Mantle (10-15x Deeper: ~65 km) -->
    <polygon points="320,160 410,310 500,160" fill="#57534e" stroke="#eab308" stroke-width="2.5"/>
    <text x="410" y="235" fill="#fef08a" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">أَوْتَادًا (STABILIZING PEG ROOT)</text>
    <text x="410" y="255" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" text-anchor="middle">Deep Lithospheric Root (~65 km Depth)</text>

    <!-- Airy-Heiskanen Balance Arrows -->
    <g stroke="#38bdf8" stroke-width="3" stroke-linecap="round">
      <line x1="390" y1="315" x2="390" y2="280"/>
      <line x1="430" y1="315" x2="430" y2="280"/>
    </g>
    <text x="525" y="280" fill="#7dd3fc" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">Isostatic Buoyant Force ➔</text>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Sir George Biddell Airy (Isostasy Theory) • Dr. Frank Press (Former President, US National Academy of Sciences - "Earth").</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/mountain_roots_isostasy.svg', 'w', encoding='utf-8') as f:
    f.write(svg_geology)
print("Created assets/scientific_diagrams/mountain_roots_isostasy.svg")

# 7. Supernova Iron Nucleosynthesis (Surah 57: Al-Hadid 57:25)
svg_iron = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="ironBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
    <radialGradient id="novaBurst" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="900" height="520" fill="url(#ironBg)"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="170" height="28" rx="6" fill="#dc2626"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">☄️ NUCLEAR ASTROPHYSICS</text>
  <text x="205" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">EXTRATERRESTRIAL SUPERNOVA ORIGIN OF IRON-56 (وَأَنزَلْنَا الْحَدِيدَ)</text>
  <text x="875" y="35" fill="#fca5a5" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">وَأَنزَلْنَا الْحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ (الحدید: ۲۵)</text>

  <!-- Supernova Core & Meteoritic Delivery -->
  <g transform="translate(40, 80)">
    <rect x="0" y="0" width="820" height="340" rx="10" fill="#030712" stroke="#1e293b"/>

    <!-- Massive Supergiant Stellar Onion Shells -->
    <g transform="translate(200, 170)">
      <circle cx="0" cy="0" r="140" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <text x="0" y="-145" fill="#60a5fa" font-size="9" text-anchor="middle">Hydrogen / Helium Outer Envelope</text>
      <circle cx="0" cy="0" r="105" fill="none" stroke="#22c55e" stroke-width="2"/>
      <circle cx="0" cy="0" r="75" fill="none" stroke="#eab308" stroke-width="2"/>
      <circle cx="0" cy="0" r="50" fill="none" stroke="#f97316" stroke-width="2"/>
      <!-- Iron Core -->
      <circle cx="0" cy="0" r="30" fill="#ef4444" stroke="#ffffff" stroke-width="2.5"/>
      <text x="0" y="4" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">⁵⁶Fe CORE</text>
      <text x="0" y="16" fill="#fecdd3" font-size="8" text-anchor="middle">T &gt; 3×10⁹ K</text>
    </g>

    <!-- Supernova Explosion & Meteorite to Terrestrial Surface -->
    <g transform="translate(480, 50)">
      <rect x="0" y="0" width="315" height="260" rx="8" fill="#0f172a" stroke="#334155"/>
      <text x="15" y="25" fill="#f87171" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold">EXTRATERRESTRIAL DESCENT TO EARTH</text>
      <!-- Meteoroid trail -->
      <path d="M 280 40 L 80 180" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
      <circle cx="75" cy="185" r="18" fill="#71717a" stroke="#ef4444" stroke-width="2"/>
      <text x="15" y="225" fill="#fde047" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">Iron Cannot Synthesize on Earth</text>
      <text x="15" y="245" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Binding energy barrier requires a supernova cataclysm.</text>
    </g>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Hans Bethe (Nobel Prize in Physics) • Fred Hoyle (Stellar Nucleosynthesis) • NASA Goddard Space Flight Center.</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/supernova_iron_nucleosynthesis.svg', 'w', encoding='utf-8') as f:
    f.write(svg_iron)
print("Created assets/scientific_diagrams/supernova_iron_nucleosynthesis.svg")

# 8. High-Altitude Hypoxia (Surah 6: Al-An'am 6:125)
svg_hypoxia = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="hypoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>
  </defs>

  <rect width="900" height="520" fill="url(#hypoBg)"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="180" height="28" rx="6" fill="#0284c7"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">✈️ AEROSPACE PHYSIOLOGY</text>
  <text x="215" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">HIGH-ALTITUDE HYPOXIA &amp; THORACIC CONSTRICTION (يَصَّعَّدُ فِي السَّمَاءِ)</text>
  <text x="875" y="35" fill="#7dd3fc" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">يَجْعَلْ صَدْرَهُ ضَيِّقًا حَرَجًا كَأَنَّمَا يَصَّعَّدُ فِي السَّمَاءِ (الأنعام: ۱۲۵)</text>

  <!-- Atmospheric Pressure Fall vs Alveolar Oxygen Saturation -->
  <g transform="translate(40, 80)">
    <rect x="0" y="0" width="820" height="340" rx="10" fill="#030712" stroke="#1e293b"/>

    <!-- Left: Atmospheric Barometric Pressure Curve -->
    <g transform="translate(40, 30)">
      <text x="0" y="20" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">ALTITUDE vs. ATMOSPHERIC PRESSURE (mmHg)</text>
      <!-- Axes -->
      <line x1="40" y1="240" x2="320" y2="240" stroke="#64748b" stroke-width="2"/>
      <line x1="40" y1="40" x2="40" y2="240" stroke="#64748b" stroke-width="2"/>
      <!-- Curve -->
      <path d="M 40 60 Q 120 180 320 230" fill="none" stroke="#f43f5e" stroke-width="3.5"/>
      <circle cx="40" cy="60" r="6" fill="#38bdf8"/>
      <text x="50" y="65" fill="#ffffff" font-size="9.5">Sea Level (760 mmHg)</text>
      <circle cx="240" cy="210" r="6" fill="#ef4444"/>
      <text x="250" y="205" fill="#fca5a5" font-size="9.5" font-weight="bold">8,000m Death Zone (250 mmHg)</text>
    </g>

    <!-- Right: Pulmonary Alveolar Compression -->
    <g transform="translate(450, 30)">
      <text x="0" y="20" fill="#f87171" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">ALVEOLAR DYSPNEA &amp; THORACIC TIGHTNESS</text>
      <rect x="0" y="35" width="330" height="235" rx="6" fill="#0f172a" stroke="#334155"/>
      <ellipse cx="165" cy="130" rx="65" ry="45" fill="#be123c" stroke="#f43f5e" stroke-width="2"/>
      <text x="165" y="135" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Collapsed Alveolus</text>
      <text x="15" y="220" fill="#fde047" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold">Severe Chest Constriction (ضَيِّقًا حَرَجًا)</text>
      <text x="15" y="240" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="9">Lack of oxygen partial pressure causes intense chest pain.</text>
    </g>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">FAA Civil Aerospace Medical Institute • Ernsting's Aviation Medicine (CRC Press).</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/high_altitude_hypoxia.svg', 'w', encoding='utf-8') as f:
    f.write(svg_hypoxia)
print("Created assets/scientific_diagrams/high_altitude_hypoxia.svg")

# 9. Pulsar / Neutron Star (Surah 86: At-Tariq 86:1-3)
svg_pulsar = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="pulsarBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>

  <rect width="900" height="520" fill="url(#pulsarBg)"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="180" height="28" rx="6" fill="#6366f1"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">🌟 RADIO ASTRONOMY</text>
  <text x="215" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">PULSARS &amp; NEUTRON STARS: THE PIERCING KNOCKER (النَّجْمُ الثَّاقِبُ)</text>
  <text x="875" y="35" fill="#a5b4fc" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">وَالسَّمَاءِ وَالطَّارِقِ النَّجْمُ الثَّاقِبُ (الطارق: ۱-۳)</text>

  <!-- Pulsar Rotating Beam Diagram -->
  <g transform="translate(40, 80)">
    <rect x="0" y="0" width="820" height="340" rx="10" fill="#030712" stroke="#1e293b"/>

    <!-- Rotating Neutron Star Core -->
    <g transform="translate(410, 170)">
      <!-- Relativistic Emission Cones -->
      <polygon points="0,0 -80,-140 80,-140" fill="#38bdf8" opacity="0.4"/>
      <polygon points="0,0 -80,140 80,140" fill="#38bdf8" opacity="0.4"/>
      <!-- Magnetic Field Lines -->
      <ellipse cx="0" cy="0" rx="110" ry="60" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="4,2"/>
      <ellipse cx="0" cy="0" rx="160" ry="90" fill="none" stroke="#818cf8" stroke-width="1" stroke-dasharray="4,2"/>
      <!-- Dense Core -->
      <circle cx="0" cy="0" r="28" fill="#ffffff" stroke="#60a5fa" stroke-width="3"/>
      <text x="0" y="5" fill="#0f172a" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="900" text-anchor="middle">NEUTRON</text>
    </g>

    <text x="410" y="45" fill="#e0f2fe" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Relativistic Jet: The Piercing Star (النَّجْمُ الثَّاقِبُ)</text>
    <text x="410" y="315" fill="#fde047" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Acoustic Knocking Waveform (الطَّارِقِ / The Knocker)</text>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Dame Jocelyn Bell Burnell &amp; Antony Hewish (Nobel Prize in Physics) • Max Planck Institute for Radio Astronomy.</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/pulsar_neutron_star.svg', 'w', encoding='utf-8') as f:
    f.write(svg_pulsar)
print("Created assets/scientific_diagrams/pulsar_neutron_star.svg")

# 10. Deep Ocean Internal Waves (Surah 24: An-Nur 24:40)
svg_internal_waves = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="100%" height="100%">
  <defs>
    <linearGradient id="oceanDepthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="25%" stop-color="#0284c7"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>

  <rect width="900" height="520" fill="#020617"/>

  <!-- Top Header Banner -->
  <rect x="0" y="0" width="900" height="55" fill="#030712" opacity="0.85"/>
  <rect x="25" y="14" width="180" height="28" rx="6" fill="#0369a1"/>
  <text x="35" y="32" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">🌊 MARINE GEOPHYSICS</text>
  <text x="215" y="33" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700">INTERNAL OCEAN WAVES &amp; OPTICAL EXTINCTION (مَوْجٌ مِّن فَوْقِهِ مَوْجٌ)</text>
  <text x="875" y="35" fill="#7dd3fc" font-family="'Amiri', serif" font-size="17" font-weight="bold" text-anchor="end">أَوْ كَظُلُمَاتٍ فِي بَحْرٍ لُّدِّيٍّ يَغْشَاهُ مَوْجٌ (النور: ۴۰)</text>

  <!-- Cross section with 3 layers -->
  <g transform="translate(40, 80)">
    <rect x="0" y="0" width="820" height="340" rx="10" fill="url(#oceanDepthGrad)" stroke="#1e293b"/>

    <!-- Layer 1: Surface Waves -->
    <path d="M 0 40 Q 50 20 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 820 40 L 820 0 L 0 0 Z" fill="#0284c7" opacity="0.5"/>
    <text x="30" y="30" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold">1. Surface Waves (سطحی امواج)</text>

    <!-- Layer 2: Subsurface Internal Waves -->
    <path d="M 0 160 Q 70 120 140 160 T 280 160 T 420 160 T 560 160 T 700 160 T 820 160" fill="none" stroke="#38bdf8" stroke-width="4"/>
    <text x="30" y="150" fill="#bae6fd" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">2. Subsurface Internal Waves (زیرِ آب اندرونی لہریں: مَوْجٌ مِّن فَوْقِهِ مَوْجٌ)</text>

    <!-- Layer 3: Absolute Darkness Zone -->
    <rect x="0" y="240" width="820" height="100" fill="#000000" opacity="0.85"/>
    <text x="30" y="275" fill="#fca5a5" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">3. Total Photopic Extinction Zone (&gt; 200m: ظُلُمَاتٌ بَعْضُهَا فَوْقَ بَعْضٍ)</text>
    <text x="30" y="300" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">Even if one extends their hand, they cannot see it due to total optical absorption.</text>
  </g>

  <!-- Bottom Academic Citation -->
  <rect x="0" y="465" width="900" height="55" fill="#020617"/>
  <text x="25" y="488" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="bold">ACADEMIC RESEARCH & SCIENTIFIC CITATION:</text>
  <text x="25" y="504" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5">Dr. Rao, "Internal Waves in the Ocean" • NOAA Ocean Exploration Service (Light Attenuation in Deep Ocean).</text>
  <text x="875" y="495" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" text-anchor="end">Nuzool-ul-Quran Scientific Insight Series</text>
</svg>'''

with open('assets/scientific_diagrams/deep_ocean_internal_waves.svg', 'w', encoding='utf-8') as f:
    f.write(svg_internal_waves)
print("Created assets/scientific_diagrams/deep_ocean_internal_waves.svg")

print("All 10 High-Resolution Original Colored Scientific Assets Generated Successfully!")
