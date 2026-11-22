export interface SymbolDefinition {
  symbol: string;
  name: string;
  quantityType: 'Besaran Pokok' | 'Besaran Turunan' | 'Parameter Tak Berdimensi';
  unit: string;
  meaning: string;
}

export interface TheoryChapter {
  id: string;
  order: string;
  title: string;
  subtitle: string;
  levelLabel: string;
  summary: string;
  narrationText: string;
  keyIdeas: string[];
  symbols: SymbolDefinition[];
  lawsAndDerivations: {
    heading: string;
    explanation: string;
    equation: string;
    derivationSteps: string[];
  }[];
  assumptions: string[];
  commonMistakes: string[];
  olympiadTrick: string;
  realWorldExample: string;
  diagramType: 'two-body' | 'cm-frame' | 'three-body-chain' | 'optimization-curve' | 'recollision-boundary';
}

export interface ConceptNode {
  id: string;
  title: string;
  shortFormula: string;
  description: string;
  chapterId: string;
  tier: 1 | 2 | 3;
  connections: string[];
}

export const CONCEPT_MAP_NODES: ConceptNode[] = [
  {
    id: 'momentum',
    title: 'Kekekalan Momentum Linear',
    shortFormula: 'Σ p_awal = Σ p_akhir',
    description:
      'Selama gaya luar neto pada sumbu gerak sama dengan nol (sistem terisolasi), total momentum linear sistem selalu konstan selama tumbukan impulsif.',
    chapterId: 'bab-1',
    tier: 1,
    connections: ['elastic-1d', 'cm-frame'],
  },
  {
    id: 'energy',
    title: 'Kekekalan Energi Kinetik (e = 1)',
    shortFormula: 'Σ K_awal = Σ K_akhir',
    description:
      'Pada tumbukan elastis sempurna, tidak ada energi mekanik yang terdisipasi menjadi panas atau deformasi permanen; kelajuan relatif mendekat sama dengan kelajuan relatif menjauh.',
    chapterId: 'bab-1',
    tier: 1,
    connections: ['elastic-1d'],
  },
  {
    id: 'elastic-1d',
    title: 'Tumbukan Elastis 1D Dua Benda',
    shortFormula: 'v₂′ = 2m₁v₁ / (m₁ + m₂)',
    description:
      'Kombinasi kekekalan momentum dan energi menghasilkan faktor pengali kecepatan dan fraksi transfer energi maksimum saat m₁ = m₂.',
    chapterId: 'bab-2',
    tier: 2,
    connections: ['chain-3', 'cm-frame'],
  },
  {
    id: 'cm-frame',
    title: 'Metode Kerangka Pusat Massa',
    shortFormula: 'uᵢ′ = −uᵢ  (e = 1)',
    description:
      'Dalam kerangka pusat massa, total momentum bernilai nol. Tumbukan elastis 1D hanya membalik arah kecepatan relatif terhadap pusat massa tanpa mengubah besarnya.',
    chapterId: 'bab-2',
    tier: 2,
    connections: ['chain-3'],
  },
  {
    id: 'chain-3',
    title: 'Tumbukan Beruntun 3-Massa (OSK No. 14)',
    shortFormula: 'v₃′ = 4m₁m₂v₁ / [(m₁+m₂)(m₂+m₃)]',
    description:
      'Massa perantara m₂ bertindak sebagai jembatan transfer momentum dan energi dari massa besar m₁ ke massa kecil m₃ agar amplifikasi kelajuan jauh melampaui tumbukan langsung.',
    chapterId: 'bab-3',
    tier: 3,
    connections: ['impedance', 'boundary'],
  },
  {
    id: 'impedance',
    title: 'Optimasi Massa Perantara (Impedance Matching)',
    shortFormula: 'm₂ = √(m₁ · m₃)',
    description:
      'Dengan ketaksamaan AM-GM atau turunan pertama, kecepatan akhir m₃ mencapai puncak mutlak saat m₂ merupakan rata-rata geometrik antara m₁ dan m₃.',
    chapterId: 'bab-4',
    tier: 3,
    connections: [],
  },
  {
    id: 'boundary',
    title: 'Syarat Tanpa Tumbukan Susulan & Rantai-N',
    shortFormula: 'v₂″ ≥ v₁′  |  mₖ = m₁ r^(k−1)',
    description:
      'Memeriksa apakah m₁ mengejar m₂ kembali setelah m₂ menumbuk m₃, serta perluasan untuk N bola beruntun dan tumbukan dengan dinding atau pegas.',
    chapterId: 'bab-5',
    tier: 3,
    connections: [],
  },
];

