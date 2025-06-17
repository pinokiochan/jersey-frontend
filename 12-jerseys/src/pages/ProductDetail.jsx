"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useCart } from "../context/CartContext"
import LoadingSpinner from "../components/LoadingSpinner"
import '../App.css';

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isLoading: cartLoading } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  // Navigation states
  const [allProducts, setAllProducts] = useState([])
  const [currentProductIndex, setCurrentProductIndex] = useState(-1)
  const [nextProduct, setNextProduct] = useState(null)
  const [prevProduct, setPrevProduct] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // МЕСТО ДЛЯ ВАШИХ ТОВАРОВ - замените этот массив на ваши данные
   const mockProducts = [
    {
      id: 1,
      name: "Manchester United Retro",
      team: "Manchester United",
      color: "Красный",
      price: 25000,
      image: "/assets/manu.png?height=300&width=300",
      description: "Классическое ретро джерси Manchester United в современной интерпретации с премиальными материалами",
      stock: 15,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: true,
    },
    {
      id: 2,
      name: "Arsenal Vintage",
      team: "Arsenal",
      color: "Красный",
      price: 22000,
      image: "/assets/arsenal.png?height=300&width=300",
      description: "Винтажное джерси Arsenal с уникальным дизайном и аутентичными деталями",
      stock: 8,
      category: "vintage",
      sizes: ["S", "M", "L", "XL"],
      featured: true,
    },
    {
      id: 3,
      name: "Liverpool Classic",
      team: "Liverpool",
      color: "Красный",
      price: 23000,
      image: "/assets/liverpool.png?height=300&width=300",
      description: "Классическое джерси Liverpool для истинных фанатов с современным кроем",
      stock: 12,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL"],
      featured: false,
    },
    {
      id: 4,
      name: "Chelsea Modern",
      team: "Chelsea",
      color: "Синий",
      price: 24000,
      image: "/assets/chelsea.png?height=300&width=300",
      description: "Современное джерси Chelsea с инновационным дизайном и технологичными материалами",
      stock: 20,
      category: "modern",
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
    },
    {
      id: 5,
      name: "Barcelona Heritage",
      team: "Barcelona",
      color: "Синий",
      price: 26000,
      image: "/assets/barcelona.jpg?height=300&width=300",
      description: "Наследие Barcelona в современном исполнении с традиционными цветами клуба",
      stock: 5,
      category: "heritage",
      sizes: ["M", "L", "XL"],
      featured: true,
    },
    {
      id: 6,
      name: "Real Madrid Elite",
      team: "Real Madrid",
      color: "Белый",
      price: 28000,
      image: "/assets/realmadrid.png?height=300&width=300",
      description: "Элитное джерси Real Madrid для особых случаев с премиальной отделкой",
      stock: 10,
      category: "elite",
      sizes: ["S", "M", "L", "XL"],
      featured: false,
    },
    {
      id: 7,
      name: "PSG Limited Edition",
      team: "PSG",
      color: "Синий",
      price: 30000,
      image: "/assets/psg.png?height=300&width=300",
      description: "Лимитированная коллекция PSG с эксклюзивным дизайном",
      stock: 3,
      category: "limited",
      sizes: ["M", "L", "XL"],
      featured: true,
    },
    {
      id: 8,
      name: "Bayern Munich Classic",
      team: "Bayern Munich",
      color: "Красный",
      price: 24500,
      image: "/assets/bayernmunchen.png?height=300&width=300",
      description: "Классическое джерси Bayern Munich с традиционным баварским дизайном",
      stock: 18,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 9,
      name: "Atletico Madrid Classic",
      team: "Atletico Madrid",
      color: "Красный",
      price: 21500,
      image: "/assets/atleticom.png?height=300&width=300",
      description: "Классическое джерси Atletico Madrid с традиционным баварским дизайном",
      stock: 14,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 10,
      name: "Japan Vintage",
      team: "Japan",
      color: "Красный",
      price: 26500,
      image: "/assets/japan.jpg?height=300&width=300",
      description: "Винтажное джерси Japan с уникальным дизайном и аутентичными деталями",
      stock: 28,
      category: "vintage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 11,
      name: "Milan Retro",
      team: "Milan",
      color: "Красный",
      price: 20500,
      image: "/assets/milan.png?height=300&width=300",
      description: "Классическое ретро джерси Milan в современной интерпретации с премиальными материалами",
      stock: 18,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 12,
      name: "Italy Retro",
      team: "Italy",
      color: "White",
      price: 28500,
      image: "/assets/italy.png?height=300&width=300",
      description: "Классическое ретро джерси Italy в современной интерпретации с премиальными материалами",
      stock: 8,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 13,
      name: "Germany Classic",
      team: "Germany",
      color: "White",
      price: 24500,
      image: "/assets/germany.png?height=300&width=300",
      description: "Классическое джерси Germany с традиционным баварским дизайном",
      stock: 20,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 14,
      name: "Manchester City Modern",
      team: "Manchester City",
      color: "White",
      price: 27500,
      image: "/assets/mancity.jpg?height=300&width=300",
      description: "Современное джерси Manchester City с инновационным дизайном и технологичными материалами",
      stock: 4,
      category: "modern",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 15,
      name: "Borussia Dortmund Classic",
      team: "Borussia Dortmund",
      color: "Yellow",
      price: 29500,
      image: "/assets/borussia.jpg?height=300&width=300",
      description: "Классическое джерси Borussia Dortmund с традиционным баварским дизайном",
      stock: 1,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 16,
      name: "Kairat Elite",
      team: "Kairat",
      color: "Yellow",
      price: 25500,
      image: "/assets/girona.png?height=300&width=300",
      description: "Элитное джерси Kairat для особых случаев с премиальной отделкой",
      stock: 0,
      category: "elite",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 17,
      name: "Juventus Vintage",
      team: "Juventus",
      color: "Black",
      price: 22500,
      image: "/assets/juventus.jpg?height=300&width=300",
      description: "Винтажное джерси Juventus с уникальным дизайном и аутентичными деталями",
      stock: 3,
      category: "vintage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 18,
      name: "Inter Heritage",
      team: "Inter",
      color: "White",
      price: 21500,
      image: "/assets/inter.jpg?height=300&width=300",
      description: "Наследие Inter в современном исполнении с традиционными цветами клуба",
      stock: 5,
      category: "heritage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 19,
      name: "Tottenham hotspur Classic",
      team: "Tottenham hotspur",
      color: "White",
      price: 27500,
      image: "/assets/tottenham.png?height=300&width=300",
      description: "Классическое джерси Tottenham hotspur с традиционным баварским дизайном",
      stock: 11,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 20,
      name: "Portugal Elite",
      team: "Portugal",
      color: "Red",
      price: 24500,
      image: "/assets/portugal.png?height=300&width=300",
      description: "Элитное джерси Portugal для особых случаев с премиальной отделкой",
      stock: 10,
      category: "elite",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 21,
      name: "Argentina Heritage",
      team: "Argentina",
      color: "Blue",
      price: 21500,
      image: "/assets/argentina.png?height=300&width=300",
      description: "Наследие Argentina в современном исполнении с традиционными цветами клуба",
      stock: 13,
      category: "heritage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 22,
      name: "England Modern",
      team: "England",
      color: "White",
      price: 20500,
      image: "/assets/england.png?height=300&width=300",
      description: "Современное джерси England с инновационным дизайном и технологичными материалами",
      stock: 17,
      category: "modern",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 23,
      name: "Russia Classic",
      team: "Russia",
      color: "Red",
      price: 26500,
      image: "/assets/russia.png?height=300&width=300",
      description: "Классическое джерси Russia с традиционным баварским дизайном",
      stock: 16,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 24,
      name: "Roma Classic",
      team: "Roma",
      color: "Brown",
      price: 28500,
      image: "/assets/roma.png?height=300&width=300",
      description: "Классическое джерси Roma с традиционным баварским дизайном",
      stock: 22,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 25,
      name: "Brasil Elite",
      team: "Brasil",
      color: "Yellow",
      price: 29500,
      image: "/assets/brasil.png?height=300&width=300",
      description: "Элитное джерси Brasil для особых случаев с премиальной отделкой",
      stock: 16,
      category: "elite",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 26,
      name: "France Modern",
      team: "France",
      color: "Blue",
      price: 25500,
      image: "/assets/france.png?height=300&width=300",
      description: "Современное джерси France с инновационным дизайном и технологичными материалами",
      stock: 20,
      category: "modern",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 27,
      name: "Real Betis Classic",
      team: "Real Betis",
      color: "Green",
      price: 28500,
      image: "/assets/betis.png?height=300&width=300",
      description: "Классическое джерси Real Betis с традиционным баварским дизайном",
      stock: 14,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 28,
      name: "Napoli Heritage",
      team: "Napoli",
      color: "Blue",
      price: 23500,
      image: "/assets/napoli.png?height=300&width=300",
      description: "Наследие Napoli в современном исполнении с традиционными цветами клуба",
      stock: 15,
      category: "heritage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 29,
      name: "Sporting Retro",
      team: "Sporting",
      color: "Green",
      price: 24500,
      image: "/assets/sporting.png?height=300&width=300",
      description: "Классическое ретро джерси Sporting в современной интерпретации с премиальными материалами",
      stock: 13,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 30,
      name: "Porto Retro",
      team: "Porto",
      color: "Blue",
      price: 22500,
      image: "/assets/porto.png?height=300&width=300",
      description: "Классическое ретро джерси Porto в современной интерпретации с премиальными материалами",
      stock: 10,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
  ]

  // Load product and all products
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Load all products
        setAllProducts(mockProducts)

        const foundProduct = mockProducts.find((p) => p.id === Number.parseInt(id))

        if (!foundProduct) {
          throw new Error("Товар не найден")
        }

        setProduct(foundProduct)

        // Find current product index
        const productIndex = mockProducts.findIndex((p) => p.id === Number.parseInt(id))
        setCurrentProductIndex(productIndex)

        setSelectedSize(foundProduct.sizes[2] || foundProduct.sizes[0]) // Default to M or first size
        setSelectedImage(0) // Reset image selection
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  // Calculate adjacent products
  useEffect(() => {
    if (allProducts.length > 0 && currentProductIndex >= 0) {
      // Previous product
      const prevIndex = currentProductIndex - 1
      setPrevProduct(prevIndex >= 0 ? allProducts[prevIndex] : null)

      // Next product
      const nextIndex = currentProductIndex + 1
      setNextProduct(nextIndex < allProducts.length ? allProducts[nextIndex] : null)
    }
  }, [allProducts, currentProductIndex])

  // Navigation functions
  const goToNextProduct = () => {
    if (nextProduct) {
      setIsTransitioning(true)
      setTimeout(() => {
        navigate(`/product/${nextProduct.id}`)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const goToPrevProduct = () => {
    if (prevProduct) {
      setIsTransitioning(true)
      setTimeout(() => {
        navigate(`/product/${prevProduct.id}`)
        setIsTransitioning(false)
      }, 150)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft" && prevProduct) {
        goToPrevProduct()
      } else if (e.key === "ArrowRight" && nextProduct) {
        goToNextProduct()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [prevProduct, nextProduct])

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Пожалуйста, выберите размер")
      return
    }

    try {
      const result = await addToCart(product, selectedSize, quantity)
      if (result?.success) {
        alert("Товар добавлен в корзину!")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Ошибка при добавлении в корзину")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Ссылка скопирована!")
    }
  }

  // Product Navigation Component
  const RelatedProducts = () => (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Другие товары</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Previous Product */}
        {prevProduct && (
          <div
            onClick={goToPrevProduct}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <img
                src={prevProduct.image || "/placeholder.svg?height=80&width=80"}
                alt={prevProduct.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">← Предыдущий товар</div>
                <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {prevProduct.name}
                </h4>
                <p className="text-red-600 font-bold">₸{prevProduct.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Product */}
        {nextProduct && (
          <div
            onClick={goToNextProduct}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-1 text-right">
                <div className="text-xs text-gray-500 mb-1">Следующий товар →</div>
                <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {nextProduct.name}
                </h4>
                <p className="text-red-600 font-bold">₸{nextProduct.price.toLocaleString()}</p>
              </div>
              <img
                src={nextProduct.image || "/placeholder.svg?height=80&width=80"}
                alt={nextProduct.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Quick Navigation Buttons
  const QuickNavButtons = () => (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-2">
      {/* Previous */}
      {prevProduct && (
        <button
          onClick={goToPrevProduct}
          disabled={isTransitioning}
          className="group bg-white hover:bg-red-600 text-gray-600 hover:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
          title={`Предыдущий: ${prevProduct.name}`}
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Next */}
      {nextProduct && (
        <button
          onClick={goToNextProduct}
          disabled={isTransitioning}
          className="group bg-white hover:bg-red-600 text-gray-600 hover:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
          title={`Следующий: ${nextProduct.name}`}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  )

  // Related Products Component
  const ProductNavigation = () => (
    <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
      {/* Previous Product */}
      <button
        onClick={goToPrevProduct}
        disabled={!prevProduct || isTransitioning}
        className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
          prevProduct && !isTransitioning
            ? "hover:bg-gray-50 text-gray-700 hover:text-red-600"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        <ChevronLeft size={20} />
        {prevProduct && (
          <div className="text-left hidden sm:block">
            <div className="text-xs text-gray-500">Предыдущий</div>
            <div className="font-medium truncate max-w-32">{prevProduct.name}</div>
          </div>
        )}
      </button>

      {/* Product Counter */}
      <div className="text-center">
        <div className="text-sm text-gray-500">
          {currentProductIndex + 1} из {allProducts.length}
        </div>
        <div className="text-xs text-gray-400">товаров</div>
      </div>

      {/* Next Product */}
      <button
        onClick={goToNextProduct}
        disabled={!nextProduct || isTransitioning}
        className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
          nextProduct && !isTransitioning
            ? "hover:bg-gray-50 text-gray-700 hover:text-red-600"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        {nextProduct && (
          <div className="text-right hidden sm:block">
            <div className="text-xs text-gray-500">Следующий</div>
            <div className="font-medium truncate max-w-32">{nextProduct.name}</div>
          </div>
        )}
        <ChevronRight size={20} />
      </button>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Загружаем товар...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Товар не найден</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/catalog"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>
        </div>

        {/* Product Navigation */}
        <RelatedProducts />
        <div className="my-box"></div>
        

        {/* Transition Overlay */}
        {isTransitioning && (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <LoadingSpinner size="lg" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={product.images?.[selectedImage] || product.image || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-red-600" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                  {product.team}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"
                    }`}
                  >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-black text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl font-black text-red-600">₸{product.price.toLocaleString()}</div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-600 text-sm ml-2">({product.reviews?.length || 0} отзывов)</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-gray-900">Размер</label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Таблица размеров
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border rounded-lg font-medium transition-colors ${
                      selectedSize === size
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-gray-200 hover:border-red-600 hover:text-red-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-3 block">Количество</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-3 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-gray-600">В наличии: {product.stock} шт.</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || cartLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
                  product.stock === 0 || cartLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-lg shadow-red-600/25"
                }`}
              >
                {cartLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Добавить в корзину</span>
                  </>
                )}
              </button>

              <Link
                to="/cart"
                className="w-full py-4 rounded-xl font-bold text-lg border-2 border-red-600 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
              >
                Перейти в корзину
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="text-green-600" size={20} />
                </div>
                <p className="text-sm font-medium text-gray-900">Быстрая доставка</p>
                <p className="text-xs text-gray-600">2-3 дня</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="text-blue-600" size={20} />
                </div>
                <p className="text-sm font-medium text-gray-900">Гарантия качества</p>
                <p className="text-xs text-gray-600">30 дней</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <RotateCcw className="text-orange-600" size={20} />
                </div>
                <p className="text-sm font-medium text-gray-900">Легкий возврат</p>
                <p className="text-xs text-gray-600">14 дней</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Описание</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-line">{product.fullDescription}</p>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Характеристики</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900 capitalize">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {product.reviews && product.reviews.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Отзывы</h3>
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{review.name}</span>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={14} className="text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <ProductNavigation />
      </div>

      {/* Quick Navigation Buttons */}
      <QuickNavButtons />

      {/* Keyboard Navigation Hint */}
      <div className="fixed bottom-6 left-6 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-2">
          <span>Навигация:</span>
          <kbd className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">←</kbd>
          <kbd className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">→</kbd>
        </div>
      </div>
    </main>
  )
}
