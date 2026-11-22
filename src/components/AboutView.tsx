interface AboutViewProps {
  onStartLearn: () => void;
  onStartPractice: () => void;
}

export function AboutView({ onStartLearn, onStartPractice }: AboutViewProps) {
  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <p className="text-xs font-bold tracking-wider text-[#7A1228] uppercase">
          Tentang Pembelajaran
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl">
          OLYMPIAD PHYSICS TRAINING · CITY LEVEL – OSK 2026
        </h2>
        <p className="mt-1 text-sm font-bold text-stone-700">
          SPECIAL TRAINING: QUESTION NUMBER 14 · TEACHER: MISTER JO
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 lg:col-span-7">
          <h3 className="text-lg font-extrabold text-stone-900">
            Analisis Sumber Asli: Soal Nomor 14 OSK Fisika SMA 2026
          </h3>
          <div className="rounded-xl border border-[#E8B4BF] bg-[#FDF5F6] p-4 text-sm leading-relaxed text-stone-800">
            <p className="font-semibold text-[#7A1228] mb-1">Naskah Asli Soal No. 14 (Momentum Linear):</p>
            <p className="italic">
              &ldquo;Tinjau sebuah sistem dengan 3 buah massa seperti pada ilustrasi pada gambar.
              Awalnya m₂ dan m₃ = 0,25 kg diam, sementara m₁ = 9 kg bergerak menuju m₂. Pada keadaan
              akhir, kecepatan m₃ maksimum. Jika seluruh peristiwa tumbukan bersifat elastis, maka
              massa m₂ sama dengan ... kg.&rdquo;
            </p>
            <p className="mt-2 font-mono text-xs font-bold text-[#7A1228]">
              Kunci terverifikasi: m₂ = √(m₁ · m₃) = √(9 × 0,25) = 1,5 kg
            </p>
          </div>

          <p className="text-sm leading-relaxed text-stone-700">
            Soal ini menguji pemahaman mendalam siswa tentang{' '}
            <strong>transfer momentum &amp; energi kinetik pada tumbukan elastis 1D beruntun</strong>{' '}
            serta teknik optimasi analitis (<em>mechanical impedance matching</em>). Banyak peserta
            berhenti pada perhitungan dua tumbukan dasar tanpa memahami mengapa massa perantara m₂
            membentuk rata-rata geometrik, maupun bagaimana batas kondisi tanpa tumbukan susulan
            bekerja.
          </p>

          <h4 className="text-base font-bold text-stone-900 pt-2">
            Alur Belajar yang Direkomendasikan Mister Jo
          </h4>
          <ol className="space-y-2.5 text-sm text-stone-700">
            <li>
              <strong>1. Peta Konsep &amp; Belajar Teori (Bab 1–5):</strong> Pahami dulu mengapa
              persamaan restitusi muncul dari kekekalan energi, metode Kerangka Pusat Massa, hingga
              pembuktian AM-GM untuk m₂ = √(m₁m₃).
            </li>
            <li>
              <strong>2. Eksplorasi Galeri Visualisasi:</strong> Gunakan penggeser parameter untuk
              melihat kurva v₃′(m₂) dan kapan tumbukan susulan muncul.
            </li>
            <li>
              <strong>3. Latihan 15 Soal Isian Singkat:</strong> Kerjakan bertahap dari tingkat
              Pengenalan Konsep (Soal 1–3) hingga HOTS Olimpiade (Soal 10–15) menggunakan format 1
              desimal koma.
            </li>
            <li>
              <strong>4. Buka Pembahasan A–J &amp; Putar Animasi Pembuktian:</strong> Pelajari FBD,
              makna fisis, serta gunakan Narator Suara untuk mengulang konsep penting.
            </li>
          </ol>
        </div>

        <aside className="space-y-5 rounded-2xl border border-stone-200 bg-[#FAF8F8] p-6 lg:col-span-5">
          <h3 className="text-lg font-extrabold text-stone-900">Profil Pembimbing</h3>
          <div className="space-y-2 text-sm text-stone-700">
            <div className="text-base font-bold text-[#7A1228]">MISTER JO</div>
            <p>
              Pembimbing Olimpiade Sains Fisika tingkat Kota/Kabupaten (OSK), Provinsi (OSP),
              hingga Nasional. Fokus pembinaan menekankan intuisi fisis, visualisasi vektor yang
              presisi, dan penurunan matematis tanpa menghafal rumus buta.
            </p>
          </div>

          <div className="h-px bg-stone-200" />

          <div className="space-y-2 text-xs text-stone-600">
            <div className="font-bold text-stone-900">Standar Ilmiah Aplikasi Ini:</div>
            <p>• Seluruh simulasi menggunakan integrator tumbukan berbasis peristiwa eksak (zero tunneling).</p>
            <p>• Kunci numerik diverifikasi melalui hukum kekekalan momentum dan energi kinetik.</p>
            <p>• Format jawaban mengikuti kaidah penulisan ilmiah Indonesia (desimal koma, 1 angka belakang koma).</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={onStartLearn}
              className="rounded-xl bg-[#7A1228] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#5E0D1E] cursor-pointer"
            >
              MULAI BELAJAR TEORI
            </button>
            <button
              type="button"
              onClick={onStartPractice}
              className="rounded-xl border border-[#7A1228] bg-white px-4 py-2.5 text-xs font-bold text-[#7A1228] hover:bg-[#FDF5F6] cursor-pointer"
            >
              KERJAKAN 15 SOAL
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
