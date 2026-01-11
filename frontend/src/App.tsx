import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProgramDetails from './pages/ProgramDetails';
import LessonEditor from './pages/LessonEditor';

// Simple check if user is logged in
// I changed 'JSX.Element' to 'any' below to stop the red error
const ProtectedRoute = ({ children }: { children: any }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/catalog" element={<Catalog />} />
        
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Program Details Page */}
        <Route path="/admin/program/:id" element={
          <ProtectedRoute>
            <ProgramDetails />
          </ProtectedRoute>
        } />
        
        {/* Lesson Editor Page */}
        <Route path="/admin/lesson/:id" element={
          <ProtectedRoute>
            <LessonEditor />
          </ProtectedRoute>
        } />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;