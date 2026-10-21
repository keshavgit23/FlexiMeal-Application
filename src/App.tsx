import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import SSOCallbackPage from "./routes/clerk-routes/SSO-Callback";
import AppLoader from "./pages/loader/AppLoader";
import {OnboardingPage} from "./pages/onboarding/OnboardingPage";
import MessOwnerHomePage from "./pages/mess-partner/MessOwnerHomePage";
import MainUserPage from "./pages/user/MainUserPage";
import Meals from "./pages/mess-partner/Meals";
import { AppProvider } from "./context/AppContext";
function App() {
  return (
    <AppProvider>
    <Routes>
      <Route path="/" element={<AppLoader />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/sso-callback" element={<SSOCallbackPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/user" element={<MainUserPage />} />
      <Route path="/mess-owner" element={<MessOwnerHomePage />} />
      <Route path="/mess-partner/meals" element={<Meals />}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </AppProvider>
  );
}

export default App;