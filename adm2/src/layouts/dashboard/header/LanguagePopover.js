import { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Popover } from '@mui/material';

// Contexts
import LocaleContext from '../../../contexts/LocaleContext'
// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);
  const go = useNavigate();
  const {availableLanguages, selectedLanguage, handleLocaleChange} = useContext(LocaleContext)
  const {locale} = useParams();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLanguageChange = (e, lang) => {
    handleClose();
    handleLocaleChange(lang.code)
    go(`/${lang.code}/article`)
  }

  useEffect(() => {
    if(locale && selectedLanguage){
      handleLocaleChange(locale)
    }
  }, [])
  
  return (
    <>
      {!!selectedLanguage && (
        <IconButton
          onClick={handleOpen}
          sx={{
            padding: 0,
            width: 35,
            height: 35,
            ...(open && {
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
            }),
          }}
        >
          <span className={`flag-${selectedLanguage.code}`} style={{ fontSize: '1.4rem', cursor: 'pointer', marginRight: '0.5rem'}} title={selectedLanguage.name}>  </span>
        </IconButton>
      )}

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Stack spacing={0.75}>
        {availableLanguages.map((lang) => (
          <MenuItem
            key={lang.id}
            selected={lang.id === selectedLanguage.id}
            onClick={(event) => handleLanguageChange(event, lang)}
          >
            <span
              className={`flag-${lang.code}`}
              style={{
                fontSize: '1.4rem',
                cursor: 'pointer',
                marginRight: '0.5rem',
              }}
              title={lang.name}
            />
            {lang.name}
          </MenuItem>
        ))}
        </Stack> 
      </Popover>
    </>
  );
}
