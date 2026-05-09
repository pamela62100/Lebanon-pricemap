import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/router';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { useAuthStore } from '@/store/useAuthStore';
import { liveConnection } from '@/lib/liveConnection';

function App() {
  // Restore live connection if user is already logged in (e.g. after page refresh)
  const user = useAuthStore(s => s.user);
  useEffect(() => {
    if (user) liveConnection.start(() => localStorage.getItem('rakis_token'));
  }, [user]);

  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
