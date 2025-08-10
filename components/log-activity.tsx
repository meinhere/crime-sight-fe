export function LogActivity() {
  const logs = [
    {
      id: 1,
      type: "pdf",
      icon: "/images/pdf-icon.png",
      title: "Ringkasan putusan pidana 2021.pdf",
      size: "320 KB",
      timestamp: "",
      status: "",
    },
    {
      id: 2,
      type: "chat",
      icon: "",
      title: "Apa beda perdata dan pidana?",
      timestamp: "",
      status: "",
    },
    {
      id: 3,
      type: "search",
      icon: "",
      title: "Cari putusan narkotika tahun 2022",
      timestamp: "",
      status: "",
    },
    {
      id: 4,
      type: "pdf",
      icon: "/images/pdf-icon.png",
      title: "Putusan sengketa tanah - Bandung.pdf",
      size: "412 KB",
      timestamp: "",
      status: "",
    },
    {
      id: 5,
      type: "map",
      icon: "",
      title: "Lihat peta persebaran kejahatan",
      timestamp: "",
      status: "",
    },
    {
      id: 6,
      type: "chat",
      icon: "",
      title: "Apa arti ne bis in idem?",
      timestamp: "",
      status: "",
    },
  ];

  return (
    <div className="flex w-full flex-col items-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Log Aktivitas
        </h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-[#f7f8fa] rounded-xl p-4 flex items-start gap-4 shadow-sm"
            >
              {/* Icon */}
              {log.type === "pdf" ? (
                <img
                  src={log.icon}
                  alt="PDF"
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="text-2xl">{log.icon}</div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">
                  {log.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {log.timestamp} {" "}
                  <span
                    className={
                      log.status.includes("unggah") || log.status.includes("Mengunggah")
                        ? "text-blue-500"
                        : "text-gray-600"
                    }
                  >
                    {log.status}
                  </span>
                  {log.size && ` • ${log.size}`}
                </div>

                {/* Upload progress (jika ada) */}
                {log.status.toLowerCase().includes("unggah") && (
                  <div className="w-full h-1 bg-gray-200 rounded mt-2">
                    <div
                      className="h-1 bg-blue-500 rounded"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button className="text-gray-400 hover:text-gray-600 transition">
                <svg width="20" height="20" fill="none">
                  <circle cx="10" cy="10" r="9" fill="#f3f4f6" />
                  <path
                    d="M6 6l8 8M14 6l-8 8"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 text-right text-gray-700">
          <span className="font-semibold text-base">“Hukum itu apa?”</span>
        </div>
      </div>
    </div>
  );
}
