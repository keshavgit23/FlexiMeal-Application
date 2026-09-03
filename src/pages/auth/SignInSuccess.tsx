// import { useAuth, useUser } from '@clerk/react';
// import { useNavigate } from 'react-router-dom';

// const SignInSuccess = () => {
//     const { isSignedIn } = useAuth();
//     const { user } = useUser();
//     const navigate = useNavigate();

//     return (
//         <>
//             <div className="flex min-h-screen items-center justify-center"> <div className="text-center"> <h1 className="text-2xl font-bold">
//                 Sign In Successful 🎉 </h1>
//                 <p className="mt-2">
//                     Welcome back!
//                 </p>

//                 {isSignedIn && user && (
//                     <p className="mt-4 text-sm">
//                         Clerk User ID: {user.id}
//                     </p>
//                 )}

//                 <button
//                     onClick={() => navigate('/')}
//                     className="mt-6 rounded-lg px-5 py-2"
//                 >
//                     Continue
//                 </button>
//             </div>
//             </div>
//         </>
//     );
// };

// export default SignInSuccess;
import { useAuth, useUser } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

const SignInSuccess = () => {
    const { isLoaded: authLoaded, isSignedIn } = useAuth();
    const { user, isLoaded: userLoaded } = useUser();
    const navigate = useNavigate();

    console.log('===== SIGN IN SUCCESS =====');
    console.log('Auth loaded:', authLoaded);
    console.log('User loaded:', userLoaded);
    console.log('Is signed in:', isSignedIn);
    console.log('User:', user);
    console.log('User ID:', user?.id);

    if (!authLoaded || !userLoaded) {
        return <div>Loading authentication...</div>;
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold">
                    Sign In Successful 🎉
                </h1>

                <p className="mt-2">
                    Welcome back!
                </p>

                <p className="mt-4 text-sm">
                    Auth Loaded: {String(authLoaded)}
                </p>

                <p className="mt-2 text-sm">
                    User Loaded: {String(userLoaded)}
                </p>

                <p className="mt-2 text-sm">
                    Signed In: {String(isSignedIn)}
                </p>

                <p className="mt-2 text-sm">
                    Clerk User ID: {user?.id ?? 'No user found'}
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

export default SignInSuccess;
