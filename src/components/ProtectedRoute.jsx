import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

    const token = JSON.parse(localStorage.getItem("token"));

  return (
    <>
      {token ? <Outlet /> : <Navigate to="/" />}
    </>
  )
}

export default ProtectedRoute
