import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, borderRadius, spacing, typography } from '../../utils/theme';

interface SunsetHeaderProps {
  title: string;
  subtitle?: string;
}

const SunsetHeader: React.FC<SunsetHeaderProps> = ({ title, subtitle }) => {
  return (
    <LinearGradient
      colors={gradients.sunset}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textInverse,
  },
  subtitle: {
    ...typography.body,
    color: colors.textInverse,
    opacity: 0.9,
    marginTop: 4,
  },
});

export default SunsetHeader;