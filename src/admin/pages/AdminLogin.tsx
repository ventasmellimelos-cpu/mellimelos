import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Heart } from "lucide-react";
import { useAdminAuth } from "@/admin/context/AdminAuth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#F8E1E4] flex items-center justify-center mx-auto mb-4">
              <Heart size={28} className="text-[#D4A5A5]" fill="#D4A5A5" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#2D2D2D]">
              Melli Melos Admin
            </h1>
            <p className="font-body text-sm text-[#6B6B6B] mt-1">
              Panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="font-body text-sm font-medium text-[#2D2D2D] mb-2 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="Ingresá la contraseña"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border font-body text-sm focus:outline-none focus:ring-2 transition-all ${
                    error
                      ? "border-red-400 focus:ring-red-200"
                      : "border-[#E0D5CC] focus:ring-[#F8E1E4] focus:border-[#F8E1E4]"
                  }`}
                />
              </div>
              {error && (
                <p className="font-body text-xs text-red-500 mt-2">
                  Contraseña incorrecta
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D2D2D] text-white font-body font-medium py-3 rounded-xl hover:bg-[#F8E1E4] hover:text-[#2D2D2D] transition-all duration-300"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
