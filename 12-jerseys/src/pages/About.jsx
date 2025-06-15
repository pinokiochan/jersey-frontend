"use client"

import { useState } from "react"
import { Star, Users, Award, Heart, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function About() {
  const [activeTab, setActiveTab] = useState("story")

  const stats = [
    { icon: Users, value: "5000+", label: "Довольных клиентов" },
    { icon: Star, value: "50+", label: "Уникальных дизайнов" },
    { icon: Award, value: "99%", label: "Положительных отзывов" },
    { icon: Heart, value: "∞", label: "Любовь к футболу" },
  ]

  const team = [
    {
      name: "Алексей Иванов",
      role: "Основатель и креативный директор",
      image: "https://ui-avatars.com/api/?name=Алексей+Иванов&background=dc2626&color=fff",
      description: "Фанат футбола с 20-летним стажем, превративший страсть в бизнес",
    },
    {
      name: "Мария Петрова",
      role: "Дизайнер",
      image: "https://ui-avatars.com/api/?name=Мария+Петрова&background=dc2626&color=fff",
      description: "Создаёт уникальные дизайны, объединяющие спорт и моду",
    },
    {
      name: "Дмитрий Сидоров",
      role: "Менеджер по качеству",
      image: "https://ui-avatars.com/api/?name=Дмитрий+Сидоров&background=dc2626&color=fff",
      description: "Следит за тем, чтобы каждое джерси соответствовало высшим стандартам",
    },
  ]

  const values = [
    {
      title: "Качество превыше всего",
      description: "Мы используем только лучшие материалы и проверенные технологии производства",
      icon: "🏆",
    },
    {
      title: "Уважение к истории",
      description: "Каждый дизайн создается с глубоким пониманием футбольной культуры и традиций",
      icon: "📚",
    },
    {
      title: "Инновации в дизайне",
      description: "Мы не копируем, а переосмысливаем классику для современного поколения",
      icon: "💡",
    },
    {
      title: "Сообщество единомышленников",
      description: "Создаём пространство для тех, кто живёт футболом и ценит стиль",
      icon: "🤝",
    },
  ]

  const tabs = [
    { id: "story", label: "Наша история" },
    { id: "team", label: "Команда" },
    { id: "values", label: "Ценности" },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            О <span className="text-red-600">12</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Мы не просто продаём джерси — мы создаём культуру, объединяющую футбол и стиль
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-red-400" size={24} />
                </div>
                <div className="text-3xl font-black text-red-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-2xl p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id ? "bg-red-600 text-white shadow-lg" : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Story Tab */}
          {activeTab === "story" && (
            <div className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-6">Как всё начиналось</h2>
                  <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                    <p>
                      Всё началось с простой идеи: а что если дать вторую жизнь легендарным джерси, адаптировав их для
                      современной уличной моды?
                    </p>
                    <p>
                      В 2020 году наш основатель Алексей, будучи страстным фанатом футбола и коллекционером винтажных
                      джерси, заметил, что многие классические дизайны забыты или недоступны современным фанатам.
                    </p>
                    <p>
                      Так родилась идея "12" — бренда, который переосмысливает футбольную классику, создавая уникальные
                      вещи для тех, кто живёт на пересечении спорта и стиля.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gray-100 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img
                      src="/placeholder.svg?height=400&width=400"
                      alt="История бренда"
                      className="w-full h-80 object-cover rounded-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-xl">12</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-12">
                <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">Почему именно "12"?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-red-600 font-black text-xl">12</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Двенадцатый игрок</h4>
                    <p className="text-gray-600">
                      В футболе "12-й номер" традиционно принадлежит фанатам — самому важному игроку команды
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="text-red-600" size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Страсть</h4>
                    <p className="text-gray-600">Мы создаём для тех, кто живёт футболом и понимает его культуру</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="text-red-600" size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Сообщество</h4>
                    <p className="text-gray-600">Объединяем людей через общую любовь к футболу и стилю</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Наша команда</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-6"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-red-600 font-semibold mb-4">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-16 bg-red-600 rounded-3xl p-12 text-white text-center">
                <h3 className="text-3xl font-black mb-6">Присоединяйся к команде!</h3>
                <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                  Мы всегда ищем талантливых людей, которые разделяют нашу страсть к футболу и качеству
                </p>
                <a
                  href="mailto:careers@12jerseys.kz"
                  className="inline-flex items-center space-x-2 bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-colors"
                >
                  <span>Отправить резюме</span>
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>
          )}

          {/* Values Tab */}
          {activeTab === "values" && (
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Наши ценности</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Готов стать частью истории?</h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Каждое джерси "12" — это не просто одежда, а часть футбольной культуры, адаптированная для современной
                  жизни
                </p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-colors shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Посмотреть коллекцию</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
