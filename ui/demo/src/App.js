import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import User from "./pages/User";

const App = () => {
  useEffect(() => {
    window.history.scrollRestoration = "manual"
  }, []);

  return (
    <Routes>     
      <Route exact path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user/HSBA" element={<User />} />
      <Route path="/user/HSBA/:pid" element={<User />} />
      
      <Route exact path="*" element={<Navigate to="/" />}/>    
    </Routes>
  );
}

export default App;