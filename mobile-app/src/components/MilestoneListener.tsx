import React, { useEffect, useState } from 'react';
import { Portal } from 'react-native-paper';
import MilestoneService from '../services/MilestoneService';
import MicroCelebration, { CelebrationMilestone } from './mindfulness/MicroCelebration';

const MilestoneListener: React.FC = () => {
  const [currentMilestone, setCurrentMilestone] = useState<CelebrationMilestone | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Subscribe to milestone events
    const unsubscribe = MilestoneService.getInstance().subscribe((milestone) => {
      setCurrentMilestone(milestone);
      setIsVisible(true);
    });

    return unsubscribe;
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Clear milestone after animation
    setTimeout(() => {
      setCurrentMilestone(null);
    }, 300);
  };

  if (!currentMilestone) return null;

  return (
    <Portal>
      <MicroCelebration
        visible={isVisible}
        milestone={currentMilestone}
        onDismiss={handleDismiss}
      />
    </Portal>
  );
};

export default MilestoneListener;