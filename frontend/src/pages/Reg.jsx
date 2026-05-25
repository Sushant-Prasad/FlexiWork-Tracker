import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await register(formData);

      toast.success(
        "Registration successful"
      );

      navigate("/login");

    } catch (error) {

      toast.error(error.message || "Registration failed");

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
            Create Account
          </h1>

          <p className="mt-3 text-muted-foreground">
            Join FlexiWork Tracker
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>

            <label className="mb-2 block text-sm text-muted-foreground">
              Full Name
            </label>

            <div className="flex items-center rounded-2xl border border-input bg-background px-4">

              <User
                size={18}
                className="text-muted-foreground"
              />

              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-3 py-4 text-foreground placeholder:text-muted-foreground outline-none"
              />

            </div>

          </div>

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

          {/* Role */}
          <div>

            <label className="mb-2 block text-sm text-muted-foreground">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-2xl border border-input bg-background px-4 py-4 text-foreground outline-none"
            >

              <option value="EMPLOYEE">
                Employee
              </option>

              <option value="MANAGER">
                Manager
              </option>

              <option value="SYSTEM_ADMIN">
                System Admin
              </option>

            </select>

          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>

        </p>

      </motion.div>

    </div>
  );
};

export default Register;