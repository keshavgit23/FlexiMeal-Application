import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import SSOCallbackPage from "./routes/clerk-routes/SSO-Callback";
import AppLoader from "./pages/loader/AppLoader";
import {OnboardingPage} from "./pages/onboarding/OnboardingPage";
import MessOwnerHomePage from "./pages/mess-partner/MessOwnerHomePage";
import StudentHomePage from "./pages/user/UserHomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLoader />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/sso-callback" element={<SSOCallbackPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/user" element={<StudentHomePage />} />
      <Route path="/mess-owner" element={<MessOwnerHomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;