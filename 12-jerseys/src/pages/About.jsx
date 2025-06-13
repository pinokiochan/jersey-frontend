import { useState } from 'react';
import { ArrowRight, Heart, Users, Award, Target, Zap, Globe, Shield } from 'lucide-react';

export default function About() {
    const [activeSection, setActiveSection] = useState('story');

    const values = [
        {
            icon: Heart,
            title: "Страсть к футболу",
            description: "Мы живём и дышим футболом. Каждое джерси для нас — это не просто ткань, а частица истории великой игры."
        },
        {
            icon: Award,
            title: "Качество превыше всего",
            description: "Используем только премиальные материалы и современные технологии для создания одежды высочайшего качества."
        },
        {
            icon: Users,
            title: "Сообщество единомышленников",
            description: "Мы объединяем людей, которые понимают: футбол — это не просто спорт, это образ жизни и культура."
        },
        {
            icon: Target,
            title: "Индивидуальность",
            description: "Каждый дизайн уникален. Мы создаём не массовый продукт, а персональные statement-вещи для истинных ценителей."
        }
    ];

    const timeline = [
        {
            year: "Февраль",
            title: "Рождение идеи",
            description: "Всё началось с простой мысли: почему нельзя носить футбольную атрибутику каждый день, не выглядя при этом как фанат на стадионе?"
        },
        {
            year: "Март",
            title: "Первая коллекция",
            description: "Запуск первой линейки переосмысленных классических джерси. 12 уникальных дизайнов, вдохновлённых легендарными моментами футбола."
        },
        {
            year: "Май",
            title: "Рост сообщества",
            description: "Более 5000 довольных клиентов по всему Казахстану. Открытие собственного производства в Алматы."
        },
        {
            year: "Июнь",
            title: "Новые горизонты",
            description: "Запуск международных поставок и коллаборации с независимыми дизайнерами. Планы по расширению в страны СНГ."
        }
    ];

    const team = [
        {
            name: "Аян ага",
            role: "Основатель & Creative Director",
            description: "Бывший профессиональный футболист, теперь создаёт одежду для тех, кто живёт футболом.",
            image: "/assets/team-1.jpg"
        },
        {
            name: "Паккунио Бикош",
            role: "Head of Design",
            description: "10 лет в fashion-индустрии. Превращает футбольную эстетику в произведения искусства.",
            image: "/assets/team-2.jpg"
        },
        {
            name: "Баха",
            role: "Backend Developer",
            description: "Сайт керек па? жасап берем.",
            image: "/assets/team-3.jpg"
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-64 h-64 bg-red-600/50 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="mb-6">
                                <span className="text-red-400 text-sm font-bold tracking-wider uppercase">О нас</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                                Мы — команда <span className="text-red-600">"12"</span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Создаём одежду для тех, кто понимает: футбол — это не просто игра, это философия, стиль жизни и способ самовыражения.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="/catalog"
                                    className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 flex items-center justify-center space-x-2"
                                >
                                    <span>Смотреть коллекцию</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <button
                                    onClick={() => document.getElementById('story').scrollIntoView({ behavior: 'smooth' })}
                                    className="text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 border border-gray-600 hover:border-white"
                                >
                                    Узнать историю
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Main Image */}
                            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                                <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden">
                                    <img
                                        src="/assets/about-hero.jpg"
                                        alt="Team 12 Story"
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.src = '/assets/fam.png';
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl">
                                    Since 2022
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute top-8 -left-8 bg-white text-gray-900 p-4 rounded-2xl shadow-2xl">
                                <div className="text-2xl font-black text-red-600">5000+</div>
                                <div className="text-sm font-medium">Довольных клиентов</div>
                            </div>

                            <div className="absolute bottom-8 -right-8 bg-white text-gray-900 p-4 rounded-2xl shadow-2xl">
                                <div className="text-2xl font-black text-red-600">50+</div>
                                <div className="text-sm font-medium">Уникальных дизайнов</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    <nav className="flex space-x-8 py-4">
                        {[
                            { id: 'story', label: 'Наша история' },
                            { id: 'values', label: 'Ценности' },
                            { id: 'timeline', label: 'Путь развития' },
                            { id: 'team', label: 'Команда' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    document.getElementById(item.id).scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`text-lg font-bold transition-colors relative ${
                                    activeSection === item.id
                                        ? 'text-red-600'
                                        : 'text-gray-600 hover:text-red-600'
                                }`}
                            >
                                {item.label}
                                {activeSection === item.id && (
                                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-red-600 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </section>

            {/* Story Section */}
            <section id="story" className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-red-600 text-sm font-bold tracking-wider uppercase">Откуда мы пришли</span>
                            <h2 className="text-4xl font-black mt-4 mb-8 text-gray-900">
                                История началась со страсти
                            </h2>

                            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                                <p>
                                    В 2025 году мы поняли простую вещь: <strong className="text-gray-900">футбольная культура не должна ограничиваться стадионом</strong>. Мы хотели создать одежду, которую можно носить каждый день, но которая при этом говорила бы о твоей любви к игре.
                                </p>

                                <p>
                                    Началось всё с переосмысления классических джерси. Мы взяли легендарные дизайны и адаптировали их для повседневной жизни, сохранив душу оригинала, но добавив современной эстетики.
                                </p>

                                <p>
                                    <strong className="text-gray-900">Число "12"</strong> символизирует фаната — двенадцатого игрока команды. Мы создаём одежду для тех, кто является частью игры, даже находясь вне поля.
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-black text-red-600 mb-2">100%</div>
                                    <div className="text-gray-600 font-medium">Авторские дизайны</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-black text-red-600 mb-2">∞</div>
                                    <div className="text-gray-600 font-medium">Любовь к футболу</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-3xl p-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-96 bg-gray-100 rounded-2xl overflow-hidden mb-6">
                                    <img
                                        src="/assets/story-image.jpg"
                                        alt="Наша история"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/assets/retroars.webp';
                                        }}
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">От идеи до реальности</h3>
                                    <p className="text-gray-600">Каждое джерси рождается из страсти к футболу и стремления к совершенству</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section id="values" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-red-600 text-sm font-bold tracking-wider uppercase">Наши принципы</span>
                        <h2 className="text-4xl font-black mt-4 mb-6 text-gray-900">Что движет нами</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                            Четыре основные ценности, которые определяют всё, что мы делаем
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group text-center p-8 rounded-2xl bg-gray-50 hover:bg-red-600 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 bg-red-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
                                    <value.icon
                                        size={28}
                                        className="text-red-600 group-hover:text-white transition-colors"
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-white transition-colors">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 group-hover:text-red-100 leading-relaxed transition-colors">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section id="timeline" className="py-20 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-red-400 text-sm font-bold tracking-wider uppercase">Наш путь</span>
                        <h2 className="text-4xl font-black mt-4 mb-6">От стартапа к бренду</h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                            Ключевые моменты нашего развития за последние годы
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-red-600"></div>

                        {timeline.map((item, index) => (
                            <div key={index} className={`relative flex items-center mb-12 ${
                                index % 2 === 0 ? 'justify-start' : 'justify-end'
                            }`}>
                                {/* Timeline Node */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-gray-900"></div>

                                {/* Content */}
                                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
                                        <div className="text-2xl font-black text-red-400 mb-2">{item.year}</div>
                                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-gray-300 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-red-600 text-sm font-bold tracking-wider uppercase">Команда мечты</span>
                        <h2 className="text-4xl font-black mt-4 mb-6 text-gray-900">Люди за брендом</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                            Познакомься с командой, которая делает магию возможной
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="group text-center bg-gray-50 rounded-2xl p-8 hover:bg-red-600 transition-all duration-300 hover:transform hover:-translate-y-2"
                            >
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.outerHTML = `<div class="w-full h-full bg-gray-300 flex items-center justify-center"><div class="w-12 h-12 bg-gray-400 rounded-full"></div></div>`;
                                        }}
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-white transition-colors">
                                    {member.name}
                                </h3>
                                <div className="text-red-600 group-hover:text-red-200 font-semibold mb-4 transition-colors">
                                    {member.role}
                                </div>
                                <p className="text-gray-600 group-hover:text-red-100 leading-relaxed transition-colors">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="max-w-4xl mx-auto text-center px-6 lg:px-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Присоединяйся к нашей истории
                    </h2>
                    <p className="text-xl text-red-100 mb-8 leading-relaxed">
                        Стань частью сообщества тех, кто живёт на пересечении футбола и стиля
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/catalog"
                            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Смотреть коллекцию
                        </a>
                        <a
                            href="/contact"
                            className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300"
                        >
                            Связаться с нами
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}