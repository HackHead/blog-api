import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Modal, Box, Typography, Grid, MenuItem,  Alert } from '@mui/material';
import server from '../../http';

const ArticleDestroyModal = ({ id, open = false, onClose }) => {
  const go = useNavigate();
  
  const destroy = async () => {
    try {
      await server.delete(`/articles/${id}`);
      go('/dashboard/blog')
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <div>
      <Modal open={open} onClose={() => {}} sx={{border: 'none', outline: 'none'}}>
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
          <Typography variant="h6" gutterBottom textAlign={'center'}>
            Вы уверены что хотите удалить эту стать? Все переводы тоже будут удалены
          </Typography>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: '2rem' }}>
              <Button variant="contained"  color='error' onClick={() => destroy()}>
                Удалить
              </Button>
              <Button type="submit" onClick={() => onClose()} variant="contained" color="info">
                Отменить
              </Button>
            </Grid>
        </Box>
        
      </Modal>
    </div>
  );
};

export default ArticleDestroyModal;
