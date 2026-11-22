import type { SimulationConfig } from '../physics/collisionEngine';

export type QuestionDifficulty =
  | 'Pengenalan Konsep'
  | 'Aplikasi'
  | 'Analisis'
  | 'HOTS Olimpiade';

export interface FBDVectorSpec {
  label: string;
  direction: 'up' | 'down' | 'left' | 'right';
  targetBodyIndex: number;
  category: 'normal' | 'weight' | 'impulse' | 'velocity' | 'spring';
}

export interface StimulusSpec {
  kind:
    | 'two-body-track'
    | 'energy-bar-chart'
    | 'three-body-osk14'
    | 'three-body-velocities'
    | 'four-body-chain'
    | 'wall-bounce-track'
    | 'curve-m2-vs-v3'
    | 'ramp-launch-three-body'
    | 'spring-end-three-body'
    | 'data-table-moving';
  caption: string;
  labels: string[];
  masses: (number | string)[];
  velocities: string[];
  extraNote?: string;
}

export interface TextbookExplanation {
  aMemahami: string;
  bDiketahui: string[];
  cDitanyakan: string;
  dAnalisisKonsep: string;
  eFbdExplanation: string;
  eFbdVectors: FBDVectorSpec[];
  fPersamaan: {
    highlightedFormula: string;
    steps: string[];
  };
  gSubstitusi: string[];
  hJawabanAkhir: string;
  iIntuisiFisika: string;
  jTrikCepat: string;
}

