import React, { useContext, useEffect, useState } from 'react';
import { Link, Stack, IconButton, InputAdornment, TextField, Button, Alert } from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import Joi from 'joi';
import AuthContext from '../../../contexts/AuthContext';
import server from '../../../http/index';
import Iconify from '../../../components/iconify';

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [alerts, setAlerts] = useState([]);
  const {user: account} = useContext(AuthContext);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().min(2).required()
      });

      const { error } = schema.validate({
        email,
        password
      });

      if (error) {
        setAlerts([{ id: Date.now(), severity: 'error', message: error.details[0].message }]);
        return;
      }

      const res = await server.post('/login', {
        email,
        password
      });

      const jwt = res.data.data.token;
      const user = res.data.data.user

      if (jwt) {
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard/blog')
      };

    } catch (error) {
      setAlerts([{ id: Date.now(), severity: 'error', message: error.response.data.error.message }]);
    }
  };

  if (account?.id) {
    return <Navigate replace to="/dashboard/blog" />
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {
            alerts.map(({ id, severity, message }) => {
              return (<Alert key={id} severity={severity} sx={{ margin: '1rem 0 2rem 0' }}>{message}</Alert>)
            })
          }
          <TextField name="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <TextField
            name="password"
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Stack>

        <Button fullWidth size="large" type="submit" variant="contained" sx={{ mt: '1rem', boxShadow: 'none' }}>
          Войти
        </Button>
      </form>
    </>

  );
}
