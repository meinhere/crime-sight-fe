"use client";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="text-gray-800 relative scroll-smooth bg-gray-100">
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight tracking-tight max-w-4xl text-gray-700">
            Clustering Kejahatan & Pencarian Putusan Mahkamah Agung
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-10">
            Eksplorasi data kasus pidana dari Mahkamah Agung Indonesia dengan
            visualisasi clustering kejahatan dan pencarian dokumen putusan yang
            cerdas. Didukung machine learning dan teknologi temu kembali informasi.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => {
                window.location.href = "/criminal-maps";
              }}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Jelajahi Data Kejahatan
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("fitur")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-gray-400 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium text-gray-700"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </section>

        {/* FITUR UTAMA SECTION */}
        <section id="fitur" className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-700">
              Fitur Utama
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Clustering Kejahatan */}
              <div
                onClick={() => {
                  window.location.href = "/criminal-maps";
                }}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-3 text-blue-600">
                  <span className="text-2xl">📊</span> Clustering Kejahatan
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Visualisasi data kasus pidana seluruh pengadilan negeri di
                  Indonesia dalam bentuk peta interaktif dengan clustering
                  machine learning dan visualisasi untuk identifikasi trend dan
                  wilayah dan waktu.
                </p>
              </div>

              {/* Pencarian Putusan Cerdas */}
              <div
                onClick={() => {
                  window.location.href = "/find-case";
                }}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-3 text-blue-600">
                  <span className="text-2xl">🔍</span> Pencarian Putusan Cerdas
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Cari dokumen putusan dengan teknologi temu kembali
                  informasi yang canggih. Temukan putusan berdasarkan tema,
                  kasus atau perkara, atau kata kunci dengan hasil yang akurat
                  dan relevan.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Statistik & Tren */}
              <div
                onClick={() => {
                  window.location.href = "/criminal-maps";
                }}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-3 text-blue-600">
                  <span className="text-2xl">📈</span> Statistik & Tren
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Analisis statistik komprehensif tentang tren kejahatan di
                  Indonesia. Data real-time dari Mahkamah Agung yang diolah
                  dengan metode machine learning untuk insight yang
                  mendalam.
                </p>
              </div>

              {/* Ringkasan Putusan */}
              <div
                onClick={() => {
                  window.location.href = "/find-case";
                }}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-3 text-blue-600">
                  <span className="text-2xl">📄</span> Ringkasan Putusan
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Setiap dokumen putusan dilengkapi dengan ringkasan
                  otomatis yang memudahkan pemahaman isi putusan tanpa
                  harus membaca keseluruhan dokumen yang panjang.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUMBER DATA SECTION */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-700">
              Sumber Data Terpercaya
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Data yang kami gunakan berasal langsung dari website Mahkamah Agung Republik
              Indonesia, mencakup seluruh peradilan negeri di Indonesia. Diproses menggunakan
              teknologi machine learning untuk analisis yang akurat.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Data Mahkamah Agung */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-700">Data Mahkamah Agung</h3>
                <p className="text-sm text-gray-600">
                  Sumber resmi putusan pengadilan
                  negeri se-Indonesia
                </p>
              </div>

              {/* Machine Learning */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-700">Machine Learning</h3>
                <p className="text-sm text-gray-600">
                  Clustering dan analisis otomatis
                  untuk insight mendalam
                </p>
              </div>

              {/* Information Retrieval */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-700">Information Retrieval</h3>
                <p className="text-sm text-gray-600">
                  Teknologi pencarian canggih dengan
                  akurasi tinggi
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Mulai Eksplorasi Data Kejahatan Indonesia
            </h2>
            <p className="text-base mb-8 text-gray-300 max-w-2xl mx-auto">
              Dapatkan insight mendalam tentang pola kejahatan di Indonesia dan akses mudah
              ke dokumen putusan dengan teknologi machine learning terdepan.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => {
                  window.location.href = "/criminal-maps";
                }}
                className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Lihat Peta Kejahatan
              </button>
              <button
                onClick={() => {
                  window.location.href = "/find-case";
                }}
                className="px-6 py-3 border border-white rounded-lg font-medium hover:bg-white hover:text-black transition"
              >
                Cari Putusan
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}