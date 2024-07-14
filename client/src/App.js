import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Forgot from "./components/forgot/Forgot";
import Forgotid from "./components/forgotid/Forgotid";

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))


const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" name="Home" element={<DefaultLayout />} />
        <Route exact path="/login" name="Login Page" element={<Login />} />
        <Route exact path="/register" name="Register Page" element={<Register />} />
        <Route exact path="/forgot" name="Forgot Page" element={<Forgot />} />
        <Route exact path="/forgotid" name="Forgot Page" element={<Forgotid />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App