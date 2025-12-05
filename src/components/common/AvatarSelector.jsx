import { useState } from 'react';
import { motion } from 'framer-motion';

const AVATARS = {
  boys: [
    { id: 'boy_1', path: '/assets/images/Avatar/Boy_avatar_1.png', name: 'Boy 1' },
    { id: 'boy_2', path: '/assets/images/Avatar/Boy_avatar_2.png', name: 'Boy 2' },
    { id: 'boy_3', path: '/assets/images/Avatar/Boy_avatar_3.png', name: 'Boy 3' },
    { id: 'boy_4', path: '/assets/images/Avatar/Boy_avatar_4.png', name: 'Boy 4' },
  ],
  girls: [
    { id: 'girl_1', path: '/assets/images/Avatar/Girl_avatar_1.png', name: 'Girl 1' },
    { id: 'girl_2', path: '/assets/images/Avatar/Girl_avatar_2.png', name: 'Girl 2' },
    { id: 'girl_3', path: '/assets/images/Avatar/Girl_avatar_3.png', name: 'Girl 3' },
    { id: 'girl_4', path: '/assets/images/Avatar/Girl_avatar_4.png', name: 'Girl 4' },
  ],
};

export default function AvatarSelector({ selectedAvatar, onSelect, className = '' }) {
  const [category, setCategory] = useState('boys');

  // If no avatar selected, default to first boy avatar
  const defaultAvatar = selectedAvatar || AVATARS.boys[0].path;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Choose Your Avatar
      </label>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setCategory('boys')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            category === 'boys'
              ? 'bg-neon-cyan text-dark-bg'
              : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-neon-cyan/50'
          }`}
        >
          Boys
        </button>
        <button
          type="button"
          onClick={() => setCategory('girls')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            category === 'girls'
              ? 'bg-neon-pink text-dark-bg'
              : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-neon-pink/50'
          }`}
        >
          Girls
        </button>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-4 gap-3">
        {AVATARS[category].map((avatar, index) => {
          const isSelected = selectedAvatar === avatar.path;
          return (
            <motion.button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.path)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-neon-cyan shadow-lg shadow-neon-cyan/30 scale-105'
                  : 'border-dark-border hover:border-neon-cyan/50'
              }`}
            >
              <img
                src={avatar.path}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-neon-cyan/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center">
                    <span className="text-dark-bg font-bold text-sm">✓</span>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Avatar Preview */}
      {selectedAvatar && (
        <div className="mt-4 p-3 bg-dark-bg border border-dark-border rounded-lg text-center">
          <p className="text-xs text-gray-400 mb-2">Selected Avatar</p>
          <img
            src={selectedAvatar}
            alt="Selected"
            className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-neon-cyan"
          />
        </div>
      )}
    </div>
  );
}

