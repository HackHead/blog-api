import React, { useEffect, useState } from 'react';
import { Button, TextField, Modal, Box, Typography, Grid, MenuItem,  Alert } from '@mui/material';
import server from '../../http';

const DomainCreationModal = ({ onTokenAdd, open = false, onClose, onCreate, onSave, data }) => {
  const [url, setUrl] = useState('');
  const [ip, setIp] = useState('');

  
  const [alerts, setAlerts] = useState([]);

  const handleClose = () => {
    onClose()
  };

  useEffect(() => {
    if(data?.url){setUrl(data.url)}
    if(data?.ipAddress){setIp(data.ipAddress)}
    if(!data?.id){
      setUrl('');
      setIp('');
    }
  }, [data])
  
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await server.post('/domains', {
        url,
        ip_address: ip
      });

      onCreate();
      handleClose();
      setUrl('');
      setIp('');
    } catch (error) {
      setAlerts([...alerts, {id: Date.now(), severity: 'error', message: error.response.data.error.message}])
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await server.patch(`/domains/${data?.id}`, {
        url,
        ip_address: ip
      });

      onCreate();
      handleClose();
      setUrl('');
      setIp('');
    } catch (error) {
      setAlerts([...alerts, {id: Date.now(), severity: 'error', message: error.response.data.error.message}])
    }

    
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
            {data?.id ? 'Редактировать домен' : 'Добавить домен'}
          </Typography>

          <form onSubmit={data ? handleSave : handleCreate}>
          {
            alerts.map(({id, severity, message}) => {
              return ( <Alert key={id} severity={severity} sx={{margin: '1rem 0 2rem 0'}}>{message}</Alert>)
            })
          }
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="URL адрес"
                  variant="outlined"
                  fullWidth
                  value={url}
                  onChange={(e) => {setUrl(e.target.value); setAlerts([])}}
                />
                <TextField
                  sx={{mt: '1rem'}}
                  label="IP адрес"
                  variant="outlined"
                  fullWidth
                  value={ip}
                  onChange={(e) => {setIp(e.target.value); setAlerts([])}}
                />
              </Grid>
              <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Button type="submit" variant="contained" color="info">
                {data?.id ? 'Обновить' : 'Добавить'}
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

export default DomainCreationModal;
