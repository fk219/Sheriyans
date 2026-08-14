import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from '../hook/useAuth'

export default function LoginPage() {
  const naviagte = useNavigate()
  const {handleLogin} = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(loginData)
    naviagte('/')
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0b0c] flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        <div className="relative rounded-xl border border-neutral-800 bg-[#141416] shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 mb-5" />
              <h1 className="text-xl font-semibold text-white tracking-tight">
                Welcome back
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                Sign in to continue to your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-[#1c1c1f] border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-lime-500 focus:border-lime-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#1c1c1f] border border-neutral-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-lime-500 focus:border-lime-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-lime-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-neutral-500 hover:text-lime-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-lime-500 to-emerald-500 hover:brightness-110 text-neutral-950 font-medium py-2.5 rounded-lg transition-all duration-200"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-neutral-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-lime-400 hover:text-lime-300 font-medium transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}