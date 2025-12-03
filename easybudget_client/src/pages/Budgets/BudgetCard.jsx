import { Trash2, AlertCircle, CheckCircle, Clock, CalendarDays, Archive } from "lucide-react";

export default function BudgetCard({ budget, onDelete }) {
  const limit = Number(budget.limit_amount);
  const used = Number(budget.used_amount);
  const remaining = limit - used;
  
  let percentage = limit === 0 ? 0 : (used / limit) * 100;
  const displayPercentage = percentage > 100 ? 100 : percentage;

  // --- LOGIC STATUS ---
  const now = new Date();
  // Set jam ke 00:00:00 agar perbandingan tanggal akurat
  now.setHours(0, 0, 0, 0);
  const startDate = new Date(budget.period_start);
  const endDate = new Date(budget.period_end);

  let status = "active";
  let statusColor = "bg-green-100 text-green-700";
  let statusLabel = "Aktif";
  let statusIcon = <CheckCircle size={14} />;

  if (now < startDate) {
    status = "upcoming";
    statusColor = "bg-blue-100 text-blue-700";
    statusLabel = "Akan Datang";
    statusIcon = <CalendarDays size={14} />;
  } else if (now > endDate) {
    status = "expired";
    statusColor = "bg-gray-100 text-gray-600";
    statusLabel = "Selesai";
    statusIcon = <Archive size={14} />;
  }

  // Warna Progress Bar (Hanya relevan jika aktif/selesai)
  let progressColor = "bg-green-500";
  let textColor = "text-green-600";
  
  if (percentage >= 100) {
    progressColor = "bg-red-500";
    textColor = "text-red-600";
  } else if (percentage >= 80) {
    progressColor = "bg-yellow-500";
    textColor = "text-yellow-600";
  }

  // Jika budget belum mulai, progress bar abu-abu
  if (status === "upcoming") {
    progressColor = "bg-blue-200";
    textColor = "text-blue-600";
  }

  const formatRp = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  
  // Format tanggal lebih lengkap (dd MMM yyyy)
  const formatDateFull = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group ${status === 'expired' ? 'opacity-75' : ''}`}>
      
      <button 
        onClick={() => onDelete(budget.budget_id)}
        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
        title="Hapus Budget"
      >
        <Trash2 size={16} />
      </button>

      {/* Header & Status Badge */}
      <div className="flex justify-between items-start mb-4 pr-8">
         <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusColor}`}>
            {statusIcon} {statusLabel}
         </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg uppercase shadow-sm">
           {budget.category_name ? budget.category_name.charAt(0) : "B"}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{budget.category_name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Clock size={12} />
            <span>{formatDateFull(budget.period_start)} - {formatDateFull(budget.period_end)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs text-gray-500 mb-1">Terpakai</p>
          <p className={`font-bold text-lg ${textColor}`}>{formatRp(used)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Limit</p>
          <p className="font-semibold text-gray-700">{formatRp(limit)}</p>
        </div>
      </div>

      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`} 
          style={{ width: `${displayPercentage}%` }}
        />
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center gap-2">
        {remaining < 0 ? (
          <>
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-xs text-red-500 font-medium">
              Over Budget sebesar <b>{formatRp(Math.abs(remaining))}</b>
            </span>
          </>
        ) : (
          <>
            <CheckCircle size={16} className="text-gray-400" />
            <span className="text-xs text-gray-500">
              Sisa aman: <span className="font-semibold text-gray-700">{formatRp(remaining)}</span>
            </span>
          </>
        )}
      </div>

    </div>
  );
}