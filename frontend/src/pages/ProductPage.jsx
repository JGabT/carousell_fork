// src/pages/ProductPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // in case you need authentication info
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
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
            ${parseFloat(product.price).toFixed(2)}
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

          {product.seller_name && (
            <div className="text-sm text-gray-600 mt-2">
              Seller: <span className="font-medium">{product.seller_name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
