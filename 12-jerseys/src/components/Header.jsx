"use client"

import { ShoppingCart, User, Menu, X, LogOut, Settings, Package, Search, Heart } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartItemsCount } = useCart()
  const { getWishlistCount } = useWishlist()
  const userMenuRef = useRef(null)
  const searchRef = useRef(null)

  // Убираем "Главная" из навигации - теперь только лого ведет на главную
  const navigation = [
    { name: "Каталог", href: "/catalog", ariaLabel: "Просмотреть каталог товаров" },
    { name: "О нас", href: "/about", ariaLabel: "Узнать больше о компании" },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsSearchOpen(false)
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    console.log("Header: Cart items count:", getCartItemsCount())
  }, [getCartItemsCount()])

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - стилизованный как в футере */}
          <Link to="/" className="flex items-center space-x-4 group" aria-label="12 Jerseys - Главная страница">
            <div className="relative">
              <span className="text-4xl font-black text-gray-900 tracking-tighter group-hover:text-red-600 transition-colors">
                12
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider group-hover:text-red-600 transition-colors">
                Jerseys
              </div>
              <div className="text-xs text-gray-400 -mt-0.5">The 12th Man</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                aria-label={item.ariaLabel}
                className={`text-lg font-semibold transition-all duration-300 relative group px-4 py-2 ${
                  isActive(item.href)
                    ? "text-red-600 bg-red-50 rounded-full"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
                )}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                aria-label="Поиск товаров"
              >
                <Search size={20} />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск джерси..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
              aria-label={`Избранное (${getWishlistCount()} товаров)`}
            >
              <Heart size={20} />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {getWishlistCount() > 99 ? "99+" : getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
              aria-label={`Корзина (${getCartItemsCount()} товаров)`}
            >
              <ShoppingCart size={20} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {getCartItemsCount() > 99 ? "99+" : getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                  aria-label="Меню пользователя"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="w-8 h-8 bg-red-100 rounded-full overflow-hidden">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={`Аватар ${user.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=dc2626&color=fff`
                      }}
                    />
                  </div>
                  <span className="hidden sm:block font-medium max-w-24 truncate">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>Профиль</span>
                    </Link>

                    <Link
                      to="/profile?tab=orders"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package size={16} />
                      <span>Мои заказы</span>
                    </Link>

                    <Link
                      to="/profile?tab=settings"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Настройки</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        <span>Выйти</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                Войти
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
              aria-label="Открыть меню"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4" role="navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-label={item.ariaLabel}
                  className={`text-lg font-semibold transition-colors px-2 py-1 rounded-lg ${
                    isActive(item.href) ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск джерси..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
