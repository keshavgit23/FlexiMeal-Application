import React, { useState } from 'react';
import { useSignIn, useSignUp } from "@clerk/react";
import { useNavigate } from 'react-router-dom';
/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */

import { AuthButton } from '../../components/auth/AuthButton';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthDivider } from '../../components/auth/AuthDivider';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { SocialAuthButton } from '../../components/auth/SocialAuthButton';


export interface AuthPageProps {
  onSuccess?: () => void;
  onNavigateToSignUp?: () => void;
  onNavigateToForgotPassword?: () => void;
}

/* ==========================================================================
   INLINE SVG ICONS (NO EXTERNAL LIBRARIES)
   ========================================================================== */

function MailIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="3" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/* ==========================================================================
   PRIMARY COMPONENT: AuthPage
   ========================================================================== */

export function AuthPage({
  onSuccess,
  onNavigateToSignUp,
}: AuthPageProps) {
  // Local form UI state (UI ONLY - NO AUTH LOGIC)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isVerifyingSignIn, setIsVerifyingSignIn] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<
    'email' | 'code' | 'password' | null
  >(null);

  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const navigate = useNavigate();

  const isVerificationStep =
    isVerifyingSignIn ||
    (isVerifyingEmail && activeTab === 'signup');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setAuthError(null);
    setNotice(null);

    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      // Device Trust verification
      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code"
        );

        if (!emailCodeFactor) {
          setAuthError(
            "No supported email verification method is available."
          );
          return;
        }

        const { error: codeError } =
          await signIn.mfa.sendEmailCode();

        if (codeError) {
          setAuthError(codeError.message);
          return;
        }

        setVerificationCode("");
        setIsVerifyingSignIn(true);
        setNotice(`A verification code was sent to ${email}.`);
        return;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();

        if (finalizeError) {
          setAuthError(finalizeError.message);
          return;
        }

        navigate("/", { replace: true });
        onSuccess?.();
        return;
      }

      setAuthError(
        `Additional authentication is required: ${signIn.status}`
      );

    } catch (error) {
      console.error("Sign-in failed:", error);
      setAuthError("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setAuthError(null);

    try {
      const { error } = await signIn.mfa.verifyEmailCode({
        code: verificationCode.trim(),
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (signIn.status !== "complete") {
        setAuthError("Verification is not complete. Please try again.");
        return;
      }

      const { error: finalizeError } = await signIn.finalize();

      if (finalizeError) {
        setAuthError(finalizeError.message);
        return;
      }

      setIsVerifyingSignIn(false);
      navigate("/", { replace: true });

    } catch (error) {
      console.error("Sign-in verification failed:", error);
      setAuthError("Unable to verify your sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setAuthError(null);
    setNotice(null);

    try {
      const { error } = await signUp.password({
        emailAddress: email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setIsVerifyingEmail(true);
      setVerificationCode('');

      const { error: verificationError } =
        await signUp.verifications.sendEmailCode();

      if (verificationError) {
        setAuthError(verificationError.message);
        return;
      }

      setNotice(`A verification code was sent to ${email}.`);
    } catch (error) {
      console.error("Sign-up failed:", error);
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setAuthError(null);
    setNotice(null);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: verificationCode.trim(),
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (signUp.status !== "complete") {
        setAuthError("Email verification is not complete. Please try again.");
        return;
      }

      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        setAuthError(finalizeError.message);
        return;
      }

      navigate('/', { replace: true });
    } catch (error) {
      console.error("Email verification failed:", error);
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to verify your email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleResendVerificationCode = async () => {
    setIsResendingCode(true);
    setAuthError(null);
    setNotice(null);

    try {
      if (isVerifyingSignIn) {
        const { error } = await signIn.mfa.sendEmailCode();

        if (error) {
          setAuthError(error.message);
          return;
        }
      } else if (isVerifyingEmail && activeTab === 'signup') {
        const { error } =
          await signUp.verifications.sendEmailCode();

        if (error) {
          setAuthError(error.message);
          return;
        }
      } else {
        return;
      }

      setNotice(`A new verification code was sent to ${email}.`);
    } catch (error) {
      console.error("Resending verification code failed:", error);

      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to resend verification code."
      );
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleForgotPassword = () => {
    setAuthError(null);
    setNotice(null);
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotPasswordStep('email');
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setAuthError(null);
    setNotice(null);

    try {
      const { error: createError } = await signIn.create({
        identifier: email.trim(),
      });

      if (createError) {
        setAuthError(createError.message);
        return;
      }

      const { error: sendError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendError) {
        setAuthError(sendError.message);
        return;
      }

      setForgotPasswordStep('code');
      setNotice(`Password reset code sent to ${email}.`);

    } catch (error) {
      console.error('Password reset code failed:', error);
      setAuthError('Unable to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setAuthError(null);

    try {
      const { error } =
        await signIn.resetPasswordEmailCode.verifyCode({
          code: resetCode.trim(),
        });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (signIn.status !== 'needs_new_password') {
        setAuthError('Unable to verify reset code. Please try again.');
        return;
      }

      setForgotPasswordStep('password');

    } catch (error) {
      console.error('Reset code verification failed:', error);
      setAuthError('Unable to verify the code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setAuthError(null);

    if (newPassword !== confirmNewPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: newPassword,
          signOutOfOtherSessions: true,
        });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (signIn.status === 'complete') {
        const { error: finalizeError } = await signIn.finalize();

        if (finalizeError) {
          setAuthError(finalizeError.message);
          return;
        }

        setForgotPasswordStep(null);
        navigate('/', { replace: true });
        return;
      }

      setAuthError(
        `Additional authentication is required: ${signIn.status}`
      );

    } catch (error) {
      console.error('Password reset failed:', error);
      setAuthError('Unable to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async () => {
    try {
      if (activeTab === 'signup') {
        const { error } = await signUp.sso({
          strategy: 'oauth_google',
          redirectCallbackUrl: '/sso-callback',
          redirectUrl: '/',

        });

        if (error) {
          console.error('Google sign-up error:', error);
          setAuthError(error.message);
        }

        return;
      }

      const { error } = await signIn.sso({
        strategy: 'oauth_google',
        redirectCallbackUrl: '/sso-callback',
        redirectUrl: '/',

      });

      if (error) {
        console.error('Google sign-in error:', error);
        setAuthError(error.message);
      }
    } catch (error: unknown) {
      console.error(`Google ${activeTab} failed:`, error);

      setAuthError(
        error instanceof Error
          ? error.message
          : `Unable to continue with social ${activeTab}.`
      );
    }
  };
  const handleToggleTab = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setAuthError(null);
    setNotice(null);
    if (tab === 'signup' && onNavigateToSignUp) {
      onNavigateToSignUp();
    }
  };

  return (
    <>
      <AuthLayout
        footer={
          <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
            <p className="text-xs text-[#6B7280]">
              By continuing, you agree to FlexiMeal&apos;s{' '}
              <button
                type="button"
                onClick={() => setNotice('Terms of Service dialog placeholder')}
                className="text-[#4B5563] underline font-medium hover:text-[#111827] focus:outline-none"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setNotice('Privacy Policy dialog placeholder')}
                className="text-[#4B5563] underline font-medium hover:text-[#111827] focus:outline-none"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        }
      >
        {/* Header Branding */}
        <AuthHeader
          title={
            forgotPasswordStep
              ? 'Reset your password'
              : activeTab === 'signin'
                ? 'Welcome back'
                : 'Create an account'
          }
          subtitle={
            forgotPasswordStep
              ? 'Follow the steps below to securely reset your password.'
              : activeTab === 'signin'
                ? 'Sign in to access your customized meal plans, nutrition goals, and canteen pre-orders.'
                : 'Join FlexiMeal to start customizing healthy campus and office meal plans today.'
          }
        />

        {/* Mobile Mode Segmented Switch (Clean Native Feel) */}
        {!forgotPasswordStep && (
          <div
            className="w-full bg-[#F3F4F6] p-1 rounded-xl flex items-center mb-6"
            role="tablist"
            aria-label="Authentication Mode"
          >
            <button
              type="button"
              role="tab"
              id="signin-tab"
              aria-selected={activeTab === 'signin'}
              onClick={() => handleToggleTab('signin')}
              className={`
            flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 focus:outline-none
            ${activeTab === 'signin'
                  ? 'bg-[#FFFFFF] text-[#111827] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#111827]'
                }
          `}
            >
              Sign In
            </button>

            <button
              type="button"
              role="tab"
              id="signup-tab"
              aria-selected={activeTab === 'signup'}
              onClick={() => handleToggleTab('signup')}
              className={`
            flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 focus:outline-none
            ${activeTab === 'signup'
                  ? 'bg-[#FFFFFF] text-[#111827] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#111827]'
                }
          `}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Demo Status Banner */}
        {notice && (
          <div
            className="mb-4 p-3 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] text-xs flex items-center justify-between"
            role="status"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-[#047857] hover:text-[#065F46] font-bold text-xs ml-2 p-1"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        )}

        {forgotPasswordStep ? (
          <form
            onSubmit={
              forgotPasswordStep === 'email'
                ? handleSendResetCode
                : forgotPasswordStep === 'code'
                  ? handleVerifyResetCode
                  : handleSubmitNewPassword
            }
            className="flex flex-col gap-4 w-full"
          >
            {forgotPasswordStep === 'email' && (
              <>
                <p className="text-sm text-[#4B5563]">
                  Enter your registered email address. We'll send
                  you a code to reset your password.
                </p>

                <AuthInput
                  id="reset-email"
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={authError || undefined}
                  required
                />

                <AuthButton type="submit" variant="primary" isLoading={isLoading}>
                  Send reset code
                </AuthButton>
              </>
            )}

            {forgotPasswordStep === 'code' && (
              <>
                <p className="text-sm text-[#4B5563]">
                  Enter the password reset code sent to <strong>{email}</strong>.
                </p>

                <AuthInput
                  id="reset-code"
                  name="resetCode"
                  type="text"
                  label="Verification code"
                  placeholder="Enter your code"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  value={resetCode}
                  onChange={(e) =>
                    setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  error={authError || undefined}
                  required
                />

                <AuthButton type="submit" variant="primary" isLoading={isLoading}>
                  Verify code
                </AuthButton>

                <button
                  type="button"
                  disabled={isResendingCode}
                  onClick={async () => {
                    setIsResendingCode(true);
                    setAuthError(null);

                    try {
                      const { error } =
                        await signIn.resetPasswordEmailCode.sendCode();

                      if (error) {
                        setAuthError(error.message);
                      } else {
                        setNotice('A new password reset code was sent.');
                      }
                    } finally {
                      setIsResendingCode(false);
                    }
                  }}
                  className="text-sm font-semibold text-[#DC2626]"
                >
                  {isResendingCode ? 'Sending...' : 'Resend code'}
                </button>
              </>
            )}

            {forgotPasswordStep === 'password' && (
              <>
                <p className="text-sm text-[#4B5563]">
                  Your email has been verified. Create a new password.
                </p>

                <PasswordInput
                  id="new-password"
                  name="newPassword"
                  label="New password"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={authError || undefined}
                  required
                />

                <PasswordInput
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  label="Confirm new password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />

                <AuthButton type="submit" variant="primary" isLoading={isLoading}>
                  Reset password
                </AuthButton>
              </>
            )}

            <button
              type="button"
              onClick={async () => {
                await signIn.reset();
                setForgotPasswordStep(null);
                setAuthError(null);
                setNotice(null);
                setResetCode('');
                setNewPassword('');
                setConfirmNewPassword('');
              }}
              className="text-sm text-[#6B7280] hover:text-[#111827]"
            >
              ← Back to Sign In
            </button>
          </form>
        ) : (
          <>
            {/* Primary Form */}
            <form
              onSubmit={
                isVerifyingSignIn
                  ? handleVerifySignIn
                  : isVerifyingEmail && activeTab === 'signup'
                    ? handleVerifyEmail
                    : activeTab === 'signup'
                      ? handleSignUpSubmit
                      : handleSignInSubmit
              }
              noValidate
              className="flex flex-col gap-4 w-full"
            >
              {isVerificationStep ? (
                <>
                  <p className="text-sm text-[#4B5563]">
                    Enter the verification code sent to <strong>{email}</strong>.
                  </p>
                  <AuthInput
                    id="auth-verification-code"
                    name="verificationCode"
                    type="text"
                    label="Email verification code"
                    placeholder="Enter your code"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    error={authError || undefined}
                    required
                  />
                  <AuthButton
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="mt-1"
                  >
                    Verify email
                  </AuthButton>
                  <button
                    type="button"
                    onClick={handleResendVerificationCode}
                    disabled={isLoading || isResendingCode}
                    className="text-sm font-semibold text-[#DC2626] hover:text-[#B91C1C] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResendingCode ? 'Sending code...' : 'Resend code'}
                  </button>
                </>
              ) : (
                <>
                  <AuthInput
                    id="auth-email"
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="name@fleximeal.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    startIcon={<MailIcon className="w-5 h-5" />}
                    required
                  />

                  <PasswordInput
                    id="auth-password"
                    name="password"
                    label="Password"
                    placeholder="••••••••••••"
                    autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showForgotPassword={activeTab === 'signin'}
                    onForgotPasswordClick={handleForgotPassword}
                    error={authError || undefined}
                    required
                  />

                  <AuthButton
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="mt-1"
                  >
                    {activeTab === 'signin' ? 'Sign In to FlexiMeal' : 'Create Free Account'}
                  </AuthButton>
                </>
              )}
            </form>
          </>
        )}

        {/* Visual Divider */}
        {!forgotPasswordStep && !(isVerifyingEmail && activeTab === 'signup') && (
          <div className="my-5">
            <AuthDivider text="OR CONTINUE WITH" />
          </div>
        )}

        {/* Social Authentication Actions */}
        {!forgotPasswordStep && !(isVerifyingEmail && activeTab === 'signup') && (
          <div className="grid grid-cols-1 gap-3 w-full">
            <SocialAuthButton
              provider="google"
              label="Google"
              onClick={handleSocialAuth}
            />
          </div>
        )}

        {/* Switch Form Action Link */}
        {!forgotPasswordStep && (
          <div className="mt-6 pt-4 border-t border-[#F3F4F6] text-center">
            {activeTab === 'signin' ? (
              <p className="text-xs text-[#6B7280]">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleToggleTab('signup')}
                  className="font-bold text-[#DC2626] hover:text-[#B91C1C] hover:underline focus:outline-none"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#6B7280]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleToggleTab('signin')}
                  className="font-bold text-[#DC2626] hover:text-[#B91C1C] hover:underline focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        )}
      </AuthLayout>
    </>
  );
}

// Default export for project bundling
export default AuthPage;
