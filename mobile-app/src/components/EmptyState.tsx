import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  animation?: any; // Lottie animation JSON
  icon?: string; // Alternative to animation
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  animation,
  icon,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {animation ? (
        <LottieView
          source={animation}
          autoPlay
          loop
          style={styles.animation}
        />
      ) : icon ? (
        <Text style={[styles.icon, { color: theme.colors.primary }]}>
          {icon}
        </Text>
      ) : null}
      
      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>
      
      <Text 
        variant="bodyLarge" 
        style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
      >
        {message}
      </Text>
      
      {actionLabel && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
});