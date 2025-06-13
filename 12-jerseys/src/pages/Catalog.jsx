import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Grid, List, ChevronDown, X } from 'lucide-react';

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
    const [activeFilters, setActiveFilters] = useState([]);

    // Unique filter options
    const [filterOptions, setFilterOptions] = useState({
        teams: [],
        colors: [],
        sizes: []
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetchProducts();
            setProducts(response.data);
            setFilteredProducts(response.data);

            // Extract unique filter options
            const uniqueTeams = [...new Set(response.data.map(p => p.team))];
            const uniqueColors = [...new Set(response.data.map(p => p.color))];
            const uniqueSizes = [...new Set(response.data.map(p => p.size))];
            const maxPrice = Math.max(...response.data.map(p => Number(p.price)));

            setFilterOptions({
                teams: uniqueTeams,
                colors: uniqueColors,
                sizes: uniqueSizes
            });
            setPriceRange({ min: 0, max: maxPrice });
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFiltersAndSort();
    }, [products, searchTerm, selectedTeams, selectedColors, selectedSizes, priceRange, sortBy, sortOrder]);

    const applyFiltersAndSort = () => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Team filter
        if (selectedTeams.length > 0) {
            filtered = filtered.filter(product => selectedTeams.includes(product.team));
        }

        // Color filter
        if (selectedColors.length > 0) {
            filtered = filtered.filter(product => selectedColors.includes(product.color));
        }

        // Size filter
        if (selectedSizes.length > 0) {
            filtered = filtered.filter(product => selectedSizes.includes(product.size));
        }

        // Price filter
        filtered = filtered.filter(product => {
            const price = Number(product.price);
            return price >= priceRange.min && price <= priceRange.max;
        });

        // Sorting
        filtered.sort((a, b) => {
            let valueA, valueB;

            switch (sortBy) {
                case 'price':
                    valueA = Number(a.price);
                    valueB = Number(b.price);
                    break;
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                case 'team':
                    valueA = a.team.toLowerCase();
                    valueB = b.team.toLowerCase();
                    break;
                default:
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        setFilteredProducts(filtered);
        updateActiveFilters();
    };

    const updateActiveFilters = () => {
        const filters = [];
        if (searchTerm) filters.push({ type: 'search', value: searchTerm, label: `Поиск: "${searchTerm}"` });
        selectedTeams.forEach(team => filters.push({ type: 'team', value: team, label: team }));
        selectedColors.forEach(color => filters.push({ type: 'color', value: color, label: color }));
        selectedSizes.forEach(size => filters.push({ type: 'size', value: size, label: `Размер ${size}` }));
        if (priceRange.min > 0 || priceRange.max < Math.max(...products.map(p => Number(p.price)))) {
            filters.push({
                type: 'price',
                value: priceRange,
                label: `₸${priceRange.min} - ₸${priceRange.max}`
            });
        }
        setActiveFilters(filters);
    };

    const removeFilter = (filterToRemove) => {
        switch (filterToRemove.type) {
            case 'search':
                setSearchTerm('');
                break;
            case 'team':
                setSelectedTeams(prev => prev.filter(team => team !== filterToRemove.value));
                break;
            case 'color':
                setSelectedColors(prev => prev.filter(color => color !== filterToRemove.value));
                break;
            case 'size':
                setSelectedSizes(prev => prev.filter(size => size !== filterToRemove.value));
                break;
            case 'price':
                const maxPrice = Math.max(...products.map(p => Number(p.price)));
                setPriceRange({ min: 0, max: maxPrice });
                break;
        }
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedTeams([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        const maxPrice = Math.max(...products.map(p => Number(p.price)));
        setPriceRange({ min: 0, max: maxPrice });
    };

    const handleTeamChange = (team) => {
        setSelectedTeams(prev =>
            prev.includes(team)
                ? prev.filter(t => t !== team)
                : [...prev, team]
        );
    };

    const handleColorChange = (color) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    const handleSizeChange = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    if (loading) {
        return (
            <main className="px-6 py-10 bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            </main>
        );
    }

    return (
        <main className="px-6 lg:px-12 py-10 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <section className="mb-10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                        Каталог
                    </h1>
                    <p className="text-gray-600 max-w-2xl text-lg leading-relaxed mb-8">
                        Полный список доступных джерси. Используй фильтры, чтобы найти то, что тебе нужно.
                    </p>

                    {/* Search and Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Поиск по названию, команде..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Sort Controls */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] = e.target.value.split('-');
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                >
                                    <option value="name-asc">По названию (А-Я)</option>
                                    <option value="name-desc">По названию (Я-А)</option>
                                    <option value="price-asc">Цена (по возрастанию)</option>
                                    <option value="price-desc">Цена (по убыванию)</option>
                                    <option value="team-asc">По команде (А-Я)</option>
                                    <option value="team-desc">По команде (Я-А)</option>
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-red-600 text-white'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-red-600 text-white'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                                    showFilters
                                        ? 'bg-red-600 text-white border-red-600'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-red-600'
                                }`}
                            >
                                <Filter size={18} />
                                <span>Фильтры</span>
                                {activeFilters.length > 0 && (
                                    <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="text-sm text-gray-600 font-medium">Активные фильтры:</span>
                            {activeFilters.map((filter, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {filter.label}
                                    <button
                                        onClick={() => removeFilter(filter)}
                                        className="hover:bg-red-200 rounded-full p-0.5 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                            >
                                Очистить все
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <div className="max-w-6xl mx-auto">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
                            <h3 className="text-lg font-bold mb-6 text-gray-900">Фильтры</h3>

                            {/* Teams Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Команды</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {filterOptions.teams.map(team => (
                                        <label key={team} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedTeams.includes(team)}
                                                onChange={() => handleTeamChange(team)}
                                                className="rounded text-red-600 focus:ring-red-600 focus:ring-2"
                                            />
                                            <span className="ml-3 text-gray-700">{team}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Colors Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Цвета</h4>
                                <div className="space-y-2">
                                    {filterOptions.colors.map(color => (
                                        <label key={color} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedColors.includes(color)}
                                                onChange={() => handleColorChange(color)}
                                                className="rounded text-red-600 focus:ring-red-600 focus:ring-2"
                                            />
                                            <span className="ml-3 text-gray-700">{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Размеры</h4>
                                <div className="space-y-2">
                                    {filterOptions.sizes.map(size => (
                                        <label key={size} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedSizes.includes(size)}
                                                onChange={() => handleSizeChange(size)}
                                                className="rounded text-red-600 focus:ring-red-600 focus:ring-2"
                                            />
                                            <span className="ml-3 text-gray-700">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Цена</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="От"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                        />
                                        <span className="text-gray-500">—</span>
                                        <input
                                            type="number"
                                            placeholder="До"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Results Count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Показано <span className="font-semibold text-gray-900">{filteredProducts.length}</span> из <span className="font-semibold text-gray-900">{products.length}</span> товаров
                            </p>
                        </div>

                        {/* Products */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-gray-400" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
                                <p className="text-gray-600 mb-4">Попробуйте изменить параметры поиска или фильтры</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Сбросить фильтры
                                </button>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${
                                viewMode === 'grid'
                                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                    : 'grid-cols-1'
                            }`}>
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}