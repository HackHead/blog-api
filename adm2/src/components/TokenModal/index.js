import React, { useState } from 'react';
import { Button, TextField, Modal, Box, Typography, Grid, MenuItem, Select, InputLabel, FormControl, Chip, Alert } from '@mui/material';
import { addHours, addYears } from 'date-fns';
import server from '../../http';

const AddTokenModal = ({ onTokenAdd, open, onClose, onCreate }) => {
  const date = new Date();

  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [tokenExpirationDate, setTokenExpirationDate] = useState(addYears(date, 999));
  const [tokenAccessRights, setTokenAccessRights] = useState('readOnly');
  const [isReseived, setIsReceived] = useState(false);
  const [token, setToken] = useState('');
  const [alerts, setAlerts] = useState([]);

  const handleClose = () => {
    onClose()
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(tokenName.trim().length < 2 || tokenName.trim().length > 64){
        setAlerts([{id: Date.now(), severity: 'error', message: 'Длинна названия не должна быть меньше 2 и больше 64 символов'}]);
        return;
      }
      if(tokenDescription.trim().length > 512){
        setAlerts([{id: Date.now(), severity: 'error', message: 'Длинна описание не должна быть больше 512 символов'}]);
        return;
      }
      const res = await server.post('/tokens', {
        name: tokenName,
        description: tokenDescription,
        accessRights: tokenAccessRights,
        expirationDate: tokenExpirationDate
      });

      const data = res.data.data;

      setIsReceived(true);
      setToken(data.token);
      onCreate();
    } catch (error) {
      console.log(error)
    }

    setTokenDescription('');
    setTokenName('');
  };

  return (
    <div>
      <Modal open={open} onClose={() => {handleClose() }} sx={{ border: 'none', outline: 'none' }}>
        {
          isReseived ? <Box sx={{
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
            
          
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  У вас больше не будет возможности скопировать этот токен
                </Typography>
                <Typography paragraph gutterBottom sx={{ fontSize: '0.9rem', my: '2rem', fontWeight: 'bold', color: 'gray', wordBreak: 'break-all', padding: '1rem', background: 'rgba(0, 0, 0, .05)'}}>
                  {token}
                </Typography>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" variant="contained" color="info" onClick={() => {setIsReceived(false); handleClose()}}>
                  Закрыть
                </Button>
              </Grid>
            </Grid>
          </Box>
            : <Box sx={{
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
                Создать API токен
              </Typography>
              {
            alerts.map(({id, severity, message}) => {
              return ( <Alert key={id} severity={severity} sx={{margin: '1rem 0 2rem 0'}}>{message}</Alert>)
            })
          }
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Название"
                      variant="outlined"
                      fullWidth
                      value={tokenName}
                      onChange={(e) => {setTokenName(e.target.value.trim()); setAlerts([])}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      multiline
                      fullWidth
                      rows={4}
                      maxRows={4}
                      label={'Описание'}
                      value={tokenDescription}
                      onChange={(e) => {setTokenDescription(e.target.value); setAlerts([])}}
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="expiration-date-label">Срок действия</InputLabel>
                      <Select
                        fullWidth
                        labelId="expiration-date-label"
                        id="demo-simple-select"
                        label="Срок действия"
                        value={tokenExpirationDate}
                        onChange={(e) => {
                          const selectedValue = e.target.value.trim();
                          if (selectedValue === '1Hour') {
                            setTokenExpirationDate(addHours(date, 1));
                          } else if (selectedValue === '1Day') {
                            setTokenExpirationDate(addHours(date, 24));
                          } else if (selectedValue === '7Days') {
                            setTokenExpirationDate(addHours(date, 168));
                          } else if (selectedValue === '999Years') {
                            setTokenExpirationDate(addYears(date, 999));
                          }
                        }}
                      >
                        <MenuItem value="1Hour">1 Час</MenuItem>
                        <MenuItem value="1Day">1 День</MenuItem>
                        <MenuItem value="7Days">7 Дней</MenuItem>
                        <MenuItem value="999Years">Бессрочно</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="access-rights-label">Права доступа</InputLabel>
                      <Select

                        labelId="access-rights-label"
                        id="access-rights-select"
                        value={tokenAccessRights}
                        label="Права доступа"
                        onChange={(e) => setTokenAccessRights(e.target.value.trim())}
                      >
                        <MenuItem value={'readOnly'}>Только чтение</MenuItem>
                        <MenuItem value={'fullAccess'}>Полный доступ</MenuItem>
                      </Select>
                    </FormControl>

                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="submit" variant="contained" color="info">
                      Добавить
                    </Button>
                    <Button variant="contained" onClick={handleClose} color='error'>
                      Отменить
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
        }


      </Modal>
    </div>
  );
};

export default AddTokenModal;
