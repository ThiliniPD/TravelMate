import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import AppBar from './components/AppBar'
import { tealTheme } from './themes/tealTheme';
import { ThemeProvider } from "@mui/material/styles";

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={tealTheme}>
      <AppBar/>
      <AppRoutes/>   
    </ThemeProvider>
  )
}

export default App

