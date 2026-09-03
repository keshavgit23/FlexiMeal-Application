import { useAuth, useUser } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

const SignUpSuccess = () => {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  console.log('===== SIGN UP SUCCESS =====');
  console.log('isLoaded:', isLoaded);
  console.log('isSignedIn:', isSignedIn);
  console.log('user:', user);
  console.log('userId:', user?.id);
  const navigate = useNavigate();

  // 1. Wait for Clerk to load
  if (!isLoaded) {
    return <div>Loading authentication state...</div>;
  }

  if (!isSignedIn || !user) {
    return <div>Please sign up or log in to view this page.</div>;
  }
  console.log('isSignedIn:', isSignedIn);
  console.log('isLoaded:', isLoaded);
  console.log('user:', user);
  console.log('Clerk ID:', user?.id);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Account Created Successfully 🎉
        </h1>

        <p className="mt-2">
          Welcome to FlexiMeal!
        </p>

        <p className="mt-4 text-sm">
          Signed In: {String(isSignedIn)}
        </p>

        <p className="mt-2 text-sm">
          User Loaded: {String(isLoaded)}
        </p>

        <p className="mt-2 text-sm">
          Clerk User ID: {isLoaded ? user?.id ?? 'No user found' : 'Loading...'}
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-lg px-5 py-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SignUpSuccess;