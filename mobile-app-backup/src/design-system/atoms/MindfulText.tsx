import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { typography, colors } from '../index';

interface MindfulTextProps extends TextProps {
  variant?: keyof typeof typography;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

export const MindfulText: React.FC<MindfulTextProps> = ({
  variant = 'bodyMedium',
  color = colors.textPrimary,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const textStyle = [
    typography[variant] || typography.bodyMedium,
    { color, textAlign: align },
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

// Convenience components for common text types
export const Heading1: React.FC<Omit<MindfulTextProps, 'variant'>> = (props) => (
  <MindfulText variant="h1" color={colors.textPrimary} {...props} />
);

export const Heading2: React.FC<Omit<MindfulTextProps, 'variant'>> = (props) => (
  <MindfulText variant="h2" color={colors.textPrimary} {...props} />
);

export const Heading3: React.FC<Omit<MindfulTextProps, 'variant'>> = (props) => (
  <MindfulText variant="h3" color={colors.textPrimary} {...props} />
);

export const Body: React.FC<Omit<MindfulTextProps, 'variant'>> = (props) => (
  <MindfulText variant="bodyMedium" color={colors.textSecondary} {...props} />
);

export const Caption: React.FC<Omit<MindfulTextProps, 'variant'>> = (props) => (
  <MindfulText variant="caption" color={colors.textTertiary} {...props} />
);

export const Quote: React.FC<Omit<MindfulTextProps, 'variant'>> = (props) => (
  <MindfulText variant="quote" color={colors.sage} align="center" {...props} />
);

export const GratitudeText: React.FC<Omit<MindfulTextProps, 'variant'>> = (props) => (
  <MindfulText variant="gratitude" color={colors.warmPeach} align="center" {...props} />
);

export default MindfulText;