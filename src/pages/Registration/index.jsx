import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {  fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const {register, handleSubmit, setError, formState:{errors, isValid}} = useForm({
    defaultValues:{
      fullName:'',
      email:'',
      password:''
    },
    mode:'onChange'
  })
  const onSubmit = async (values)=>{
    const data = await dispatch(fetchRegister(values))
    if(!data.payload){
     alert('Cannot register')
   
    }
    if('token' in data.payload){
     window.localStorage.setItem('token',data.payload.token)
    } 
     }
   if(isAuth){
     return <Navigate to='/'/>
   }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
       Create account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
              <TextField className={styles.field} label="Full name"
              {...register('fullName',{required:'Add full name'})}
       helperText={errors.fullName?.message}
       error={Boolean(errors.fullName?.message)}

      fullWidth />
      <TextField className={styles.field} label="E-Mail"
              {...register('email',{required:'Add email'})}
       helperText={errors.email?.message}
       error={Boolean(errors.email?.message)}
type='email'
      fullWidth />
      <TextField className={styles.field}
            {...register('password',{required:'Add password'})}
       helperText={errors.password?.message}
       error={Boolean(errors.password?.message)}
type='password'
      label="Password" fullWidth />
      <Button type='submit' size="large" variant="contained" disabled={!isValid} fullWidth>
        Register
      </Button>

      </form>
    </Paper>
  );
};
