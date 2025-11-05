import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BottomNavbar from "../components/BottomNavbar";
import { generateAvatarUrl } from "../utils/avatarUtils";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Conversations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/chat/conversations`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setConversations(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pb-20">
        <p className="text-xl text-text">Loading conversations...</p>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-4xl mx-auto">
        {error ? (
          <div className="px-4 py-8 text-center text-red-500">{error}</div>
        ) : conversations.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
            <p className="text-lg">No conversations yet</p>
            <p className="text-sm mt-2">Start chatting with sellers to see your messages here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <button
                key={conversation.other_user_id}
                onClick={() => navigate(`/chat/${conversation.other_user_id}`)}
                className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition text-left"
              >
                <div className="relative">
                  <img
                    src={generateAvatarUrl(conversation.other_user_name, conversation.other_user_picture)}
                    alt={conversation.other_user_name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {conversation.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.other_user_name}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {new Date(conversation.last_message_time).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.last_message}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Conversations;
