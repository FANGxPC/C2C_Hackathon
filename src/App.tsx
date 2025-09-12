import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AIStudyAssistant } from './components/AIStudyAssistant';
import { ResumePlacement } from './components/ResumePlacement';
import { StudyMaterials } from './components/StudyMaterials';
import { Networking } from './components/Networking';
import { StudyGroups } from './components/StudyGroups';
import { LearningTracker } from './components/LearningTracker';
import { Profile } from './components/Profile';

// Theme mapping for each screen
const SCREEN_THEMES = {
  'dashboard': 'theme-dashboard',
  'ai-assistant': 'theme-ai-assistant',
  'placement-prep': 'theme-placement-prep',
  'study-materials': 'theme-study-materials',
  'networking': 'theme-networking',
  'study-groups': 'theme-study-groups',
  'learning-tracker': 'theme-learning-tracker',
  'profile': 'theme-profile'
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  // Update theme class on body when screen changes
  useEffect(() => {
    const themeClass = SCREEN_THEMES[activeScreen];
    // Remove all theme classes
    document.body.classList.remove(...Object.values(SCREEN_THEMES));
    // Add current theme class
    if (themeClass) {
      document.body.classList.add(themeClass);
    }
  }, [activeScreen]);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'ai-assistant':
        return <AIStudyAssistant />;
      case 'placement-prep':
        return <ResumePlacement />;
      case 'study-materials':
        return <StudyMaterials />;
      case 'networking':
        return <Networking />;
      case 'study-groups':
        return <StudyGroups />;
      case 'learning-tracker':
        return <LearningTracker />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full overflow-auto"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}