export interface PracticeQuestion {
  id: number;
  code: string;
  title: string;
  difficulty: QuestionDifficulty;
  relatedChapterId: string;
  unit: string;
  expectedAnswer: number; // verified 1-decimal number
  stimulus: StimulusSpec;
  prompt: string;
  hint: string;
  promptNarration: string;
  explanationNarration: string;
  explanation: TextbookExplanation;
  simulationConfig: SimulationConfig;
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    code: 'SOAL 01',
    title: 'Transfer Kecepatan Tumbukan Elastis Dua Bola',
    difficulty: 'Pengenalan Konsep',
    relatedChapterId: 'bab-2',
    unit: 'm/s',
    expectedAnswer: 8.0,
    stimulus: {
      kind: 'two-body-track',
      caption: 'Skema lintasan horizontal licin sebelum tumbukan antara bola A dan bola B.',
      labels: ['A (m₁)', 'B (m₂)'],
      masses: ['4,0 kg', '2,0 kg'],
      velocities: ['v₁ = +6,0 m/s →', 'v₂ = 0 m/s (diam)'],
    },
    prompt:
      'Berdasarkan skema stimulus di atas, bola A bermassa m₁ = 4,0 kg bergerak ke kanan dengan kelajuan 6,0 m/s di atas lintasan horizontal licin, lalu menumbuk secara elastis sempurna bola B bermassa m₂ = 2,0 kg yang mula-mula diam. Tentukan kelajuan bola B tepat setelah tumbukan (dalam m/s).',
    hint:
      'Gunakan rumus tumbukan elastis 1D untuk benda target yang mula-mula diam: v₂′ = 2m₁v₁ / (m₁ + m₂).',
    promptNarration:
      'Soal nomor satu. Perhatikan skema lintasan licin pada stimulus. Bola A bermassa empat koma nol kilogram bergerak ke kanan dengan kelajuan enam koma nol meter per sekon menuju bola B bermassa dua koma nol kilogram yang mula-mula diam. Jika tumbukan berlangsung elastis sempurna, tentukan kelajuan bola B tepat setelah tumbukan dalam satuan meter per sekon.',
    explanationNarration:
      'Pembahasan soal nomor satu. Pada Diagram Benda Bebas saat tumbukan berlangsung, bekerja gaya berat ke bawah dan gaya normal lantai ke atas yang saling meniadakan di sumbu y, serta pasangan gaya impulsif aksi-reaksi pada arah sumbu x: bola A mendorong bola B ke arah plus x dan bola B menahan bola A ke arah minus x. Karena tidak ada gaya luar di sumbu x, momentum linear kekal dan energi kinetik ikut kekal. Dengan rumus v dua aksen sama dengan dua kali m satu kali v satu dibagi m satu tambah m dua, kita peroleh dua kali empat kali enam dibagi enam, sama dengan delapan koma nol meter per sekon.',
    explanation: {
      aMemahami:
        'Bola A yang lebih berat menumbuk secara sentral dan elastis bola B yang lebih ringan dalam keadaan diam di lantai datar tanpa gesekan. Sebagian momentum dan energi kinetik bola A berpindah ke bola B sehingga bola B meluncur lebih cepat daripada kecepatan awal bola A.',
      bDiketahui: [
        'Massa bola A: m₁ = 4,0 kg',
        'Massa bola B: m₂ = 2,0 kg',
        'Kecepatan awal bola A: v₁ = +6,0 m/s',
        'Kecepatan awal bola B: v₂ = 0 m/s',
        'Jenis tumbukan: elastis sempurna (e = 1)',
      ],
      cDitanyakan: 'Kelajuan bola B tepat setelah tumbukan (v₂′) dalam satuan m/s.',
      dAnalisisKonsep:
        'Karena lantai datar licin, resultan gaya eksternal arah horizontal ΣFₓ = 0 sehingga Hukum Kekekalan Momentum Linear berlaku. Karena tumbukan elastis sempurna (e = 1), Hukum Kekekalan Energi Kinetik juga berlaku dan menghasilkan persamaan restitusi v₂′ − v₁′ = v₁ − v₂.',
      eFbdExplanation:
        'Saat kedua bola bersentuhan sesaat, pada masing-masing bola bekerja gaya berat W = m·g ke bawah (−y) dan gaya normal N ke atas (+y) yang saling meniadakan (N = W). Pada sumbu gerak (+x), bekerja gaya impulsif kontak aksi-reaksi: F₁₂ mendorong bola B ke kanan (+x) dan F₂₁ mendorong bola A ke kiri (−x) dengan besar sama.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'F₂₁', direction: 'left', targetBodyIndex: 0, category: 'impulse' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'F₁₂', direction: 'right', targetBodyIndex: 1, category: 'impulse' },
      ],
      fPersamaan: {
        highlightedFormula: 'v₂′ = [ 2 m₁ / (m₁ + m₂) ] · v₁',
        steps: [
          'Kekekalan momentum: m₁ v₁ + 0 = m₁ v₁′ + m₂ v₂′',
          'Persamaan restitusi (e = 1): v₂′ − v₁′ = v₁  ⇒  v₁′ = v₂′ − v₁',
          'Substitusikan v₁′ ke persamaan momentum: m₁ v₁ = m₁(v₂′ − v₁) + m₂ v₂′',
          'Kumpulkan suku v₂′: 2 m₁ v₁ = (m₁ + m₂) v₂′  ⇒  v₂′ = 2m₁ v₁ / (m₁ + m₂)',
        ],
      },
      gSubstitusi: [
        'v₂′ = (2 × 4,0 kg × 6,0 m/s) / (4,0 kg + 2,0 kg)',
        'v₂′ = 48,0 / 6,0 = 8,0 m/s',
      ],
      hJawabanAkhir: '8,0 m/s',
      iIntuisiFisika:
        'Karena m₁ > m₂, faktor penguatan 2m₁/(m₁ + m₂) = 4/3 > 1. Benda ringan yang ditumbuk benda lebih berat selalu terdorong dengan kelajuan lebih besar daripada kelajuan awal penumbuknya (namun selalu kurang dari 2v₁).',
      jTrikCepat:
        'Hitung kecepatan pusat massa v_CM = (4×6)/(4+2) = 4,0 m/s. Karena bola B mula-mula diam (v₂ = 0), kecepatan akhirnya langsung v₂′ = 2·v_CM − 0 = 8,0 m/s!',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 4.0, x0: 1.5, v0: 6.0, radius: 0.48, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 2.0, x0: 6.5, v0: 0.0, radius: 0.38, color: '#1E3A5F' },
      ],
      duration: 2.6,
    },
  },
  {
    id: 2,
    code: 'SOAL 02',
    title: 'Efisiensi Transfer Energi Kinetik Dua Massa',
    difficulty: 'Pengenalan Konsep',
    relatedChapterId: 'bab-2',
    unit: '%',
    expectedAnswer: 75.0,
    stimulus: {
      kind: 'two-body-track',
      caption: 'Bola 1 menumbuk bola 2 yang lebih berat dalam kondisi diam di rel udara licin.',
      labels: ['Bola 1 (m₁)', 'Bola 2 (m₂)'],
      masses: ['2,0 kg', '6,0 kg'],
      velocities: ['v₁ = +v₀ →', 'v₂ = 0 (diam)'],
    },
    prompt:
      'Sebuah bola bermassa m₁ = 2,0 kg bergerak menuju bola kedua bermassa m₂ = 6,0 kg yang diam pada lantai datar licin seperti terlihat pada stimulus. Jika tumbukan berlangsung lenting sempurna (elastis), berapa persen (%) energi kinetik awal sistem yang berhasil ditransfer menjadi energi kinetik bola 2 setelah tumbukan?',
    hint:
      'Hitung rasio K₂′ / K_awal = [4 m₁ m₂ / (m₁ + m₂)²] × 100%.',
    promptNarration:
      'Soal nomor dua. Bola bermassa dua koma nol kilogram bergerak menuju bola kedua bermassa enam koma nol kilogram yang diam di lantai licin. Tumbukan berlangsung elastis sempurna. Berapa persen energi kinetik awal sistem yang berhasil ditransfer menjadi energi kinetik bola dua setelah tumbukan?',
    explanationNarration:
      'Pembahasan soal nomor dua. Pada Diagram Benda Bebas saat kontak tumbukan, gaya normal dan gaya berat saling menyeimbangkan di sumbu vertikal, sedangkan gaya impulsif kontak antara kedua bola bekerja berlawanan arah di sumbu horizontal. Untuk mencari persentase transfer energi kinetik, kita substitusikan rumus kecepatan akhir v dua aksen ke dalam energi kinetik bola dua, sehingga diperoleh fraksi transfer energi empat m satu m dua dibagi kuadrat jumlah m satu tambah m dua. Dengan m satu dua kilogram dan m dua enam kilogram, diperoleh empat puluh delapan per enam puluh empat sama dengan nol koma tujuh lima atau tujuh puluh lima koma nol persen.',
    explanation: {
      aMemahami:
        'Tidak seluruh energi kinetik awal berpindah ke bola target ketika kedua massa tidak sama besar. Kita diminta menghitung persentase energi kinetik awal yang berpindah ke bola kedua setelah satu kali tumbukan elastis.',
      bDiketahui: [
        'Massa bola penumbuk: m₁ = 2,0 kg',
        'Massa bola target (diam): m₂ = 6,0 kg',
        'Koefisien restitusi: e = 1 (lenting sempurna)',
      ],
      cDitanyakan: 'Persentase energi kinetik awal yang ditransfer ke m₂ (η dalam %).',
      dAnalisisKonsep:
        'Kecepatan akhir bola kedua adalah v₂′ = 2m₁v₁ / (m₁ + m₂). Energi kinetik bola kedua sesudah tumbukan dapat langsung dibandingkan terhadap energi kinetik awal K₁ = ½ m₁ v₁² tanpa bergantung pada besar v₁.',
      eFbdExplanation:
        'Selama interval kontak singkat, tiap bola mengalami gaya berat W ke bawah dan gaya normal N ke atas pada sumbu-y (ΣF_y = 0). Pada sumbu-x, gaya impulsif F₁₂ mendorong bola 2 ke kanan (+x) sementara gaya reaksi F₂₁ mendorong bola 1 ke kiri (−x).',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'F₂₁', direction: 'left', targetBodyIndex: 0, category: 'impulse' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'F₁₂', direction: 'right', targetBodyIndex: 1, category: 'impulse' },
      ],
      fPersamaan: {
        highlightedFormula: 'η = K₂′ / K_awal = 4 m₁ m₂ / (m₁ + m₂)²',
        steps: [
          'Energi kinetik awal: K_awal = ½ m₁ v₁²',
          'Kecepatan akhir bola 2: v₂′ = 2 m₁ v₁ / (m₁ + m₂)',
          'Energi kinetik akhir bola 2: K₂′ = ½ m₂ (v₂′)² = ½ m₂ · [4 m₁² v₁² / (m₁ + m₂)²]',
          'Bagi K₂′ dengan K_awal: η = [4 m₁ m₂ / (m₁ + m₂)²]',
        ],
      },
      gSubstitusi: [
        'η = [4 × 2,0 kg × 6,0 kg] / (2,0 kg + 6,0 kg)²',
        'η = 48,0 / 64,0 = 0,75',
        'Dalam persen: η = 0,75 × 100% = 75,0%',
      ],
      hJawabanAkhir: '75,0 %',
      iIntuisiFisika:
        'Fraksi transfer energi hanya bernilai 100% ketika m₁ = m₂. Karena rasio massa di sini 1 : 3, masih ada 25% energi kinetik yang tersisa pada bola 1 (memantul kembali ke arah kiri dengan laju ½ v₁).',
      jTrikCepat:
        'Rumus cepat persentase transfer energi η = 4r / (1 + r)² dengan r = m₂/m₁ = 3: η = 12 / 16 = 75,0%.',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 2.0, x0: 2.0, v0: 4.0, radius: 0.36, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 6.0, x0: 6.0, v0: 0.0, radius: 0.52, color: '#1E3A5F' },
      ],
      duration: 2.8,
    },
  },
  {
    id: 3,
    code: 'SOAL 03',
    title: 'Optimasi Massa Perantara Sistem 3-Massa (Variasi OSK No. 14)',
    difficulty: 'Pengenalan Konsep',
    relatedChapterId: 'bab-4',
    unit: 'kg',
    expectedAnswer: 4.0,
    stimulus: {
      kind: 'three-body-osk14',
      caption: 'Konfigurasi tumbukan beruntun 3 benda segaris (pola langsung Soal OSK 2026 No. 14).',
      labels: ['m₁', 'm₂', 'm₃'],
      masses: ['16,0 kg', 'm₂ = ?', '1,0 kg'],
      velocities: ['v₁ →', 'diam', 'diam'],
      extraNote: 'Syarat akhir: kelajuan akhir m₃ bernilai maksimum',
    },
    prompt:
      'Tinjau sistem tiga buah massa segaris pada lintasan datar licin seperti ditunjukkan pada stimulus. Awalnya m₂ dan m₃ = 1,0 kg dalam keadaan diam, sementara m₁ = 16,0 kg bergerak menuju m₂. Seluruh peristiwa tumbukan berlangsung elastis sempurna. Agar pada keadaan akhir kelajuan m₃ bernilai maksimum, berapakah massa m₂ yang harus dipilih (dalam kg)?',
    hint:
      'Nyatakan v₃′ sebagai fungsi dari m₂, lalu cari nilai minimum penyebutnya menggunakan AM-GM atau turunan pertama terhadap m₂.',
    promptNarration:
      'Soal nomor tiga, merupakan variasi langsung Soal Nomor empat belas OSK 2026. Pada stimulus terlihat tiga benda segaris di lintasan licin. Awalnya m dua dan m tiga sebesar satu koma nol kilogram diam, sementara m satu sebesar enam belas koma nol kilogram bergerak menuju m dua. Seluruh tumbukan bersifat elastis. Agar kelajuan akhir m tiga maksimum, tentukan massa m dua dalam satuan kilogram.',
    explanationNarration:
      'Pembahasan soal nomor tiga. Pada Diagram Benda Bebas setiap tahap tumbukan, gaya normal dan gaya berat saling meniadakan secara vertikal, sementara gaya impulsif kontak antarbola bekerja horizontal sepanjang sumbu x. Melalui dua tahap tumbukan elastis beruntun, kecepatan akhir m tiga berbanding terbalik dengan fungsi m dua tambah m satu m tiga per m dua. Dengan ketaksamaan A M G M, nilai maksimum v tiga tercapai saat m dua sama dengan akar m satu kali m tiga, yaitu akar enam belas kali satu sama dengan empat koma nol kilogram.',
    explanation: {
      aMemahami:
        'Massa m₁ yang sangat besar ingin mentransfer kelajuan sebesar mungkin ke massa kecil m₃ melalui perantara m₂. Kita mencari nilai optimal m₂ (impedance matching mekanik) agar kecepatan akhir m₃ mencapai puncak.',
      bDiketahui: [
        'Massa pertama: m₁ = 16,0 kg (bergerak dengan laju v₁)',
        'Massa ketiga: m₃ = 1,0 kg (mula-mula diam)',
        'Massa kedua: m₂ (mula-mula diam, nilai dicari)',
        'Semua tumbukan elastis sempurna (e = 1)',
      ],
      cDitanyakan: 'Massa perantara m₂ agar kelajuan akhir m₃ maksimum (dalam kg).',
      dAnalisisKonsep:
        'Tumbukan terjadi berurutan: pertama m₁ menumbuk m₂, lalu m₂ menumbuk m₃. Dengan menggabungkan persamaan kecepatan dari kedua tumbukan elastis, diperoleh v₃′(m₂) yang dapat dimaksimumkan terhadap m₂.',
      eFbdExplanation:
        'Pada setiap tumbukan (Tahap 1 antara m₁–m₂ dan Tahap 2 antara m₂–m₃), gaya normal ke atas (+y) mengimbangi gaya berat ke bawah (−y). Gaya kontak impulsif aksi-reaksi bekerja murni sepanjang sumbu horizontal x sehingga total momentum sistem selalu kekal.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'F₂₁', direction: 'left', targetBodyIndex: 0, category: 'impulse' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'F₁₂', direction: 'right', targetBodyIndex: 1, category: 'impulse' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
      ],
      fPersamaan: {
        highlightedFormula: 'm₂ = √(m₁ · m₃)',
        steps: [
          'Tahap 1 (m₁ → m₂): v₂′ = 2m₁ v₁ / (m₁ + m₂)',
          'Tahap 2 (m₂ → m₃): v₃′ = 2m₂ v₂′ / (m₂ + m₃) = 4 m₁ m₂ v₁ / [(m₁ + m₂)(m₂ + m₃)]',
          'Bagi pembilang & penyebut dengan m₂: v₃′ = 4 m₁ v₁ / [m₁ + m₃ + m₂ + (m₁m₃ / m₂)]',
          'Minimumkan f(m₂) = m₂ + (m₁m₃ / m₂) dengan turunan df/dm₂ = 1 − m₁m₃/m₂² = 0  ⇒  m₂ = √(m₁m₃)',
        ],
      },
      gSubstitusi: [
        'm₂ = √(16,0 kg × 1,0 kg)',
        'm₂ = √(16,0 kg²) = 4,0 kg',
      ],
      hJawabanAkhir: '4,0 kg',
      iIntuisiFisika:
        'Dengan m₂ = 4,0 kg, rasio massa pada kedua tumbukan seimbang sempurna (16 : 4 = 4 : 1). Kedua tumbukan memberikan faktor penguatan kecepatan yang sama besar sehingga efek keseluruhannya maksimal.',
      jTrikCepat:
        'Untuk rantai 3 massa elastis dengan ujung diam, massa perantara optimal selalu merupakan rata-rata geometrik kedua ujung: m₂ = √(m₁m₃).',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 16.0, x0: 1.5, v0: 4.0, radius: 0.55, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 4.0, x0: 5.5, v0: 0.0, radius: 0.42, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 1.0, x0: 9.0, v0: 0.0, radius: 0.30, color: '#1E3A5F' },
      ],
      duration: 3.2,
    },
  },
  {
    id: 4,
    code: 'SOAL 04',
    title: 'Kelajuan Akhir Maksimum Pada Parameter Asli OSK 2026 No. 14',
    difficulty: 'Aplikasi',
    relatedChapterId: 'bab-4',
    unit: 'm/s',
    expectedAnswer: 14.4,
    stimulus: {
      kind: 'three-body-osk14',
      caption: 'Parameter massa identik dengan Soal OSK 2026 No. 14 dengan laju awal m₁ sebesar 4,9 m/s.',
      labels: ['m₁', 'm₂ (opt)', 'm₃'],
      masses: ['9,0 kg', 'm₂*', '0,25 kg'],
      velocities: ['v₁ = +4,9 m/s →', 'diam', 'diam'],
      extraNote: 'm₂ dipilih agar v₃ akhir maksimum',
    },
    prompt:
      'Menggunakan konfigurasi massa Soal OSK 2026 Nomor 14 pada stimulus (m₁ = 9,0 kg dan m₃ = 0,25 kg diam), massa m₁ mula-mula bergerak dengan kelajuan v₁ = 4,9 m/s menuju m₂ yang diam. Jika m₂ dipilih secara optimal agar kelajuan akhir m₃ maksimum dan seluruh tumbukan bersifat elastis, tentukan kelajuan akhir maksimum yang dicapai m₃ (dalam m/s).',
    hint:
      'Tentukan dulu m₂ = √(9,0 × 0,25) = 1,5 kg, lalu hitung v₂′ dan v₃′ secara berurutan.',
    promptNarration:
      'Soal nomor empat menggunakan angka massa persis seperti soal asli OSK dua ribu dua puluh enam nomor empat belas, yaitu m satu sembilan koma nol kilogram dan m tiga nol koma dua lima kilogram. Kali ini diketahui kelajuan awal m satu adalah empat koma sembilan meter per sekon. Jika m dua dipilih agar kelajuan akhir m tiga maksimum, berapakah kelajuan akhir maksimum m tiga dalam meter per sekon?',
    explanationNarration:
      'Pembahasan soal nomor empat. Pertama kita cari massa perantara optimal seperti pada Soal Nomor empat belas OSK 2026, yaitu akar sembilan kali nol koma dua lima sama dengan satu koma lima kilogram. Perhatikan Diagram Benda Bebas: pada tumbukan pertama m satu mendorong m dua ke kanan dan pada tumbukan kedua m dua mendorong m tiga ke kanan sementara gaya vertikal seimbang. Pada tahap pertama, v dua aksen sama dengan delapan belas per sepuluh koma lima kali empat koma sembilan sama dengan delapan koma empat meter per sekon. Pada tahap kedua, v tiga aksen sama dengan tiga per satu koma tujuh lima kali delapan koma empat sama dengan empat belas koma empat meter per sekon.',
    explanation: {
      aMemahami:
        'Setelah menemukan m₂* = 1,5 kg seperti pada soal asli OSK 2026 No. 14, kita menghitung seberapa besar amplifikasi kecepatan yang sesungguhnya terjadi pada massa kecil m₃.',
      bDiketahui: [
        'm₁ = 9,0 kg, v₁ = +4,9 m/s',
        'm₃ = 0,25 kg, v₃ = 0 m/s',
        'm₂ dipilih optimal (v₃ akhir maksimum), v₂ = 0 m/s',
      ],
      cDitanyakan: 'Kelajuan akhir maksimum massa ketiga (v₃,maks) dalam m/s.',
      dAnalisisKonsep:
        'Pertama tentukan m₂* = √(m₁m₃), kemudian periksa apakah terjadi tumbukan susulan (karena m₁ > m₃, pada kondisi optimal v₂″ > v₁′ sehingga hanya terjadi tepat 2 tumbukan). Lalu hitung v₂′ dan v₃′.',
      eFbdExplanation:
        'Selama kontak tahap 1 (m₁–m₂) dan tahap 2 (m₂–m₃), gaya berat W dan normal N seimbang pada arah-y. Gaya impulsif antarbola berpasangan aksi-reaksi sejajar sumbu-x, memindahkan momentum ke kanan secara berjenjang.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'F₁₂', direction: 'right', targetBodyIndex: 1, category: 'impulse' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
        { label: 'F₂₃', direction: 'right', targetBodyIndex: 2, category: 'impulse' },
      ],
      fPersamaan: {
        highlightedFormula: 'v₃,maks = [ 4 m₁ / (√m₁ + √m₃)² ] · v₁',
        steps: [
          'Hitung massa optimal: m₂* = √(m₁ m₃)',
          'Rasio kelajuan tahap 1: v₂′ / v₁ = 2 m₁ / (m₁ + √(m₁ m₃)) = 2√m₁ / (√m₁ + √m₃)',
          'Rasio kelajuan tahap 2: v₃′ / v₂′ = 2 √(m₁ m₃) / (√(m₁ m₃) + m₃) = 2√m₁ / (√m₁ + √m₃)',
          'Kalikan kedua rasio: v₃,maks = [2√m₁ / (√m₁ + √m₃)]² · v₁ = [4 m₁ / (√m₁ + √m₃)²] · v₁',
        ],
      },
      gSubstitusi: [
        'm₂* = √(9,0 × 0,25) = 1,5 kg',
        'Faktor pengali tiap tahap: 2√9 / (√9 + √0,25) = 6 / (3 + 0,5) = 6 / 3,5 = 12/7',
        'v₃,maks = (12/7)² × 4,9 m/s = (144 / 49) × 4,9 m/s = 14,4 m/s',
      ],
      hJawabanAkhir: '14,4 m/s',
      iIntuisiFisika:
        'Melalui perantara 1,5 kg, m₃ meluncur hampir 3 kali lipat lebih cepat (14,4 m/s vs 4,9 m/s). Bandingkan bila m₂ tidak ada: tumbukan langsung menghasilkan (18/9,25) × 4,9 ≈ 9,5 m/s saja.',
      jTrikCepat:
        'Pada titik optimal m₂ = √(m₁m₃), pengali kecepatan tahap 1 dan tahap 2 identik bernilai 2/(1 + r) dengan r = √(m₃/m₁) = 0,5/3 = 1/6. Jadi v₃,maks = (12/7)² · 4,9 = 14,4 m/s.',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 9.0, x0: 1.2, v0: 4.9, radius: 0.52, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 1.5, x0: 5.0, v0: 0.0, radius: 0.36, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 0.25, x0: 8.5, v0: 0.0, radius: 0.26, color: '#1E3A5F' },
      ],
      duration: 2.8,
    },
  },
  {
    id: 5,
    code: 'SOAL 05',
    title: 'Momentum Linear Maksimum yang Diterima Massa Ketiga',
    difficulty: 'Aplikasi',
    relatedChapterId: 'bab-4',
    unit: 'Ns',
    expectedAnswer: 6.4,
    stimulus: {
      kind: 'three-body-osk14',
      caption: 'Sistem tiga balok pada lantai licin; balok ketiga menerima dorongan maksimal.',
      labels: ['m₁', 'm₂ (opt)', 'm₃'],
      masses: ['8,0 kg', 'm₂*', '0,5 kg'],
      velocities: ['v₁ = +5,0 m/s →', 'diam', 'diam'],
      extraNote: 'Energi kinetik akhir m₃ dimaksimumkan',
    },
    prompt:
      'Tiga buah massa m₁ = 8,0 kg, m₂, dan m₃ = 0,5 kg tersusun segaris di atas bidang datar licin seperti pada stimulus. Massa m₂ dan m₃ awalnya diam, sedangkan m₁ bergerak dengan kelajuan 5,0 m/s menuju m₂. Jika m₂ diatur agar energi kinetik akhir m₃ bernilai maksimum dan semua tumbukan elastis sempurna, tentukan besar momentum akhir m₃ (dalam Ns).',
    hint:
      'Memaksimumkan energi kinetik m₃ sama dengan memaksimumkan v₃′, sehingga m₂ tetap sama dengan √(m₁ m₃). Hitung p₃ = m₃ v₃′.',
    promptNarration:
      'Soal nomor lima. Tiga massa tersusun segaris di bidang datar licin: m satu delapan koma nol kilogram melaju lima koma nol meter per sekon menuju m dua yang diam dan m tiga nol koma lima kilogram yang juga diam. Massa m dua diatur agar energi kinetik akhir m tiga maksimum. Tentukan besar momentum akhir m tiga dalam satuan Newton sekon.',
    explanationNarration:
      'Pembahasan soal nomor lima. Karena energi kinetik m tiga berbanding lurus dengan kuadrat kecepatannya, memaksimumkan energi kinetik sama persis dengan memaksimumkan kelajuan m tiga. Maka m dua optimal sama dengan akar delapan kali nol koma lima sama dengan dua koma nol kilogram. Pada Diagram Benda Bebas selama tumbukan impulsif, gaya luar sumbu x nol sehingga momentum berpindah dari m satu ke m dua lalu ke m tiga. Kelajuan m dua menjadi delapan meter per sekon, kelajuan m tiga menjadi dua belas koma delapan meter per sekon, sehingga momentum akhirnya nol koma lima dikali dua belas koma delapan sama dengan enam koma empat Newton sekon.',
    explanation: {
      aMemahami:
        'Soal menanyakan momentum linear akhir p₃ = m₃ v₃′ saat kondisi transfer energi ke m₃ dibuat maksimum oleh pemilihan massa perantara m₂.',
      bDiketahui: [
        'm₁ = 8,0 kg, v₁ = +5,0 m/s',
        'm₃ = 0,5 kg, v₃ = 0 m/s',
        'Tumbukan beruntun elastis (e = 1) dengan K₃′ maksimum',
      ],
      cDitanyakan: 'Besar momentum akhir m₃ (p₃′ = m₃ v₃′) dalam Ns.',
      dAnalisisKonsep:
        'Karena K₃′ = ½ m₃ (v₃′)² dan m₃ tetap, K₃′ maksimum dicapai tepat saat v₃′ maksimum, yaitu ketika m₂ = √(m₁m₃).',
      eFbdExplanation:
        'Gaya berat W dan normal N seimbang sepanjang sumbu-y untuk ketiga benda. Impuls eksternal total selama tiap tumbukan nol, sehingga impuls yang diterima m₃ tepat sama dengan perubahan momentumnya p₃′ = ∫ F₂₃ dt.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
        { label: 'F₂₃', direction: 'right', targetBodyIndex: 2, category: 'impulse' },
      ],
      fPersamaan: {
        highlightedFormula: 'm₂* = √(m₁ m₃)   dan   p₃′ = m₃ v₃′',
        steps: [
          'm₂* = √(8,0 × 0,5) = √4,0 = 2,0 kg',
          'Tahap 1: v₂′ = [2 m₁ / (m₁ + m₂*)] v₁',
          'Tahap 2: v₃′ = [2 m₂* / (m₂* + m₃)] v₂′',
          'Momentum akhir: p₃′ = m₃ · v₃′',
        ],
      },
      gSubstitusi: [
        'v₂′ = (2 × 8,0 / (8,0 + 2,0)) × 5,0 = 1,6 × 5,0 = 8,0 m/s',
        'v₃′ = (2 × 2,0 / (2,0 + 0,5)) × 8,0 = 1,6 × 8,0 = 12,8 m/s',
        'p₃′ = 0,5 kg × 12,8 m/s = 6,4 Ns',
      ],
      hJawabanAkhir: '6,4 Ns',
      iIntuisiFisika:
        'Momentum awal sistem adalah 8,0 × 5,0 = 40,0 Ns. Meski m₃ hanya bermassa 0,5 kg (1/16 dari m₁), ia menerima 6,4 Ns (16% momentum total) karena kelajuannya teramplifikasi menjadi 12,8 m/s.',
      jTrikCepat:
        'Faktor kecepatan tiap tahap sama: 2/(1 + √(0,5/8)) = 2/(1 + 0,25) = 1,6. Langsung hitung p₃′ = 0,5 × (1,6)² × 5,0 = 6,4 Ns.',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 8.0, x0: 1.5, v0: 5.0, radius: 0.52, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 2.0, x0: 5.2, v0: 0.0, radius: 0.38, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 0.5, x0: 8.6, v0: 0.0, radius: 0.28, color: '#1E3A5F' },
      ],
      duration: 2.8,
    },
  },
  {
    id: 6,
    code: 'SOAL 06',
    title: 'Analisis Rantai 3-Massa Non-Optimal & Selisih Kelajuan Akhir',
    difficulty: 'Aplikasi',
    relatedChapterId: 'bab-3',
    unit: 'm/s',
    expectedAnswer: 17.2,
    stimulus: {
      kind: 'three-body-velocities',
      caption: 'Tiga balok di atas rel udara tanpa gesekan dengan massa tengah telah ditentukan.',
      labels: ['m₁', 'm₂', 'm₃'],
      masses: ['6,0 kg', '4,0 kg', '1,0 kg'],
      velocities: ['v₁ = +10,0 m/s →', 'diam', 'diam'],
      extraNote: 'Periksa v₂″ dan v₁′ untuk memastikan tidak terjadi tumbukan susulan',
    },
    prompt:
      'Tiga balok segaris berada pada rel udara licin seperti pada stimulus: m₁ = 6,0 kg meluncur dengan kelajuan 10,0 m/s menumbuk m₂ = 4,0 kg (diam), yang kemudian menumbuk m₃ = 1,0 kg (diam). Seluruh tumbukan bersifat elastis sempurna. Tentukan selisih kelajuan akhir antara balok ketiga dan balok pertama (v₃,akhir − v₁,akhir) dalam satuan m/s.',
    hint:
      'Hitung v₁′ dan v₂′ pada tumbukan pertama, lalu v₂″ dan v₃′ pada tumbukan kedua. Pastikan v₂″ > v₁′ agar tidak ada tumbukan susulan.',
    promptNarration:
      'Soal nomor enam. Tiga balok segaris di rel udara licin: m satu enam koma nol kilogram melaju sepuluh koma nol meter per sekon menuju m dua empat koma nol kilogram yang diam dan m tiga satu koma nol kilogram yang diam. Tentukan selisih kelajuan akhir antara balok ketiga dan balok pertama dalam meter per sekon.',
    explanationNarration:
      'Pembahasan soal nomor enam. Kita lacak dua tumbukan elastis berurutan dan periksa syarat batasnya. Pada tumbukan pertama antara m satu enam kilogram dan m dua empat kilogram, m satu melambat menjadi dua koma nol meter per sekon dan m dua melesat dua belas koma nol meter per sekon. Pada tumbukan kedua antara m dua empat kilogram dan m tiga satu kilogram, m dua menjadi tujuh koma dua meter per sekon sementara m tiga menjadi sembilan belas koma dua meter per sekon. Karena tujuh koma dua lebih besar dari dua koma nol, m satu tidak menyusul m dua. Jadi selisih kelajuan akhir adalah sembilan belas koma dua dikurangi dua koma nol sama dengan tujuh belas koma dua meter per sekon.',
    explanation: {
      aMemahami:
        'Tidak seperti soal sebelumnya, massa m₂ = 4,0 kg di sini tidak bernilai √6. Kita wajib menghitung kecepatan akhir m₁ dan m₃ serta memverifikasi apakah m₁ sempat mengejar m₂ lagi setelah tumbukan kedua.',
      bDiketahui: [
        'm₁ = 6,0 kg, v₁ = +10,0 m/s',
        'm₂ = 4,0 kg, v₂ = 0 m/s',
        'm₃ = 1,0 kg, v₃ = 0 m/s',
      ],
      cDitanyakan: 'Selisih kelajuan akhir (v₃,akhir − v₁,akhir) dalam m/s.',
      dAnalisisKonsep:
        'Hitung v₁′ dan v₂′ pada tumbukan pertama, lalu v₂″ dan v₃′ pada tumbukan kedua. Cek syarat v₁′ ≤ v₂″ ≤ v₃′; bila terpenuhi, sistem stabil dan tidak ada tumbukan ke-3.',
      eFbdExplanation:
        'Pada tumbukan pertama maupun kedua, gaya normal dan gravitasi seimbang vertikal, sedangkan gaya impulsif kontak F₁₂ dan F₂₃ bekerja di sumbu-x. Vektor kecepatan akhir terurut makin besar ke kanan (v₁′ < v₂″ < v₃′).',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'v₁′', direction: 'right', targetBodyIndex: 0, category: 'velocity' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'v₂″', direction: 'right', targetBodyIndex: 1, category: 'velocity' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
        { label: 'v₃′', direction: 'right', targetBodyIndex: 2, category: 'velocity' },
      ],
      fPersamaan: {
        highlightedFormula: 'v_a′ = [(m_a − m_b)/(m_a + m_b)] v_a   dan   v_b′ = [2 m_a /(m_a + m_b)] v_a',
        steps: [
          'Tumbukan 1: v₁′ = [(6 − 4)/(6 + 4)] v₁  dan  v₂′ = [12 / 10] v₁',
          'Tumbukan 2: v₂″ = [(4 − 1)/(4 + 1)] v₂′  dan  v₃′ = [8 / 5] v₂′',
          'Syarat berhenti: periksa apakah v₂″ ≥ v₁′',
        ],
      },
      gSubstitusi: [
        'v₁′ = (2/10) × 10,0 = 2,0 m/s',
        'v₂′ = (12/10) × 10,0 = 12,0 m/s',
        'v₂″ = (3/5) × 12,0 = 7,2 m/s (karena 7,2 > 2,0 m/s, tidak ada tumbukan susulan)',
        'v₃′ = (8/5) × 12,0 = 19,2 m/s',
        'Selisih: v₃′ − v₁′ = 19,2 − 2,0 = 17,2 m/s',
      ],
      hJawabanAkhir: '17,2 m/s',
      iIntuisiFisika:
        'Meskipun m₂ = 4,0 kg bukan massa optimum (yang seharusnya √6 ≈ 2,45 kg), sistem tetap meneruskan momentum secara bersih tanpa tumbukan susulan karena m₁ > m₂ > m₃ masih cukup dekat dengan syarat batas.',
      jTrikCepat:
        'Cek kekekalan energi sebagai verifikasi: K_awal = ½(6)(100) = 300 J; K_akhir = ½(6)(4) + ½(4)(51,84) + ½(1)(368,64) = 12 + 103,68 + 184,32 = 300,0 J (terbukti akurat!).',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 6.0, x0: 1.0, v0: 10.0, radius: 0.50, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 4.0, x0: 5.5, v0: 0.0, radius: 0.44, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 1.0, x0: 9.5, v0: 0.0, radius: 0.30, color: '#1E3A5F' },
      ],
      duration: 2.2,
    },
  },
  {
    id: 7,
    code: 'SOAL 07',
    title: 'Batas Minimum Massa m₂ Tanpa Tumbukan Susulan',
    difficulty: 'Analisis',
    relatedChapterId: 'bab-5',
    unit: 'kg',
    expectedAnswer: 3.0,
    stimulus: {
      kind: 'three-body-velocities',
      caption: 'Kondisi kritis setelah tumbukan ke-2: m₁ dan m₂ melaju dengan kelajuan akhir tepat sama (v₁′ = v₂″).',
      labels: ['m₁', 'm₂ (min)', 'm₃'],
      masses: ['5,0 kg', 'm₂ = ?', '2,0 kg'],
      velocities: ['v₁′ (akhir)', 'v₂″ = v₁′', 'v₃′ (akhir)'],
      extraNote: 'Syarat batas: tepat tidak ada tumbukan ke-3 antara m₁ dan m₂',
    },
    prompt:
      'Dalam sistem tumbukan elastis beruntun tiga massa segaris (m₁ → m₂ → m₃) dengan m₂ dan m₃ mula-mula diam, diketahui m₁ = 5,0 kg dan m₃ = 2,0 kg. Jika m₂ terlalu kecil, setelah m₂ menumbuk m₃ kecepatan m₂ dapat menjadi lebih kecil daripada kecepatan m₁ sehingga m₁ mengejar dan menumbuk m₂ untuk kedua kalinya. Tentukan nilai minimum massa m₂ (dalam kg) agar setelah tumbukan kedua, m₁ tepat tidak mengejar m₂ kembali (v₂″ = v₁′).',
    hint:
      'Samakan v₁′ = [(m₁ − m₂)/(m₁ + m₂)] v₁ dengan v₂″ = [(m₂ − m₃)/(m₂ + m₃)] · [2m₁/(m₁ + m₂)] v₁, lalu selesaikan persamaan kuadrat dalam m₂.',
    promptNarration:
      'Soal nomor tujuh, menguji pemahaman batas berlakunya dua tumbukan. Diketahui m satu lima koma nol kilogram dan m tiga dua koma nol kilogram. Jika m dua terlalu kecil, m satu dapat menyusul m dua untuk tumbukan ketiga. Berapakah nilai minimum m dua dalam kilogram agar tepat setelah tumbukan kedua, kecepatan m dua sama persis dengan kecepatan m satu sehingga tidak terjadi tumbukan susulan?',
    explanationNarration:
      'Pembahasan soal nomor tujuh. Agar m satu tepat tidak menyusul m dua setelah m dua menumbuk m tiga, kecepatan akhir m dua v dua aksen ganda harus sama dengan kecepatan m satu v satu aksen. Menyederhanakan kedua persamaan menghasilkan persamaan kuadrat m dua kuadrat ditambah jumlah m satu tambah m tiga kali m dua dikurangi tiga kali m satu kali m tiga sama dengan nol. Dengan m satu lima dan m tiga dua, kita peroleh m dua kuadrat tambah tujuh m dua kurang tiga puluh sama dengan nol, yang terfaktorkan menjadi m dua tambah sepuluh kali m dua kurang tiga sama dengan nol, sehingga nilai positifnya adalah tiga koma nol kilogram.',
    explanation: {
      aMemahami:
        'Kita mencari batas kritis massa m₂ sehingga tepat sesudah tumbukan m₂–m₃, jarak antara m₁ dan m₂ menjadi konstan (kecepatan keduanya sama persis, v₂″ = v₁′).',
      bDiketahui: [
        'm₁ = 5,0 kg (bergerak dengan kelajuan awal v₁)',
        'm₃ = 2,0 kg (mula-mula diam)',
        'Syarat batas: v₂″ = v₁′ (m₂ mula-mula diam)',
      ],
      cDitanyakan: 'Massa minimum m₂ (dalam kg) agar tepat tidak terjadi tumbukan susulan.',
      dAnalisisKonsep:
        'Pertama tulis v₁′ dan v₂″ dalam variabel m₁, m₂, m₃. Karena syarat batas v₂″ ≥ v₁′ menghilangkan faktor v₁ dan (m₁ + m₂), diperoleh persamaan kuadrat m₂² + (m₁ + m₃)m₂ − 3m₁m₃ = 0.',
      eFbdExplanation:
        'Setelah tumbukan kedua selesai, tidak ada lagi gaya kontak horizontal. Kedua balok m₁ dan m₂ bergerak dengan kecepatan konstan sama besar ke arah +x, diimbangi N dan W pada sumbu-y.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'v₁′', direction: 'right', targetBodyIndex: 0, category: 'velocity' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'v₂″ = v₁′', direction: 'right', targetBodyIndex: 1, category: 'velocity' },
      ],
      fPersamaan: {
        highlightedFormula: 'm₂² + (m₁ + m₃) m₂ − 3 m₁ m₃ = 0',
        steps: [
          'v₁′ = [(m₁ − m₂)/(m₁ + m₂)] v₁',
          'v₂″ = [(m₂ − m₃)/(m₂ + m₃)] · [2m₁ / (m₁ + m₂)] v₁',
          'Samakan v₁′ = v₂″  ⇒  (m₁ − m₂)(m₂ + m₃) = 2m₁(m₂ − m₃)',
          'Ekspansi: m₁m₂ + m₁m₃ − m₂² − m₂m₃ = 2m₁m₂ − 2m₁m₃',
          'Susun ulang: m₂² + (m₁ + m₃)m₂ − 3m₁m₃ = 0',
        ],
      },
      gSubstitusi: [
        'm₂² + (5,0 + 2,0) m₂ − 3(5,0)(2,0) = 0',
        'm₂² + 7 m₂ − 30 = 0',
        '(m₂ + 10)(m₂ − 3) = 0  ⇒  m₂ = 3,0 kg (ambil akar positif)',
      ],
      hJawabanAkhir: '3,0 kg',
      iIntuisiFisika:
        'Perhatikan bahwa nilai batas minimum ini (3,0 kg) masih lebih kecil daripada titik optimum m₂* = √10 ≈ 3,16 kg. Itulah bukti konsisten mengapa titik optimum selalu bebas dari tumbukan susulan.',
      jTrikCepat:
        'Uji cepat di m₂ = 3 kg, m₁ = 5 kg, m₃ = 2 kg: v₁′ = (5−3)/(5+3) = 0,25 v₁; v₂′ = 10/8 = 1,25 v₁; v₂″ = ((3−2)/(3+2)) × 1,25 v₁ = 0,25 v₁ (cocok!).',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 5.0, x0: 1.5, v0: 4.0, radius: 0.48, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 3.0, x0: 5.0, v0: 0.0, radius: 0.40, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 2.0, x0: 8.2, v0: 0.0, radius: 0.36, color: '#1E3A5F' },
      ],
      duration: 3.2,
    },
  },
  {
    id: 8,
    code: 'SOAL 08',
    title: 'Pelacakan Tumbukan Susulan Ketika m₂ < m₃',
    difficulty: 'Analisis',
    relatedChapterId: 'bab-5',
    unit: 'm/s',
    expectedAnswer: 6.6,
    stimulus: {
      kind: 'three-body-velocities',
      caption: 'Karena m₂ < m₃, benda tengah m₂ memantul ke kiri setelah tumbukan ke-2 dan mengalami tumbukan susulan.',
      labels: ['m₁', 'm₂', 'm₃'],
      masses: ['6,0 kg', '1,0 kg', '3,0 kg'],
      velocities: ['v₁ = +4,9 m/s →', 'diam', 'diam'],
      extraNote: 'Seluruh tumbukan beruntun bersifat elastis sempurna hingga tidak ada tumbukan lagi',
    },
    prompt:
      'Tiga buah massa berada segaris di atas rel licin seperti pada stimulus: m₁ = 6,0 kg bergerak ke kanan dengan laju 4,9 m/s menuju m₂ = 1,0 kg yang diam, dan di kanannya terdapat m₃ = 3,0 kg yang juga diam. Seluruh peristiwa tumbukan bersifat elastis sempurna hingga akhirnya tidak ada lagi tumbukan yang mungkin terjadi. Tentukan kelajuan akhir m₃ setelah seluruh rangkaian tumbukan selesai (dalam m/s).',
    hint:
      'Lacak tumbukan tahap demi tahap: setelah tumbukan 2, m₂ memantul ke kiri (−4,2 m/s) lalu menumbuk m₁ lagi, kemudian m₂ berbalik ke kanan dan menumbuk m₃ untuk kedua kalinya!',
    promptNarration:
      'Soal nomor delapan. Tiga massa berada di rel licin: m satu enam koma nol kilogram bergerak empat koma sembilan meter per sekon menuju m dua satu koma nol kilogram dan m tiga tiga koma nol kilogram yang diam. Karena m dua lebih kecil dari m tiga, m dua akan memantul ke kiri setelah menumbuk m tiga dan memicu tumbukan susulan. Tentukan kelajuan akhir m tiga setelah seluruh rangkaian tumbukan berakhir.',
    explanationNarration:
      'Pembahasan soal nomor delapan. Soal ini melatih pelacakan urutan tumbukan secara lengkap. Pada tumbukan pertama, m satu dan m dua menghasilkan v satu aksen tiga koma lima dan v dua aksen delapan koma empat meter per sekon. Pada tumbukan kedua, m dua yang lebih ringan dari m tiga memantul ke kiri dengan kecepatan minus empat koma dua, sementara m tiga melaju empat koma dua meter per sekon. Pada tumbukan ketiga, m satu mendorong kembali m dua sehingga m dua melaju sembilan koma nol meter per sekon ke kanan dan mengejar m tiga. Akhirnya pada tumbukan keempat antara m dua dan m tiga, kecepatan akhir masing-masing menjadi satu koma tiga, satu koma delapan, dan enam koma enam meter per sekon.',
    explanation: {
      aMemahami:
        'Saat m₂ < m₃, tumbukan m₂–m₃ memantulkan m₂ ke kiri sehingga m₂ kembali berhadapan dengan m₁ (yang masih bergerak ke kanan). Akibatnya terjadi 4 kali tumbukan sebelum ketiga benda menjauh permanen.',
      bDiketahui: [
        'm₁ = 6,0 kg, v₁ = +4,9 m/s',
        'm₂ = 1,0 kg, v₂ = 0 m/s',
        'm₃ = 3,0 kg, v₃ = 0 m/s',
      ],
      cDitanyakan: 'Kelajuan akhir m₃ setelah seluruh tumbukan selesai (dalam m/s).',
      dAnalisisKonsep:
        'Terapkan rumus tumbukan elastis 1D berulang kali dengan memperhatikan tanda positif (ke kanan) dan negatif (ke kiri) hingga terpenuhi urutan v₁,akhir ≤ v₂,akhir ≤ v₃,akhir.',
      eFbdExplanation:
        'Setiap kali terjadi kontak tumbukan (baik m₁–m₂ maupun m₂–m₃), gaya kontak aksi-reaksi bekerja sepanjang sumbu-x (N dan W saling meniadakan di sumbu-y). Pada tumbukan ke-3, m₁ dan m₂ bergerak saling berlawanan arah sebelum bertumbukan.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'v₁′ (+)', direction: 'right', targetBodyIndex: 0, category: 'velocity' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'v₂″ (−)', direction: 'left', targetBodyIndex: 1, category: 'velocity' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
      ],
      fPersamaan: {
        highlightedFormula:
          'v_a′ = [(m_a − m_b)v_a + 2m_b v_b]/(m_a + m_b)   dan   v_b′ = [2m_a v_a + (m_b − m_a)v_b]/(m_a + m_b)',
        steps: [
          'Tumbukan 1 (m₁ vs m₂): hitung v₁′ dan v₂′',
          'Tumbukan 2 (m₂ vs m₃): hitung v₂″ (< 0, memantul ke kiri) dan v₃′',
          'Tumbukan 3 (m₁ vs m₂ berlawanan arah): hitung v₁″ dan v₂‴',
          'Tumbukan 4 (m₂ mengejar m₃ karena v₂‴ > v₃′): hitung v₂⁗ dan v₃″',
        ],
      },
      gSubstitusi: [
        'Tumbukan 1: v₁′ = (5/7)(4,9) = +3,5 m/s;  v₂′ = (12/7)(4,9) = +8,4 m/s',
        'Tumbukan 2: v₂″ = (−2/4)(8,4) = −4,2 m/s;  v₃′ = (2/4)(8,4) = +4,2 m/s',
        'Tumbukan 3 (m₁ +3,5 vs m₂ −4,2): v₁″ = (5/7)(3,5) + (2/7)(−4,2) = 2,5 − 1,2 = +1,3 m/s;  v₂‴ = (12/7)(3,5) − (5/7)(−4,2) = 6,0 + 3,0 = +9,0 m/s',
        'Tumbukan 4 (m₂ +9,0 mengejar m₃ +4,2): v₂⁗ = (−2/4)(9,0) + (6/4)(4,2) = −4,5 + 6,3 = +1,8 m/s;  v₃″ = (2/4)(9,0) + (2/4)(4,2) = 4,5 + 2,1 = +6,6 m/s',
        'Cek akhir: 1,3 < 1,8 < 6,6 m/s (tumbukan berhenti total)',
      ],
      hJawabanAkhir: '6,6 m/s',
      iIntuisiFisika:
        'Bola tengah m₂ berfungsi seperti "kurir bolak-balik" yang memantul kembali ke m₁ untuk mengambil tambahan energi kinetik, lalu mengantarkannya lagi ke m₃.',
      jTrikCepat:
        'Gunakan rumus pusat massa pada tahap 3 & 4: tahap 3 memiliki v_CM = [6(3,5)+1(−4,2)]/7 = 2,4 m/s ⇒ v₂‴ = 2(2,4) − (−4,2) = 9,0 m/s; tahap 4 memiliki v_CM = [1(9,0)+3(4,2)]/4 = 5,4 m/s ⇒ v₃″ = 2(5,4) − 4,2 = 6,6 m/s.',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 6.0, x0: 1.0, v0: 4.9, radius: 0.48, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 1.0, x0: 5.0, v0: 0.0, radius: 0.30, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 3.0, x0: 7.5, v0: 0.0, radius: 0.40, color: '#1E3A5F' },
      ],
      duration: 4.0,
    },
  },
  {
    id: 9,
    code: 'SOAL 09',
    title: 'Perluasan Rantai Empat Massa Barisan Geometri Optimal',
    difficulty: 'Analisis',
    relatedChapterId: 'bab-5',
    unit: 'm/s',
    expectedAnswer: 13.5,
    stimulus: {
      kind: 'four-body-chain',
      caption: 'Rantai 4 bola elastis segaris dengan massa perantara membentuk barisan geometri.',
      labels: ['m₁', 'm₂', 'm₃', 'm₄'],
      masses: ['27,0 kg', 'm₂*', 'm₃*', '1,0 kg'],
      velocities: ['v₁ = +4,0 m/s →', 'diam', 'diam', 'diam'],
      extraNote: 'Rasio massa berurutan sama: m₂/m₁ = m₃/m₂ = m₄/m₃ = r',
    },
    prompt:
      'Konsep Soal OSK 2026 Nomor 14 diperluas menjadi sistem 4 bola segaris di bidang horizontal licin seperti pada stimulus: m₁ = 27,0 kg bergerak ke kanan dengan laju 4,0 m/s, sementara m₂, m₃, dan m₄ = 1,0 kg mula-mula diam. Seluruh tumbukan terjadi beruntun secara elastis sempurna. Jika m₂ dan m₃ dipilih secara optimal membentuk barisan geometri agar kelajuan akhir m₄ maksimum, tentukan kelajuan akhir maksimum m₄ (dalam m/s).',
    hint:
      'Tentukan rasio geometri r = (m₄/m₁)^(1/3) = 1/3 sehingga m₂ = 9,0 kg dan m₃ = 3,0 kg, lalu kalikan kecepatan dengan [2/(1+r)]³.',
    promptNarration:
      'Soal nomor sembilan, perluasan sistem menjadi empat benda beruntun. Massa m satu dua puluh tujuh kilogram melaju empat koma nol meter per sekon menuju m dua, m tiga, dan m empat satu koma nol kilogram yang diam. Untuk memaksimumkan kelajuan akhir m empat, massa disusun membentuk barisan geometri. Tentukan kelajuan akhir maksimum m empat dalam meter per sekon.',
    explanationNarration:
      'Pembahasan soal nomor sembilan. Untuk empat massa yang disusun menjadi barisan geometri dari dua puluh tujuh kilogram ke satu kilogram, rasio r adalah akar pangkat tiga dari satu per dua puluh tujuh, yaitu sepertiga. Maka m dua sembilan kilogram dan m tiga tiga kilogram. Setiap tumbukan pada rasio sepertiga melipatgandakan kecepatan sebesar dua dibagi satu tambah sepertiga, yaitu satu koma lima kali. Setelah tiga kali tumbukan beruntun, kelajuan m empat menjadi satu koma lima pangkat tiga dikali empat koma nol, menghasilkan tiga belas koma lima meter per sekon.',
    explanation: {
      aMemahami:
        'Menyisipkan dua massa perantara (bukan hanya satu) membagi lompatan rasio massa 27 : 1 menjadi tiga tahap lembut dengan rasio masing-masing 3 : 1, sehingga transfer energi menjadi jauh lebih efisien.',
      bDiketahui: [
        'm₁ = 27,0 kg, v₁ = +4,0 m/s',
        'm₄ = 1,0 kg; m₂, m₃, m₄ mula-mula diam',
        'Rasio optimal konstan: m₂/m₁ = m₃/m₂ = m₄/m₃ = r',
      ],
      cDitanyakan: 'Kelajuan akhir maksimum m₄ (dalam m/s).',
      dAnalisisKonsep:
        'Agar hasil kali efisiensi transfer tiga tahap maksimum, setiap tahap harus memiliki rasio massa identik r. Untuk 4 benda (3 tumbukan), m₄ = m₁ r³ ⇒ r = (m₄/m₁)^(1/3).',
      eFbdExplanation:
        'Pada ketiga peristiwa kontak tumbukan beruntun, gaya berat dan normal selalu saling meniadakan di arah-y dan gaya impulsif bekerja murni sepanjang sumbu-x. Setelah seluruh tumbukan, v₁′ < v₂″ < v₃″ < v₄′ sehingga tidak ada tumbukan susulan.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
        { label: 'F₃₄', direction: 'right', targetBodyIndex: 3, category: 'impulse' },
      ],
      fPersamaan: {
        highlightedFormula: 'v₄,maks = [ 2 / (1 + r) ]³ · v₁   dengan   r = (m₄ / m₁)^(1/3)',
        steps: [
          'r³ = m₄ / m₁ = 1 / 27  ⇒  r = 1/3',
          'Didapat m₂ = 27 × (1/3) = 9,0 kg dan m₃ = 9 × (1/3) = 3,0 kg',
          'Faktor pengali tiap tumbukan: 2m_a / (m_a + r m_a) = 2 / (1 + r) = 2 / (4/3) = 3/2 = 1,5',
          'Setelah 3 kali tumbukan: v₄′ = (1,5)³ v₁ = (27/8) v₁',
        ],
      },
      gSubstitusi: [
        'v₂′ = 1,5 × 4,0 = 6,0 m/s',
        'v₃′ = 1,5 × 6,0 = 9,0 m/s',
        'v₄′ = 1,5 × 9,0 = 13,5 m/s',
      ],
      hJawabanAkhir: '13,5 m/s',
      iIntuisiFisika:
        'Tanpa perantara, tumbukan langsung 27 kg ke 1 kg hanya menghasilkan (54/28)×4 ≈ 7,7 m/s. Dengan 2 perantara optimal, kecepatannya melonjak hingga 13,5 m/s (memindahkan hampir 84% energi awal ke bola 1 kg!).',
      jTrikCepat:
        'Rantai N benda optimal berasio r: langsung hitung [2/(1+r)]^(N−1) · v₁. Di sini (3/2)³ × 4 = 27/2 = 13,5 m/s.',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 27.0, x0: 1.0, v0: 4.0, radius: 0.54, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 9.0, x0: 3.8, v0: 0.0, radius: 0.44, color: '#961A34' },
        { id: 'b3', label: 'm₃', mass: 3.0, x0: 6.4, v0: 0.0, radius: 0.36, color: '#B45309' },
        { id: 'b4', label: 'm₄', mass: 1.0, x0: 8.8, v0: 0.0, radius: 0.28, color: '#1E3A5F' },
      ],
      duration: 2.6,
    },
  },
  {
    id: 10,
    code: 'SOAL 10',
    title: 'Tumbukan Elastis dengan Pantulan Dinding Vertikal Kokoh',
    difficulty: 'HOTS Olimpiade',
    relatedChapterId: 'bab-5',
    unit: 'm/s',
    expectedAnswer: 7.0,
    stimulus: {
      kind: 'wall-bounce-track',
      caption: 'Lintasan licin berujung dinding vertikal kokoh di sisi kanan.',
      labels: ['m₁', 'm₂', 'Dinding'],
      masses: ['1,0 kg', '2,0 kg', '∞ (kokoh)'],
      velocities: ['v₁ = +9,0 m/s →', 'diam', 'diam'],
      extraNote: 'm₂ memantul elastis di dinding lalu mengejar m₁ ke kiri',
    },
    prompt:
      'Perhatikan konfigurasi stimulus: bola m₁ = 1,0 kg bergerak ke kanan dengan laju 9,0 m/s menuju bola m₂ = 2,0 kg yang diam di antara m₁ dan sebuah dinding vertikal kokoh di sebelah kanan. Semua tumbukan (bola-bola dan bola-dinding) berlangsung elastis sempurna tanpa gesekan. Setelah m₂ memantul dari dinding, m₂ menumbuk kembali m₁. Tentukan kelajuan akhir m₁ setelah seluruh rangkaian tumbukan selesai (dalam m/s).',
    hint:
      'Saat tumbukan pertama, m₁ memantul ke kiri (−3,0 m/s) dan m₂ ke kanan (+6,0 m/s). Setelah m₂ memantul dari dinding (−6,0 m/s), m₂ mengejar m₁ yang bergerak ke kiri!',
    promptNarration:
      'Soal nomor sepuluh. Bola m satu bermassa satu kilogram bergerak ke kanan sembilan koma nol meter per sekon menuju m dua bermassa dua kilogram yang diam di depan dinding vertikal kokoh. Setelah tumbukan pertama, m dua menumbuk dinding, memantul ke kiri, lalu menumbuk kembali m satu. Tentukan kelajuan akhir m satu setelah seluruh tumbukan selesai dalam meter per sekon.',
    explanationNarration:
      'Pembahasan soal nomor sepuluh. Perhatikan bahwa saat m dua menumbuk dinding, dinding memberikan gaya impulsif eksternal ke kiri sehingga momentum sistem tidak kekal pada pantulan dinding, namun energi kinetik tetap kekal dan kecepatan m dua berbalik menjadi minus enam meter per sekon. Sebelumnya pada tumbukan pertama, m satu memantul ke kiri dengan kecepatan minus tiga meter per sekon. Karena minus enam lebih cepat daripada minus tiga ke arah kiri, m dua menyusul m satu dan terjadilah tumbukan elastis kedua di mana momentum kedua bola kekal kembali. Hasilnya m satu melesat ke kiri dengan kecepatan minus tujuh koma nol meter per sekon, jadi kelajuannya tujuh koma nol meter per sekon.',
    explanation: {
      aMemahami:
        'Dinding berperan sebagai benda bermassa tak hingga (m₃ → ∞) yang membalik arah kecepatan m₂ tanpa mengubah besarnya. Akibatnya m₂ berbalik mengejar m₁ yang sedang melaju ke kiri.',
      bDiketahui: [
        'm₁ = 1,0 kg, v₁ = +9,0 m/s',
        'm₂ = 2,0 kg, v₂ = 0 m/s',
        'Dinding vertikal kokoh di kanan (e = 1)',
      ],
      cDitanyakan: 'Kelajuan akhir (magnitudo kecepatan) m₁ setelah tumbukan selesai (dalam m/s).',
      dAnalisisKonsep:
        'Ada tiga kejadian: (1) m₁ menumbuk m₂ (momentum & energi kekal), (2) m₂ memantul elastis di dinding (energi kekal, arah v₂ berbalik), (3) m₂ mengejar m₁ ke kiri dan bertumbukan elastis lagi (momentum & energi kekal).',
      eFbdExplanation:
        'Saat m₂ mengenai dinding, dinding mengerjakan gaya impulsif luar N_dinding ke arah kiri (−x), mengubah arah momentum m₂. Pada tumbukan bola-bola, gaya impulsif murni internal (aksi-reaksi F₁₂ = −F₂₁).',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'v₁″ (−)', direction: 'left', targetBodyIndex: 0, category: 'velocity' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'F_dinding', direction: 'left', targetBodyIndex: 1, category: 'impulse' },
      ],
      fPersamaan: {
        highlightedFormula:
          'v_dinding′ = −v_dinding   |   v₁″ = [(m₁ − m₂)v₁′ + 2m₂ v₂″] / (m₁ + m₂)',
        steps: [
          'Tahap 1 (m₁ → m₂): v₁′ = [(1−2)/3](9,0) = −3,0 m/s;  v₂′ = [2(1)/3](9,0) = +6,0 m/s',
          'Tahap 2 (m₂ → dinding): v₂″ = −v₂′ = −6,0 m/s',
          'Tahap 3 (m₂ menyusul m₁ di kiri): kedua benda bergerak ke kiri dengan v₁′ = −3,0 m/s dan v₂″ = −6,0 m/s',
        ],
      },
      gSubstitusi: [
        'v₁″ = [(1,0 − 2,0)/(1,0 + 2,0)] (−3,0) + [2(2,0)/(1,0 + 2,0)] (−6,0)',
        'v₁″ = (−1/3)(−3,0) + (4/3)(−6,0) = +1,0 − 8,0 = −7,0 m/s',
        'Cek v₂‴ = (2/3)(−3,0) + (1/3)(−6,0) = −2,0 − 2,0 = −4,0 m/s (karena |−7,0| > |−4,0|, keduanya saling menjauh ke kiri dan tidak bertumbukan lagi)',
        'Kelajuan akhir m₁ = |v₁″| = 7,0 m/s',
      ],
      hJawabanAkhir: '7,0 m/s',
      iIntuisiFisika:
        'Total energi kinetik awal adalah ½(1)(9²) = 40,5 J. Di akhir, energi kinetik total adalah ½(1)(7²) + ½(2)(4²) = 24,5 + 16,0 = 40,5 J, terkonservasi sempurna meski arah momentum total telah dibalikkan oleh dinding.',
      jTrikCepat:
        'Gunakan metode cermin (bayangan): seolah-olah m₂ memantul tidak terjadi dengan membalik kecepatan semua hal, atau langsung gunakan v_CM tahap 3 = [1(−3) + 2(−6)]/3 = −5,0 m/s ⇒ v₁″ = 2(−5,0) − (−3,0) = −7,0 m/s.',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 1.0, x0: 4.5, v0: 9.0, radius: 0.32, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 2.0, x0: 6.8, v0: 0.0, radius: 0.40, color: '#1E3A5F' },
      ],
      wallX: 9.2,
      duration: 2.0,
    },
  },
  {
    id: 11,
    code: 'SOAL 11',
    title: 'Energi Kinetik Maksimum Massa Ketiga dengan Kurva Optimasi',
    difficulty: 'HOTS Olimpiade',
    relatedChapterId: 'bab-4',
    unit: 'Joule',
    expectedAnswer: 32.0,
    stimulus: {
      kind: 'curve-m2-vs-v3',
      caption: 'Grafik fraksi energi kinetik akhir benda 3 (K₃′/E₀) terhadap nilai massa perantara m₂.',
      labels: ['m₁ = 4,0 kg', 'm₂ = m₂*', 'm₃ = 1,0 kg'],
      masses: ['4,0 kg', 'm₂*', '1,0 kg'],
      velocities: ['E₀ = 40,5 J', 'diam', 'diam'],
      extraNote: 'Puncak kurva terjadi pada m₂* = √(m₁ m₃)',
    },
    prompt:
      'Tiga benda segaris berada di lintasan licin dengan m₁ = 4,0 kg dan m₃ = 1,0 kg. Awalnya m₂ dan m₃ diam, sementara m₁ bergerak menuju m₂ dengan energi kinetik awal E₀ = 40,5 J seperti pada stimulus. Seluruh tumbukan berlangsung elastis sempurna dan m₂ dipilih sesuai puncak kurva agar energi kinetik akhir m₃ maksimum. Berapakah energi kinetik akhir maksimum yang dimiliki m₃ (dalam Joule)?',
    hint:
      'Pada titik puncak kurva m₂* = √(4,0 × 1,0) = 2,0 kg, hitung efisiensi transfer tiap tahap η = 4 m_a m_b / (m_a + m_b)² lalu kalikan η₁ · η₂ · E₀.',
    promptNarration:
      'Soal nomor sebelas. Perhatikan grafik hubungan energi kinetik akhir m tiga terhadap massa perantara m dua. Diketahui m satu empat koma nol kilogram memiliki energi kinetik awal empat puluh koma lima Joule, sedangkan m dua dan m tiga satu koma nol kilogram diam. Jika m dua dipilih tepat di puncak kurva, berapakah energi kinetik akhir maksimum m tiga dalam satuan Joule?',
    explanationNarration:
      'Pembahasan soal nomor sebelas. Pada puncak kurva, massa optimal m dua sama dengan akar empat kali satu, yaitu dua koma nol kilogram. Karena rasio massa tahap pertama empat banding dua dan tahap kedua dua banding satu sama-sama dua banding satu, efisiensi transfer energi tiap tahap identik, yaitu delapan per sembilan. Setelah dua tahap tumbukan elastis beruntun, fraksi energi yang sampai ke m tiga adalah delapan per sembilan kuadrat sama dengan enam puluh empat per delapan puluh satu. Dikalikan energi awal empat puluh koma lima Joule menghasilkan tepat tiga puluh dua koma nol Joule.',
    explanation: {
      aMemahami:
        'Alih-alih menghitung kecepatan secara eksplisit, soal ini menguji pemahaman efisiensi transfer energi kinetik berantai dari sumber energi E₀ menuju massa ujung m₃ melalui perantara optimal m₂*.',
      bDiketahui: [
        'm₁ = 4,0 kg, E₀ = 40,5 J',
        'm₃ = 1,0 kg (diam); m₂ = m₂* (diam)',
        'Semua tumbukan elastis sempurna',
      ],
      cDitanyakan: 'Energi kinetik akhir maksimum massa ketiga (K₃,maks) dalam Joule.',
      dAnalisisKonsep:
        'Efisiensi transfer energi satu tumbukan elastis adalah η(m_a, m_b) = 4m_a m_b / (m_a + m_b)². Untuk dua tahap beruntun tanpa tumbukan susulan, K₃′ = η₁ · η₂ · E₀.',
      eFbdExplanation:
        'Selama kontak tahap 1 dan tahap 2, kerja gaya luar total adalah nol (gaya normal dan berat tegak lurus arah gerak, tidak melakukan usaha), sehingga total energi kinetik tiga benda selalu tetap sebesar 40,5 J.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
      ],
      fPersamaan: {
        highlightedFormula: 'K₃,maks = [ 16 m₁ m₃ / (√m₁ + √m₃)⁴ ] · E₀',
        steps: [
          'm₂* = √(m₁ m₃) = √(4,0 × 1,0) = 2,0 kg',
          'η₁ = 4 m₁ m₂* / (m₁ + m₂*)² = 4(4)(2) / 6² = 32/36 = 8/9',
          'η₂ = 4 m₂* m₃ / (m₂* + m₃)² = 4(2)(1) / 3² = 8/9',
          'K₃,maks = η₁ · η₂ · E₀',
        ],
      },
      gSubstitusi: [
        'K₃,maks = (8/9) × (8/9) × 40,5 J',
        'K₃,maks = (64 / 81) × (81 / 2) J = 32,0 J',
      ],
      hJawabanAkhir: '32,0 Joule',
      iIntuisiFisika:
        'Sebanyak 79,0% dari total energi kinetik awal berhasil dipindahkan ke m₃ yang massanya seperempat m₁. Jika tanpa m₂, efisiensi langsung hanya 4(4)(1)/5² = 64% (hanya 25,9 J).',
      jTrikCepat:
        'Dengan rasio r = √(m₃/m₁) = 0,5, efisiensi satu tahap selalu 4r/(1+r)² = 2/2,25 = 8/9, sehingga totalnya (8/9)² × 40,5 = 32,0 J.',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 4.0, x0: 1.5, v0: 4.5, radius: 0.48, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 2.0, x0: 5.0, v0: 0.0, radius: 0.38, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 1.0, x0: 8.2, v0: 0.0, radius: 0.30, color: '#1E3A5F' },
      ],
      duration: 2.8,
    },
  },
  {
    id: 12,
    code: 'SOAL 12',
    title: 'Invariansi Massa Optimal Saat Tumbukan Lenting Sebagian (e < 1)',
    difficulty: 'HOTS Olimpiade',
    relatedChapterId: 'bab-4',
    unit: 'kg',
    expectedAnswer: 3.0,
    stimulus: {
      kind: 'three-body-osk14',
      caption: 'Sistem 3 massa dengan koefisien restitusi seragam e = 0,5 pada setiap tumbukan.',
      labels: ['m₁', 'm₂ (opt)', 'm₃'],
      masses: ['9,0 kg', 'm₂ = ?', '1,0 kg'],
      velocities: ['v₁ →', 'diam', 'diam'],
      extraNote: 'Koefisien restitusi setiap tumbukan: e = 0,5',
    },
    prompt:
      'Tinjau kembali sistem tiga massa segaris seperti pada Soal OSK 2026 Nomor 14: m₁ = 9,0 kg bergerak menuju m₂ yang diam, lalu m₂ menumbuk m₃ = 1,0 kg yang diam. Namun kali ini setiap tumbukan bersifat lenting sebagian dengan koefisien restitusi seragam e = 0,5. Agar kelajuan akhir m₃ tetap bernilai maksimum, berapakah massa m₂ yang harus dipilih (dalam kg)?',
    hint:
      'Turunkan v₃′ menggunakan v_b′ = (1 + e)m_a v_a / (m_a + m_b). Perhatikan bahwa faktor (1 + e)² keluar sebagai konstanta dan tidak memengaruhi posisi maksimum m₂!',
    promptNarration:
      'Soal nomor dua belas menguji ketajaman analisis terhadap asumsi. Sistem tiga massa sama seperti pola OSK nomor empat belas, dengan m satu sembilan kilogram dan m tiga satu kilogram, tetapi tumbukannya lenting sebagian dengan koefisien restitusi e sama dengan nol koma lima. Agar kelajuan akhir m tiga tetap maksimum, berapakah massa m dua yang harus dipilih dalam kilogram?',
    explanationNarration:
      'Pembahasan soal nomor dua belas. Banyak peserta olimpiade mengira koefisien restitusi e yang lebih kecil dari satu mengubah posisi massa perantara optimal. Mari kita buktikan: kecepatan benda target bermassa m b setelah ditumbuk m a dengan restitusi e adalah satu tambah e kali m a v a dibagi m a tambah m b. Maka untuk dua tumbukan beruntun, faktor satu tambah e kuadrat hanya menjadi pengali konstan di pembilang, sementara bentuk penyebut tetap sama persis! Oleh karena itu nilai optimal m dua tidak bergantung pada e dan tetap sama dengan akar sembilan kali satu, yaitu tiga koma nol kilogram.',
    explanation: {
      aMemahami:
        'Kita menguji apakah kehilangan energi mekanik (e = 0,5 < 1) menggeser massa perantara optimal m₂ atau tidak. Hasilnya memperlihatkan struktur matematis yang sangat elegan dari persamaan restitusi.',
      bDiketahui: [
        'm₁ = 9,0 kg (bergerak menuju m₂)',
        'm₃ = 1,0 kg (mula-mula diam)',
        'Koefisien restitusi seragam: e = 0,5',
      ],
      cDitanyakan: 'Massa perantara m₂ agar kelajuan akhir m₃ maksimum (dalam kg).',
      dAnalisisKonsep:
        'Meskipun energi kinetik tidak kekal (e = 0,5), hukum kekekalan momentum dan persamaan restitusi v_b′ − v_a′ = e(v_a − v_b) tetap berlaku untuk menurunkan v₃′(m₂).',
      eFbdExplanation:
        'Selama kontak tumbukan inelastik (e = 0,5), tetap bekerja gaya berat W dan gaya normal N yang seimbang di sumbu-y, serta gaya impulsif aksi-reaksi horizontal yang menjamin kekekalan momentum linear di kedua tahap.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'F₂₁', direction: 'left', targetBodyIndex: 0, category: 'impulse' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'F₁₂', direction: 'right', targetBodyIndex: 1, category: 'impulse' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
      ],
      fPersamaan: {
        highlightedFormula: 'v₃′ = [ (1 + e)² m₁ m₂ / ((m₁ + m₂)(m₂ + m₃)) ] · v₁',
        steps: [
          'Untuk tumbukan m_a (laju v_a) ke m_b (diam) dengan restitusi e: v_b′ = [(1 + e)m_a / (m_a + m_b)] v_a',
          'Tahap 1: v₂′ = [(1 + e)m₁ / (m₁ + m₂)] v₁',
          'Tahap 2: v₃′ = [(1 + e)m₂ / (m₂ + m₃)] v₂′ = [(1 + e)² m₁ m₂ / ((m₁ + m₂)(m₂ + m₃))] v₁',
          'Karena (1 + e)² = 2,25 konstan terhadap m₂, memaksimumkan v₃′ tetap meminimumkan m₂ + m₁m₃/m₂ ⇒ m₂* = √(m₁ m₃)',
        ],
      },
      gSubstitusi: [
        'm₂* = √(9,0 kg × 1,0 kg) = 3,0 kg',
        'Cek tumbukan susulan di m₂ = 3,0 kg dan e = 0,5:',
        'v₁′ = (9 − 0,5×3)/12 · v₁ = 0,625 v₁',
        'v₂′ = (1,5×9)/12 · v₁ = 1,125 v₁;  v₂″ = (3 − 0,5×1)/4 · (1,125 v₁) = 0,703 v₁ > 0,625 v₁ (aman, tidak ada tumbukan ke-3!)',
      ],
      hJawabanAkhir: '3,0 kg',
      iIntuisiFisika:
        'Sifat simetri geometrik antara m₁ dan m₃ bertahan meski sebagian energi hilang menjadi panas. Nilai m₂ = √(m₁m₃) tidak pernah bergantung pada e maupun kecepatan awal v₁.',
      jTrikCepat:
        'Ingat prinsip invariansi: selama e₁ dan e₂ bernilai tetap (tidak bergantung pada m₂), faktor (1+e₁)(1+e₂) hanya menggeser skala tinggi kurva tanpa menggeser absis puncaknya √(m₁m₃).',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 9.0, x0: 1.5, v0: 4.0, radius: 0.52, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 3.0, x0: 5.2, v0: 0.0, radius: 0.40, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 1.0, x0: 8.5, v0: 0.0, radius: 0.30, color: '#1E3A5F' },
      ],
      restitution: 0.5,
      duration: 3.2,
    },
  },
  {
    id: 13,
    code: 'SOAL 13',
    title: 'Sistem 3 Massa dengan Seluruh Benda Sudah Bergerak Awal',
    difficulty: 'HOTS Olimpiade',
    relatedChapterId: 'bab-2',
    unit: 'm/s',
    expectedAnswer: 16.0,
    stimulus: {
      kind: 'data-table-moving',
      caption: 'Data awal kecepatan dan arah gerak ketiga bola pada lintasan horizontal licin.',
      labels: ['Bola 1 (m₁)', 'Bola 2 (m₂)', 'Bola 3 (m₃)'],
      masses: ['6,0 kg', '2,0 kg', '1,0 kg'],
      velocities: ['+8,0 m/s (→)', '+2,0 m/s (→)', '−4,0 m/s (←)'],
      extraNote: 'Urutan kontak awal: m₁ menumbuk m₂ dahulu, lalu m₂ menumbuk m₃',
    },
    prompt:
      'Berdasarkan tabel stimulus, tiga buah bola bergerak pada satu garis lurus di atas bidang datar licin: m₁ = 6,0 kg ke kanan (+8,0 m/s), m₂ = 2,0 kg ke kanan (+2,0 m/s), dan m₃ = 1,0 kg ke kiri (−4,0 m/s). Urutan tumbukan awal adalah m₁ menumbuk m₂ terlebih dahulu, baru kemudian m₂ menumbuk m₃ (seluruh tumbukan elastis sempurna). Tentukan besar kelajuan akhir m₃ setelah seluruh rangkaian tumbukan selesai (dalam m/s).',
    hint:
      'Gunakan metode Kerangka Pusat Massa v′ = 2v_CM − v pada tumbukan 1 (m₁–m₂) dan tumbukan 2 (m₂–m₃). Periksa apakah m₁ menumbuk m₂ lagi memengaruhi m₃.',
    promptNarration:
      'Soal nomor tiga belas. Lihat tabel data pada stimulus: ketiga bola sudah bergerak sejak awal. Bola satu enam kilogram ke kanan delapan meter per sekon, bola dua dua kilogram ke kanan dua meter per sekon, dan bola tiga satu kilogram bergerak berlawanan arah ke kiri empat meter per sekon. Tumbukan terjadi beruntun antara satu-dua lalu dua-tiga secara elastis. Tentukan kelajuan akhir bola tiga dalam meter per sekon.',
    explanationNarration:
      'Pembahasan soal nomor tiga belas. Metode terbersih untuk tumbukan dengan semua benda bergerak adalah metode Pusat Massa. Pada tumbukan pertama antara bola satu dan bola dua, kecepatan pusat massa adalah enam kali delapan tambah dua kali dua dibagi delapan sama dengan enam koma lima meter per sekon. Maka v satu aksen menjadi lima koma nol dan v dua aksen menjadi sebelas koma nol meter per sekon ke kanan. Pada tumbukan kedua antara bola dua berkecepatan sebelas ke kanan dan bola tiga berkecepatan minus empat ke kiri, kecepatan pusat massa adalah dua kali sebelas kurang satu kali empat dibagi tiga sama dengan enam koma nol meter per sekon. Sehingga v tiga akhir menjadi dua kali enam dikurangi minus empat sama dengan enam belas koma nol meter per sekon!',
    explanation: {
      aMemahami:
        'Berbeda dari kondisi dasar di mana m₂ dan m₃ diam, di sini ketiganya bergerak sejak awal (bahkan m₃ menuju ke kiri). Namun konsep tumbukan elastis beruntun dan metode kerangka Pusat Massa menyelesaikannya dengan cepat dan bersih.',
      bDiketahui: [
        'm₁ = 6,0 kg, v₁ = +8,0 m/s',
        'm₂ = 2,0 kg, v₂ = +2,0 m/s',
        'm₃ = 1,0 kg, v₃ = −4,0 m/s (tanda minus karena bergerak ke kiri)',
      ],
      cDitanyakan: 'Kelajuan akhir m₃ setelah seluruh tumbukan selesai (dalam m/s).',
      dAnalisisKonsep:
        'Gunakan rumus pusat massa v_i′ = 2v_CM − v_i pada tumbukan (1, 2), lalu pada tumbukan (2, 3). Setelah tumbukan ke-2, periksa apakah m₁ mengejar m₂ dan memicu tumbukan susulan ke m₃.',
      eFbdExplanation:
        'Pada tumbukan ke-2, m₂ melaju ke kanan (+x) sementara m₃ melaju ke kiri (−x). Gaya kontak aksi-reaksi membalik arah gerak m₃ menjadi ke kanan dengan kelajuan jauh lebih besar; gaya berat dan normal saling meniadakan secara vertikal.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'v₂′ (+)', direction: 'right', targetBodyIndex: 1, category: 'velocity' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
        { label: 'v₃ (−awal)', direction: 'left', targetBodyIndex: 2, category: 'velocity' },
      ],
      fPersamaan: {
        highlightedFormula: 'v_CM = (m_a v_a + m_b v_b)/(m_a + m_b)   ⇒   v_i′ = 2 v_CM − v_i',
        steps: [
          'Tumbukan 1 (m₁ = 6, m₂ = 2): v_CM,12 = (6×8 + 2×2) / 8',
          'v₁′ = 2 v_CM,12 − v₁  dan  v₂′ = 2 v_CM,12 − v₂',
          'Tumbukan 2 (m₂ = 2, m₃ = 1): v_CM,23 = (2 v₂′ + 1 v₃) / 3',
          'v₂″ = 2 v_CM,23 − v₂′  dan  v₃′ = 2 v_CM,23 − v₃',
        ],
      },
      gSubstitusi: [
        'v_CM,12 = (48 + 4) / 8 = 6,5 m/s',
        'v₁′ = 2(6,5) − 8,0 = +5,0 m/s;   v₂′ = 2(6,5) − 2,0 = +11,0 m/s',
        'v_CM,23 = [2(11,0) + 1(−4,0)] / 3 = 18,0 / 3 = +6,0 m/s',
        'v₂″ = 2(6,0) − 11,0 = +1,0 m/s;   v₃′ = 2(6,0) − (−4,0) = +16,0 m/s',
        'Cek tumbukan ke-3: m₁ (+5,0) mengejar m₂ (+1,0) menghasilkan v₂‴ = 7,0 m/s < 16,0 m/s, sehingga m₃ tidak pernah tertumbuk lagi.',
      ],
      hJawabanAkhir: '16,0 m/s',
      iIntuisiFisika:
        'Karena m₃ bergerak berlawanan arah (−4,0 m/s) menyongsong m₂ (+11,0 m/s), kelajuan relatif pendekatan keduanya menjadi 15,0 m/s. Tumbukan berhadapan ini melontarkan m₃ dengan laju +16,0 m/s.',
      jTrikCepat:
        'Selalu konversi tanda arah terlebih dahulu (−4,0), lalu terapkan 2v_CM − v; periksa juga tumbukan susulan m₁–m₂ (hasilnya hanya 7,0 m/s, tak mungkin mengejar 16,0 m/s).',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 6.0, x0: 1.0, v0: 8.0, radius: 0.46, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 2.0, x0: 4.0, v0: 2.0, radius: 0.36, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 1.0, x0: 10.5, v0: -4.0, radius: 0.30, color: '#1E3A5F' },
      ],
      duration: 2.2,
    },
  },
  {
    id: 14,
    code: 'SOAL 14',
    title: 'Kombinasi Lintasan Turun, Tumbukan 3-Massa Optimal & Tanjakan Licin',
    difficulty: 'HOTS Olimpiade',
    relatedChapterId: 'bab-5',
    unit: 'm',
    expectedAnswer: 16.2,
    stimulus: {
      kind: 'ramp-launch-three-body',
      caption: 'Balok m₁ turun dari ketinggian h = 3,2 m menuju tumbukan 3 massa optimal lalu m₃ mendaki tanjakan licin.',
      labels: ['m₁', 'm₂ (opt)', 'm₃'],
      masses: ['9,0 kg', 'm₂*', '1,0 kg'],
      velocities: ['h = 3,2 m (diam)', 'diam', 'diam'],
      extraNote: 'Percepatan gravitasi g = 10 m/s²; seluruh lintasan licin sempurna',
    },
    prompt:
      'Sebuah balok bermassa m₁ = 9,0 kg dilepaskan dari keadaan diam pada ketinggian h = 3,2 m di atas lintasan lengkung licin (g = 10 m/s²) yang tersambung mulus dengan bidang datar licin seperti pada stimulus. Di bidang datar diam dua balok segaris: m₂ dan m₃ = 1,0 kg. Setelah menumbuk m₂ dan m₂ menumbuk m₃ secara elastis sempurna, balok m₃ meluncur menaiki tanjakan licin di ujung kanan hingga berhenti sesaat di ketinggian maksimum H_maks. Jika m₂ dipilih agar H_maks sebesar mungkin, tentukan H_maks (dalam meter).',
    hint:
      'Cari kelajuan awal m₁ di dasar lintasan v₀ = √(2gh) = 8,0 m/s, tentukan m₂* = √(9×1) = 3,0 kg, hitung v₃,maks, lalu konversi ke ketinggian H_maks = v₃,maks² / (2g).',
    promptNarration:
      'Soal nomor empat belas, level HOTS Olimpiade. Balok m satu sembilan koma nol kilogram meluncur dari diam di ketinggian tiga koma dua meter pada lintasan licin, lalu di dasar bidang datar terjadi tumbukan elastis beruntun m satu, m dua, dan m tiga satu koma nol kilogram. Massa m dua dipilih optimal agar ketinggian maksimum yang dicapai m tiga di tanjakan kanan terbesar. Berapakah ketinggian maksimum tersebut dalam meter?',
    explanationNarration:
      'Pembahasan soal nomor empat belas. Di lintasan lengkung pertama, kekekalan energi mekanik memberikan kecepatan m satu di dasar lintasan sebesar akar dua kali sepuluh kali tiga koma dua sama dengan delapan koma nol meter per sekon. Agar tinggi tanjakan akhir m tiga maksimum, kelajuan m tiga harus maksimum sehingga m dua sama dengan akar sembilan kali satu sama dengan tiga koma nol kilogram. Dengan rasio massa sepertiga pada kedua tumbukan, setiap tumbukan mengalikan kelajuan sebesar satu koma lima kali: m dua menjadi dua belas meter per sekon dan m tiga menjadi delapan belas meter per sekon. Akhirnya di tanjakan kanan, energi kinetik berubah menjadi potensial, menghasilkan H maksimum delapan belas kuadrat dibagi dua puluh sama dengan enam belas koma dua meter!',
    explanation: {
      aMemahami:
        'Soal ini memadukan kekekalan energi mekanik di lintasan gravitasi dengan prinsip inti Soal OSK 2026 No. 14 di bidang datar. Perhatikan betapa mengejutkannya hasil fisika: massa kecil m₃ sanggup naik ke ketinggian yang jauh lebih tinggi dari ketinggian awal m₁ (16,2 m vs 3,2 m)!',
      bDiketahui: [
        'm₁ = 9,0 kg, h_awal = 3,2 m, g = 10 m/s²',
        'm₃ = 1,0 kg; m₂ dipilih optimal untuk H_maks',
        'Semua lintasan dan tumbukan licin serta elastis sempurna',
      ],
      cDitanyakan: 'Ketinggian maksimum yang dicapai m₃ pada tanjakan kanan (H_maks dalam meter).',
      dAnalisisKonsep:
        'Tiga fase terpisah: (1) Kekekalan energi mekanik m₁ menuruni lengkungan; (2) Tumbukan elastis beruntun 3-massa di dasar datar; (3) Kekekalan energi mekanik m₃ mendaki tanjakan.',
      eFbdExplanation:
        'Saat menuruni dan mendaki lintasan miring, gaya normal N tegak lurus lintasan (tidak melakukan usaha), sedangkan komponen berat mg sin θ mempercepat m₁ turun dan memperlambat m₃ naik. Pada fase tumbukan datar, N = mg dan gaya kontak horizontal bekerja secara impulsif.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
      ],
      fPersamaan: {
        highlightedFormula: 'H_maks = (v₃,maks / v₀)² · h   dengan   v₃,maks = [4 m₁ / (√m₁ + √m₃)²] v₀',
        steps: [
          'Fase 1: ½ m₁ v₀² = m₁ g h  ⇒  v₀ = √(2gh)',
          'Fase 2: m₂* = √(m₁ m₃) = 3,0 kg, faktor pengali kelajuan total = 4 m₁ / (√m₁ + √m₃)²',
          'Fase 3: m₃ g H_maks = ½ m₃ (v₃,maks)²  ⇒  H_maks = (v₃,maks)² / (2g)',
        ],
      },
      gSubstitusi: [
        'v₀ = √(2 × 10 × 3,2) = √64 = 8,0 m/s',
        'm₂* = √(9,0 × 1,0) = 3,0 kg',
        'v₂′ = [2(9)/(9+3)] × 8,0 = 1,5 × 8,0 = 12,0 m/s',
        'v₃,maks = [2(3)/(3+1)] × 12,0 = 1,5 × 12,0 = 18,0 m/s',
        'H_maks = 18,0² / (2 × 10) = 324 / 20 = 16,2 m',
      ],
      hJawabanAkhir: '16,2 m',
      iIntuisiFisika:
        'Tidak ada pelanggaran kekekalan energi! Energi potensial awal m₁ adalah 9 × 10 × 3,2 = 288 J. Pada akhirnya m₃ bermassa 1 kg memiliki energi potensial 1 × 10 × 16,2 = 162 J (56,25% dari energi awal), sedangkan sisanya masih tersimpan pada gerak m₁ dan m₂.',
      jTrikCepat:
        'Karena H ∝ v², langsung gunakan rasio kuadrat: v₃,maks / v₀ = (1,5)² = 9/4, maka H_maks = (9/4)² × h = (81/16) × 3,2 = 16,2 m tanpa perlu menghitung g!',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 9.0, x0: 0.6, v0: 0.0, radius: 0.45, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 3.0, x0: 4.5, v0: 0.0, radius: 0.36, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 1.0, x0: 7.0, v0: 0.0, radius: 0.28, color: '#1E3A5F' },
      ],
      initialRamp: {
        bodyIndex: 0,
        height: 3.2,
        gravity: 10,
        flatEntryX: 2.5,
      },
      finalRamp: {
        bodyIndex: 2,
        startX: 8.5,
        gravity: 10,
        angleDeg: 35,
      },
      duration: 5.5,
    },
  },
  {
    id: 15,
    code: 'SOAL 15',
    title: 'Tumbukan Beruntun 3-Massa dengan Pegas Penyangga di Ujung Lintasan',
    difficulty: 'HOTS Olimpiade',
    relatedChapterId: 'bab-5',
    unit: 'cm',
    expectedAnswer: 32.0,
    stimulus: {
      kind: 'spring-end-three-body',
      caption: 'Massa m₃ terhubung ke dinding vertikal kanan melalui pegas ringan berkonstanta k = 1200 N/m.',
      labels: ['m₁', 'm₂ (opt)', 'm₃'],
      masses: ['12,0 kg', 'm₂*', '0,75 kg'],
      velocities: ['v₁ = +5,0 m/s →', 'diam', 'diam (pegas rileks)'],
      extraNote: 'k = 1200 N/m; tumbukan m₂–m₃ bersifat impulsif (sangat singkat)',
    },
    prompt:
      'Pada sistem bidang datar licin seperti ditunjukkan pada stimulus, m₁ = 12,0 kg bergerak dengan kelajuan 5,0 m/s menuju m₂ yang diam. Di sebelah kanan m₂, benda m₃ = 0,75 kg diam dan terhubung dengan dinding vertikal kanan melalui pegas tak bermassa berkonstanta k = 1200 N/m dalam keadaan rileks. Kedua tumbukan (m₁–m₂ dan m₂–m₃) bersifat elastis sempurna dan terjadi sangat singkat (impulsif). Jika m₂ dipilih agar kompresi maksimum pegas bernilai terbesar, tentukan kompresi maksimum pegas (dalam cm).',
    hint:
      'Karena tumbukan impulsif, pegas belum tertekan saat tumbukan m₂–m₃ berlangsung. Cari m₂* = √(12,0 × 0,75) = 3,0 kg, hitung v₃′, lalu gunakan ½ k x_maks² = ½ m₃ (v₃′)².',
    promptNarration:
      'Soal nomor lima belas, soal tantangan terakhir. Massa m satu dua belas koma nol kilogram melaju lima koma nol meter per sekon menuju m dua yang diam dan m tiga nol koma tujuh lima kilogram yang terhubung ke dinding oleh pegas berkonstanta seribu dua ratus Newton per meter. Kedua tumbukan berlangsung elastis dan sangat singkat. Jika m dua dipilih agar kompresi pegas terbesar, tentukan kompresi maksimum pegas dalam satuan sentimeter.',
    explanationNarration:
      'Pembahasan soal nomor lima belas. Karena tumbukan antara m dua dan m tiga berlangsung sangat singkat secara impulsif, pegas belum sempat memendek selama tumbukan sehingga gaya pegas dapat diabaikan saat tumbukan dan m tiga memperoleh kelajuan murni dari hukum kekekalan momentum dan energi. Agar kompresi pegas maksimum, energi kinetik m tiga harus maksimum, yaitu saat m dua sama dengan akar dua belas kali nol koma tujuh lima sama dengan tiga koma nol kilogram. Kelajuan m dua menjadi delapan meter per sekon dan kelajuan m tiga menjadi dua belas koma delapan meter per sekon. Setelah tumbukan, energi kinetik m tiga berubah sempurna menjadi energi potensial pegas, menghasilkan x maksimum nol koma tiga dua meter atau tiga puluh dua koma nol sentimeter.',
    explanation: {
      aMemahami:
        'Menggabungkan konsep tumbukan beruntun impulsif dengan dinamika harmonik pegas. Kunci fisika berada pada pemisahan skala waktu: waktu kontak tumbukan jauh lebih singkat daripada seperempat periode pegas.',
      bDiketahui: [
        'm₁ = 12,0 kg, v₁ = +5,0 m/s',
        'm₃ = 0,75 kg (diam, terikat pegas k = 1200 N/m)',
        'Tumbukan impulsif elastis; m₂ dipilih agar x_maks maksimum',
      ],
      cDitanyakan: 'Kompresi maksimum pegas (x_maks) dalam satuan cm.',
      dAnalisisKonsep:
        'Kompresi pegas maksimum tercapai jika energi kinetik yang masuk ke m₃ (yaitu ½ m₃ v₃′²) sebesar mungkin, yang menuntut m₂* = √(m₁ m₃). Setelah tumbukan m₂–m₃ berakhir, m₃ menekan pegas hingga berhenti sesaat (½ k x_maks² = ½ m₃ v₃′²).',
      eFbdExplanation:
        'Selama fase tumbukan impulsif, gaya pegas kx ≈ 0 karena x ≈ 0. Setelah m₃ lepas dari m₂ dan bergerak ke kanan menekan pegas, gaya pemulih pegas F_pegas = kx mengarah ke kiri (−x) memperlambat m₃ hingga v = 0 pada x = x_maks.',
      eFbdVectors: [
        { label: 'N₁', direction: 'up', targetBodyIndex: 0, category: 'normal' },
        { label: 'W₁', direction: 'down', targetBodyIndex: 0, category: 'weight' },
        { label: 'N₂', direction: 'up', targetBodyIndex: 1, category: 'normal' },
        { label: 'W₂', direction: 'down', targetBodyIndex: 1, category: 'weight' },
        { label: 'N₃', direction: 'up', targetBodyIndex: 2, category: 'normal' },
        { label: 'W₃', direction: 'down', targetBodyIndex: 2, category: 'weight' },
        { label: 'F_pegas = kx', direction: 'left', targetBodyIndex: 2, category: 'spring' },
      ],
      fPersamaan: {
        highlightedFormula: 'x_maks = v₃,maks · √(m₃ / k)',
        steps: [
          'm₂* = √(m₁ m₃)',
          'v₂′ = [2 m₁ / (m₁ + m₂*)] v₁   dan   v₃,maks = [2 m₂* / (m₂* + m₃)] v₂′',
          'Kekekalan energi mekanik pegas-massa: ½ k x_maks² = ½ m₃ (v₃,maks)²',
          'x_maks = v₃,maks √(m₃ / k)',
        ],
      },
      gSubstitusi: [
        'm₂* = √(12,0 × 0,75) = √9,0 = 3,0 kg',
        'v₂′ = [24,0 / 15,0] × 5,0 = 1,6 × 5,0 = 8,0 m/s',
        'v₃,maks = [6,0 / 3,75] × 8,0 = 1,6 × 8,0 = 12,8 m/s',
        'x_maks = 12,8 × √(0,75 / 1200) = 12,8 × √(1 / 1600) = 12,8 / 40 = 0,32 m = 32,0 cm',
      ],
      hJawabanAkhir: '32,0 cm',
      iIntuisiFisika:
        'Periode osilasi m₃ pada pegas adalah T = 2π√(m₃/k) = 2π/40 ≈ 0,157 s, sedangkan durasi tumbukan elastis logam hanya orde 10⁻⁴ s. Oleh sebab itu asumsi tumbukan impulsif (pegas belum tertekan saat kontak) sangat akurat secara fisis.',
      jTrikCepat:
        'Faktor pengali tiap tahap 1,6 ⇒ v₃,maks = 1,6² × 5,0 = 12,8 m/s. Perhatikan 0,75/1200 = 3/4800 = 1/1600 ⇒ √(1/1600) = 1/40, sehingga x_maks = 12,8 / 40 = 0,32 m = 32,0 cm.',
    },
    simulationConfig: {
      bodies: [
        { id: 'b1', label: 'm₁', mass: 12.0, x0: 1.0, v0: 5.0, radius: 0.50, color: '#7A1228' },
        { id: 'b2', label: 'm₂', mass: 3.0, x0: 4.5, v0: 0.0, radius: 0.38, color: '#B45309' },
        { id: 'b3', label: 'm₃', mass: 0.75, x0: 7.8, v0: 0.0, radius: 0.28, color: '#1E3A5F' },
      ],
      spring: {
        attachedToIndex: 2,
        k: 1200,
        equilibriumX: 7.8,
        wallX: 10.2,
      },
      duration: 2.2,
    },
  },
];
