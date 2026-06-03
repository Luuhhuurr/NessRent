import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import Dashboard from './pages/Dashboard';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import TransactionHistory from './pages/TransactionHistory';
import AdminDashboard from './pages/AdminDashboard';
import ProductManagement from './pages/ProductManagement';
import AddProduct from './pages/AddProduct';
import UserVerification from './pages/UserVerification';
import BlacklistUser from './pages/BlacklistUser';
import TransactionManagement from './pages/TransactionManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - Landing and Product pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>

        {/* Auth routes - Login and Register pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-success" element={<RegisterSuccess />} />
        </Route>

        {/* User dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<TransactionHistory />} />
        </Route>

        {/* Booking routes */}
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking-success" element={<BookingSuccess />} />

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/verify-user" element={<UserVerification />} />
          <Route path="/admin/transactions" element={<TransactionManagement />} />
          <Route path="/admin/blacklist-user" element={<BlacklistUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;