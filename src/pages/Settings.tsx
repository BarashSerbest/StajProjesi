import { useState, useEffect } from 'react';
import SettingsForm from '../components/Settings/SettingsForm';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Settings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const settingsData = await apiService.getSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error('Ayarlar getirilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingsUpdate = async (updatedSettings: any) => {
    try {
      await apiService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Ayarlar güncellenirken hata:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('settings.subtitle')}
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('settings.subtitle')}
        </p>
      </div>
      
      {settings && <SettingsForm initialSettings={settings} onUpdate={handleSettingsUpdate} />}
    </div>
  );
}