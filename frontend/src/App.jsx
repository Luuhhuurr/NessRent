import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import AuthWatcher from './components/AuthWatcher';
import RequireAuth from './routes/RequireAuth';
import RequireAdmin from './routes/RequireAdmin';
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
import TransactionDetail from './pages/TransactionDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import ProductManagement from './pages/ProductManagement';
import AddProduct from './pages/AddProduct';
import TransactionManagement from './pages/TransactionManagement';
import LokasiPenyerahan from './pages/user/LokasiPenyerahan';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthWatcher />

      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-success" element={<RegisterSuccess />} />
        </Route>

        {/* Signed-in users */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/dashboard/penyerahan" element={<LokasiPenyerahan />} />
            <Route path="/user/add-product" element={<AddProduct />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/logout" element={<Logout />} />
        </Route>

        {/* Admins only */}
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/transactions" element={<TransactionManagement />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route element={<Layout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
