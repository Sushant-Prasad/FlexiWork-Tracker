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
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ======================================
          COMMON NAVBAR
      ====================================== */}
      <Navbar user={user} />

      {/* ======================================
          MAIN LAYOUT
      ====================================== */}
      <div className="flex">

        {/* ======================================
            SIDEBAR
        ====================================== */}
        <div className="hidden lg:block">
          <EmployeeSidebar user={user} />
        </div>

        {/* ======================================
            MAIN PAGE CONTENT
        ====================================== */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* Nested Routes Render Here */}
          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default EmployeeLayout;