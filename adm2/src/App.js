import { useEffect, useState } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

import server from './http';
import AuthContext from './contexts/AuthContext';
// ----------------------------------------------------------------------



export default function App() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [user, setUser] = useState(userData);

  return (
    <AuthContext.Provider value={{token, setToken, user, setUser}}>
        <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Router />
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </AuthContext.Provider>
  );
}
