export default function Home() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                    CrimeSight
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                    Platform Analisis Data Kejahatan Indonesia Berbasis AI
                </p>
                <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
            </div>

            {/* Description Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-black">Tentang CrimeSight</h2>
                    <p className="text-gray-600 leading-relaxed">
                        CrimeSight adalah platform inovatif yang mengintegrasikan teknologi artificial intelligence
                        untuk menganalisis data kejahatan di Indonesia. Kami menyediakan visualisasi data yang
                        komprehensif dan insights mendalam untuk membantu pemahaman pola kejahatan.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Platform ini dirancang untuk memberikan akses mudah kepada masyarakat umum dan
                        profesional dalam memahami dinamika keamanan di berbagai wilayah Indonesia.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-black">Fitur Utama</h2>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-600">
                                <span className="font-medium">Peta Interaktif</span> - Visualisasi geografis data kejahatan real-time
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-600">
                                <span className="font-medium">AI Chatbot</span> - Asisten cerdas untuk analisis data
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-600">
                                <span className="font-medium">Document AI</span> - Summarisasi dokumen hukum otomatis
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-600">
                                <span className="font-medium">Search Engine</span> - Pencarian kasus dengan AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-black">Misi Kami</h2>
                    <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        Meningkatkan transparansi dan aksesibilitas informasi kejahatan di Indonesia melalui
                        teknologi AI yang canggih. Kami berkomitmen untuk menyediakan data yang akurat,
                        real-time, dan mudah dipahami untuk mendukung keamanan masyarakat.
                    </p>
                </div>
            </div>

            {/* Technology Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-black text-center">Teknologi yang Digunakan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-3 p-6 bg-white border-2 border-gray-200 rounded-lg">
                        <div className="w-12 h-12 bg-black rounded-lg mx-auto flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded"></div>
                        </div>
                        <h3 className="font-semibold text-black">Machine Learning</h3>
                        <p className="text-sm text-gray-600">
                            Algoritma ML untuk prediksi dan analisis pola kejahatan
                        </p>
                    </div>

                    <div className="text-center space-y-3 p-6 bg-white border-2 border-gray-200 rounded-lg">
                        <div className="w-12 h-12 bg-black rounded-lg mx-auto flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full"></div>
                        </div>
                        <h3 className="font-semibold text-black">Natural Language Processing</h3>
                        <p className="text-sm text-gray-600">
                            NLP untuk pemrosesan dokumen dan chatbot interaction
                        </p>
                    </div>

                    <div className="text-center space-y-3 p-6 bg-white border-2 border-gray-200 rounded-lg">
                        <div className="w-12 h-12 bg-black rounded-lg mx-auto flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
                        </div>
                        <h3 className="font-semibold text-black">Data Visualization</h3>
                        <p className="text-sm text-gray-600">
                            Visualisasi interaktif untuk pemahaman data yang lebih baik
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-6 pt-8">
                <h2 className="text-2xl font-semibold text-black">Mulai Eksplorasi</h2>
                <p className="text-gray-600">
                    Jelajahi fitur-fitur CrimeSight dan dapatkan insights mendalam tentang data kejahatan Indonesia
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/criminal-maps"
                        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Lihat Peta Kejahatan
                    </a>
                    <a
                        href="/chatbot"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                        Chat dengan AI
                    </a>
                </div>
            </div>

            {/* Footer Info */}
            <div className="text-center pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    Platform ini dikembangkan untuk tujuan edukasi dan transparansi informasi publik
                </p>
            </div>
        </div>
    )
}