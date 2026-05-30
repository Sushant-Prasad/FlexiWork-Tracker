import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Clock, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button.jsx";
import { updateMyProfile } from "../../services/userServices.js";

/*
==================================================
PREFERENCES CARD
--------------------------------------------------
Purpose:
  Editable work preferences:
  - Geo Check Opt-in (toggle)
  - Edit Cutoff Hour (number input)
  These map directly to user.settings in the model.

Props:
  - user: profile object
  - isLoading: boolean
==================================================
*/

const TOKEN_KEY = "flexiwork_token";

const PreferencesCard = ({ user, isLoading }) => {
  const queryClient = useQueryClient();

  const [geoOptIn, setGeoOptIn] = useState(false);
  const [cutoffHour, setCutoffHour] = useState(22);

  useEffect(() => {
    if (user?.settings) {
      setGeoOptIn(user.settings.geoCheckOptIn ?? false);
      setCutoffHour(user.settings.editCutoffHour ?? 22);
    }
  }, [user]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      const token = localStorage.getItem(TOKEN_KEY);
      return updateMyProfile(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Preferences saved!");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    const hour = Number(cutoffHour);
    if (hour < 0 || hour > 23) {
      toast.error("Cutoff hour must be 0–23");
      return;
    }
    mutate({
      settings: {
        geoCheckOptIn: geoOptIn,
        editCutoffHour: hour,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-14 animate-pulse rounded-2xl bg-muted" />
        <div className="h-14 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Geo Check Toggle */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin size={15} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Enable Geo Tracking</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Allow location check during work log creation
            </p>
          </div>
        </div>
        {/* Toggle switch */}
        <button
          role="switch"
          aria-checked={geoOptIn}
          onClick={() => setGeoOptIn((v) => !v)}
          className={`relative h-6 w-11 shrink-0 rounded-full border-2 transition-colors ${
            geoOptIn
              ? "border-primary bg-primary"
              : "border-muted-foreground/30 bg-muted"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              geoOptIn ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {/* Cutoff Hour */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock size={15} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Edit Cutoff Hour</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Work logs cannot be edited after this hour (0–23)
            </p>
          </div>
        </div>
        <input
          type="number"
          min={0}
          max={23}
          value={cutoffHour}
          onChange={(e) => setCutoffHour(e.target.value)}
          className="w-16 rounded-xl border border-input bg-background px-3 py-2 text-center text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="gap-2 rounded-2xl"
        >
          <Save size={15} />
          {isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default PreferencesCard;
