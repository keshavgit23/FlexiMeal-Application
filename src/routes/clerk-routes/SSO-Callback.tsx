import { AuthenticateWithRedirectCallback } from '@clerk/react';

export default function SsoCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/auth-resolver"
      signUpFallbackRedirectUrl="/auth-resolver"
      signInUrl="/"
      signUpUrl="/"
    />
  );
}