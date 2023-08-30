import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import AuthContext from '../../../contexts/AuthContext';
// mocks_
import account from '../../../_mock/account';
import LocaleContext from '../../../contexts/LocaleContext';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Блог',
    icon: 'eva:home-fill',
    url: '/article'
  },
  {
    label: 'API Токены',
    icon: 'eva:person-fill',
    url: '/token'
  },
  {
    label: 'Домены',
    icon: 'eva:settings-2-fill',
    url: '/domain'
  },
  {
    label: 'Категории',
    icon: 'eva:settings-2-fill',
    url: '/category'
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const {user} = useContext(AuthContext)
  const go = useNavigate();
  const {selectedLanguage} = useContext(LocaleContext)
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logout = () => {
    handleClose();
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    go('/login')
  }

  const goto = (url) => {
    console.log(`/${selectedLanguage.code}/${url}`)
    go(`/${selectedLanguage.code}/${url}`);
    handleClose()
  };
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.full_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => goto(option.url)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logout} sx={{ m: 1 }}>
          Выйти
        </MenuItem>
      </Popover>
    </>
  );
}
