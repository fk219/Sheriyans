import { useState } from "react";
import { Eye, EyeOff, Compass, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleRegister) {
      await handleRegister(registerData);
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#191a1a] text-[#e8e8e6] flex flex-col items-center justify-center p-4 selection:bg-neutral-800">
      <div className="w-full max-w-xs space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <Compass className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold tracking-tight">perplexity</span>
          </Link>
          <h1 className="text-xl font-medium tracking-tight text-[#f3f3ee] pt-2">
            Create an account
          </h1>
          <p className="text-xs text-neutral-500">
            Start exploring and searching with AI
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-[#202222] border border-white/10 p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleChange}
                placeholder="username"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-[#f0f0ee] placeholder-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-[#f0f0ee] placeholder-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-3.5 pr-9 py-2 text-xs text-[#f0f0ee] placeholder-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 mt-2 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-medium transition-colors cursor-pointer shadow-sm"
            >
              <span>Create account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-neutral-300 hover:text-white font-medium underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}