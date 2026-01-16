import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/useTheme';

export const SettingsPanel: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Theme Setting */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">Dark Mode</h3>
            <p className="text-sm text-secondary">
              {isDark ? 'Currently using dark mode' : 'Currently using light mode'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 bg-[#987e55] hover:bg-[#6B5D47] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {isDark ? (
              <>
                <Sun className="w-5 h-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">About Rave</h3>
        <p className="text-sm text-secondary mb-3">
          Rave is a streamlined request management dashboard designed to help you track and manage reviews and referrals with minimal clutter.
        </p>
        <div className="space-y-2 text-sm text-secondary">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Last Updated:</strong> January 2025</p>
        </div>
      </div>

      {/* Help Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Getting Started</h3>
        <ul className="space-y-3 text-sm text-secondary">
          <li className="flex gap-3">
            <span className="font-semibold text-primary">1.</span>
            <span>Use the <strong>Reviews</strong> tab to track all review requests</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">2.</span>
            <span>Use the <strong>Referrals</strong> tab to track all referral requests</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">3.</span>
            <span>Click on any request to view details</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-primary">4.</span>
            <span>Use the archive icon to remove requests from your active list</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
