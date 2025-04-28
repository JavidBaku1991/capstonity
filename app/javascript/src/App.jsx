import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './components/Home'
import Products from './components/Products'
import Cart from './components/Cart'
import SignUp from './components/SignUp'
import Login from './components/Login'
import AddProduct from './components/AddProduct'

const App = () => {
  console.log('APP - Component rendering')
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products/new" element={<AddProduct />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App 