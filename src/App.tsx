import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import SSOCallbackPage from "./routes/clerk-routes/SSO-Callback";
import AuthResolver from "./pages/auth/AuthResolver";
import {OnboardingPage} from "./pages/onboarding/OnboardingPage";
import MessOwnerHomePage from "./pages/mess-owner/MessOwnerHomePage";
import StudentHomePage from "./pages/student/StudentHomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/sso-callback" element={<SSOCallbackPage />} />
      <Route path="/auth-resolver" element={<AuthResolver />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/student" element={<StudentHomePage />} />
      <Route path="/mess-owner" element={<MessOwnerHomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;