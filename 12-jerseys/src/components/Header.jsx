import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const activeLink = location.pathname === '/' ? 'home' : location.pathname.slice(1);

    const NavButton = ({ to, children }) => (
        <Link
            to={to}
            className={`relative px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg ${
                activeLink === to.slice(1)
                    ? 'text-white bg-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
            } group`}
        >
            {children}
        </Link>
    );

    const ActionButton = ({ to, children, badge }) => (
        <Link
            to={to}
            className={`relative p-3 rounded-xl transition-all duration-300 group shadow-sm ${
                activeLink === to.slice(1)
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-white text-gray-700 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 border border-gray-200'
            }`}
        >
            <div className="transition-transform group-hover:scale-110 duration-300">
                {children}
            </div>
            {badge && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                    {badge}
                </div>
            )}
        </Link>
    );

    return (
        <header className="relative bg-white">
            <div className="flex justify-between items-center px-8 lg:px-12 py-6 shadow-sm bg-white sticky top-0 z-50 border-b border-gray-100">
                {/* Logo */}
                <Link to="/" className="group relative">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <span className="text-6xl font-black text-gray-900 tracking-tighter">
                                12
                            </span>
                            <div className="absolute -bottom-1 left-0 w-full h-1 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">Jerseys</div>
                            <div className="text-xs text-gray-400 -mt-0.5">The 12th Man</div>
                        </div>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-2">
                    <NavButton to="/catalog">КАТАЛОГ</NavButton>
                    <NavButton to="/about">О НАС</NavButton>
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    <ActionButton to="/cart" badge={3}>
                        <ShoppingCart size={20} />
                    </ActionButton>
                    <ActionButton to="/login">
                        <User size={20} />
                    </ActionButton>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-3 rounded-xl bg-white text-gray-700 hover:bg-red-600 hover:text-white transition-all duration-300 border border-gray-200 shadow-sm"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 z-40 ${
                isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}>
                <nav className="px-8 py-8 space-y-3">
                    <Link
                        to="/catalog"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block py-4 px-6 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                            activeLink === 'catalog'
                                ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                                : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                        }`}
                    >
                        КАТАЛОГ
                    </Link>
                    <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block py-4 px-6 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                            activeLink === 'about'
                                ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                                : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                        }`}
                    >
                        О НАС
                    </Link>
                </nav>
            </div>
        </header>
    );
}
