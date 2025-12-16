import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import "../../assets/styles/global.css";
export default function Profile() {
    const navigate = useNavigate();
  const { user_id } = useAuth();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editName, setEditName] = useState(false);


  /** ================================
   * FETCH USER DATA
   =================================== */
  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;
      setUserData(data);
      setName(data.name);
      setEmail(data.email);

    } catch (err) {
      console.error("Fetch user failed:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);



  /** ================================
   * UPDATE USER REQUEST (PATCH)
   =================================== */
  const updateUser = async (fields) => {
    try {
      const formData = new FormData();

      // Append dynamic fields
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // 🔥 JANGAN SET CONTENT TYPE MANUAL
      await api.patch(`/users/${user_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchUser(); // refresh UI
      return true;

    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      return false;
    }
  };



  /** ================================
   * SAVE NAME HANDLER
   =================================== */
  const handleSaveName = async () => {
    const success = await updateUser({ name });
    if (success) setEditName(false);
  };


  /** ================================
   * FILE UPLOAD HANDLER
   =================================== */
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // show preview immediately
    setPreviewPhoto(URL.createObjectURL(file));

    // ❗ key wajib "photo" — sesuai multer backend
    const success = await updateUser({ photo: file });

    if (!success) {
      console.log("Upload gagal — cek console backend.");
    }
  };



  if (!userData) return <p className="text-center p-10 text-gray-600">Loading...</p>;


  return (
    <div className="w-full h-full p-10 font-gabarito bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-10">

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-500 text-transparent bg-clip-text">
          Profile Settings
        </h1>

        <div className="flex items-start gap-10">

          {/* LEFT — PROFILE PHOTO */}
          <div className="w-1/3 flex flex-col items-center">
            <div className="relative group">
              <img
                src={previewPhoto || userData.photo_url}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-white transition-transform duration-300 group-hover:scale-105"
              />

              <label className="absolute bottom-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-indigo-700 transition">
                Change
                <input type="file" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>


          {/* RIGHT FORM */}
          <div className="w-2/3 space-y-6">

            {/* NAME */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>

              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={name}
                  readOnly={!editName}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-black px-4 py-3 rounded-xl border focus:ring-2 transition
                    ${editName 
                      ? "border-indigo-500 focus:ring-indigo-300 bg-white"
                      : "border-gray-200 bg-gray-100 cursor-not-allowed"
                    }`}
                />

                {!editName ? (
                  <button
                    onClick={() => setEditName(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveName}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditName(false);
                        setName(userData.name);
                      }}
                      className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>



            {/* EMAIL (locked) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 rounded-xl text-black border border-gray-200 bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <button
  onClick={() => navigate("/dashboard")}
  className=" cursor-pointer mt-6 w-full px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-black transition"
>
  ← Back to Dashboard
</button>
          </div>
        </div>
      </div>
    </div>
  );
}
