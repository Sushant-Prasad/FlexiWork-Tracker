import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  ClipboardList,
  Bell,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    title: "Hybrid Work Tracking",
    description:
      "Track remote, office, and hybrid work modes efficiently.",
    icon: CalendarCheck,
  },
  {
    title: "Task & Project Management",
    description:
      "Managers can assign projects and tasks to employees.",
    icon: ClipboardList,
  },
  {
    title: "Attendance Analytics",
    description:
      "Compare planned vs actual work logs with detailed insights.",
    icon: BarChart3,
  },
  {
    title: "Notifications & Alerts",
    description:
      "Real-time reminders for tasks, attendance, and approvals.",
    icon: Bell,
  },
  {
    title: "Team Collaboration",
    description:
      "Manage teams, members, and productivity in one place.",
    icon: Users,
  },
  {
    title: "Leave Management",
    description:
      "Easy leave requests and manager approval workflow.",
    icon: CheckCircle2,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:flex lg:items-center lg:justify-between">
          
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm text-blue-400">
              Smart Hybrid Workforce Platform
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
              FlexiWork <span className="text-blue-500">Tracker</span>
            </h1>

            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              A modern hybrid work management system that helps
              organizations manage attendance, projects, tasks,
              work modes, leave requests, and productivity analytics.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-700"
              >
                Get Started
              </Link>

              <Link
                to="/about"
                className="rounded-xl border border-zinc-700 px-6 py-3 font-medium transition hover:bg-zinc-900"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mt-16 lg:mt-0"
          >
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Team Collaboration"
                className="w-[500px] rounded-2xl object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Powerful Features
          </h2>

          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Everything needed to manage hybrid teams,
            attendance, projects, productivity, and collaboration.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 transition hover:border-blue-500/40 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-4 text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 py-20 grid gap-10 md:grid-cols-3 text-center">
          
          <div>
            <h3 className="text-5xl font-bold text-blue-500">
              99%
            </h3>
            <p className="mt-3 text-zinc-400">
              Attendance Tracking Accuracy
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-blue-500">
              24/7
            </h3>
            <p className="mt-3 text-zinc-400">
              Workforce Monitoring
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-blue-500">
              100+
            </h3>
            <p className="mt-3 text-zinc-400">
              Team Collaboration Features
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-12"
        >
          <h2 className="text-4xl font-bold">
            Manage Your Hybrid Workforce Efficiently
          </h2>

          <p className="mt-5 text-zinc-400 text-lg">
            Improve productivity, attendance tracking,
            and team collaboration with FlexiWork Tracker.
          </p>

          <div className="mt-8">
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-medium transition hover:bg-blue-700"
            >
              Start Now
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500">
        © 2026 FlexiWork Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;