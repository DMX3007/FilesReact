import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "../shared/context/AuthContext";
import ProtectedRoute from "../widgets/navigation/ProtectedRoute";
import Navigation from "../widgets/navigation/Navigation"
import Journals from '../pages/journals';
import Reports from '../pages/reports';
import LoginPage from "../pages/auth/LoginPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 container mx-auto py-6 px-4">
            <Routes>
              <Route path="/login" element={
                <LoginPage />
              }/>
              <Route path="/" element={
                <ProtectedRoute>
                  <Journals />
                </ProtectedRoute>}
              />
              <Route path="/journal" element={
                <ProtectedRoute>
                  <Journals />
                </ProtectedRoute>} />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App