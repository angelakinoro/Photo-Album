import React from 'react'
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from './pages/Landing'
import Login from './pages/Login'
import Home from './pages/Home'
import UserPage from './pages/UserPage'
import AlbumPage from './pages/AlbumPage'
import PhotoPage from './pages/PhotoPage'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />}></Route>
          <Route path='/login' element={ <Login />}></Route>
          <Route path='/home' element={ <Home />}></Route>
          <Route path='/users/:id' element={ <UserPage />}></Route>
          <Route path='/albums/:id' element={ <AlbumPage />}></Route>
          <Route path='/photod/:id' element={ <PhotoPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App