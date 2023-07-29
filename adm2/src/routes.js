import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
// layouts
import { Grid, CircularProgress } from '@mui/material';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import CategoryPage from './pages/CategoryPage'
import TokensPage from './pages/TokenPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import DomainPage from './pages/DomainPage';
import ArticleEdit from './pages/ArticleEdit';
import ArticlePreview from './pages/ArticlePreview';
import ArticleCreate from './pages/ArticleCreate';
import AuthContext from './contexts/AuthContext';
import server from './http';



export default function Router() {
  const [isAuth, setIsAuth] = useState(false);
  const user = useContext(AuthContext);
  const [isLoading, setIsloading] = useState(true);

  const checkIsAuth = async () => {
    try {
      const res = await server.get('/me');
      if(res.data.data.id){
        setIsAuth(true)
      } else {
        
        setIsAuth(false)
      }
    } catch (error) {
     setIsAuth(false)
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
    } finally {
      setIsloading(false)
    }
  }

  useEffect(() => {
    if(user){
      checkIsAuth()
    }
  }, [useNavigate()]) ; 
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuth ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: isAuth ? <DashboardAppPage /> : <Navigate to="/404" /> },
        { path: 'token', element: isAuth ? <TokensPage /> : <Navigate to="/404" /> },
        { path: 'category', element: isAuth ? <CategoryPage /> : <Navigate to="/404" /> },
        { path: 'blog', element: true ? <BlogPage /> : <Navigate to="/404" /> },
        { path: 'domain', element: isAuth ? <DomainPage /> : <Navigate to="/404" /> },
        { path: 'article/new', element: isAuth ? <ArticleCreate /> : <Navigate to="/404" /> },
        { path: 'article/edit/:id', element: isAuth ? <ArticleEdit /> : <Navigate to="/404" /> },
        { path: 'article/preview/:id', element: isAuth ? <ArticlePreview /> : <Navigate to="/404" /> },
      ],
    },
    {
      path: 'login',
      element: isAuth ? <Navigate to="/dashboard/blog" /> : <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return isLoading ? (
    <Grid container alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
      <Grid item><CircularProgress /></Grid>
    </Grid>
    ) : routes;
}
