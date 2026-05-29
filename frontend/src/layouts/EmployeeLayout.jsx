import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import EmployeeSidebar from "../components/sidebar/EmployeeSidebar";

/*
==================================================
EMPLOYEE LAYOUT
--------------------------------------------------
Structure:
- Common Navbar
- Employee Sidebar
- Main Page Content
==================================================
*/

const EmployeeLayout = () => {

  /*
    TEMP USER
    Later replace with:
    
    const { user } = useAuth();
  */
  const user = {
    name: "Sushant",
    email: "sushant@gmail.com",
    role: "EMPLOYEE",
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">

      {/* ======================================
          COMMON NAVBAR
      ====================================== */}
      <Navbar user={user} />

      {/* ======================================
          MAIN LAYOUT
      ====================================== */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ======================================
            SIDEBAR
        ====================================== */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <EmployeeSidebar user={user} />
        </div>

        {/* ======================================
            MAIN PAGE CONTENT
        ====================================== */}
        <main className="min-h-0 flex-1 overflow-y-auto p-6">

          {/* Nested Routes Render Here */}
          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default EmployeeLayout;