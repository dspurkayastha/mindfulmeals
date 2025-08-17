import React, { Component, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  useTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { hapticFeedback } from '../utils/haptic';

interface Props {
  children: ReactNode;
  onRecovery?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  recoveryAttempts: number;
}

class MindfulErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
      recoveryAttempts: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to error reporting service
    console.error('Error caught by MindfulErrorBoundary:', error, errorInfo);
    
    // Haptic feedback for error
    hapticFeedback.error();
    
    this.setState({
      errorInfo,
    });
  }

  handleRecovery = () => {
    // Haptic feedback for recovery attempt
    hapticFeedback.buttonPress();
    
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: prevState.recoveryAttempts + 1,
    }));
    
    // Call external recovery handler if provided
    if (this.props.onRecovery) {
      this.props.onRecovery();
    }
  };

  handleBreathingExercise = () => {
    // Navigate to breathing exercise
    // This would need to be connected to navigation
    hapticFeedback.breathingStart();
  };

  render() {
    if (this.state.hasError) {
      return (
        <PaperProvider>
          <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Card style={styles.card}>
                <Card.Content>
                  {/* Calming animation */}
                  <View style={styles.animationContainer}>
                    <LottieView
                      source={require('../assets/animations/calm-waves.json')}
                      autoPlay
                      loop
                      style={styles.animation}
                    />
                  </View>

                  <Title style={styles.title}>
                    Let's Take a Mindful Moment
                  </Title>

                  <Text style={styles.message}>
                    Something unexpected happened, but that's okay. Let's take a breath and try again.
                  </Text>

                  {this.state.recoveryAttempts > 0 && (
                    <Text style={styles.retryMessage}>
                      Recovery attempt {this.state.recoveryAttempts}
                    </Text>
                  )}

                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      onPress={this.handleRecovery}
                      style={styles.button}
                      icon="refresh"
                    >
                      Try Again Mindfully
                    </Button>

                    <Button
                      mode="outlined"
                      onPress={this.handleBreathingExercise}
                      style={styles.button}
                      icon="meditation"
                    >
                      Breathing Exercise
                    </Button>
                  </View>

                  {__DEV__ && (
                    <TouchableOpacity
                      style={styles.debugContainer}
                      onPress={() => console.log(this.state.error, this.state.errorInfo)}
                    >
                      <Text style={styles.debugText}>
                        {this.state.error?.message || 'Unknown error'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </Card.Content>
              </Card>

              {/* Mindful tips */}
              <Card style={[styles.card, styles.tipsCard]}>
                <Card.Content>
                  <Text style={styles.tipsTitle}>While we recover...</Text>
                  <Text style={styles.tip}>• Take 3 deep breaths</Text>
                  <Text style={styles.tip}>• Notice 5 things around you</Text>
                  <Text style={styles.tip}>• Remember: Technology hiccups are temporary</Text>
                </Card.Content>
              </Card>
            </ScrollView>
          </SafeAreaView>
        </PaperProvider>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    marginBottom: 16,
  },
  animationContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    color: '#2e7d32',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    color: '#666',
  },
  retryMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#999',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 24,
  },
  debugContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  tipsCard: {
    backgroundColor: '#e8f5e9',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2e7d32',
  },
  tip: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4caf50',
  },
});

export default MindfulErrorBoundary;