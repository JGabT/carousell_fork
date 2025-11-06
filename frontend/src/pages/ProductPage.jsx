// src/pages/ProductPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { generateAvatarUrl } from "../utils/avatarUtils";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch product details"
      );
      setLoading(false);
    }
  };

  const handleMessageSeller = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (product && product.seller_id) {
      navigate(`/chat/${product.seller_id}`, { state: { product } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-text">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Image */}
        <div className="lg:w-1/2 bg-gray-200 flex items-center justify-center h-96 overflow-hidden rounded-lg">
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
            <div className="text-gray-400">No Image Available</div>
          )}
        </div>

        {/* Info */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-text">{product.title}</h1>
          {product.category && (
            <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-accent rounded-full">
              {product.category}
            </span>
          )}
          <p className="text-gray-600">
            {product.description || "No description available"}
          </p>

          <div className="text-2xl font-bold text-primary">
            ₱{parseFloat(product.price).toFixed(2)}
          </div>

          {product.condition && (
            <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded">
              Condition: {product.condition}
            </span>
          )}

          {product.location && (
            <div className="flex items-center text-gray-500 text-sm">
              <svg
                className="w-4 h-4 mr-1"
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

          {/* Seller Profile Card */}
          {product.seller_name && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Seller Information
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={
                    product.image_url.startsWith("http")
                      ? product.seller_picture
                      : `${API_BASE_URL}${product.seller_picture}`
                  }
                  alt={product.seller_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {product.seller_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Member since {new Date(product.created_at).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message Seller Button */}
          {user && product && user.id !== product.seller_id && (
            <button
              onClick={handleMessageSeller}
              className="mt-4 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Message Seller
            </button>
          )}
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              Login to Message Seller
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
