// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import UserPage from './pages/UserPage';
import AlbumPage from './pages/AlbumPage';
import PhotoPage from './pages/PhotoPage';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();

  // Show a full-page loading spinner while auth status is being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/home" replace />}
      />
      <Route 
        path="/home" 
        element={user ? <Home /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/users/:id" 
        element={user ? <UserPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/albums/:albumId" 
        element={user ? <AlbumPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/photos/:id" 
        element={user ? <PhotoPage /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;