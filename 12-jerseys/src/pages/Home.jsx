"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Star, Shield, Truck, Users, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const features = [
    {
      icon: Star,
      title: "Премиум качество",
      description: "Каждое джерси проходит строгий отбор и переработку с использованием высококачественных материалов",
      stats: "99% довольных клиентов",
    },
    {
      icon: Shield,
      title: "Уникальный дизайн",
      description: "Авторские переосмысления классических джерси, созданные для современного стиля жизни",
      stats: "50+ эксклюзивных дизайнов",
    },
    {
      icon: Truck,
      title: "Быстрая доставка",
      description: "Доставляем по всему Казахстану в течение 2-3 рабочих дней",
      stats: "Бесплатно от ₸30,000",
    },
    {
      icon: Users,
      title: "Сообщество",
      description: "Присоединяйся к сообществу тех, кто живёт на пересечении футбола и моды",
      stats: "5000+ участников",
    },
  ]

  const collections = [
    {
      title: "Классика",
      description: "Переосмысленные легендарные джерси",
      image: "/placeholder.svg?height=300&width=300",
      count: "12+ моделей",
      price: "от ₸18,000",
    },
    {
      title: "Лимитед",
      description: "Ограниченные коллекции в малых тиражах",
      image: "/placeholder.svg?height=300&width=300",
      count: "3 модели",
      price: "от ₸25,000",
    },
    {
      title: "Винтаж",
      description: "Ретро джерси в современной интерпретации",
      image: "/placeholder.svg?height=300&width=300",
      count: "8+ моделей",
      price: "от ₸22,000",
    },
  ]

  const testimonials = [
    {
      name: "Алексей К.",
      text: "Качество просто невероятное! Джерси Manchester United выглядит как оригинал, но с современным кроем.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Алексей+К&background=dc2626&color=fff",
    },
    {
      name: "Мария С.",
      text: "Заказала Arsenal винтаж - в восторге! Материал приятный, посадка идеальная.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Мария+С&background=dc2626&color=fff",
    },
    {
      name: "Дмитрий Л.",
      text: "Быстрая доставка, отличная упаковка. Буду заказывать еще!",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Дмитрий+Л&background=dc2626&color=fff",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {isAuthenticated && (
            <div className="mb-6 animate-fade-in">
              <span className="text-red-400 text-lg font-bold tracking-wider">Добро пожаловать, {user.name}!</span>
            </div>
          )}

          <div className="mb-6">
            <span className="text-red-400 text-lg font-bold tracking-wider uppercase animate-fade-in-up">
              The 12th Man Collection
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter animate-fade-in-up delay-200">
            Джерси.
            <br />
            <span className="text-red-600 animate-pulse">Переосмысленно.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-400">
            Мы создаём не просто футболки — мы даём им вторую жизнь в стиле повседневного искусства.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-600">
            <Link
              to="/catalog"
              className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105 flex items-center space-x-2"
            >
              <span>Перейти в каталог</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => setIsVideoPlaying(true)}
              className="group text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 border border-gray-600 hover:border-white flex items-center space-x-2"
            >
              <Play size={20} className="group-hover:scale-110 transition-transform" />
              <span>Смотреть видео</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in-up delay-800">
            <div className="text-center">
              <div className="text-3xl font-black text-red-400 mb-2">5000+</div>
              <div className="text-gray-400">Довольных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-red-400 mb-2">50+</div>
              <div className="text-gray-400">Уникальных дизайнов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-red-400 mb-2">99%</div>
              <div className="text-gray-400">Положительных отзывов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-red-400 mb-2">24/7</div>
              <div className="text-gray-400">Поддержка клиентов</div>
            </div>
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
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="mb-6">
                <span className="text-red-600 text-sm font-bold tracking-wider uppercase">Наша история</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-8 text-gray-900 leading-tight">
                Почему <span className="text-red-600">"12"</span>?
              </h2>

              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Мы верим, что футбол — это не только спорт, но и стиль жизни.{" "}
                  <strong className="text-gray-900">"12"</strong> — это символ фаната, двенадцатого игрока на поле.
                </p>

                <p>
                  Мы соединяем эстетику легендарных клубов с современной уличной модой, создавая уникальные вещи для
                  тех, кто не готов выбирать между стадионом и улицей.
                </p>

                <p>
                  Каждое джерси в нашей коллекции — это не просто одежда, а statement piece, который говорит о твоей
                  страсти к игре и чувству стиля.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-black text-red-600 mb-2">100%</div>
                  <div className="text-gray-600 font-medium">Авторские дизайны</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-black text-red-600 mb-2">∞</div>
                  <div className="text-gray-600 font-medium">Любовь к футболу</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-80 bg-gray-200 rounded-xl mb-6 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=320&width=320"
                    alt="Футболка 12"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Твой стиль</h3>
                  <p className="text-gray-600">Уличная мода встречает футбольную культуру</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-float">
                <Star className="text-red-600" size={24} />
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-float delay-1000">
                <span className="text-white font-bold">12</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-12 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
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
                className={`p-8 rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                  hoveredFeature === index
                    ? "bg-red-600 text-white shadow-2xl shadow-red-600/30"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                    hoveredFeature === index ? "bg-white/20" : "bg-red-100"
                  }`}
                >
                  <feature.icon size={28} className={hoveredFeature === index ? "text-white" : "text-red-600"} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className={`leading-relaxed mb-4 ${hoveredFeature === index ? "text-red-100" : "text-gray-600"}`}>
                  {feature.description}
                </p>
                <div className={`text-sm font-semibold ${hoveredFeature === index ? "text-red-200" : "text-red-600"}`}>
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Preview */}
      <section className="px-6 lg:px-12 py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
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
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {collection.count}
                    </span>
                    <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {collection.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{collection.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/catalog"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105"
            >
              <span>Смотреть все коллекции</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 lg:px-12 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-600 text-sm font-bold tracking-wider uppercase">Отзывы</span>
            <h2 className="text-4xl font-black mt-4 mb-6 text-gray-900">Что говорят наши клиенты</h2>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={20} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
                      <div className="flex items-center justify-center space-x-3">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{testimonial.name}</div>
                          <div className="text-gray-600 text-sm">Покупатель</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              aria-label="Следующий отзыв"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-red-600" : "bg-gray-300"
                  }`}
                  aria-label={`Перейти к отзыву ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-20 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Готов стать частью команды?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Присоединяйся к тысячам фанатов, которые уже выбрали стиль "12". Твоё идеальное джерси ждёт тебя.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Начать покупки</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  )
}
