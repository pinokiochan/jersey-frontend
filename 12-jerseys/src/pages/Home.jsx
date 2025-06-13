import { ArrowRight, Star, Shield, Truck, Users } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
    const [hoveredFeature, setHoveredFeature] = useState(null);

    const features = [
        {
            icon: Star,
            title: "Премиум качество",
            description: "Каждое джерси проходит строгий отбор и переработку с использованием высококачественных материалов"
        },
        {
            icon: Shield,
            title: "Уникальный дизайн",
            description: "Авторские переосмысления классических джерси, созданные для современного стиля жизни"
        },
        {
            icon: Truck,
            title: "Быстрая доставка",
            description: "Доставляем по всему Казахстану в течение 2-3 рабочих дней"
        },
        {
            icon: Users,
            title: "Сообщество",
            description: "Присоединяйся к сообществу тех, кто живёт на пересечении футбола и моды"
        }
    ];

    const collections = [
        {
            title: "Классика",
            description: "Переосмысленные легендарные джерси",
            image: "assets/manu.jpg",
            count: "12+ моделей"
        },
        {
            title: "Лимитед",
            description: "Ограниченные коллекции в малых тиражах",
            image: "assets/ynwa.jpg",
            count: "3 модели"
        },
        {
            title: "Винтаж",
            description: "Ретро джерси в современной интерпретации",
            image: "assets/retroars.webp",
            count: "8+ моделей"
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-red-600 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/50 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="mb-6">
                        <span className="text-red-400 text-lg font-bold tracking-wider uppercase">The 12th Man Collection</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter">
                        Джерси.
                        <br />
                        <span className="text-red-600">Переосмысленно.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Мы создаём не просто футболки — мы даём им вторую жизнь в стиле повседневного искусства.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <a
                            href="/catalog"
                            className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105 flex items-center space-x-2"
                        >
                            <span>Перейти в каталог</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>

                        <a
                            href="/about"
                            className="text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 border border-gray-600 hover:border-white"
                        >
                            Узнать больше
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-red-600 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Brand Story Section */}
            <section className="px-6 lg:px-12 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="mb-6">
                                <span className="text-red-600 text-sm font-bold tracking-wider uppercase">Наша история</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black mb-8 text-gray-900 leading-tight">
                                Почему <span className="text-red-600">"12"</span>?
                            </h2>

                            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                                <p>
                                    Мы верим, что футбол — это не только спорт, но и стиль жизни. <strong className="text-gray-900">"12"</strong> — это символ фаната, двенадцатого игрока на поле.
                                </p>

                                <p>
                                    Мы соединяем эстетику легендарных клубов с современной уличной модой, создавая уникальные вещи для тех, кто не готов выбирать между стадионом и улицей.
                                </p>

                                <p>
                                    Каждое джерси в нашей коллекции — это не просто одежда, а statement piece, который говорит о твоей страсти к игре и чувству стиля.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-64 bg-gray-200 rounded-xl mb-6 overflow-hidden">
                                    <img
                                        src="/assets/12.png"
                                        alt="Футболка 12"
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Твой стиль</h3>
                                    <p className="text-gray-600">Уличная мода встречает футбольную культуру</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 lg:px-12 py-20 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-red-600 text-sm font-bold tracking-wider uppercase">Преимущества</span>
                        <h2 className="text-4xl font-black mt-4 mb-6 text-gray-900">Что делает нас особенными</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Мы не просто продаём одежду — мы создаём культуру и сообщество
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setHoveredFeature(index)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                className={`p-8 rounded-2xl transition-all duration-300 cursor-pointer ${
                                    hoveredFeature === index
                                        ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30 transform -translate-y-2'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                }`}
                            >
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                                    hoveredFeature === index ? 'bg-white/20' : 'bg-red-100'
                                }`}>
                                    <feature.icon
                                        size={28}
                                        className={hoveredFeature === index ? 'text-white' : 'text-red-600'}
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className={`leading-relaxed ${
                                    hoveredFeature === index ? 'text-red-100' : 'text-gray-600'
                                }`}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Collections Preview */}
            <section className="px-6 lg:px-12 py-20 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-red-400 text-sm font-bold tracking-wider uppercase">Коллекции</span>
                        <h2 className="text-4xl font-black mt-4 mb-6">Найди свой стиль</h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            От классических переосмыслений до лимитированных релизов
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {collections.map((collection, index) => (
                            <div
                                key={index}
                                className="group bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                                <div className="h-64 relative overflow-hidden">
                                    <img
                                        src={collection.image}
                                        alt={collection.title}
                                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                          {collection.count}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors">
                                        {collection.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {collection.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a
                            href="/catalog"
                            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40"
                        >
                            <span>Смотреть все коллекции</span>
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 lg:px-12 py-20 bg-red-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Стань частью <br />команды "12"
                    </h2>
                    <p className="text-xl text-red-100 mb-8 leading-relaxed">
                        Присоединяйся к сообществу тех, кто не выбирает между футболом и стилем
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/catalog"
                            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Начать покупки
                        </a>
                        <a
                            href="/about"
                            className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300"
                        >
                            Узнать больше
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}