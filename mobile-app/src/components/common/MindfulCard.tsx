import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

interface MindfulCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  style?: ViewStyle;
}

const MindfulCard: React.FC<MindfulCardProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 20,
      padding: 20,
      backgroundColor: '#F5F5DC', // Warm Gray
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor: '#8B4513',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 8,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 2,
          borderColor: '#D2B48C', // Soft Taupe
          backgroundColor: 'transparent',
        };
      default:
        return {
          ...baseStyle,
          shadowColor: '#8B4513',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
    }
  };

  if (variant === 'outlined') {
    return (
      <View style={[getCardStyle(), style]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      <LinearGradient
        colors={['#F5F5DC', '#FFF8DC']} // Warm Gray to Soft Cream
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 20,
        }}
      />
      {children}
    </View>
  );
};

export default MindfulCard;
