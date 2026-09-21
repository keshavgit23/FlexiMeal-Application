import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { authenticateUser } from "../../apis/auth.api";
import BrandLogo from "../../assets/BrandLogo.jpeg";
export default function AppLoader() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  const [hasError, setHasError] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const resolveApp = useCallback(async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate("/auth", { replace: true });
      return;
    }

    if (isResolving) return;

    setHasError(false);
    setIsResolving(true);

    try {
      const token = await getToken();

      console.log("Token available:", !!token);

      if (!token) {
        throw new Error("Token unavailable");
      }

      const response = await authenticateUser(token);

      console.log("Authentication response:", response);

      if (
        !response ||
        response.success !== true ||
        !response.user ||
        typeof response.user.onboardingCompleted !== "boolean" ||
        !response.user.role
      ) {
        throw new Error("Invalid backend response");
      }

      const { onboardingCompleted, role } = response.user;

      // User has not completed onboarding
      if (!onboardingCompleted) {
        navigate("/onboarding", { replace: true });
        return;
      }

      // User has completed onboarding
      switch (role) {
        case "student":
          navigate("/student", { replace: true });
          break;

        case "mess_owner":
          navigate("/mess-owner", { replace: true });
          break;

        default:
          throw new Error(`Unsupported user role: ${role}`);
      }
    } catch (error) {
      console.error("Unable to initialize application:", error);
      setHasError(true);
    } finally {
      setIsResolving(false);
    }
  }, [isLoaded, isSignedIn, isResolving, getToken, navigate]);

  useEffect(() => {
    if (isLoaded && !hasError && !isResolving) {
      resolveApp();
    }
  }, [isLoaded, isSignedIn, hasError, isResolving, resolveApp]);

  if (hasError) {
    return (
      <div
        id="app-loader-error-container"
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-background)] text-center"
      >
        <div
          id="app-loader-error-icon-wrapper"
          className="w-14 h-14 mb-5 rounded-[var(--radius-full)] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] flex items-center justify-center"
        >
          <i
            className="fa-solid fa-triangle-exclamation text-2xl text-[var(--color-error)]"
            aria-hidden="true"
          />
        </div>

        <h1
          id="app-loader-error-title"
          className="text-xl font-semibold text-[var(--color-text-primary)] font-[var(--font-family-heading)] mb-2"
        >
          Something went wrong
        </h1>

        <p
          id="app-loader-error-description"
          className="max-w-sm text-sm text-[var(--color-text-secondary)] font-[var(--font-family-body)] mb-6"
        >
          We couldn't set up your session. Please try again.
        </p>

        <button
          id="app-loader-retry-button"
          type="button"
          onClick={resolveApp}
          disabled={isResolving}
          className="px-6 py-2.5 rounded-[var(--radius-xl)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] text-[var(--color-text-inverse)] font-medium font-[var(--font-family-body)] transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {isResolving ? (
            <>
              <i
                className="fa-solid fa-spinner fa-spin text-sm"
                aria-hidden="true"
              />
              <span>Retrying...</span>
            </>
          ) : (
            <>
              <i
                className="fa-solid fa-rotate-right text-sm"
                aria-hidden="true"
              />
              <span>Retry</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      id="app-loader-container"
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-background)]"
    >
      {/* Logo */}
      <div
        id="app-loader-logo"
        className="mb-6 flex items-center justify-center"
      >
        {/* Replace this with your actual logo */}
        <img
          src={BrandLogo}
          alt="FlexiMeal"
          className="w-20 h-20 rounded-full object-contain"
        />
      </div>

      {/* Loading spinner */}
      <div
        id="app-loader-spinner-wrapper"
        className="w-10 h-10 mb-5 flex items-center justify-center"
      >
        <i
          className="fa-solid fa-spinner fa-spin text-3xl text-[var(--color-primary)]"
          aria-hidden="true"
        />
      </div>

      {/* Loading message */}
      <p
        id="app-loader-message"
        className="text-base font-medium text-[var(--color-text-primary)] font-[var(--font-family-body)]"
      >
        Setting things up...
      </p>
    </div>
  );
}



