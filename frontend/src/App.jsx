import { useState } from 'react'
import './App.css'
import { UserProvider } from './context/UserContext'
import AppRoutes from './routes/AppRoutes'
import AppBar from './components/AppBar'
import { TealTheme } from './themes/TealTheme';
import { ThemeProvider } from "@mui/material/styles";

function App() {

  return (
    <ThemeProvider theme={TealTheme}>
      <UserProvider>
        <AppBar />
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
