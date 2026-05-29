import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Reg from './pages/Reg.jsx'
import NotFound from './pages/NotFound.jsx'
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx'
import EmployeeTasks from './pages/employee/MyTasks.jsx'
import EmployeeAttendance from './pages/employee/Attendance.jsx'
import EmployeeLeaves from './pages/employee/MyLeaves.jsx'
import EmployeeNotifications from './pages/employee/Notifications.jsx'
import ManagerDashboard from './pages/manager/Dashboard.jsx'
import ManagerTeams from './pages/manager/Teams.jsx'
import ManagerProjects from './pages/manager/Projects.jsx'
import ManagerTasks from './pages/manager/Tasks.jsx'
import ManagerAttendanceAnalytics from './pages/manager/AttendanceAnalytics.jsx'
import ManagerLeavesApproval from './pages/manager/LeavesApproval.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import AdminTeams from './pages/admin/Teams.jsx'
import AdminProjects from './pages/admin/Projects.jsx'
import AdminSystemAnalytics from './pages/admin/SystemAnalytics.jsx'
import AdminSettings from './pages/admin/Settings.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Reg />} />

          <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
            <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/tasks" element={<EmployeeTasks />} />
            <Route path="/employee/attendance" element={<EmployeeAttendance />} />
            <Route path="/employee/leaves" element={<EmployeeLeaves />} />
            <Route path="/employee/notifications" element={<EmployeeNotifications />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
            <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/teams" element={<ManagerTeams />} />
            <Route path="/manager/projects" element={<ManagerProjects />} />
            <Route path="/manager/tasks" element={<ManagerTasks />} />
            <Route
              path="/manager/attendance-analytics"
              element={<ManagerAttendanceAnalytics />}
            />
            <Route path="/manager/leaves-approval" element={<ManagerLeavesApproval />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["SYSTEM_ADMIN"]} />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/teams" element={<AdminTeams />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/system-analytics" element={<AdminSystemAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
