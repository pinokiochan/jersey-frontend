"use client"

import { useState, useEffect } from "react"
import { Star, Users, Award, Heart, ArrowRight, Mail, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"

export default function About() {
  const [activeTab, setActiveTab] = useState("story")
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(false)

  const stats = [
    { icon: Users, value: "5000+", label: "Довольных клиентов" },
    { icon: Star, value: "50+", label: "Уникальных дизайнов" },
    { icon: Award, value: "99%", label: "Положительных отзывов" },
    { icon: Heart, value: "∞", label: "Любовь к футболу" },
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

  // Updated team data with the four main developers
  useEffect(() => {
    if (activeTab === "team" && teamMembers.length === 0) {
      const loadTeamMembers = async () => {
        setLoading(true)
        try {
          // Updated team with Ayan, Bikosh, Bakha, and Berdibek as main team
          const mockTeamMembers = [
            {
              id: 1,
              name: "Ayan",
              role: "Lead Developer & Co-Founder",
              image: "https://ui-avatars.com/api/?name=Ayan&background=dc2626&color=fff",
              description: "Специализируется на создании интуитивных мобильных интерфейсов и архитектуре приложений",
              email: "ayan@12jerseys.kz",
              linkedin: "#",
            },
            {
              id: 2,
              name: "Bikosh",
              role: "Senior Developer & Technical Lead",
              image: "https://ui-avatars.com/api/?name=Bikosh&background=dc2626&color=fff",
              description: "Разрабатывает мобильные приложения для лучшего пользовательского опыта",
              email: "bikosh@12jerseys.kz",
              linkedin: "#",
            },
            {
              id: 3,
              name: "Bakha",
              role: "Performance Engineer",
              image: "https://ui-avatars.com/api/?name=Bakha&background=dc2626&color=fff",
              description: "Эксперт по оптимизации производительности мобильных приложений и системной архитектуре",
              email: "bakha@12jerseys.kz",
              linkedin: "#",
            },
            {
              id: 4,
              name: "Berdibek",
              role: "Full-Stack Developer",
              image: "https://ui-avatars.com/api/?name=Berdibek&background=dc2626&color=fff",
              description: "Специализируется на кроссплатформенной разработке и интеграции систем",
              email: "berdibek@12jerseys.kz",
              linkedin: "#",
            },
          ]

          await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate loading
          setTeamMembers(mockTeamMembers)
        } catch (error) {
          console.error("Error loading team members:", error)
        } finally {
          setLoading(false)
        }
      }
      loadTeamMembers()
    }
  }, [activeTab, teamMembers.length])

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
                  <stat.icon className="text-red-600" size={24} />
                </div>
                <div className="text-3xl font-black text-red-600 mb-2">{stat.value}</div>
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
                      В 2020 году наша команда разработчиков, будучи страстными фанатами футбола, заметила, что многие
                      классические дизайны забыты или недоступны современным фанатам.
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

          {/* Team Tab - Updated to show only the main team */}
          {activeTab === "team" && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Загружаем команду...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Main Team */}
                  <div className="mb-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">Наша команда</h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                      Команда талантливых разработчиков, которые создают современные решения для мира футбольной моды
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all group hover:scale-105"
                        >
                          <img
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
                          />
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                          <p className="text-red-600 font-semibold text-sm mb-3">{member.role}</p>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.description}</p>

                          <div className="flex justify-center space-x-3">
                            <a
                              href={`mailto:${member.email}`}
                              className="p-2 bg-white hover:bg-red-600 text-gray-600 hover:text-white rounded-lg transition-colors shadow-sm"
                              title="Email"
                            >
                              <Mail size={14} />
                            </a>
                            <a
                              href={member.linkedin}
                              className="p-2 bg-white hover:bg-red-600 text-gray-600 hover:text-white rounded-lg transition-colors shadow-sm"
                              title="LinkedIn"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin size={14} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-600 rounded-3xl p-12 text-white text-center">
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
                </>
              )}
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
