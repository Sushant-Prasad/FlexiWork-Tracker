import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authServices.js";

/*
==================================================
AUTH CONTEXT
--------------------------------------------------
Purpose:
Provides global authentication state and
authentication-related actions across the
entire FlexiWork application.

Features:
- User Authentication
- User Registration
- Auto Login
- Persistent Login
- Logout
- Global User State
- Loading State
- Token Management

Used By:
- Entire Application
- Protected Routes
- Navbar
- Sidebar
- Dashboard
- Profile
- Role-based Routing

Related APIs:
- POST /api/auth/login
- POST /api/auth/register
- GET  /api/auth/me

Business Value:
Maintains a single source of truth for
authentication, allowing every component
to access the current logged-in user,
authentication status, and auth actions
without prop drilling.

Workflow:
1. Application loads.
2. Read token from localStorage.
3. Validate token.
4. Fetch current user.
5. Store user globally.
6. Provide authentication methods.
7. Allow logout by clearing session.

Returns:
Authentication Context Provider and
custom authentication hook.
==================================================
*/

/*
==================================================
AUTH CONTEXT
--------------------------------------------------
Purpose:
Creates a global React Context for
authentication state.
==================================================
*/
const AuthContext = createContext(null);

/*
==================================================
TOKEN STORAGE KEY
--------------------------------------------------
Purpose:
Key used to store JWT token inside
browser localStorage.
==================================================
*/
const TOKEN_KEY = "flexiwork_token";

/*
==================================================
AUTH PROVIDER
--------------------------------------------------
Props:
- children

Purpose:
Wraps the application and provides
authentication state and actions to all
child components.

Returns:
AuthContext Provider.
==================================================
*/
export const AuthProvider = ({ children }) => {

  /*
  ==========================================
  AUTHENTICATED USER
  ------------------------------------------
  Stores the currently logged-in user.
  ==========================================
  */
  const [user, setUser] = useState(null);

  /*
  ==========================================
  AUTH TOKEN
  ------------------------------------------
  Stores JWT token.

  Initial value is loaded from localStorage
  to support persistent login.
  ==========================================
  */
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Indicates whether authentication data
  is currently being loaded.
  ==========================================
  */
  const [isLoading, setIsLoading] =
    useState(true);

  /*
  ==========================================
  AUTO LOGIN
  ------------------------------------------
  Runs once when the provider mounts.

  Workflow:
  1. Read token from localStorage.
  2. If token exists:
     - Validate token.
     - Fetch current user.
  3. If validation fails:
     - Remove invalid token.
     - Clear authentication state.
  ==========================================
  */
  useEffect(() => {

    const savedToken =
      localStorage.getItem(TOKEN_KEY);

    /*
    ----------------------------------------
    No saved login session.
    ----------------------------------------
    */
    if (!savedToken) {

      setToken(null);
      setIsLoading(false);

      return;
    }

    /*
    ----------------------------------------
    Load current authenticated user.
    ----------------------------------------
    */
    const loadUser = async () => {

      try {

        setToken(savedToken);

        const data =
          await getCurrentUser(savedToken);

        const current =
          data?.user ||
          data?.data ||
          data;

        setUser(current || null);

      } catch (error) {

        /*
        Remove invalid or expired token.
        */
        localStorage.removeItem(TOKEN_KEY);

        setToken(null);
        setUser(null);

      } finally {

        setIsLoading(false);

      }

    };

    loadUser();

  }, []);

  /*
  ==========================================
  LOGIN
  ------------------------------------------
  Authenticates the user.

  Parameters:
  - email
  - password

  Workflow:
  1. Call login API.
  2. Save token.
  3. Save authenticated user.
  4. Return authentication data.
  ==========================================
  */
  const login = async ({
    email,
    password,
  }) => {

    const data =
      await loginUser({
        email,
        password,
      });

    const token =
      data?.token ||
      data?.data?.token;

    const current =
      data?.user ||
      data?.data?.user;

    /*
    Save JWT token locally.
    */
    if (token) {
      localStorage.setItem(
        TOKEN_KEY,
        token
      );
    }

    setToken(token || null);
    setUser(current || null);

    return {
      token,
      user: current,
    };

  };

  /*
  ==========================================
  REGISTER
  ------------------------------------------
  Registers a new user account.

  Parameters:
  - name
  - email
  - password
  - role

  Returns:
  Registration response.
  ==========================================
  */
  const register = async ({
    name,
    email,
    password,
    role,
  }) => {

    return registerUser({
      name,
      email,
      password,
      role,
    });

  };

  /*
  ==========================================
  LOGOUT
  ------------------------------------------
  Ends the current session.

  Workflow:
  1. Remove token.
  2. Clear user state.
  3. Reset authentication.
  ==========================================
  */
  const logout = () => {

    localStorage.removeItem(TOKEN_KEY);

    setToken(null);
    setUser(null);

  };

  /*
  ==========================================
  CONTEXT VALUE
  ------------------------------------------
  Memoizes context value to prevent
  unnecessary re-renders.

  Exposes:
  - user
  - token
  - loading state
  - authentication methods
  ==========================================
  */
  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      setUser,
    }),
    [
      user,
      token,
      isLoading,
    ]
  );

  /*
  ==========================================
  CONTEXT PROVIDER
  ------------------------------------------
  Makes authentication state available
  throughout the application.
  ==========================================
  */
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};

/*
==================================================
USE AUTH HOOK
--------------------------------------------------
Purpose:
Custom hook for accessing authentication
context from any component.

Returns:
Authentication context.

Throws:
Error if used outside AuthProvider.
==================================================
*/
export const useAuth = () => {

  const context =
    useContext(AuthContext);

  /*
  ------------------------------------------
  Ensure hook is used inside provider.
  ------------------------------------------
  */
  if (!context) {

    throw new Error(
      "useAuth must be used within an AuthProvider"
    );

  }

  return context;

};