import { useAuth } from '../../contexts/AuthContext';

export default function Avatar({ user, size = 'md', className = '' }) {
  const { user: currentUser } = useAuth();
  
  // Handle both direct user object and populated userId reference
  const getUserData = () => {
    if (!user) return null;
    // If userId is populated (object), use it; otherwise use user directly
    if (user.userId && typeof user.userId === 'object') {
      return user.userId;
    }
    return user;
  };

  const userData = getUserData();
  const userId = userData?._id?.toString() || userData?.userId?.toString() || user?.userId?.toString() || user?._id?.toString();
  const currentUserId = currentUser?._id?.toString() || currentUser?.userId?.toString();
  const isCurrentUser = userId === currentUserId;

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const avatarUrl = userData?.avatar || user?.avatar || '/assets/images/Avatar/Boy_avatar_1.png';
  const displayName = userData?.username || user?.username || 'User';

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className={`w-full h-full rounded-full object-cover border-2 ${
            isCurrentUser ? 'border-neon-cyan' : 'border-dark-border'
          }`}
          onError={(e) => {
            // Fallback to default avatar if image fails to load
            e.target.src = '/assets/images/Avatar/Boy_avatar_1.png';
          }}
        />
      ) : (
        <div
          className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold border-2 ${
            isCurrentUser
              ? 'bg-gradient-to-br from-neon-purple to-neon-cyan border-neon-cyan'
              : 'bg-gradient-to-br from-gray-600 to-gray-700 border-dark-border'
          }`}
        >
          {displayName[0].toUpperCase()}
        </div>
      )}
      {isCurrentUser && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-cyan rounded-full border-2 border-dark-bg"></div>
      )}
    </div>
  );
}

