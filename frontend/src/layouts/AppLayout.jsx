import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

/*
==================================================
APPLICATION LAYOUT
--------------------------------------------------
Component:
AppLayout

Purpose:
Provides the main application layout shared
across all authenticated pages.

It includes:
- Top Navigation Bar
- Role-based Sidebar
- Main Content Area

Used In:
- Employee Module
- Manager Module
- System Admin Module

Dependencies:
- React Router
- AuthContext
- Navbar
- Sidebar

Features:
- Common Layout
- Persistent Navigation
- Conditional Sidebar Rendering
- Nested Route Support
- Responsive Page Structure

Business Value:
Creates a consistent user interface across
the entire FlexiWork application while
allowing each page to render its own
content inside a shared layout.

Workflow:
1. Render application navbar.
2. Retrieve authenticated user.
3. Show sidebar if user is logged in.
4. Render current route inside the
   content area using Outlet.

Returns:
Application layout with nested pages.
==================================================
*/

const AppLayout = () => {

  /*
  ==========================================
  AUTHENTICATED USER
  ------------------------------------------
  Retrieves the currently logged-in user
  from the global authentication context.

  Used to determine whether the sidebar
  should be displayed.
  ==========================================
  */
  const { user } = useAuth();

  return (

    /*
    ==========================================
    APPLICATION CONTAINER
    ------------------------------------------
    Root layout container containing the
    navbar and page content.
    ==========================================
    */
    <div className="flex h-screen flex-col bg-background text-foreground">

      {/* ==================================
          TOP NAVIGATION BAR
          ----------------------------------
          Shared navigation displayed across
          all application pages.
      ================================== */}
      <Navbar />

      {/* ==================================
          MAIN LAYOUT
          ----------------------------------
          Contains the sidebar and the page
          content area.
      ================================== */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ==============================
            SIDEBAR
            ------------------------------
            Displayed only when a user is
            authenticated.
        ============================== */}
        {user ? <Sidebar /> : null}

        {/* ==============================
            PAGE CONTENT
            ------------------------------
            Renders nested routes using
            React Router's Outlet.
        ============================== */}
        <main className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
          <Outlet />
        </main>

      </div>

    </div>

  );

};

export default AppLayout;