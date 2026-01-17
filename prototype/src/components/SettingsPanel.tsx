import React, { useState } from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/useTheme';

export const SettingsPanel: React.FC = () => {
  const { themePreference, setThemePreference } = useTheme();
  const [businessDescription, setBusinessDescription] = useState('');
  const [toneExamples, setToneExamples] = useState('');
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState('');
  const [emojiThreshold, setEmojiThreshold] = useState(4);
  const [cadenceIntervalDays, setCadenceIntervalDays] = useState('3');
  const [cadenceMaxAttempts, setCadenceMaxAttempts] = useState('3');

  const themeOptions = [
    { label: 'Light', value: 'light' as const, icon: Sun },
    { label: 'Dark', value: 'dark' as const, icon: Moon },
    { label: 'Auto', value: 'system' as const, icon: Monitor },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Appearance Setting */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-lg font-semibold text-primary mb-1">Appearance</h3>
          <p className="text-sm text-secondary">Choose light, dark, or follow your system preference.</p>
        </div>
        <div className="border border-[#eeeeee] dark:border-[#38383A] rounded-lg overflow-hidden">
          {themeOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setThemePreference(option.value)}
                className={[
                  'w-full flex items-center justify-between px-4 py-3 text-left',
                  'bg-white dark:bg-[#2E2E2E]',
                  'hover:bg-[#f0f0f0] dark:hover:bg-[#333333] transition-colors',
                  index !== themeOptions.length - 1 ? 'border-b border-[#eeeeee] dark:border-[#38383A]' : ''
                ].join(' ')}
              >
                <span className="flex items-center gap-3 text-sm text-primary">
                  <Icon className="w-5 h-5" />
                  {option.label}
                </span>
                {themePreference === option.value ? (
                  <Check className="w-5 h-5 text-[#987e55]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Owner Settings */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="px-1">
            <h4 className="text-base font-semibold text-primary">Business Description</h4>
            <p className="text-sm text-secondary">1–2 sentence summary of what you do and who you serve.</p>
          </div>
          <div className="border border-[#eeeeee] dark:border-[#38383A] rounded-lg bg-white dark:bg-[#2E2E2E] p-4 space-y-3">
            <textarea
              className="input-field w-full min-h-[96px]"
              placeholder="e.g. I run a mobile dog-grooming service in North Austin."
              value={businessDescription}
              onChange={(event) => setBusinessDescription(event.target.value)}
            />
            <div className="flex justify-end">
              <button type="button" className="btn-secondary text-sm">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="px-1">
            <h4 className="text-base font-semibold text-primary">Tone Examples</h4>
            <p className="text-sm text-secondary">Optional sample sentences to match your voice.</p>
          </div>
          <div className="border border-[#eeeeee] dark:border-[#38383A] rounded-lg bg-white dark:bg-[#2E2E2E] p-4 space-y-3">
            <textarea
              className="input-field w-full min-h-[96px]"
              placeholder="Add a few sentences you might say to a customer."
              value={toneExamples}
              onChange={(event) => setToneExamples(event.target.value)}
            />
            <div className="flex justify-end">
              <button type="button" className="btn-secondary text-sm">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="px-1">
            <h4 className="text-base font-semibold text-primary">Google My Business URL</h4>
            <p className="text-sm text-secondary">Included automatically in review requests.</p>
          </div>
          <div className="border border-[#eeeeee] dark:border-[#38383A] rounded-lg bg-white dark:bg-[#2E2E2E] p-4 space-y-3">
            <input
              className="input-field w-full"
              type="url"
              placeholder="https://g.page/your-business/review"
              value={googleBusinessUrl}
              onChange={(event) => setGoogleBusinessUrl(event.target.value)}
            />
            <div className="flex justify-end">
              <button type="button" className="btn-secondary text-sm">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="px-1">
            <h4 className="text-base font-semibold text-primary">Emoji Threshold</h4>
            <p className="text-sm text-secondary">Which rating counts as positive (default 4/5).</p>
          </div>
          <div className="border border-[#eeeeee] dark:border-[#38383A] rounded-lg bg-white dark:bg-[#2E2E2E] p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEmojiThreshold(value)}
                  aria-pressed={emojiThreshold === value}
                  className={[
                    'w-11 h-11 rounded-lg border text-sm font-semibold transition-colors',
                    emojiThreshold === value
                      ? 'bg-[#987e55] border-[#987e55] text-white'
                      : 'bg-white dark:bg-[#2E2E2E] border-[#dddddd] dark:border-[#38383A] text-primary hover:bg-[#f5f5f5] dark:hover:bg-[#333333]'
                  ].join(' ')}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button type="button" className="btn-secondary text-sm">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="px-1">
            <h4 className="text-base font-semibold text-primary">Cadence Controls</h4>
            <p className="text-sm text-secondary">Set follow-up intervals and max attempts.</p>
          </div>
          <div className="border border-[#eeeeee] dark:border-[#38383A] rounded-lg bg-white dark:bg-[#2E2E2E] p-4 space-y-3">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm font-semibold text-primary">Days between follow-ups</span>
                <input
                  className="input-field w-full"
                  type="number"
                  min={1}
                  value={cadenceIntervalDays}
                  onChange={(event) => setCadenceIntervalDays(event.target.value)}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-primary">Max attempts</span>
                <input
                  className="input-field w-full"
                  type="number"
                  min={1}
                  value={cadenceMaxAttempts}
                  onChange={(event) => setCadenceMaxAttempts(event.target.value)}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button type="button" className="btn-secondary text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
