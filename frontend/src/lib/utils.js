import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/*
==================================================
CLASS NAME UTILITY
--------------------------------------------------
Function:
cn

Purpose:
Combines multiple CSS class names into a
single optimized class string.

Uses:
- clsx
- tailwind-merge

Features:
- Conditional Class Names
- Removes Duplicate Classes
- Resolves Conflicting Tailwind Classes
- Cleaner JSX
- Reusable Utility

Used In:
- Buttons
- Cards
- Forms
- Tables
- Modals
- Layout Components
- Entire UI

Business Value:
Provides a standardized way to compose
Tailwind CSS class names while preventing
conflicting utility classes, resulting in
cleaner, more maintainable UI code.

Workflow:
1. Accept multiple class inputs.
2. Use clsx to combine valid class names.
3. Use tailwind-merge to remove duplicate
   or conflicting Tailwind classes.
4. Return the final optimized class string.

Parameters:
- ...inputs : Array<string | object | array>

Returns:
Merged Tailwind CSS class string.
==================================================
*/

export const cn = (...inputs) => {

  /*
  ==========================================
  MERGE CLASS NAMES
  ------------------------------------------
  clsx:
  - Handles conditional class names.
  - Ignores false, null, undefined values.

  tailwind-merge:
  - Removes duplicate Tailwind classes.
  - Resolves conflicting utilities.
  - Example:
      "p-2 p-4" → "p-4"
      "text-sm text-lg" → "text-lg"
  ==========================================
  */
  return twMerge(clsx(inputs));

};