import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, User, Link, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button.jsx";
import { updateMyProfile } from "../../services/userServices.js";

/*
==================================================
PERSONAL INFO FORM
--------------------------------------------------
Purpose:
  Editable form for name, avatarUrl, and timezone.
  Fires PATCH /api/users/update on save.

Props:
  - user: profile object
  - isLoading: boolean
==================================================
*/

const TOKEN_KEY = "flexiwork_token";

// Common IANA timezones for the dropdown
const TIMEZONES = [
  "Asia/Kolkata",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      <Icon size={12} />
      {label}
    </label>
    {children}
  </div>
);

const PersonalInfoForm = ({ user, isLoading }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    avatarUrl: "",
    timezone: "Asia/Kolkata",
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        avatarUrl: user.avatarUrl || "",
        timezone: user.timezone || "Asia/Kolkata",
      });
    }
  }, [user]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      const token = localStorage.getItem(TOKEN_KEY);
      return updateMyProfile(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    const payload = {};
    if (form.name.trim() !== (user?.name || "").trim())
      payload.name = form.name.trim();
    if (form.avatarUrl !== (user?.avatarUrl || ""))
      payload.avatarUrl = form.avatarUrl;
    if (form.timezone !== (user?.timezone || ""))
      payload.timezone = form.timezone;

    if (Object.keys(payload).length === 0) {
      toast("No changes to save.", { icon: "ℹ️" });
      return;
    }
    mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Name */}
      <Field label="Display Name" icon={User}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your full name"
          className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
        />
      </Field>

      {/* Avatar URL */}
      <Field label="Avatar URL" icon={Link}>
        <input
          type="url"
          value={form.avatarUrl}
          onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
          placeholder="https://example.com/avatar.jpg"
          className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
        />
        {form.avatarUrl && (
          <div className="mt-2 flex items-center gap-2">
            <img
              src={form.avatarUrl}
              alt="preview"
              className="h-8 w-8 rounded-lg object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
            <span className="text-xs text-muted-foreground">Preview</span>
          </div>
        )}
      </Field>

      {/* Timezone */}
      <Field label="Timezone" icon={Globe}>
        <select
          value={form.timezone}
          onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
          className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </Field>

      {/* Save */}
      <div className="flex justify-end pt-1">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="gap-2 rounded-2xl"
        >
          <Save size={15} />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
