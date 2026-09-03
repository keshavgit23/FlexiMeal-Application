// main.tsx
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react"; 
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import App from "./App.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}
  signInUrl="/"
  signUpUrl="/"
  signInFallbackRedirectUrl="/sign-in-success"
  signUpFallbackRedirectUrl="/sign-up-success"
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
