import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import SSOCallbackPage from "./routes/clerk-routes/SSO-Callback";
import AuthResolver from "./pages/auth/AuthResolver";
import DashboardPage from "./pages/DashboardPage";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/sso-callback" element={<SSOCallbackPage />} />
      <Route path="/auth-resolver" element={<AuthResolver />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;