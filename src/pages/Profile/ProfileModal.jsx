import { useState, useEffect } from "react";
import { X, Camera, Loader2, User, Briefcase, Wallet, Save, Edit2 } from "lucide-react";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function ProfileModal({ isOpen, onClose }) {
  const auth = useAuth(); 
  const user_id = auth?.user_id;
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [profileData, setProfileData] = useState(null); 
  
  // --- STATE EDIT NAME ---
  const [name, setName] = useState("");
  const [editName, setEditName] = useState(false);
  
  // --- STATE EDIT PHOTO ---
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- STATE EDIT PROFILE (Pekerjaan & Keuangan) ---
  const [editProfile, setEditProfile] = useState(false);
  const [job, setJob] = useState("");
  const [incomeId, setIncomeId] = useState("1");
  const [incomeAmount, setIncomeAmount] = useState("");

  // --- 1. FETCH DATA (User & Profile) ---
  useEffect(() => {
    if (isOpen && user_id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // A. Ambil data User
          const resUser = await api.get(`/users/${user_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(resUser.data.data);
          setName(resUser.data.data.name);

          // B. Ambil data Profile Tambahan
          try {
            const resProfile = await api.get("/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const pData = resProfile.data.data;
            setProfileData(pData);

            // Isi state inputan edit
            if (pData) {
                setJob(pData.pekerjaan || "");
                setIncomeId(pData.id_penghasilan || "1");
                setIncomeAmount(pData.pendapatan_bulanan || "");
            }
          } catch (err) {
            console.log("User belum mengisi data profile.");
          }

        } catch (err) {
          console.error("Gagal mengambil data user:", err);
          toast.error("Gagal memuat profil.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, user_id, token]);

  // --- 2. UPDATE FOTO ---
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewPhoto(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file); 

      await api.patch(`/users/${user_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Foto profil berhasil diperbarui!");
      const res = await api.get(`/users/${user_id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.data);

    } catch (err) {
      console.error(err);
      toast.error("Gagal mengupload foto.");
      setPreviewPhoto(null); 
    } finally {
      setUploading(false);
    }
  };

  // --- 3. UPDATE NAMA ---
  const handleSaveName = async () => {
    if (!name.trim()) {
        toast.error("Nama tidak boleh kosong");
        return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);

      await api.patch(`/users/${user_id}`, formData, {
         headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Nama berhasil diubah!");
      setUserData({ ...userData, name: name }); 
      setEditName(false);
      
      // Opsional: Reload window jika ingin update Header juga
      // window.location.reload(); 
    } catch (err) {
      toast.error("Gagal mengubah nama.");
    }
  };

  // --- 4. UPDATE PROFILE (Pekerjaan & Keuangan) ---
  const handleSaveProfile = async () => {
    if(!job || !incomeAmount) {
        toast.error("Mohon lengkapi data pekerjaan dan pendapatan.");
        return;
    }

    try {
        await api.patch("/profile", {
            pekerjaan: job,
            id_penghasilan: incomeId,
            pendapatan_bulanan: incomeAmount
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("Profil keuangan berhasil diupdate!");
        
        setProfileData({
            ...profileData,
            pekerjaan: job,
            id_penghasilan: incomeId,
            pendapatan_bulanan: incomeAmount
        });
        
        setEditProfile(false);

    } catch (error) {
        console.error("Gagal update profile:", error);
        toast.error("Gagal menyimpan perubahan profile.");
    }
  };

  const formatRp = (num) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num || 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative font-gabarito flex flex-col md:flex-row h-auto max-h-[90vh]">
        
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10"
        >
            <X size={20} className="text-gray-600" />
        </button>

        {loading ? (
            <div className="w-full p-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={30} />
                <p className="text-gray-500">Memuat Profil...</p>
            </div>
        ) : (
            <>
                {/* --- BAGIAN KIRI (FOTO) --- */}
                <div className="w-full md:w-2/5 bg-gradient-to-b from-[#15213F] to-[#1e2d50] p-8 flex flex-col items-center justify-center text-white relative">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
                            <img 
                                src={previewPhoto || userData?.photo_url || "https://via.placeholder.com/150"} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                            <Camera className="text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} disabled={uploading} />
                        </label>
                    </div>
                    
                    {uploading && <p className="text-xs mt-2 animate-pulse">Mengupload...</p>}

                    <h2 className="mt-4 text-xl font-bold text-center">{userData?.name}</h2>
                    <p className="text-blue-200 text-sm text-center break-all">{userData?.email}</p>
                </div>

                {/* --- BAGIAN KANAN (FORM & INFO) --- */}
                <div className="w-full md:w-3/5 p-8 bg-white overflow-y-auto">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <User size={20} className="text-blue-600" /> Pengaturan Profil
                    </h3>

                    <div className="space-y-5">
                        
                        {/* 1. Nama (Editable dengan Tombol Batal & Simpan) */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Nama Lengkap</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={name}
                                    disabled={!editName}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full p-2 rounded-lg border transition-all ${editName ? "border-blue-500 bg-blue-50 focus:outline-none text-gray-800" : "border-transparent bg-transparent pl-0 font-semibold text-gray-800"}`}
                                />
                                {editName ? (
                                    <div className="flex gap-1">
                                        {/* Tombol Batal */}
                                        <button 
                                            onClick={() => {
                                                setEditName(false);
                                                setName(userData?.name || ""); // Reset ke nama asli
                                            }}
                                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                                            title="Batal"
                                        >
                                            <X size={16} />
                                        </button>
                                        
                                        {/* Tombol Simpan */}
                                        <button 
                                            onClick={handleSaveName} 
                                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                            title="Simpan"
                                        >
                                            <Save size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    // Tombol Edit
                                    <button 
                                        onClick={() => setEditName(true)} 
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="Ubah Nama"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2. Email (Read Only) */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</label>
                            <div className="text-gray-600 text-sm font-medium">
                                {userData?.email}
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-4"></div>

                        {/* 3. Header Profile Keuangan */}
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-gray-700">Profil Keuangan</h4>
                            {!editProfile ? (
                                <button 
                                    onClick={() => setEditProfile(true)} 
                                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    <Edit2 size={14} /> Ubah Data
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setEditProfile(false)} 
                                        className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition flex items-center gap-1 text-xs"
                                        title="Batal"
                                    >
                                        <X size={14} /> Batal
                                    </button>
                                    <button 
                                        onClick={handleSaveProfile} 
                                        className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 text-xs"
                                        title="Simpan"
                                    >
                                        <Save size={14} /> Simpan
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 4. Form Pekerjaan & Pendapatan */}
                        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            
                            {/* PEKERJAAN */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                                    <Briefcase size={12} /> Pekerjaan
                                </label>
                                {editProfile ? (
                                    <input 
                                        type="text" 
                                        value={job} 
                                        onChange={(e) => setJob(e.target.value)}
                                        className="w-full p-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                                        placeholder="Contoh: Freelancer"
                                    />
                                ) : (
                                    <p className="font-semibold text-gray-800 text-sm">
                                        {profileData?.pekerjaan || "-"}
                                    </p>
                                )}
                            </div>

                            {/* JENIS PENGHASILAN */}
                            {editProfile && (
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Sumber Pendapatan</label>
                                    <select 
                                        value={incomeId} 
                                        onChange={(e) => setIncomeId(e.target.value)}
                                        className="w-full p-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                                    >
                                        <option value="1">Gaji Tetap</option>
                                        <option value="2">Bisnis / Usaha</option>
                                        <option value="3">Freelance</option>
                                        <option value="4">Investasi</option>
                                    </select>
                                </div>
                            )}
                            
                            {/* PENDAPATAN */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                                    <Wallet size={12} /> Pendapatan Bulanan
                                </label>
                                {editProfile ? (
                                    <input 
                                        type="number" 
                                        value={incomeAmount} 
                                        onChange={(e) => setIncomeAmount(e.target.value)}
                                        className="w-full p-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                                        placeholder="0"
                                    />
                                ) : (
                                    <p className="font-semibold text-gray-800 text-sm">
                                        {profileData?.pendapatan_bulanan ? formatRp(profileData.pendapatan_bulanan) : "-"}
                                        <span className="text-xs text-gray-400 font-normal ml-1">(Per Bulan)</span>
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}