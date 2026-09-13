import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import { authenticateUser } from '../../apis/auth.api';

export default function AuthResolver() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  const [hasError, setHasError] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  const resolveAuthentication = useCallback(async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate('/', { replace: true });
      return;
    }

    if (isResolving) return;

    setHasError(false);
    setIsResolving(true);

    try {
      const token = await getToken();
      console.log("Token available:", !!token);
      if (!token) {
        throw new Error('Token unavailable');
      }

      const response = await authenticateUser(token);

      if (
        !response ||
        response.success !== true ||
        !response.user ||
        typeof response.user.onboardingCompleted !== 'boolean'
      ) {
        throw new Error('Invalid backend response');
      }

      if (response.user.onboardingCompleted) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      console.error('Unable to set up account:', err);
      setHasError(true);
    } finally {
      setIsResolving(false);
    }
  }, [isLoaded, isSignedIn, isResolving, getToken, navigate]);

  useEffect(() => {
    if (isLoaded && !hasError && !isResolving) {
      resolveAuthentication();
    }
  }, [isLoaded, isSignedIn]);

  if (hasError) {
    return (
      <div
        id="auth-resolver-error-container"
        className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]"
      >
        <div
          id="auth-resolver-error-card"
          className="w-full max-w-md p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-resting)] text-center"
        >
          <div
            id="auth-resolver-error-icon-wrapper"
            className="w-14 h-14 mx-auto mb-4 rounded-[var(--radius-full)] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] flex items-center justify-center"
          >
            <i
              className="fa-solid fa-triangle-exclamation text-2xl text-[var(--color-error)]"
              aria-hidden="true"
            />
          </div>

          <h1
            id="auth-resolver-error-title"
            className="text-xl font-semibold text-[var(--color-text-primary)] font-[var(--font-family-heading)] mb-2"
          >
            Unable to set up your account.
          </h1>

          <p
            id="auth-resolver-error-description"
            className="text-sm text-[var(--color-text-secondary)] font-[var(--font-family-body)] mb-6"
          >
            An unexpected error occurred while resolving your session.
          </p>

          <div
            id="auth-resolver-error-actions"
            className="flex items-center justify-center"
          >
            <button
              id="auth-resolver-retry-button"
              type="button"
              onClick={resolveAuthentication}
              disabled={isResolving}
              className="px-6 py-2.5 rounded-[var(--radius-xl)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] text-[var(--color-text-inverse)] font-medium font-[var(--font-family-body)] transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {isResolving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm" aria-hidden="true" />
                  <span>Retrying...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-rotate-right text-sm" aria-hidden="true" />
                  <span>Retry</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="auth-resolver-loading-container"
      className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]"
    >
      <div
        id="auth-resolver-loading-card"
        className="w-full max-w-sm p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-resting)] text-center"
      >
        <div
          id="auth-resolver-spinner-wrapper"
          className="w-12 h-12 mx-auto mb-4 flex items-center justify-center"
        >
          <i
            className="fa-solid fa-spinner fa-spin text-3xl text-[var(--color-primary)]"
            aria-hidden="true"
          />
        </div>

        <p
          id="auth-resolver-loading-message"
          className="text-base font-medium text-[var(--color-text-primary)] font-[var(--font-family-body)]"
        >
          Setting up your account...
        </p>
      </div>
    </div>
  );
}
