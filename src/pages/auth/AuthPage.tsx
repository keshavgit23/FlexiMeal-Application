import React, { useState } from 'react';
import { useSignIn, useSignUp } from "@clerk/react";
import { useAuth, useUser } from "@clerk/react";
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
  onNavigateToForgotPassword,
}: AuthPageProps) {
  // Local form UI state (UI ONLY - NO AUTH LOGIC)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [mockLoading, setMockLoading] = useState(false);
  const [mockError, setMockError] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  console.log("Clerk signed in:", isSignedIn);
  console.log('User ID:', user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
    setMockLoading(true);
    setMockError(null);

    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        setMockError(error.message);
        return;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();

        if (finalizeError) {
          setMockError(finalizeError.message);
          return;
        }

        console.log("✅ Clerk sign-in successful");

        onSuccess?.();
      } else {
        console.log("Sign-in requires additional step:", signIn.status);
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      setMockError("Unable to sign in. Please try again.");
    } finally {
      setMockLoading(false);
    }
  };
  const handleForgotPassword = () => {
    if (onNavigateToForgotPassword) {
      onNavigateToForgotPassword();
    } else {
      setDemoNotice('Password reset flow placeholder triggered.');
    }
  };

  const handleSocialAuth = async (provider: 'Google' | 'Apple') => {
    try {
      const strategy =
        provider === 'Google'
          ? 'oauth_google'
          : 'oauth_apple';

      if (activeTab === 'signup') {
        const { error } = await signUp.sso({
          strategy,
          redirectCallbackUrl: '/sso-callback',
          redirectUrl: '/sign-up-success',

        });

        if (error) {
          console.error(`${provider} sign-up error:`, error);
          setMockError(error.message);
        }

        return;
      }

      const { error } = await signIn.sso({
        strategy,
        redirectCallbackUrl: '/sso-callback',
        redirectUrl: '/sign-in-success',

      });

      if (error) {
        console.error(`${provider} sign-in error:`, error);
        setMockError(error.message);
      }
    } catch (error: any) {
      console.error(`${provider} ${activeTab} failed:`, error);

      setMockError(
        error?.message ||
        `Unable to continue with social ${activeTab}.`
      );
    }
  };
  const handleToggleTab = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setMockError(null);
    setDemoNotice(null);
    if (tab === 'signup' && onNavigateToSignUp) {
      onNavigateToSignUp();
    }
  };

  return (
    <>
      <button onClick={() => signOut()}>
        Sign out
      </button>
      <AuthLayout
        footer={
          <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
            <p className="text-xs text-[#6B7280]">
              By continuing, you agree to FlexiMeal&apos;s{' '}
              <button
                type="button"
                onClick={() => setDemoNotice('Terms of Service dialog placeholder')}
                className="text-[#4B5563] underline font-medium hover:text-[#111827] focus:outline-none"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setDemoNotice('Privacy Policy dialog placeholder')}
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
          title={activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
          subtitle={
            activeTab === 'signin'
              ? 'Sign in to access your customized meal plans, nutrition goals, and canteen pre-orders.'
              : 'Join FlexiMeal to start customizing healthy campus and office meal plans today.'
          }
        />

        {/* Mobile Mode Segmented Switch (Clean Native Feel) */}
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

        {/* Demo Status Banner */}
        {demoNotice && (
          <div
            className="mb-4 p-3 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] text-xs flex items-center justify-between"
            role="status"
          >
            <span>{demoNotice}</span>
            <button
              type="button"
              onClick={() => setDemoNotice(null)}
              className="text-[#047857] hover:text-[#065F46] font-bold text-xs ml-2 p-1"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        )}

        {/* Primary Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
          {/* Email Field */}
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

          {/* Password Field with visibility toggle & Forgot Password */}
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
            error={mockError || undefined}
            required
          />

          {/* Remember Me / Session persistence check */}
          <div className="flex items-center justify-between pt-0.5 pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#DC2626] border-[#D1D5DB] focus:ring-[#DC2626] focus:ring-offset-0 cursor-pointer accent-[#DC2626]"
              />
              <span className="text-xs text-[#4B5563] font-medium">Keep me signed in</span>
            </label>
          </div>

          {/* Primary Action Button */}
          <AuthButton
            type="submit"
            variant="primary"
            isLoading={mockLoading}
            className="mt-1"
          >
            {activeTab === 'signin' ? 'Sign In to FlexiMeal' : 'Create Free Account'}
          </AuthButton>
        </form>

        {/* Visual Divider */}
        <div className="my-5">
          <AuthDivider text="OR CONTINUE WITH" />
        </div>

        {/* Social Authentication Actions */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <SocialAuthButton
            provider="google"
            label="Google"
            onClick={() => handleSocialAuth('Google')}
          />
          <SocialAuthButton
            provider="apple"
            label="Apple"
            onClick={() => handleSocialAuth('Apple')}
          />
        </div>

        {/* Switch Form Action Link */}
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
      </AuthLayout>
    </>
  );
}

// Default export for project bundling
export default AuthPage;
