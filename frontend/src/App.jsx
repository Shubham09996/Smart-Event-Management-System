import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import BackgroundFlow from "./components/BackgroundFlow";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // New import
import ResetPasswordPage from "./pages/ResetPasswordPage";   // New import
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage"; 
import ContactPage from "./pages/ContactPage"; 
import StudentDashboardPage from "./pages/StudentDashboardPage";  
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";  
import AdminDashboardPage from "./pages/AdminDashboardPage";   // 👈 yaha import kiya
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast'; // Import Toaster

export default function App() {
  return (
    <Router>
      <BackgroundFlow>
        <AuthProvider>
          <div className="bg-[#0a0a0f] text-white min-h-screen">
            <Navbar />

            <Routes>
              {/* Landing Page */}
              <Route
                path="/"
                element={
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Hero />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Features />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <Stats />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <Footer />
                    </motion.div>
                  </>
                }
              />

              {/* Events Page */}
              <Route path="/events" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                  <EventsPage />
                </motion.div>
              } />

              {/* About Page */}
              <Route path="/about" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                  <AboutPage />
                </motion.div>
              } />

              {/* Contact Page */}
              <Route path="/contact" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                  <ContactPage />
                </motion.div>
              } />

              {/* Login Page */}
              <Route path="/login" element={
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <Login />
                </motion.div>
              } />

              {/* Signup Page */}
              <Route path="/signup" element={
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <Signup />
                </motion.div>
              } />

              {/* Forgot Password Page */}
              <Route path="/forgot-password" element={
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <ForgotPasswordPage />
                </motion.div>
              } />

              {/* Reset Password Page */}
              <Route path="/resetpassword/:resettoken" element={
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <ResetPasswordPage />
                </motion.div>
              } />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student" element={
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                    <StudentDashboardPage />
                  </motion.div>
                } />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
                <Route path="/organizer" element={
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                    <OrganizerDashboardPage />
                  </motion.div>
                } />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                    <AdminDashboardPage />
                  </motion.div>
                } />
              </Route>

            </Routes>
            <Toaster position="top-center" reverseOrder={false} /> {/* Toaster component */}
          </div>
        </AuthProvider>
      </BackgroundFlow>
    </Router>
  );
}
