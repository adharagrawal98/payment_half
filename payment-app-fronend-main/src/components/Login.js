import React from 'react';
import { auth, provider } from '../firebaseConfig'; // Import Firebase auth and provider
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import signupImage from '../assets/Singup-image.jpg';

const Login = ({ setUser, setUserRole }) => { // Accept props
    const navigate = useNavigate();
    const db = getFirestore();

    const handleRoleChangeAndSignIn = async (selectedRole) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check Firestore for existing user
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                const existingRole = userDoc.data().role; // Get the user's role from Firestore

                // Check if the selected role matches the existing role
                if (existingRole !== selectedRole) {
                    // Role mismatch for the same account
                    Swal.fire({
                        title: 'Role Mismatch',
                        text: `You are registered as a ${existingRole}. Please log in with that role.`,
                        icon: 'warning',
                        confirmButtonText: 'Okay'
                    });
                    return; // Stop further execution, do not set user or role
                }

                // If roles match, proceed to set user and redirect based on the role
                setUser(user); // Set user in App state
                setUserRole(existingRole); // Update user role
                if (existingRole === "Donor") {
                    navigate('/home'); // Redirect to donor home page
                } else if (existingRole === "Shelter Staff") {
                    navigate('/shelter-dashboard'); // Redirect to shelter admin dashboard
                }
            } else {
                // User does not exist in Firestore
                Swal.fire({
                    title: 'User Not Found',
                    text: 'No user found with this account. Please sign up first.',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
                navigate('/signup');
            }

        } catch (error) {
            Swal.fire({
                title: 'Login Error',
                text: 'Sorry, please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
            console.error("Error during authentication:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-no-repeat bg-center"
                style={{
                    backgroundImage: `url(${signupImage})`,
                    backgroundSize: '100% auto',
                    backgroundPosition: 'center',
                }}
            >
                <div className="bg-black bg-opacity-50 w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold mb-10 text-white">App Name</h1>
                    <div className="flex space-x-4">
                        <button
                            className="w-48 h-16 mb-80 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
                            onClick={() => handleRoleChangeAndSignIn("Donor")}
                        >
                            Login as Donor
                        </button>
                        <button
                            className="w-48 h-16 mb-80 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
                            onClick={() => handleRoleChangeAndSignIn("Shelter Staff")}
                        >
                            Login as Shelter Staff
                        </button>
                    </div>
                    <div className="flex items-center text-white -mt-2">
                        <span>Don't have an account? <a href="/signup" className="underline text-blue-300 underline hover:text-blue-500 transition duration-200">Sign up</a></span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;