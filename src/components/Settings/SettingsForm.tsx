import { useState } from 'react';
import { Settings, Mail, Webhook } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SettingsData {
  emailAlerts: boolean;
  slackWebhook: string;
  notifications: {
    highSeverity: boolean;
    mediumSeverity: boolean;
    lowSeverity: boolean;
  };
}

interface SettingsFormProps {
  initialSettings: SettingsData;
  onUpdate: (settings: SettingsData) => Promise<void>;
}

export default function SettingsForm({ initialSettings, onUpdate }: SettingsFormProps) {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SettingsData>(initialSettings);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdate(settings);
      alert(t('settings.saved'));
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          {t('settings.general')}
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('settings.emailAlerts')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('settings.emailAlertsDesc')}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Webhook className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                {t('settings.slackWebhook')}
              </label>
            </div>
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={settings.slackWebhook}
              onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {t('settings.notificationPrefs')}
        </h2>
        
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([severity, enabled]) => (
            <div key={severity} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {t(`settings.${severity}`)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(`settings.${severity}Desc`)}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [severity]: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSaving ? t('settings.saving') : t('settings.save')}
        </button>
      </div>
    </div>
  );
}