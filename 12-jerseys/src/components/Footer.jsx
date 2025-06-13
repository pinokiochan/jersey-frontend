import { Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-8 lg:px-12 py-16">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="relative">
                                <span className="text-6xl font-black text-white tracking-tighter">
                                    12
                                </span>
                                <div className="absolute -bottom-1 left-0 w-full h-1 bg-red-600 rounded-full"></div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-300 uppercase tracking-wider">Jerseys</div>
                                <div className="text-xs text-gray-400 -mt-0.5">The 12th Man</div>
                            </div>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                            Переосмысленные футбольные джерси для тех, кто живёт футболом и стилем.
                            Мы создаём одежду, которая объединяет спорт и уличную моду.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {[
                                { icon: Instagram, href: '#', label: 'Instagram' },
                                { icon: Facebook, href: '#', label: 'Facebook' }
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="p-3 bg-gray-800 hover:bg-red-600 rounded-xl transition-all duration-300 group hover:scale-110 shadow-lg"
                                    aria-label={label}
                                >
                                    <Icon size={20} className="text-gray-300 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-xl font-bold text-white mb-6 relative">
                            Навигация
                        </h4>
                        <nav className="space-y-4">
                            {[
                                { name: 'Каталог', href: '/catalog' },
                                { name: 'О нас', href: '/about' },
                                { name: 'Войти', href: '/login' },
                                { name: 'Корзина', href: '/cart' },
                                { name: 'Доставка', href: '/shipping' },
                                { name: 'Возврат', href: '/returns' }
                            ].map(({ name, href }) => (
                                <a
                                    key={name}
                                    href={href}
                                    className="block text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm font-medium"
                                >
                                    {name}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 className="text-xl font-bold text-white mb-6">
                            Связь
                        </h4>

                        {/* Contact Info */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-gray-800 rounded-lg">
                                    <MapPin size={16} className="text-red-400" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">г. Астана</p>
                                    <p className="text-gray-400 text-xs">Казахстан</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-800 rounded-lg">
                                    <Mail size={16} className="text-red-400" />
                                </div>
                                <a
                                    href="mailto:support@12jerseys.kz"
                                    className="text-gray-300 text-sm hover:text-red-400 transition-colors font-medium"
                                >
                                    support@12jerseys.kz
                                </a>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h5 className="text-sm font-bold text-white mb-4">Подписка</h5>
                            <div className="flex rounded-xl overflow-hidden shadow-lg">
                                <input
                                    type="email"
                                    placeholder="Ваш email"
                                    className="flex-1 px-4 py-3 bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:bg-gray-700 transition-colors"
                                />
                                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors text-sm font-bold">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-gray-400 text-sm">
                                © {currentYear} <span className="font-bold text-white">12</span>. Все права защищены.
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Создано для тех, кто живёт футболом
                            </p>
                        </div>

                        <div className="flex items-center space-x-8 text-xs text-gray-400">
                            <a href="/privacy" className="hover:text-red-400 transition-colors font-medium">
                                Политика конфиденциальности
                            </a>
                            <a href="/terms" className="hover:text-red-400 transition-colors font-medium">
                                Условия использования
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}