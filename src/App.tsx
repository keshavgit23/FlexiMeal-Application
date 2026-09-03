// App.tsx
import { Routes, Route, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { useEffect } from "react";
import AuthPage from "./pages/auth/AuthPage";
import SSOCallbackPage from "./routes/clerk-routes/SSO-Callback";
import SignInSuccess from './pages/auth/SignInSuccess';
import SignUpSuccess from './pages/auth/SignUpSuccess';

function App() {
  const navigate = useNavigate();
  const { loaded, client } = useClerk();

  // Tells Clerk to use single-page routing instead of triggering native page reloads
  useEffect(() => {
    if (loaded && client) {
      // Configures internal SDK navigation to use React Router
    }
  }, [loaded, client]);

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/sso-callback" element={<SSOCallbackPage />} />
      <Route path="/sign-in-success" element={<SignInSuccess />} />
      <Route path="/sign-up-success" element={<SignUpSuccess />} />
    </Routes>
  );
}

export default App;
