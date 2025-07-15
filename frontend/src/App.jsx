import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DipendenteDashboard from './pages/DipendenteDashboard';
import RichiestaDetail from './pages/RichiestaDetail';
import ResponsabileDashboard from './pages/ResponsabileDashboard';
import { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

function NotificationPopup({ notification }) {
  if (!notification) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      minWidth: 260,
      maxWidth: 350,
      background: notification.type === 'error' ? '#d63031' : '#00b894',
      color: '#fff',
      padding: '1em 1.5em',
      borderRadius: 8,
      boxShadow: '0 2px 16px #0003',
      fontWeight: 500,
      fontSize: '1.05em',
      transition: 'opacity 0.3s',
      opacity: notification ? 1 : 0
    }}>
      {notification.message}
    </div>
  );
}

function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);
  return (
    <NotificationContext.Provider value={showNotification}>
      <NotificationPopup notification={notification} />
      {children}
    </NotificationContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dipendente" element={
            <PrivateRoute>
              <DipendenteDashboard />
            </PrivateRoute>
          } />
          <Route path="/richieste/:id" element={
            <PrivateRoute>
              <RichiestaDetail />
            </PrivateRoute>
          } />
          <Route path="/responsabile" element={
            <PrivateRoute>
              <ResponsabileDashboard />
            </PrivateRoute>
          } />
          <Route path="/" element={<HomeRedirect />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

function HomeRedirect() {
  // Scegli la dashboard in base al ruolo
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.ruolo === 'Responsabile') return <Navigate to="/responsabile" />;
  if (user.ruolo === 'Dipendente') return <Navigate to="/dipendente" />;
  return <Navigate to="/login" />;
}

export default App;
