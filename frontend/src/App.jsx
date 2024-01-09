import { useState } from 'react'
import './App.css'
import { UserProvider } from './context/UserContext'
import AppRoutes from './routes/AppRoutes'
import AppBar from './components/AppBar'
import { TealTheme } from './themes/TealTheme';
import { ThemeProvider } from "@mui/material/styles";
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'


function Copyright(props) {
  return (
      <Typography variant="body2" color="white" align="center" {...props}>
          {'Copyright © '}
          <Link color="inherit" href="/">
              Travel Mate
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
      </Typography>
  );
}

function App() {

  return (
    <ThemeProvider theme={TealTheme}>
      <UserProvider>
        <AppBar />
        <AppRoutes />
      </UserProvider>
      <Copyright style={{ background:'#22311c' }}/>
    </ThemeProvider>
  )
}

export default App
