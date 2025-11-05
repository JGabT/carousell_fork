/**
 * Generate avatar URL for a user
 * @param {string} name - User's name
 * @param {string|null} pictureUrl - User's profile picture URL
 * @returns {string} Avatar URL
 */
export const generateAvatarUrl = (name, pictureUrl) => {
  if (pictureUrl) {
    return pictureUrl;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=eb8f0d&color=fff`;
};
