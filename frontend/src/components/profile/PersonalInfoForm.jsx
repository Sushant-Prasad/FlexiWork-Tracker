/*
==================================================
PERSONAL INFORMATION FORM
--------------------------------------------------
Component:
PersonalInfoForm

Sub Components:
- Field

Purpose:
Allows users to update editable profile
information such as display name,
avatar URL, and timezone.

Used In:
Employee Profile Page
Manager Profile Page
Admin Profile Page

Related APIs:
GET   /api/users/me
PATCH /api/users/update

Editable Fields:
- Name
- Avatar URL
- Timezone

Business Value:
Enables users to personalize their
profile and maintain accurate account
preferences.

Workflow:
1. Load profile data
2. Populate form fields
3. Detect modified values
4. Submit changed fields only
5. Refresh profile cache

Return:
Editable profile form.
==================================================
*/

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, User, Link, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button.jsx";
import { updateMyProfile } from "../../services/userServices.js";

/*
==================================================
AUTH TOKEN STORAGE KEY
--------------------------------------------------
Purpose:
Defines localStorage key used to retrieve
the authenticated user's JWT token.

Business Logic:
Used for all protected profile update
requests.
==================================================
*/
const TOKEN_KEY = "flexiwork_token";

/*
==================================================
SUPPORTED TIMEZONES
--------------------------------------------------
Purpose:
Provides timezone options available in
the profile settings form.

Business Logic:
Allows users to configure local timezone
preferences for scheduling, attendance,
and reporting features.

Default:
Asia/Kolkata
==================================================
*/
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

/*
==================================================
FORM FIELD COMPONENT
--------------------------------------------------
Component:
Field

Props:
- label
- icon
- children

Purpose:
Reusable form field wrapper used for
all profile input controls.

Features:
- Consistent labels
- Icon support
- Unified spacing

Business Logic:
Standardizes form design across all
profile settings.
==================================================
*/
const Field = ({
  label,
  icon: Icon,
  children,
}) => (
  <div>

    {/* ======================================
        FIELD LABEL
    ====================================== */}
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">

      <Icon size={12} />

      {label}

    </label>

    {/* ======================================
        FIELD CONTENT
    ====================================== */}
    {children}

  </div>
);

/*
==================================================
PERSONAL INFO FORM
--------------------------------------------------
Component:
PersonalInfoForm

Props:
- user
- isLoading

Purpose:
Provides profile editing functionality
for authenticated users.

Features:
- Profile Updates
- Avatar Preview
- Timezone Selection
- Optimized Updates

Business Value:
Improves user experience by allowing
self-service profile management.

Return:
Editable profile settings form.
==================================================
*/
const PersonalInfoForm = ({
  user,
  isLoading,
}) => {

  /*
  ==========================================
  REACT QUERY CLIENT
  ------------------------------------------
  Purpose:
  Used for cache invalidation after
  successful profile updates.
  ==========================================
  */
  const queryClient = useQueryClient();

  /*
  ==========================================
  FORM STATE
  ------------------------------------------
  Purpose:
  Stores editable profile fields.

  Fields:
  - name
  - avatarUrl
  - timezone
  ==========================================
  */
  const [form, setForm] = useState({
    name: "",
    avatarUrl: "",
    timezone: "Asia/Kolkata",
  });

  /*
  ==========================================
  PROFILE DATA INITIALIZATION
  ------------------------------------------
  Purpose:
  Populates form fields when profile
  data becomes available.

  Business Logic:
  Keeps form synchronized with latest
  server data.
  ==========================================
  */
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        avatarUrl: user.avatarUrl || "",
        timezone: user.timezone || "Asia/Kolkata",
      });
    }
  }, [user]);

  /*
  ==========================================
  PROFILE UPDATE MUTATION
  ------------------------------------------
  Purpose:
  Sends profile updates to backend.

  API:
  PATCH /api/users/update

  Workflow:
  1. Retrieve token
  2. Submit updates
  3. Refresh profile cache
  4. Display success/error feedback
  ==========================================
  */
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      const token = localStorage.getItem(TOKEN_KEY);

      return updateMyProfile(payload, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-profile"],
      });

      toast.success(
        "Profile updated successfully!"
      );
    },

    onError: (err) =>
      toast.error(err.message),
  });

  /*
  ==========================================
  SAVE HANDLER
  ------------------------------------------
  Purpose:
  Builds update payload containing only
  modified fields.

  Business Logic:
  Prevents unnecessary API updates and
  reduces payload size.
  ==========================================
  */
  const handleSave = () => {

    const payload = {};

    if (
      form.name.trim() !==
      (user?.name || "").trim()
    ) {
      payload.name = form.name.trim();
    }

    if (
      form.avatarUrl !==
      (user?.avatarUrl || "")
    ) {
      payload.avatarUrl = form.avatarUrl;
    }

    if (
      form.timezone !==
      (user?.timezone || "")
    ) {
      payload.timezone = form.timezone;
    }

    /*
    ========================================
    NO CHANGES DETECTED
    ========================================
    */
    if (
      Object.keys(payload).length === 0
    ) {
      toast("No changes to save.", {
        icon: "ℹ️",
      });

      return;
    }

    mutate(payload);
  };

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton placeholders while
  profile data is loading.

  Business Logic:
  Prevents layout shifts and improves
  perceived performance.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="space-y-4">

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-2xl bg-muted"
          />
        ))}

      </div>
    );
  }

  /*
  ==========================================
  PROFILE SETTINGS FORM
  ------------------------------------------
  Sections:
  - Display Name
  - Avatar URL
  - Avatar Preview
  - Timezone
  - Save Action

  Business Value:
  Allows users to manage their
  profile preferences.
  ==========================================
  */
  return (
    <div className="space-y-5">

      {/* ======================================
          DISPLAY NAME
      ====================================== */}
      <Field
        label="Display Name"
        icon={User}
      >

        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              name: e.target.value,
            }))
          }
          placeholder="Your full name"
          className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
        />

      </Field>

      {/* ======================================
          AVATAR URL
      ====================================== */}
      <Field
        label="Avatar URL"
        icon={Link}
      >

        <input
          type="url"
          value={form.avatarUrl}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              avatarUrl: e.target.value,
            }))
          }
          placeholder="https://example.com/avatar.jpg"
          className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
        />

        {/* ==================================
            AVATAR PREVIEW
        ================================== */}
        {form.avatarUrl && (
          <div className="mt-2 flex items-center gap-2">

            <img
              src={form.avatarUrl}
              alt="preview"
              className="h-8 w-8 rounded-lg object-cover"
              onError={(e) =>
                (e.target.style.display = "none")
              }
            />

            <span className="text-xs text-muted-foreground">
              Preview
            </span>

          </div>
        )}

      </Field>

      {/* ======================================
          TIMEZONE SELECTOR
      ====================================== */}
      <Field
        label="Timezone"
        icon={Globe}
      >

        <select
          value={form.timezone}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              timezone: e.target.value,
            }))
          }
          className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
        >

          {TIMEZONES.map((tz) => (
            <option
              key={tz}
              value={tz}
            >
              {tz}
            </option>
          ))}

        </select>

      </Field>

      {/* ======================================
          SAVE PROFILE BUTTON
      ====================================== */}
      <div className="flex justify-end pt-1">

        <Button
          onClick={handleSave}
          disabled={isPending}
          className="gap-2 rounded-2xl"
        >

          <Save size={15} />

          {isPending
            ? "Saving..."
            : "Save Changes"}

        </Button>

      </div>

    </div>
  );
};

export default PersonalInfoForm;