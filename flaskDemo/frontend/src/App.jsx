
import './App.css'
import { SignIn } from './components/SignIn'
import {  Routes, Route, Outlet } from "react-router-dom";
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';

function App() {

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn></SignIn>} />
        <Route path="/signup" element={<SignUp></SignUp>} />
        <Route path="/home" element={<Home></Home>} />
        <Route path="*" element={<h3 className=' font-bold text-center'>Not found</h3>} />
      </Routes>
      <Outlet></Outlet>
    </>
  )
}

export default App
