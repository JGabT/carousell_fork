import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavbar from "../components/BottomNavbar";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data);
      setLoading(false);
    } catch {
      setError("Failed to load products");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl text-text">Loading...</div>
      </div>
    );
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery.trim() ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#7e7e7e] to-[#460000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Parasell
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            The Marketplace for Everything
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 px-6 py-4 rounded-full border text-lg focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-900"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-4 rounded-full border text-lg focus:outline-none focus:ring-4 focus:ring-white/30 bg-white text-gray-900 font-medium"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Toys">Toys</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="submit"
                className="px-8 py-4 text-primary rounded-full font-semibold hover:bg-gray-100 bg-white transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <img
                    src={
                      product.image_url.startsWith("http")
                        ? product.image_url
                        : `${API_BASE_URL}${product.image_url}`
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-text mb-2 truncate">
                  {product.title}
                </h3>
                {product.category && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-[#0000000c] text-accent rounded-full mb-2">
                    {product.category}
                  </span>
                )}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description || "No description available"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    ₱{parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.condition && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.condition}
                    </span>
                  )}
                </div>
                {product.location && (
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {product.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchQuery.trim()
                ? "No products found matching your search"
                : "No products available at the moment"}
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
};

export default Home;
