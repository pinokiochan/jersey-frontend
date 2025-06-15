import ScrollToTop from "./components/ScrollToTop"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import ErrorBoundary from "./components/ErrorBoundary"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Catalog from "./pages/Catalog"
import About from "./pages/About"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Cart from "./pages/Cart"
import Profile from "./pages/Profile"

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
                <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-1">
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                        path="/profile"
                        element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                        }
                    />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
