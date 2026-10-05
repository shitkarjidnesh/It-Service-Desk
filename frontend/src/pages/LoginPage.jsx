import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 1: Email + Password + Role
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          withCredentials: true,
        },
      );

      console.log(response.data);

      // Backend has sent OTP
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: formData.email,
          role: formData.role,
          otp: otp,
        },
        {
          withCredentials: true,
        },
      );

      const loggedInUser = response.data.user;
      login(loggedInUser); // Update auth context with logged-in user
      console.log("Logged in user:", loggedInUser);

      // Redirect according to role
      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else if (loggedInUser.role === "employee") {
        navigate("/employee");
      } else if (loggedInUser.role === "technician") {
        navigate("/technician");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP";

      setError(message);

      // Wrong/expired OTP → go back to login
      setOtp("");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">IT Help Desk</h1>

          <p className="text-sm text-slate-500 mt-2">
            Sign in to manage your support requests
          </p>
        </div>

        {/* ================= STEP 1 — LOGIN ================= */}
        {step === 1 && (
          <form onSubmit={handleLogin} className="space-y-5">
            <h2 className="text-xl font-semibold text-slate-700">Login</h2>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-slate-300
                  rounded-lg
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    pr-12
                    border
                    border-slate-300
                    rounded-lg
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    hover:text-slate-700
                    text-lg
                  ">
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-slate-300
                  rounded-lg
                  bg-white
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                ">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                bg-red-50
                border
                border-red-200
                text-red-600
                text-sm
                px-4
                py-3
                rounded-lg
              ">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3
                bg-blue-600
                hover:bg-blue-700
                disabled:bg-blue-400
                text-white
                font-semibold
                rounded-lg
                transition
                duration-200
              ">
              {loading ? "Checking..." : "Login"}
            </button>
          </form>
        )}

        {/* ================= STEP 2 — OTP ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="text-center">
              <div
                className="
                mx-auto
                mb-4
                w-14
                h-14
                rounded-full
                bg-blue-100
                flex
                items-center
                justify-center
              ">
                <span className="text-2xl">🔐</span>
              </div>

              <h2 className="text-xl font-semibold text-slate-700">
                Verify OTP
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                OTP has been sent to your registered email.
              </p>
            </div>

            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, "");
                  setOtp(value);
                }}
                maxLength={6}
                required
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-slate-300
                  rounded-lg
                  text-center
                  text-xl
                  tracking-[0.5em]
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                bg-red-50
                border
                border-red-200
                text-red-600
                text-sm
                px-4
                py-3
                rounded-lg
              ">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3
                bg-blue-600
                hover:bg-blue-700
                disabled:bg-blue-400
                text-white
                font-semibold
                rounded-lg
                transition
                duration-200
              ">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
