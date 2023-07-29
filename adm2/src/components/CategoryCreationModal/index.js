import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Modal, Box, Typography, Grid, MenuItem, Alert, Select, FormControl, InputLabel, Divider } from '@mui/material';
import server from '../../http';


const CategoryCreationModal = ({ onTokenAdd, open = false, onClose, onCreate, data }) => {

  const [categoryName, setCategoryName] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [translations, setTranslations] = useState({});

  const handleTranslationUpdate = (value, id) => {
    setTranslations(prevState => ({
      ...prevState,
      [id]: value
    }));
  };
  
  const handleClose = () => {
    onClose();
    setAlerts([]);
    setCategoryName('');
  };

  useEffect(() => {
    if(data?.length) {
      const newTranslations = Object.keys(data[0].locale).reduce((acc, code) => {
        acc[`${data[0].locale[code].language.id}`] = data[0].locale[code].name
        
        return acc
      }, {});


      setCategoryName(data[0].name)
      setTranslations(newTranslations)
    } else {
      setTranslations({});
    }
  }, [data])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoryName.length < 2 || categoryName .length > 64) {
      setAlerts([{ id: 0, severity: 'error', message: 'Название не может быть меньше 2 и больше 64 символов' }])
      return
    }
    try {
      if(data?.length){
        const updatedCategory = await server.patch(`/categories/${data[0].id}`, {
          name: categoryName.trim(),
          translations
        });
      } else {
        const createdCategory = await server.post('/categories', {
          name: categoryName.trim(),
          translations
        });
  
      }
      onCreate();
      setCategoryName('');
      handleClose();
    } catch (error) {
      console.log(error)
      setAlerts([{ id: 0, severity: 'error', message: error.response.data.error.message }])
    }

    
  };

  const fetchLanguages = async () => {
    try {
      const res = await server.get('/languages');

      const data = res.data.data;
      setLanguages(data);
      if(data.length){
        setSelectedLanguage(data[0].id)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])
  return (
    <div>
      <Modal open={open} onClose={handleClose} sx={{ border: 'none', outline: 'none' }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          border: 'none',
          outline: 'none'
        }}>
          <Typography variant="h6" gutterBottom>
            Создать категорию
          </Typography>

          <form onSubmit={handleSubmit}>
            {
              alerts.map(({ id, severity, message }) => {
                return (<Alert key={id} severity={severity} sx={{ margin: '1rem 0 2rem 0' }}>{message}</Alert>)
              })
            }
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Название"
                  variant="outlined"
                  fullWidth
                  value={categoryName}
                  onChange={(e) => { setCategoryName(e.target.value); setAlerts([]) }}
                />
                <Divider sx={{ my: '1rem' }} />
                <Grid>
                  <FormControl fullWidth>
                    <InputLabel id="access-rights-label">Язык</InputLabel>
                    <Select
                      labelId="access-rights-label"
                      id="access-rights-select"
                      value={selectedLanguage}
                      label="Язык"
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      {
                        languages.map(({id, code, name}) => {
                          return (
                            <MenuItem 
                              key={id} 
                              value={id} 
                              sx={{display: 'flex', justifyContent: 'space-between'}}
                            ><span><span className={`flag-${code}`}/>{name}</span></MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                  {languages.map(({ id, code, name }) => (
                    <TextField
                      key={id}
                      sx={{ mt: '1rem', display: selectedLanguage === id ? 'block' : 'none' }}
                      label="Перевод"
                      variant="outlined"
                      fullWidth
                      value={translations[id] || ''}
                      onChange={(e) => handleTranslationUpdate(e.target.value, id)}
                    />
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type="submit" variant="contained" color="info" sx={{boxShadow: 'none'}}>
                  { data?.length ? 'Обновить' :  'Создать' }
                </Button>
                <Button variant="contained" onClick={handleClose} color='error'>
                  Отменить
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CategoryCreationModal;
