import { Navigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Navigate replace to={"/article"}/>
    </>
  );
}
