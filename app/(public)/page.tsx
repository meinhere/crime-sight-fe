"use client";

import { IconChartBar, IconFilter, IconInfoCircle } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { CrimeProvinceList } from "@/components/crime-povince-list";
import { CrimeTrendChart } from "@/components/crime-trend-chart";
import { LogActivity } from "@/components/log-activity";
import { districtsData } from "@/data/districts-data";
import dynamic from "next/dynamic";
import { is } from "zod/v4/locales";
import { set } from "zod";

const IndonesiaCrimeMap = dynamic(
  () =>
    import("@/components/indonesia-crime-map").then((mod) => ({
      default: mod.IndonesiaCrimeMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat peta Indonesia...</p>
          <p className="text-sm text-gray-500 mt-1">Memproses data wilayah</p>
        </div>
      </div>
    ),
  }
);
export default function Home() {
  const [selectedCrimeType, setSelectedCrimeType] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const filteredDistricts = useMemo(() => {
    if (selectedRegion === "all" || selectedRegion === "jawa-timur") {
      return districtsData;
    }
    return districtsData.filter((district) => district.id === selectedRegion);
  }, [selectedRegion]);

  return (
    <div className="min-h-screen flex flex-col w-full gap-8">
      {isLogin ? (
        <div className="flex-1 w-full flex flex-col gap-8">
          {/* section 1 */}
          <section className="flex flex-col lg:flex-row gap-8 w-full">
            {/* chart */}
            <div className="w-full">
              <CrimeTrendChart className="lg:w-full lg:h-screen" />
            </div>
          </section>

          {/* Section 2 */}
          <section className="flex gap-8 w-full flex-col lg:flex-row ">
            {/* lokasi */}
            <CrimeProvinceList className="lg:w-1/2 " />

            {/* log activity */}
            <LogActivity />
          </section>
        </div>
      ) : (
        <div className="text-gray-800 relative scroll-smooth">
          {/* Optional background glow */}
          <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-white to-[#e0e0e0] opacity-40 blur-[100px] rounded-full transform -translate-x-1/2 -z-10" />

          {/* HERO SECTION - full screen */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight max-w-4xl">
              Satu Klik untuk Informasi Kejahatan & Ringkasan Hukum
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-10">
              Temukan visualisasi data kejahatan, chatbot hukum, dan AI yang
              meringkas dokumen putusan dengan mudah, cepat, dan akurat. Untuk
              masyarakat, pelajar, dan profesional hukum.
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
              <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition font-medium" onClick={setIsLogin.bind(null, true)}>
                Jelajahi Sekarang
              </button>
              <button
                onClick={() => {
                  document
                    .getElementById("fitur")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition font-medium"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </section>

          {/* FITUR DETAIL SECTION */}
          <section id="fitur" className="py-24 px-6 bg-white rounded-lg">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Fitur Kami
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Card Template */}
                {[
                  {
                    icon: "📍",
                    title: "Visualisasi Kejahatan",
                    desc: "Lihat data kejahatan dalam bentuk peta interaktif dan grafik statistik. Cocok untuk riset, edukasi, dan pemahaman tren sosial.",
                  },
                  {
                    icon: "🤖",
                    title: "Chatbot Hukum",
                    desc: "Ajukan pertanyaan seputar hukum dan dapatkan jawaban dari AI yang dilatih dengan data hukum Indonesia. Cepat dan mudah dipahami.",
                  },
                  {
                    icon: "🔍",
                    title: "Cari Dokumen Putusan",
                    desc: "Cari dokumen putusan hanya dengan informasi dasar seperti nama, lokasi, atau jenis perkara. Hasil cepat dan relevan.",
                  },
                  {
                    icon: "🧠",
                    title: "Ringkasan AI",
                    desc: "AI akan merangkum isi dokumen putusan secara otomatis, sehingga kamu bisa memahami intinya tanpa membaca panjang lebar.",
                  },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(96,165,250,0.5)] transition-shadow duration-300 cursor-pointer"
                  >
                    <h3 className="text-2xl font-semibold mb-3 flex items-center gap-3">
                      <span className="text-3xl">{icon}</span> {title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-20 px-6 bg-black text-white rounded-lg mt-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Mulai Jelajahi Data Kejahatan & Putusan Hukum Sekarang!
              </h2>
              <p className="text-lg mb-10 text-gray-300 max-w-2xl mx-auto">
                Dapatkan akses mudah ke informasi yang kamu butuhkan, dengan
                fitur canggih dan AI yang membantu memahami hukum.
              </p>
              <div className="flex justify-center gap-6 flex-wrap">
                <button
                  onClick={() => {
                  document
                    .getElementById("fitur")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                  className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-300 transition"
                >
                  Pelajari Lebih Lanjut
                </button>
                <a
                  href="/signup"
                  className="px-8 py-3 border border-white rounded-full font-semibold hover:bg-white hover:text-black transition"
                >
                  Daftar Sekarang
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
