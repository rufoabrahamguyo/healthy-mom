import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import WeekTracker from './pages/WeekTracker';
import HealthLibrary from './pages/HealthLibrary';
import ClinicFinder from './pages/ClinicFinder';
import MoodTracker from './pages/MoodTracker';
import KickCounter from './pages/KickCounter';
import ContractionTimer from './pages/ContractionTimer';
import Appointments from './pages/Appointments';
import BabyPrep from './pages/BabyPrep';
import Reminders from './pages/Reminders';
import Nutrition from './pages/Nutrition';
import Forum from './pages/Forum';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="app">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <WeekTracker />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/library" 
                  element={
                    <ProtectedRoute>
                      <HealthLibrary />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/clinics" 
                  element={
                    <ProtectedRoute>
                      <ClinicFinder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mood" 
                  element={
                    <ProtectedRoute>
                      <MoodTracker />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/kicks" 
                  element={
                    <ProtectedRoute>
                      <KickCounter />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/contractions" 
                  element={
                    <ProtectedRoute>
                      <ContractionTimer />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/appointments" 
                  element={
                    <ProtectedRoute>
                      <Appointments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/prep" 
                  element={
                    <ProtectedRoute>
                      <BabyPrep />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reminders" 
                  element={
                    <ProtectedRoute>
                      <Reminders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/nutrition" 
                  element={
                    <ProtectedRoute>
                      <Nutrition />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/forum" 
                  element={
                    <ProtectedRoute>
                      <Forum />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
