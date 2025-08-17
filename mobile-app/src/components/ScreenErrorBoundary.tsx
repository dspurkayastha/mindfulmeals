import React, { Component, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
} from 'react-native-paper';
import { hapticFeedback } from '../utils/haptic';
import { announceForAccessibility } from '../utils/accessibility';

interface Props {
  children: ReactNode;
  screenName: string;
  onRetry?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  retryCount: number;
}

class ScreenErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`Error in ${this.props.screenName}:`, error, errorInfo);
    hapticFeedback.error();
    announceForAccessibility('An error occurred. Recovery options available.');
  }

  handleRetry = () => {
    hapticFeedback.buttonPress();
    this.setState(prevState => ({
      hasError: false,
      retryCount: prevState.retryCount + 1,
    }));
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <SafeAreaView style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>
                Oops! Let's try that again
              </Title>
              
              <Text style={styles.message}>
                {this.props.screenName} encountered a temporary issue.
              </Text>

              {this.state.retryCount > 0 && (
                <Text style={styles.retryText}>
                  Retry attempt: {this.state.retryCount}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={this.handleRetry}
                style={styles.button}
                icon="refresh"
                accessible={true}
                accessibilityLabel="Retry"
                accessibilityHint="Double tap to retry loading this screen"
              >
                Try Again
              </Button>
            </Card.Content>
          </Card>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#2e7d32',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
  },
  retryText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    color: '#999',
  },
  button: {
    borderRadius: 24,
  },
});

export default ScreenErrorBoundary;