export const THEORY_CHAPTERS: TheoryChapter[] = [
  {
    id: 'bab-1',
    order: 'Bab 01',
    title: 'Fondasi Momentum Linear & Tumbukan Elastis',
    subtitle: 'Besaran pokok, turunan, impuls tumbukan, dan dua hukum kekekalan utama',
    levelLabel: 'Konsep Dasar',
    summary:
      'Sebelum menganalisis tiga bola pada Soal Nomor 14 OSK 2026, kita harus menguasai mengapa momentum selalu kekal pada tumbukan singkat dan kapan energi kinetik ikut kekal.',
    narrationText:
      'Selamat datang di Bab satu bersama Mister Jo. Pada Soal Nomor empat belas OSK Fisika dua ribu dua puluh enam, kita menghadapi sistem tiga benda yang bertumbukan beruntun secara elastis. Fondasi utamanya adalah dua hukum kekekalan: pertama, Hukum Kekekalan Momentum Linear yang berlaku karena gaya interaksi antarbola merupakan gaya dalam aksi-reaksi selama waktu kontak yang sangat singkat. Kedua, Hukum Kekekalan Energi Kinetik yang berlaku khusus karena seluruh tumbukan bersifat elastis sempurna dengan koefisien restitusi sama dengan satu.',
    keyIdeas: [
      'Momentum linear p = m · v adalah besaran vektor; arah gerak ke kanan (+x) dan ke kiri (−x) wajib dibedakan dengan tanda aljabar.',
      'Selama tumbukan dua benda, gaya kontak F₁₂ dan F₂₁ merupakan pasangan aksi-reaksi (F₁₂ = −F₂₁) dengan durasi Δt sama, sehingga perubahan total momentum sistem sama dengan nol.',
      'Pada tumbukan elastis sempurna (e = 1), energi kinetik total tepat sebelum tumbukan sama persis dengan energi kinetik total tepat sesudah tumbukan.',
    ],
    symbols: [
      {
        symbol: 'm',
        name: 'Massa benda',
        quantityType: 'Besaran Pokok',
        unit: 'kg',
        meaning: 'Ukuran inersia benda yang mempertahankan keadaan geraknya.',
      },
      {
        symbol: 'v',
        name: 'Kecepatan linear',
        quantityType: 'Besaran Turunan',
        unit: 'm/s',
        meaning: 'Laju perubahan posisi terhadap waktu beserta arah gerak pada sumbu-x.',
      },
      {
        symbol: 'p = m·v',
        name: 'Momentum linear',
        quantityType: 'Besaran Turunan',
        unit: 'kg·m/s (Ns)',
        meaning: 'Ukuran kesulitan menghentikan benda bergerak; searah dengan vektor kecepatan.',
      },
      {
        symbol: 'K = ½ m v²',
        name: 'Energi kinetik',
        quantityType: 'Besaran Turunan',
        unit: 'Joule (J)',
        meaning: 'Energi gerak skalar yang terkonservasi hanya jika tumbukan bersifat elastis sempurna.',
      },
      {
        symbol: 'e',
        name: 'Koefisien restitusi',
        quantityType: 'Parameter Tak Berdimensi',
        unit: 'tanpa satuan',
        meaning: 'Rasio kelajuan menjauh relatif terhadap kelajuan mendekat relatif (e = 1 untuk elastis).',
      },
    ],
    lawsAndDerivations: [
      {
        heading: 'Hukum Kekekalan Momentum & Energi pada Tumbukan 1D',
        explanation:
          'Untuk dua benda bermassa m₁ dan m₂ bergerak sepanjang satu garis lurus tanpa gaya eksternal horizontal:',
        equation: 'm₁ v₁ + m₂ v₂ = m₁ v₁′ + m₂ v₂′    dan    v₂′ − v₁′ = e (v₁ − v₂)',
        derivationSteps: [
          'Dari Hukum Kekekalan Energi Kinetik (e = 1): ½ m₁ v₁² + ½ m₂ v₂² = ½ m₁ (v₁′)² + ½ m₂ (v₂′)².',
          'Kelompokkan suku bermassa sama: m₁ (v₁² − v₁′²) = m₂ (v₂′² − v₂²).',
          'Faktorkan selisih kuadrat: m₁ (v₁ − v₁′)(v₁ + v₁′) = m₂ (v₂′ − v₂)(v₂′ + v₂).',
          'Dari kekekalan momentum: m₁ (v₁ − v₁′) = m₂ (v₂′ − v₂). Bagi kedua persamaan (untuk v₁ ≠ v₁′) menghasilkan v₁ + v₁′ = v₂ + v₂′, atau v₂′ − v₁′ = v₁ − v₂ (persamaan restitusi e = 1).',
        ],
      },
    ],
    assumptions: [
      'Lintasan datar dan licin sempurna (resultan gaya luar arah horizontal ΣFₓ = 0).',
      'Tumbukan bersifat sentral (garis hubung pusat massa sejajar vektor kecepatan, sehingga tidak timbul rotasi).',
      'Durasi kontak Δt sangat singkat (impulsif) sehingga benda tidak berpindah posisi secara signifikan saat bertumbukan.',
    ],
    commonMistakes: [
      'Menjumlahkan besar kelajuan tanpa memperhatikan tanda minus ketika benda memantul ke kiri.',
      'Menganggap energi kinetik selalu kekal padahal soal menyebutkan tumbukan lenting sebagian (e < 1).',
    ],
    olympiadTrick:
      'Gunakan selalu persamaan linear v₂′ − v₁′ = v₁ − v₂ menggantikan persamaan kuadrat energi kinetik agar perhitungan aljabar 3× lebih cepat dan bebas kesalahan akar kuadrat.',
    realWorldExample:
      'Bola biliar yang bertumbukan di atas meja datar licin atau tumbukan antarpartikel bermuatan pada akselerator linear.',
    diagramType: 'two-body',
  },
  {
    id: 'bab-2',
    order: 'Bab 02',
    title: 'Rumus Tumbukan Elastis 1D & Kerangka Pusat Massa',
    subtitle: 'Menurunkan v₁′, v₂′, fraksi transfer energi, dan sudut pandang pusat massa',
    levelLabel: 'Fondasi Matematis',
    summary:
      'Memahami bentuk eksplisit kecepatan akhir tumbukan dua benda serta alasan fisis mengapa tumbukan langsung antara massa besar dan massa sangat kecil tidak efisien mentransfer energi.',
    narrationText:
      'Pada Bab dua, kita menurunkan rumus kecepatan akhir tumbukan elastis satu dimensi serta memahaminya melalui kerangka pusat massa. Dalam kerangka pusat massa yang bergerak dengan kecepatan v CM, tumbukan elastis sempurna hanya membalikkan arah kecepatan setiap benda. Akibatnya, jika massa berat m satu menumbuk langsung massa ringan m tiga yang diam, kecepatan maksimum m tiga hanya mendekati dua kali kecepatan m satu, sehingga sebagian besar energi tertinggal di m satu.',
    keyIdeas: [
      'Jika m₁ ≫ m₂ (benda berat menumbuk benda ringan diam), kecepatan benda ringan paling besar mendekati 2v₁, tidak bisa lebih dari itu dalam satu kali tumbukan.',
      'Fraksi energi kinetik yang berpindah dari m₁ ke m₂ diam adalah η = 4m₁m₂ / (m₁ + m₂)², yang mencapai 100% hanya saat m₁ = m₂.',
      'Dalam kerangka Pusat Massa (v_CM), kecepatan setelah tumbukan elastis memenuhi v_i′ = 2·v_CM − v_i.',
    ],
    symbols: [
      {
        symbol: 'v_CM',
        name: 'Kecepatan pusat massa',
        quantityType: 'Besaran Turunan',
        unit: 'm/s',
        meaning: 'Kecepatan rata-rata berbobot massa sistem: (m₁v₁ + m₂v₂)/(m₁ + m₂).',
      },
      {
        symbol: 'η',
        name: 'Efisiensi transfer energi',
        quantityType: 'Parameter Tak Berdimensi',
        unit: 'tanpa satuan (%)',
        meaning: 'Perbandingan energi kinetik yang diterima benda target terhadap energi kinetik awal penumbuk.',
      },
    ],
    lawsAndDerivations: [
      {
        heading: 'Penurunan Rumus Kecepatan Akhir & Metode Pusat Massa',
        explanation:
          'Substitusi v₁′ = v₂′ − e(v₁ − v₂) ke dalam persamaan kekekalan momentum menghasilkan rumus umum:',
        equation: 'v₂′ = [(1 + e)m₁ v₁ + (m₂ − e m₁) v₂] / (m₁ + m₂)   |   Khusus v₂ = 0 & e = 1:  v₂′ = 2m₁ v₁ / (m₁ + m₂)',
        derivationSteps: [
          'Mulai dari m₁ v₁ + m₂ v₂ = m₁ v₁′ + m₂ v₂′ dan v₁′ = v₂′ − e(v₁ − v₂).',
          'Substitusikan v₁′: m₁ v₁ + m₂ v₂ = m₁[v₂′ − e(v₁ − v₂)] + m₂ v₂′.',
          'Kumpulkan v₂′: (m₁ + m₂) v₂′ = (1 + e)m₁ v₁ + (m₂ − e m₁) v₂.',
          'Dengan cara serupa, v₁′ = [(m₁ − e m₂) v₁ + (1 + e)m₂ v₂] / (m₁ + m₂).',
          'Alternatif Pusat Massa (untuk e = 1): v_CM = (m₁ v₁ + m₂ v₂)/(m₁ + m₂). Dalam kerangka CM, u₁ = v₁ − v_CM berbalik menjadi u₁′ = −u₁, sehingga di kerangka lab: v₁′ = v_CM + u₁′ = 2v_CM − v₁.',
        ],
      },
    ],
    assumptions: [
      'Berlaku untuk tumbukan searah satu dimensi dengan sumbu +x konsisten.',
      'Untuk persamaan v₂′ = 2m₁v₁/(m₁ + m₂), diasumsikan benda target mula-mula diam (v₂ = 0) dan e = 1.',
    ],
    commonMistakes: [
      'Mengira benda yang lebih ringan selalu menerima energi kinetik lebih besar; faktanya transfer energi hanya optimal (100%) bila m₁ = m₂.',
      'Lupa mengalikan faktor 2 pada rumus pusat massa v′ = 2v_CM − v.',
    ],
    olympiadTrick:
      'Untuk soal dengan kedua benda bergerak awal (seperti variasi OSK tingkat lanjut), rumus v′ = 2v_CM − v jauh lebih minim salah hitung daripada menghafal dua pecahan panjang.',
    realWorldExample:
      'Moderator neutron pada reaktor nuklir: neutron cepat paling efisien diperlambat oleh inti bermassa hampir sama (hidrogen/proton pada air), bukan oleh inti timbal yang sangat berat.',
    diagramType: 'cm-frame',
  },
  {
    id: 'bab-3',
    order: 'Bab 03',
    title: 'Mekanisme Tumbukan Beruntun 3-Massa (Inti Soal No. 14)',
    subtitle: 'Bagaimana massa perantara m₂ melipatgandakan kelajuan akhir m₃',
    levelLabel: 'Analisis Sistem',
    summary:
      'Mengapa menempatkan m₂ di antara m₁ dan m₃ menghasilkan kelajuan m₃ yang jauh lebih tinggi dibandingkan jika m₁ menumbuk m₃ secara langsung?',
    narrationText:
      'Bab tiga membedah jantung Soal Nomor empat belas OSK 2026. Jika m satu sebesar sembilan kilogram menumbuk langsung m tiga sebesar nol koma dua lima kilogram, kelajuan m tiga hanya menjadi satu koma sembilan empat kali kecepatan awal. Namun ketika disisipkan m dua sebesar satu koma lima kilogram di tengah, tumbukan pertama memindahkan energi secara bertahap ke m dua, lalu tumbukan kedua melontarkan m tiga hingga hampir tiga kali kecepatan awal m satu!',
    keyIdeas: [
      'Tumbukan berlangsung dalam dua tahap berurutan: Tahap 1 antara m₁ dan m₂ (m₂ diam), lalu Tahap 2 antara m₂ dan m₃ (m₃ diam).',
      'Jika m₁ > m₂ > m₃, kedua tahap menghasilkan penguatan kelajuan (v₂′ > v₁ dan v₃′ > v₂′), karena faktor pengali 2m_a/(m_a + m_b) selalu lebih besar dari 1 saat m_a > m_b.',
      'Pada contoh asli OSK 2026 No. 14 (m₁ = 9 kg, m₃ = 0,25 kg): tanpa m₂, v₃_langsung = (18/9,25)v₁ ≈ 1,95 v₁. Dengan m₂ = 1,5 kg, v₃_beruntun = (144/49)v₁ ≈ 2,94 v₁!',
    ],
    symbols: [
      {
        symbol: 'm₁',
        name: 'Massa penumbuk awal',
        quantityType: 'Besaran Pokok',
        unit: 'kg',
        meaning: 'Benda pertama yang membawa momentum dan energi kinetik awal sistem.',
      },
      {
        symbol: 'm₂',
        name: 'Massa perantara (bridge)',
        quantityType: 'Besaran Pokok',
        unit: 'kg',
        meaning: 'Benda tengah yang menjembatani ketimpangan massa antara m₁ dan m₃.',
      },
      {
        symbol: 'm₃',
        name: 'Massa target akhir',
        quantityType: 'Besaran Pokok',
        unit: 'kg',
        meaning: 'Benda ujung yang kelajuan atau energi kinetiknya ingin dimaksimumkan.',
      },
    ],
    lawsAndDerivations: [
      {
        heading: 'Fungsi Kecepatan Akhir m₃ terhadap Massa Perantara m₂',
        explanation:
          'Kita terapkan rumus tumbukan elastis beruntun sebanyak dua kali secara berurutan:',
        equation: 'v₃′ = [ 4 m₁ m₂ / ((m₁ + m₂)(m₂ + m₃)) ] · v₁',
        derivationSteps: [
          'Tahap 1 (m₁ menumbuk m₂ yang diam): v₂′ = [2m₁ / (m₁ + m₂)] v₁, dan v₁′ = [(m₁ − m₂)/(m₁ + m₂)] v₁.',
          'Tahap 2 (m₂ berkecepatan v₂′ menumbuk m₃ yang diam): v₃′ = [2m₂ / (m₂ + m₃)] v₂′.',
          'Substitusikan v₂′ ke v₃′: v₃′ = [2m₂ / (m₂ + m₃)] · [2m₁ / (m₁ + m₂)] v₁.',
          'Sederhanakan menjadi fungsi rasional terhadap m₂: v₃′(m₂) = [4 m₁ m₂ / ((m₁ + m₂)(m₂ + m₃))] v₁.',
        ],
      },
    ],
    assumptions: [
      'Jarak awal antara m₂ dan m₃ cukup besar (atau terjadi dua tumbukan terpisah) sehingga tumbukan m₁–m₂ selesai sempurna sebelum m₂ mencapai m₃.',
      'Ketiga massa berada pada satu garis lurus dan tidak ada gesekan lantai.',
    ],
    commonMistakes: [
      'Menganggap ketiga benda bertumbukan serentak secara bersamaan (simultaneous 3-body collision), padahal secara fisis tumbukan terjadi berurutan satu per satu.',
      'Mengira m₂ yang paling kecil atau paling besar selalu menghasilkan v₃′ terbesar.',
    ],
    olympiadTrick:
      'Bandingkan rasio v₃′/v₁ untuk tumbukan langsung vs beruntun: penguatan terjadi karena dua kali pengalian faktor > 1 yang saling menguatkan saat rasio massa dipecah menjadi dua langkah berimbang.',
    realWorldExample:
      'Gelombang kejut pada ledakan bintang (supernova) atau mainan Astro Blaster di mana bola paling ringan di atas bola berat melenting sangat tinggi.',
    diagramType: 'three-body-chain',
  },
  {
    id: 'bab-4',
    order: 'Bab 04',
    title: 'Optimasi m₂ = √(m₁ m₃) — Impedance Matching Mekanik',
    subtitle: 'Pembuktian analitis via AM-GM dan kalkulus turunan, serta independensi terhadap e',
    levelLabel: 'Optimasi Olimpiade',
    summary:
      'Inilah puncak penurunan matematis Soal Nomor 14 OSK 2026: menentukan nilai tepat m₂ agar v₃′ (dan otomatis energi kinetik K₃′ serta momentum p₃′) bernilai maksimum mutlak.',
    narrationText:
      'Di Bab empat, kita membuktikan rumus emas Soal Nomor empat belas: m dua sama dengan akar m satu kali m tiga. Perhatikan bahwa memaksimumkan kecepatan akhir m tiga ekuivalen dengan meminimumkan fungsi penyebut, yaitu m dua ditambah m satu kali m tiga per m dua. Dengan ketaksamaan A M G M, nilai minimum tercapai tepat ketika kedua suku sama besar, menghasilkan m dua kuadrat sama dengan m satu kali m tiga. Untuk m satu sembilan kilogram dan m tiga nol koma dua lima kilogram, hasilnya tepat satu koma lima kilogram!',
    keyIdeas: [
      'Memaksimumkan v₃′ terhadap m₂ juga sekaligus memaksimumkan momentum akhir p₃′ = m₃ v₃′ dan energi kinetik akhir K₃′ = ½ m₃ (v₃′)².',
      'Nilai optimal m₂ = √(m₁ m₃) berarti rasio massa di setiap tahap sama persis: m₁ / m₂ = m₂ / m₃.',
      'Fakta Olimpiade: bahkan jika tumbukan bersifat lenting sebagian dengan koefisien restitusi seragam e < 1, posisi optimum tetap m₂ = √(m₁ m₃)!',
    ],
    symbols: [
      {
        symbol: 'm₂*',
        name: 'Massa perantara optimum',
        quantityType: 'Besaran Pokok',
        unit: 'kg',
        meaning: 'Rata-rata geometrik √(m₁ · m₃) yang menyamakan efisiensi transfer tahap 1 dan tahap 2.',
      },
      {
        symbol: 'r = √(m₃/m₁)',
        name: 'Rasio geometrik massa',
        quantityType: 'Parameter Tak Berdimensi',
        unit: 'tanpa satuan',
        meaning: 'Perbandingan m₂/m₁ sekaligus m₃/m₂ pada kondisi optimum.',
      },
    ],
    lawsAndDerivations: [
      {
        heading: 'Pembuktian dengan AM-GM & Kalkulus Turunan Pertama',
        explanation:
          'Kita ingin memaksimumkan v₃′ = 4 m₁ v₁ / f(m₂), yang berarti meminimumkan f(m₂):',
        equation: 'm₂* = √(m₁ · m₃)   ⇒   v₃,maks = [ 4 m₁ / (√m₁ + √m₃)² ] · v₁',
        derivationSteps: [
          'Bagi pembilang dan penyebut persamaan v₃′ dengan m₂: v₃′ = 4 m₁ v₁ / [ ((m₁ + m₂)(m₂ + m₃)) / m₂ ].',
          'Ekspansi fungsi penyebut f(m₂) = (m₁ m₂ + m₁ m₃ + m₂² + m₂ m₃) / m₂ = (m₁ + m₃) + m₂ + (m₁ m₃ / m₂).',
          'Metode AM-GM: Karena m₂ > 0 dan m₁ m₃ / m₂ > 0, berlaku m₂ + (m₁ m₃ / m₂) ≥ 2√(m₂ · m₁ m₃ / m₂) = 2√(m₁ m₃).',
          'Kesamaan (nilai minimum penyebut = nilai maksimum v₃′) tercapai ketika m₂ = m₁ m₃ / m₂ ⇒ m₂² = m₁ m₃ ⇒ m₂ = √(m₁ m₃).',
          'Verifikasi dengan soal OSK 2026 No. 14: m₁ = 9 kg, m₃ = 0,25 kg ⇒ m₂ = √(9 × 0,25) = √2,25 = 1,5 kg.',
          'Perhatikan juga perluasan koefisien restitusi seragam e: pembilang hanya berubah dari 4 menjadi (1+e)², sehingga f(m₂) tidak berubah dan m₂* tetap √(m₁ m₃)!',
        ],
      },
    ],
    assumptions: [
      'Massa m₁ dan m₃ bernilai positif tetap, sedangkan m₂ bebas dipilih positif (m₂ > 0).',
      'Kondisi optimum otomatis menjamin tidak ada tumbukan susulan apabila m₁ > m₃ (dibuktikan di Bab 5).',
    ],
    commonMistakes: [
      'Menggunakan rata-rata aritmetika (m₁ + m₃)/2 alih-alih rata-rata geometrik √(m₁ m₃). Pada soal OSK No. 14, (9 + 0,25)/2 = 4,625 kg adalah SALAH!',
      'Lupa menarik akar kuadrat setelah menghitung m₁ · m₃ = 2,25.',
    ],
    olympiadTrick:
      'Ingat prinsip simetri transfer energi: efisiensi total η_total = η₁ · η₂ maksimum ketika η₁ = η₂, yang terjadi jika rasio massa m₁/m₂ = m₂/m₃ ⇒ m₂ = √(m₁ m₃).',
    realWorldExample:
      'Impedance matching pada transformator listrik, kotak roda gigi sepeda, atau lapisan anti-refleksi optik (indeks bias n₂ = √(n₁ n₃)).',
    diagramType: 'optimization-curve',
  },
  {
    id: 'bab-5',
    order: 'Bab 05',
    title: 'Batas Tanpa Tumbukan Susulan, Rantai N-Benda & Kasus Lanjutan',
    subtitle: 'Analisis v₂″ vs v₁′, pembalikan arah pada m₂ < m₃, dinding pantul, dan pegas',
    levelLabel: 'HOTS Olimpiade',
    summary:
      'Peserta olimpiade sejati tidak berhenti pada rumus cepat: ia selalu memeriksa apakah tumbukan ketiga terjadi, bagaimana jika terdapat N massa, atau jika sistem digabungkan dengan bidang miring, dinding, dan pegas.',
    narrationText:
      'Bab lima melatih ketajaman tingkat HOTS Olimpiade. Setelah tumbukan kedua antara m dua dan m tiga, selalu tanyakan: apakah kecepatan akhir m dua lebih lambat daripada kecepatan m satu? Jika v dua aksen ganda lebih kecil dari v satu aksen, m satu akan menyusul dan menumbuk m dua lagi! Selain itu, kita juga mempelajari perluasan ke N bola dalam barisan geometri, penggabungan energi potensial bidang miring, serta pegas penahan di ujung lintasan.',
    keyIdeas: [
      'Syarat tidak terjadi tumbukan susulan (m₁ mengejar m₂) setelah tumbukan kedua adalah v₂″ ≥ v₁′.',
      'Jika m₂ < m₃, maka setelah menumbuk m₃, massa m₂ memantul ke kiri (v₂″ < 0) dan PASTI bertumbukan lagi dengan m₁ yang masih bergerak ke kanan (jika m₁ > m₂).',
      'Untuk rantai N benda yang dioptimalkan serentak (m₁ → m₂ → ... → m_N), massa optimum membentuk barisan geometri m_k = m₁ · r^(k−1) dengan r = (m_N / m₁)^(1/(N−1)).',
    ],
    symbols: [
      {
        symbol: 'v₂″',
        name: 'Kecepatan m₂ setelah tumbukan ke-2',
        quantityType: 'Besaran Turunan',
        unit: 'm/s',
        meaning: 'Menentukan apakah m₁ (berkecepatan v₁′) akan mengejar m₂ atau tidak.',
      },
      {
        symbol: 'H_maks',
        name: 'Tinggi maksimum di tanjakan',
        quantityType: 'Besaran Pokok',
        unit: 'm',
        meaning: 'Ketinggian yang dicapai m₃ setelah tumbukan akibat konversi energi kinetik menjadi potensial.',
      },
      {
        symbol: 'x_maks',
        name: 'Kompresi maksimum pegas',
        quantityType: 'Besaran Pokok',
        unit: 'm (atau cm)',
        meaning: 'Pemendekan pegas akibat tumbukan impulsif m₂ ke m₃ yang terhubung pegas.',
      },
    ],
    lawsAndDerivations: [
      {
        heading: 'Syarat Batas Tumbukan Susulan & Bukti Keamanan Titik Optimum',
        explanation:
          'Agar tidak terjadi tumbukan susulan antara m₁ dan m₂ setelah tumbukan kedua, syarat mutlaknya adalah v₂″ ≥ v₁′:',
        equation: 'm₂² + (m₁ + m₃) m₂ − 3 m₁ m₃ ≥ 0',
        derivationSteps: [
          'Bandingkan v₂″ = [(m₂ − m₃)/(m₂ + m₃)] · [2m₁/(m₁ + m₂)] v₁ dengan v₁′ = [(m₁ − m₂)/(m₁ + m₂)] v₁.',
          'Karena m₁ + m₂ > 0 dan v₁ > 0, syarat v₂″ ≥ v₁′ menjadi 2m₁(m₂ − m₃)/(m₂ + m₃) ≥ m₁ − m₂.',
          'Kalikan kedua ruas dengan (m₂ + m₃) > 0: 2m₁ m₂ − 2m₁ m₃ ≥ m₁ m₂ + m₁ m₃ − m₂² − m₂ m₃.',
          'Pindahkan ke ruas kiri: m₂² + (m₁ + m₃) m₂ − 3 m₁ m₃ ≥ 0.',
          'Substitusikan titik optimum m₂ = √(m₁ m₃) ke ruas kiri: m₁ m₃ + (m₁ + m₃)√(m₁ m₃) − 3 m₁ m₃ = √(m₁ m₃)·(m₁ + m₃ − 2√(m₁ m₃)) = √(m₁ m₃)·(√m₁ − √m₃)² ≥ 0!',
          'Artinya: titik optimum m₂ = √(m₁ m₃) SELALU aman dari tumbukan susulan!',
        ],
      },
    ],
    assumptions: [
      'Jika m₂ tidak memenuhi pertidaksamaan batas di atas, perhitungan harus dilanjutkan dengan melacak tumbukan ke-3, ke-4, dan seterusnya hingga v₁_akhir ≤ v₂_akhir ≤ v₃_akhir.',
      'Pada kasus pegas di ujung lintasan, tumbukan harus cukup singkat (impulsif) sehingga gaya pegas dapat diabaikan selama proses tumbukan berlangsung.',
    ],
    commonMistakes: [
      'Langsung berhenti di 2 tumbukan padahal v₂″ < v₁′ atau v₂″ < 0.',
      'Menggunakan kekekalan momentum saat benda sudah menumbuk dinding kokoh atau pegas yang terikat ke dinding (dinding memberikan impuls eksternal!).',
    ],
    olympiadTrick:
      'Untuk rantai N bola optimal dengan rasio massa r = (m_N/m₁)^(1/(N−1)), setiap tumbukan mengalikan kecepatan sebesar 2/(1 + r), sehingga v_N = [2/(1 + r)]^(N−1) · v₁. Saat N → ∞, seluruh energi awal hampir 100% berpindah ke bola terakhir sehingga v_N → √(m₁/m_N) · v₁!',
    realWorldExample:
      'Akselerasi partikel kosmik atau mekanisme penguatan impuls berjenjang pada sistem benturan pelindung kendaraan.',
    diagramType: 'recollision-boundary',
  },
];
