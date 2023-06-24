import React, { useState } from 'react';
import { Button, TextField, Modal, Box, Typography, Grid, MenuItem,  Alert } from '@mui/material';
import server from '../../http';

const CategoryCreationModal = ({ onTokenAdd, open = false, onClose, onCreate }) => {
  const [categoryName, setCategoryName] = useState('');
  const [alerts, setAlerts] = useState([]);
  const handleClose = () => {
    onClose()
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(categoryName.length < 2 || categoryName.length > 64){
      setAlerts([{id: 0, severity: 'error', message: 'Название не может быть меньше 2 и больше 64 символов'}])
      return 
    }
    try {
      await server.post('/categories', {
        name: categoryName.trim(),
      });

      onCreate();
    } catch (error) {
      console.log(error)
    }

    setCategoryName('');
    handleClose();
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose} sx={{border: 'none', outline: 'none'}}>
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
            alerts.map(({id, severity, message}) => {
              return ( <Alert key={id} severity={severity} sx={{margin: '1rem 0 2rem 0'}}>{message}</Alert>)
            })
          }
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Название"
                  variant="outlined"
                  fullWidth
                  value={categoryName}
                  onChange={(e) => {setCategoryName(e.target.value); setAlerts([])}}
                />
              </Grid>
              <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Button type="submit" variant="contained" color="info">
                  Создать
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
