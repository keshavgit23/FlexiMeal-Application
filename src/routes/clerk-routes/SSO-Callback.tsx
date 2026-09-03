import { AuthenticateWithRedirectCallback } from '@clerk/react';

export default function SsoCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/sign-in-success"
      signUpFallbackRedirectUrl="/sign-up-success"
      signInUrl="/"
      signUpUrl="/"
    />
  );
}