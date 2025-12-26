import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PrivateRoutes = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }
  return (
    token ? <Outlet /> : <Navigate to="/user/login" />
  )
}

export default PrivateRoutes
