import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AppRoutes></AppRoutes>
    <div>My capstone project</div>
     
    </>
  )
}

export default App
