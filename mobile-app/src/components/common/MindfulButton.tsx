import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors as palette } from '../../utils/theme';
import { hapticFeedback } from '../../utils/haptic';

interface MindfulButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const MindfulButton: React.FC<MindfulButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return [palette.terracotta, palette.goldenAmber];
      case 'secondary':
        return [palette.olive, palette.sage];
      case 'outline':
        return ['transparent', 'transparent'];
      default:
        return [palette.terracotta, palette.goldenAmber];
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: palette.mutedBrown,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    };

    switch (size) {
      case 'small':
        return { ...baseStyle, paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 };
      case 'large':
        return { ...baseStyle, paddingHorizontal: 32, paddingVertical: 16, minHeight: 56 };
      default:
        return { ...baseStyle, paddingHorizontal: 24, paddingVertical: 12, minHeight: 48 };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (size) {
      case 'small':
        return { ...baseStyle, fontSize: 14 };
      case 'large':
        return { ...baseStyle, fontSize: 18 };
      default:
        return { ...baseStyle, fontSize: 16 };
    }
  };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[
          getButtonStyle(),
          {
            borderWidth: 2,
            borderColor: palette.terracotta,
            backgroundColor: 'transparent',
          },
          style,
        ]}
        onPress={() => {
          hapticFeedback.buttonPress();
          onPress();
        }}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            getTextStyle(),
            { color: palette.terracotta },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={() => {
        hapticFeedback.buttonPress();
        onPress();
      }}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getButtonColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 16,
        }}
      />
      <Text
        style={[
          getTextStyle(),
          { color: palette.textInverse },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default MindfulButton;
