"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, CreditCard, MapPin, User, Plus, Edit3, Trash2, Check, AlertCircle, ShoppingBag } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user, addOrder, updateUser, isAuthenticated } = useAuth()
  const { showSuccess, showError } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})

  // Form data
  const [orderData, setOrderData] = useState({
    // Personal info
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",

    // Delivery address
    selectedAddressId: null,
    newAddress: {
      title: "",
      street: "",
      city: "",
      region: "",
      postalCode: "",
      country: "Казахстан",
      isDefault: false,
    },

    // Payment
    paymentMethod: "cash",
    cardData: {
      number: "",
      expiry: "",
      cvv: "",
      name: "",
    },

    // Additional
    deliveryNotes: "",
    promoCode: "",
  })

  // Redirect if cart is empty or user not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } })
      return
    }
    if (cartItems.length === 0) {
      navigate("/cart")
      return
    }
  }, [cartItems, isAuthenticated, navigate])

  // Load user data
  useEffect(() => {
    if (user) {
      setOrderData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        selectedAddressId: user.addresses?.find((addr) => addr.isDefault)?.id || null,
      }))
    }
  }, [user])

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      // Personal info validation
      if (!orderData.firstName.trim()) newErrors.firstName = "Введите имя"
      if (!orderData.lastName.trim()) newErrors.lastName = "Введите фамилию"
      if (!orderData.email.trim()) newErrors.email = "Введите email"
      if (!orderData.phone.trim()) newErrors.phone = "Введите номер телефона"

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (orderData.email && !emailRegex.test(orderData.email)) {
        newErrors.email = "Неверный формат email"
      }

      const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/
      if (orderData.phone && !phoneRegex.test(orderData.phone)) {
        newErrors.phone = "Неверный формат телефона"
      }
    }

    if (step === 2) {
      // Address validation
      if (!orderData.selectedAddressId) {
        if (!orderData.newAddress.street.trim()) newErrors.street = "Введите адрес"
        if (!orderData.newAddress.city.trim()) newErrors.city = "Введите город"
        if (!orderData.newAddress.region.trim()) newErrors.region = "Введите область"
      }
    }

    if (step === 3) {
      // Payment validation
      if (orderData.paymentMethod === "card") {
        if (!orderData.cardData.number.trim()) newErrors.cardNumber = "Введите номер карты"
        if (!orderData.cardData.expiry.trim()) newErrors.cardExpiry = "Введите срок действия"
        if (!orderData.cardData.cvv.trim()) newErrors.cardCvv = "Введите CVV"
        if (!orderData.cardData.name.trim()) newErrors.cardName = "Введите имя на карте"

        // Card number validation (basic)
        const cardNumber = orderData.cardData.number.replace(/\s/g, "")
        if (cardNumber && (cardNumber.length < 13 || cardNumber.length > 19)) {
          newErrors.cardNumber = "Неверный номер карты"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  const handleInputChange = (field, value) => {
    setOrderData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAddressChange = (field, value) => {
    setOrderData((prev) => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        [field]: value,
      },
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleCardChange = (field, value) => {
    let formattedValue = value

    // Format card number
    if (field === "number") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
    }

    // Format expiry
    if (field === "expiry") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substr(0, 5)
    }

    // Format CVV
    if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").substr(0, 4)
    }

    setOrderData((prev) => ({
      ...prev,
      cardData: {
        ...prev.cardData,
        [field]: formattedValue,
      },
    }))

    if (errors[`card${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors((prev) => ({
        ...prev,
        [`card${field.charAt(0).toUpperCase() + field.slice(1)}`]: "",
      }))
    }
  }

  const saveUserData = async () => {
    // Save user personal info
    const updatedUserData = {
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      phone: orderData.phone,
    }

    // Save address if it's new
    if (!orderData.selectedAddressId && orderData.newAddress.street) {
      const newAddress = {
        id: Date.now().toString(),
        ...orderData.newAddress,
        createdAt: new Date().toISOString(),
      }

      updatedUserData.addresses = [...(user.addresses || []), newAddress]

      // Set as default if it's the first address
      if (!user.addresses || user.addresses.length === 0) {
        newAddress.isDefault = true
      }
    }

    updateUser(updatedUserData)
  }

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return

    setIsProcessing(true)

    try {
      // Save user data for future orders
      await saveUserData()

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get selected address
      let deliveryAddress = "Не указан"
      if (orderData.selectedAddressId) {
        const selectedAddr = user.addresses?.find((addr) => addr.id === orderData.selectedAddressId)
        if (selectedAddr) {
          deliveryAddress = `${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.region}`
        }
      } else if (orderData.newAddress.street) {
        deliveryAddress = `${orderData.newAddress.street}, ${orderData.newAddress.city}, ${orderData.newAddress.region}`
      }

      // Create order
      const newOrderData = {
        total: getCartTotal(),
        items: cartItems,
        customerInfo: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone,
        },
        deliveryAddress,
        paymentMethod: getPaymentMethodText(orderData.paymentMethod),
        deliveryNotes: orderData.deliveryNotes,
        promoCode: orderData.promoCode,
      }

      const newOrder = addOrder(newOrderData)
      clearCart()

      showSuccess(`Заказ ${newOrder.id} успешно оформлен!`, "Мы свяжемся с вами для подтверждения")

      // Redirect to success page or profile
      navigate("/profile?tab=orders")
    } catch (error) {
      showError("Ошибка при оформлении заказа. Попробуйте еще раз.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "card":
        return "Банковская карта"
      case "cash":
        return "Наличными при получении"
      case "transfer":
        return "Банковский перевод"
      default:
        return "Наличными при получении"
    }
  }

  const addNewAddress = () => {
    setOrderData((prev) => ({
      ...prev,
      selectedAddressId: null,
      newAddress: {
        title: "",
        street: "",
        city: "",
        region: "",
        postalCode: "",
        country: "Казахстан",
        isDefault: false,
      },
    }))
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Вернуться в корзину</span>
          </Link>

          <h1 className="text-4xl font-black text-gray-900 mb-2">Оформление заказа</h1>
          <p className="text-gray-600">Заполните данные для доставки</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Личные данные", icon: User },
              { step: 2, title: "Адрес доставки", icon: MapPin },
              { step: 3, title: "Оплата", icon: CreditCard },
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step ? "bg-red-600 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {currentStep > step ? <Check size={20} /> : <Icon size={20} />}
                </div>
                <span className={`font-medium ${currentStep >= step ? "text-red-600" : "text-gray-400"}`}>{title}</span>
                {step < 3 && <div className="w-8 h-px bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Личные данные</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Имя <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={orderData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                          errors.firstName ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Введите ваше имя"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Фамилия <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={orderData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                          errors.lastName ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Введите вашу фамилию"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={orderData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={orderData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="+7 (777) 123-45-67"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Адрес доставки</h2>
                    <button
                      onClick={addNewAddress}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      <Plus size={18} />
                      <span>Новый адрес</span>
                    </button>
                  </div>

                  {/* Saved Addresses */}
                  {user.addresses && user.addresses.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Сохраненные адреса</h3>
                      {user.addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                            orderData.selectedAddressId === address.id
                              ? "border-red-600 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleInputChange("selectedAddressId", address.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{address.title || "Адрес"}</h4>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                                    По умолчанию
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {address.street}, {address.city}, {address.region}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-red-600">
                                <Edit3 size={16} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New Address Form */}
                  {!orderData.selectedAddressId && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Новый адрес</h3>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Название адреса (необязательно)
                        </label>
                        <input
                          type="text"
                          value={orderData.newAddress.title}
                          onChange={(e) => handleAddressChange("title", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                          placeholder="Дом, Работа, и т.д."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Улица и дом <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={orderData.newAddress.street}
                          onChange={(e) => handleAddressChange("street", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                            errors.street ? "border-red-500" : "border-gray-200"
                          }`}
                          placeholder="ул. Абая, дом 123, кв. 45"
                        />
                        {errors.street && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.street}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Город <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={orderData.newAddress.city}
                            onChange={(e) => handleAddressChange("city", e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                              errors.city ? "border-red-500" : "border-gray-200"
                            }`}
                            placeholder="Алматы"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={16} className="mr-1" />
                              {errors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Область <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={orderData.newAddress.region}
                            onChange={(e) => handleAddressChange("region", e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                              errors.region ? "border-red-500" : "border-gray-200"
                            }`}
                            placeholder="Алматинская область"
                          />
                          {errors.region && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={16} className="mr-1" />
                              {errors.region}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Почтовый индекс</label>
                          <input
                            type="text"
                            value={orderData.newAddress.postalCode}
                            onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="050000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Страна</label>
                          <select
                            value={orderData.newAddress.country}
                            onChange={(e) => handleAddressChange("country", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                          >
                            <option value="Казахстан">Казахстан</option>
                            <option value="Россия">Россия</option>
                            <option value="Кыргызстан">Кыргызстан</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={orderData.newAddress.isDefault}
                            onChange={(e) => handleAddressChange("isDefault", e.target.checked)}
                            className="rounded text-red-600 focus:ring-red-600"
                          />
                          <span className="text-sm text-gray-700">Сделать адресом по умолчанию</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Delivery Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Комментарий к доставке</label>
                    <textarea
                      value={orderData.deliveryNotes}
                      onChange={(e) => handleInputChange("deliveryNotes", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                      rows={3}
                      placeholder="Дополнительная информация для курьера..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Способ оплаты</h2>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    {[
                      {
                        id: "cash",
                        title: "Наличными при получении",
                        description: "Оплата курьеру при доставке",
                        icon: "💵",
                      },
                      {
                        id: "card",
                        title: "Банковская карта",
                        description: "Visa, MasterCard, МИР",
                        icon: "💳",
                      },
                      {
                        id: "transfer",
                        title: "Банковский перевод",
                        description: "Перевод на расчетный счет",
                        icon: "🏦",
                      },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                          orderData.paymentMethod === method.id
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleInputChange("paymentMethod", method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{method.title}</h4>
                            <p className="text-gray-600 text-sm">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Details */}
                  {orderData.paymentMethod === "card" && (
                    <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900">Данные карты</h3>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Номер карты <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={orderData.cardData.number}
                          onChange={(e) => handleCardChange("number", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                            errors.cardNumber ? "border-red-500" : "border-gray-200"
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Срок действия <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={orderData.cardData.expiry}
                            onChange={(e) => handleCardChange("expiry", e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                              errors.cardExpiry ? "border-red-500" : "border-gray-200"
                            }`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.cardExpiry && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={16} className="mr-1" />
                              {errors.cardExpiry}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={orderData.cardData.cvv}
                            onChange={(e) => handleCardChange("cvv", e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                              errors.cardCvv ? "border-red-500" : "border-gray-200"
                            }`}
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cardCvv && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={16} className="mr-1" />
                              {errors.cardCvv}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Имя на карте <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={orderData.cardData.name}
                          onChange={(e) => handleCardChange("name", e.target.value.toUpperCase())}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
                            errors.cardName ? "border-red-500" : "border-gray-200"
                          }`}
                          placeholder="IVAN PETROV"
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.cardName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Promo Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Промокод</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={orderData.promoCode}
                        onChange={(e) => handleInputChange("promoCode", e.target.value.toUpperCase())}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Введите промокод"
                      />
                      <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                        Применить
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span>Назад</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <span>Далее</span>
                    <ArrowLeft size={18} className="rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <ShoppingBag size={18} />
                    )}
                    <span>{isProcessing ? "Обрабатываем..." : "Оформить заказ"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Ваш заказ</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex items-center space-x-3">
                    <img
                      src={item.image || "/placeholder.svg?height=60&width=60"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-gray-600 text-xs">
                        {item.selectedSize} • {item.quantity} шт.
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      ₸{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </span>
                  <span className="font-semibold">₸{getCartTotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Доставка</span>
                  <span className="font-semibold text-green-600">Бесплатно</span>
                </div>

                {orderData.promoCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Промокод ({orderData.promoCode})</span>
                    <span className="font-semibold text-green-600">-₸0</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Итого</span>
                  <span className="text-red-600">₸{getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <Check size={16} />
                  <span className="font-medium text-sm">Безопасная оплата</span>
                </div>
                <p className="text-green-700 text-xs">Ваши данные защищены SSL-шифрованием</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
