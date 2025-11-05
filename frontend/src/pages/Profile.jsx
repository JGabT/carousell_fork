import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BottomNavbar from '../components/BottomNavbar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    // Cleanup blob URL on unmount
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfilePictureUrl(response.data.user.profile_picture_url);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Revoke previous blob URL to prevent memory leak
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setProfilePicture(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async () => {
    if (!profilePicture) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', profilePicture);

      const response = await axios.post(
        `${API_BASE_URL}/api/upload/profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setProfilePictureUrl(response.data.imageUrl);
      setImagePreview(null);
      setProfilePicture(null);
      setSuccess('Profile picture updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text">My Profile</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Current Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              {profilePictureUrl ? (
                <img
                  src={`${API_BASE_URL}${profilePictureUrl}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-16 h-16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Upload New Profile Picture */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Profile Picture
            </h3>

            <div className="space-y-4">
              {imagePreview && (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePicture(null);
                      setImagePreview(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="profile-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <button
                onClick={handleUpload}
                disabled={!profilePicture || loading}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Profile Picture'}
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="border-t mt-6 pt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-secondary/90 transition duration-200 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
};

export default Profile;
