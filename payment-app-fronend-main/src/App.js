// App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Removed BrowserRouter import
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Ensure you're importing Firestore functions
import { auth } from './firebaseConfig'; // Ensure this is your correct path
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut from firebase/auth
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import ShelterDashboard from './components/ShelterDashboard'; // Import your Shelter Dashboard
import ContactForm from './components/ContactUs';
import Testimonials from './components/Testimonials';
import DonorMap from './components/DonorMap';
import CharityPaymentPage from './components/CharityPaymentPage'
import PaymentConfirmationPage from './components/PaymentConfirmationPage';
import VerifyPage from './components/VerifyPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // New state to track user role
  const db = getFirestore(); // Initialize Firestore here
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Get user role from Firestore if user is authenticated
        const fetchUserRole = async () => {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role); // Set the role state
          } else {
            setUserRole(null); // Reset role if user is not found in Firestore
          }
        };
        fetchUserRole();
      } else {
        setUserRole(null); // Reset role if user is not authenticated
      }
    });
    return () => unsubscribe();
  }, [db]); // Add db to dependencies

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      navigate('/login'); // Redirect to login after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Determine if navbar should be displayed based on current path
  const hideNavbarRoutes = ['/login', '/signup'];
  const showNavbar = !hideNavbarRoutes.includes(window.location.pathname); // Use window.location.pathname for current path

  return (
    <div>
      {/* Conditional Navbar Rendering */}
      {showNavbar && user && userRole && (
        <nav className="flex items-center justify-between p-4 bg-black text-white">
          {/* Align "Shelter App" to the left and make it clickable */}
          <div
            className="text-lg font-bold flex-grow cursor-pointer"
            onClick={() => navigate('/')} // Navigate to homepage on click
          >
            Wanna Shelter You!
          </div>
          {/* Align buttons to the right */}
          <div className="flex space-x-4"> {/* Add space between buttons */}
            <button
              className="text-white text-sm md:text-base hover:text-blue-300"
              onClick={() => navigate('/testimonials')}
            >
              Testimonials
            </button>
            <button
              className="text-white text-sm md:text-base hover:text-blue-300"
              onClick={() => navigate('/contact-us')}
            >
              Contact Us
            </button>
            <button
              onClick={handleSignOut}
              className="hover:text-blue-300"
            >
              Sign Out
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/home" element={user && userRole === 'Donor' ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/shelter-dashboard" element={user && userRole === 'Shelter Staff' ? <ShelterDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setUser={setUser} setUserRole={setUserRole} />} />
        <Route path="/" element={user ? <Navigate to={userRole === 'Donor' ? '/home' : '/shelter-dashboard'} /> : <Navigate to="/login" />} />
        <Route path="/verify-page" element={<VerifyPage />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact-us" element={<ContactForm />} />
        <Route path="/donor-map" element={<DonorMap />} />
        <Route path="/shelter/:id" element={<CharityPaymentPage />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmationPage />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
      </Routes>
    </div>
  );
};

export default App;