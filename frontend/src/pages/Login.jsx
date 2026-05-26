import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoleDefaultPath } from "../constants/navigation.js";
import { Button } from "../components/ui/button.jsx";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login successful");

      const destination = getRoleDefaultPath(result?.user?.role);
      navigate(destination, { replace: true });

    } catch (error) {

      toast.error(error.message || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl"
      >

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-foreground">
            Welcome Back
          </h1>

          <p className="mt-3 text-muted-foreground">
            Login to FlexiWork Tracker
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>

            <label className="mb-2 block text-sm text-muted-foreground">
              Email
            </label>

            <div className="flex items-center rounded-2xl border border-input bg-background px-4">

              <Mail
                size={18}
                className="text-muted-foreground"
              />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-3 py-4 text-foreground placeholder:text-muted-foreground outline-none"
              />

            </div>

          </div>

          {/* Password */}
          <div>

            <label className="mb-2 block text-sm text-muted-foreground">
              Password
            </label>

            <div className="flex items-center rounded-2xl border border-input bg-background px-4">

              <Lock
                size={18}
                className="text-muted-foreground"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-3 py-4 text-foreground placeholder:text-muted-foreground outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                    className="text-muted-foreground"
                  />
                ) : (
                  <Eye
                    size={18}
                    className="text-muted-foreground"
                  />
                )}
              </button>

            </div>

          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </Button>

        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">

          Don’t have an account?{" "}

          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>

        </p>

      </motion.div>

    </div>
  );
};

export default Login;