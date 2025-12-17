import { Trash2, Edit2, PlusCircle, Calendar, CheckCircle, AlertCircle, Trophy } from "lucide-react";

export default function GoalCard({ goal, onDelete, onAddMoney }) {
  const target = Number(goal.target_amount);
  const current = Number(goal.current_amount);
  const remainingAmount = target - current;
  
  let percentage = target === 0 ? 0 : (current / target) * 100;
  const displayPercentage = percentage > 100 ? 100 : percentage;

  // Hitung Sisa Hari
  const deadlineDate = new Date(goal.deadline);
  const today = new Date();
  today.setHours(0,0,0,0);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Status Visual
  let statusColor = "bg-blue-500";
  let statusText = "text-blue-600";
  let statusBadge = null;

  if (current >= target) {
    statusColor = "bg-green-500";
    statusText = "text-green-600";
    statusBadge = (
        <div className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1">
            <Trophy size={12} /> Tercapai
        </div>
    );
  } else if (diffDays < 0) {
    statusColor = "bg-red-500";
    statusText = "text-red-600";
    statusBadge = (
        <div className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1">
            <AlertCircle size={12} /> Lewat Deadline
        </div>
    );
  } else {
    // Rekomendasi Menabung Harian
    const dailySave = remainingAmount / (diffDays || 1);
  }

  const formatRp = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  const formatDate = (date) => new Date(date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`bg-background-card dark:bg-background-card-dark p-5 rounded-2xl shadow-sm border border-border dark:border-border-dark hover:shadow-md transition-all relative group flex flex-col justify-between h-full ${current >= target ? 'border-green-200' : ''}`}>
      
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
            onClick={() => onDelete(goal.goal_id)}
            className="p-2 mt-10 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Hapus Goal"
        >
            <Trash2 size={16} />
        </button>
      </div>

      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
             <div className="flex flex-col">
                <h3 className="font-bold text-text-black dark:text-text-white text-lg line-clamp-1" title={goal.name}>{goal.name}</h3>
                <div className="flex items-center gap-1 text-xs text-text-grey dark:text-text-grey-dark mt-1">
                    <Calendar size={12} />
                    <span>Deadline: {formatDate(goal.deadline)}</span>
                </div>
             </div>
             {statusBadge}
        </div>

        {/* Progress Bar */}
        <div className="mb-1 flex justify-between items-end">
             <span className={`text-2xl font-bold ${statusText}`}>{Math.round(percentage)}%</span>
             <span className="text-xs text-text-grey dark:text-text-grey-dark mb-1">Terkumpul</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${statusColor}`} 
            style={{ width: `${displayPercentage}%` }}
            />
        </div>

        {/* Nominal Info */}
        <div className="flex justify-between text-sm mb-4 pt-3 border-t border-gray-50">
            <div>
                <p className="text-xs text-gray-400">Saat Ini</p>
                <p className="font-semibold text-text-black dark:text-text-white">{formatRp(current)}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-400">Target</p>
                <p className="font-bold text-text-black dark:text-text-white">{formatRp(target)}</p>
            </div>
        </div>
      </div>

      {/* Footer Actions / Info */}
      <div className="mt-auto">
         {current < target ? (
             <>
                {diffDays > 0 ? (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg mb-3 text-center">
                        Kurang <b>{formatRp(remainingAmount)}</b> dalam <b>{diffDays} hari</b>
                    </p>
                ) : (
                    <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mb-3 text-center font-medium">
                        Target belum tercapai & sudah lewat deadline.
                    </p>
                )}

                <button 
                    onClick={() => onAddMoney(goal)}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
                >
                    <PlusCircle size={16} /> Isi Tabungan
                </button>
             </>
         ) : (
             <div className="w-full py-2.5 bg-green-100 text-green-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                 <CheckCircle size={18} /> Selesai!
             </div>
         )}
      </div>

    </div>
  );
}