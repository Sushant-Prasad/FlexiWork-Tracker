/*
==================================================
PREFERENCES SETTINGS CARD
--------------------------------------------------
Component:
PreferencesCard

Purpose:
Allows users to configure personal work
preferences and system behavior settings.

Used In:
Employee Profile Page
Manager Profile Page
Admin Profile Page

Related APIs:
GET   /api/users/me
PATCH /api/users/update

Settings Managed:
- Geo Check Opt-In
- Work Log Edit Cutoff Hour

Business Value:
Provides employees with control over
attendance tracking preferences and
work log modification policies.

Workflow:
1. Load user settings
2. Populate preference controls
3. Allow user modifications
4. Validate input values
5. Save settings to backend
6. Refresh profile cache

Return:
User preferences management form.
==================================================
*/

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Clock, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button.jsx";
import { updateMyProfile } from "../../services/userServices.js";

/*
==================================================
AUTH TOKEN STORAGE KEY
--------------------------------------------------
Purpose:
Defines localStorage key used for
authenticated API requests.

Business Logic:
Required for all protected profile
update operations.
==================================================
*/
const TOKEN_KEY = "flexiwork_token";

/*
==================================================
PREFERENCES CARD
--------------------------------------------------
Component:
PreferencesCard

Props:
- user
- isLoading

Purpose:
Provides editable user preferences
related to attendance tracking and
work log management.

Features:
- Geo Tracking Preference
- Edit Cutoff Configuration
- Settings Persistence
- Input Validation

Business Value:
Allows employees to customize their
working experience while maintaining
organizational compliance rules.

Return:
Preferences management card.
==================================================
*/
const PreferencesCard = ({
  user,
  isLoading,
}) => {

  /*
  ==========================================
  REACT QUERY CLIENT
  ------------------------------------------
  Purpose:
  Used to invalidate cached profile
  data after successful updates.
  ==========================================
  */
  const queryClient = useQueryClient();

  /*
  ==========================================
  GEO TRACKING STATE
  ------------------------------------------
  Purpose:
  Controls whether geo-location is
  captured during work log creation.

  Business Logic:
  Used for attendance verification
  and location-based compliance.
  ==========================================
  */
  const [geoOptIn, setGeoOptIn] =
    useState(false);

  /*
  ==========================================
  EDIT CUTOFF HOUR STATE
  ------------------------------------------
  Purpose:
  Defines the maximum hour at which
  users can modify work logs.

  Example:
  22 = 10 PM

  Business Logic:
  Prevents retroactive work log
  modifications after business hours.
  ==========================================
  */
  const [cutoffHour, setCutoffHour] =
    useState(22);

  /*
  ==========================================
  LOAD USER SETTINGS
  ------------------------------------------
  Purpose:
  Synchronizes local form state with
  settings received from backend.

  Trigger:
  Runs whenever user profile changes.
  ==========================================
  */
  useEffect(() => {
    if (user?.settings) {
      setGeoOptIn(
        user.settings.geoCheckOptIn ?? false
      );

      setCutoffHour(
        user.settings.editCutoffHour ?? 22
      );
    }
  }, [user]);

  /*
  ==========================================
  SAVE PREFERENCES MUTATION
  ------------------------------------------
  API:
  PATCH /api/users/update

  Purpose:
  Persists updated settings to backend.

  Workflow:
  1. Retrieve auth token
  2. Send updated settings
  3. Refresh profile cache
  4. Display user feedback
  ==========================================
  */
  const { mutate, isPending } =
    useMutation({
      mutationFn: (payload) => {
        const token =
          localStorage.getItem(TOKEN_KEY);

        return updateMyProfile(
          payload,
          token
        );
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["my-profile"],
        });

        toast.success(
          "Preferences saved!"
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
  Validates settings before sending
  them to backend.

  Validation Rules:
  - Cutoff Hour must be between
    0 and 23 inclusive.

  Business Logic:
  Prevents invalid scheduling
  configurations.
  ==========================================
  */
  const handleSave = () => {
    const hour = Number(cutoffHour);

    if (hour < 0 || hour > 23) {
      toast.error(
        "Cutoff hour must be 0–23"
      );
      return;
    }

    mutate({
      settings: {
        geoCheckOptIn: geoOptIn,
        editCutoffHour: hour,
      },
    });
  };

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton placeholders while
  profile settings are loading.

  Business Logic:
  Improves perceived performance and
  prevents layout shifts.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="space-y-4">

        <div className="h-14 animate-pulse rounded-2xl bg-muted" />

        <div className="h-14 animate-pulse rounded-2xl bg-muted" />

      </div>
    );
  }

  /*
  ==========================================
  PREFERENCES SETTINGS UI
  ------------------------------------------
  Sections:
  - Geo Tracking Toggle
  - Edit Cutoff Hour
  - Save Preferences

  Business Value:
  Provides self-service preference
  management for employees.
  ==========================================
  */
  return (
    <div className="space-y-5">

      {/* ======================================
          GEO TRACKING PREFERENCE
          --------------------------------------
          Allows users to enable or disable
          location capture during work log
          creation.
      ====================================== */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/50 px-5 py-4">

        <div className="flex items-start gap-3">

          {/* Preference Icon */}
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

            <MapPin size={15} />

          </div>

          {/* Preference Details */}
          <div>

            <p className="text-sm font-medium text-foreground">
              Enable Geo Tracking
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Allow location check during
              work log creation
            </p>

          </div>

        </div>

        {/* ==================================
            TOGGLE SWITCH
        ================================== */}
        <button
          role="switch"
          aria-checked={geoOptIn}
          onClick={() =>
            setGeoOptIn((v) => !v)
          }
          className={`relative h-6 w-11 shrink-0 rounded-full border-2 transition-colors ${
            geoOptIn
              ? "border-primary bg-primary"
              : "border-muted-foreground/30 bg-muted"
          }`}
        >

          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              geoOptIn
                ? "left-[22px]"
                : "left-0.5"
            }`}
          />

        </button>

      </div>

      {/* ======================================
          WORK LOG EDIT CUTOFF HOUR
          --------------------------------------
          Defines the latest hour when
          users can edit work logs.
      ====================================== */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/50 px-5 py-4">

        <div className="flex items-start gap-3">

          {/* Preference Icon */}
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

            <Clock size={15} />

          </div>

          {/* Preference Details */}
          <div>

            <p className="text-sm font-medium text-foreground">
              Edit Cutoff Hour
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Work logs cannot be edited
              after this hour (0–23)
            </p>

          </div>

        </div>

        {/* ==================================
            HOUR INPUT
        ================================== */}
        <input
          type="number"
          min={0}
          max={23}
          value={cutoffHour}
          onChange={(e) =>
            setCutoffHour(e.target.value)
          }
          className="w-16 rounded-xl border border-input bg-background px-3 py-2 text-center text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
        />

      </div>

      {/* ======================================
          SAVE PREFERENCES BUTTON
      ====================================== */}
      <div className="flex justify-end">

        <Button
          onClick={handleSave}
          disabled={isPending}
          className="gap-2 rounded-2xl"
        >

          <Save size={15} />

          {isPending
            ? "Saving..."
            : "Save Preferences"}

        </Button>

      </div>

    </div>
  );
};

export default PreferencesCard;