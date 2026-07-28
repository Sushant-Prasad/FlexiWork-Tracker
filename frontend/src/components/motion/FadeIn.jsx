import { motion } from "framer-motion";

/*
==================================================
FADE IN ANIMATION
--------------------------------------------------
Component:
FadeIn

Props:
- children
- delay (optional)

Purpose:
Provides a reusable fade-in animation
wrapper that smoothly reveals its child
components when they are rendered.

Used In:
- Dashboard Pages
- Cards
- Charts
- Tables
- Forms
- Sections
- Modals

Dependencies:
- Framer Motion

Animation:
- Fade In
- Slide Up

Features:
- Reusable Animation Wrapper
- Configurable Delay
- Smooth Entrance Animation
- Improves User Experience
- Lightweight Component

Business Value:
Creates a consistent entrance animation
across the application, making the user
interface feel modern, polished, and
more engaging.

Workflow:
1. Component mounts.
2. Starts with lower opacity and
   slight downward offset.
3. Animates to full opacity.
4. Moves into its final position.
5. Renders child content smoothly.

Returns:
Animated wrapper around child components.
==================================================
*/

export const FadeIn = ({
  children,
  delay = 0,
}) => (

  /*
  ==========================================
  ANIMATED CONTAINER
  ------------------------------------------
  Wraps child components with a reusable
  fade-in and slide-up animation.

  Animation Details:
  • Initial:
      - Opacity: 0
      - Y Offset: 18px

  • Animate:
      - Opacity: 1
      - Y Offset: 0

  • Transition:
      - Duration: 0.6 seconds
      - Ease: easeOut
      - Configurable Delay
  ==========================================
  */
  <motion.div
    initial={{
      opacity: 0,
      y: 18,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.6,
      ease: "easeOut",
      delay,
    }}
  >
    {children}
  </motion.div>

);