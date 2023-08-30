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

import AuthContext from './contexts/AuthContext';
import LocaleContext from './contexts/LocaleContext';
import FetchingContext from './contexts/FetchingContext';

import useLocale from './hooks/useLocale';
// ----------------------------------------------------------------------



export default function App() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [user, setUser] = useState(userData);
  const [isLoading, setIsloading] = useState(false);
  
  const [langs, ] = useState()
  
  const {
    selectedLanguage,
    availableLanguages,
    setSelectedLanguage,
    handleLocaleChange
  } = useLocale();
  
  
  
  return (
    <AuthContext.Provider value={{token, setToken, user, setUser}}>
      <FetchingContext.Provider value={{isLoading, setIsloading}}>
        <LocaleContext.Provider value={{selectedLanguage, availableLanguages, setSelectedLanguage, handleLocaleChange}}>
          <HelmetProvider>
          <BrowserRouter>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <Router />
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
        </LocaleContext.Provider>
      </FetchingContext.Provider>
    </AuthContext.Provider>
  );
}
