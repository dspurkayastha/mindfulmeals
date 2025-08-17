import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '@/hooks/api/useAuth';
import { SunsetHeader } from '@/components';
import { STORAGE_KEYS } from '@/config/constants';
import { showToast } from '@/utils/toast';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { mutate: login, isLoading } = useLogin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!email || !password || (isSignUp && !name)) {
      showToast({
        type: 'error',
        title: 'Please fill all fields',
        message: isSignUp ? 'Name, email and password are required' : 'Email and password are required',
      });
      return;
    }

    if (isSignUp) {
      // For MVP, we'll simulate signup
      showToast({
        type: 'info',
        title: 'Coming soon!',
        message: 'Sign up will be available in the next update',
      });
      return;
    }

    // For MVP, mock login
    if (email === 'demo@mindfulmeals.com' && password === 'demo123') {
      // Mark onboarding as complete
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
      
      // Mock successful login
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock-token');
      
      showToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'Let\'s continue your mindful journey',
      });
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as never }],
      });
    } else {
      showToast({
        type: 'error',
        title: 'Invalid credentials',
        message: 'Try demo@mindfulmeals.com / demo123',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SunsetHeader 
          title="MindfulMeals" 
          subtitle={isSignUp ? "Begin your mindful journey" : "Welcome back"} 
        />
        
        <View style={styles.formContainer}>
          {isSignUp && (
            <TextInput
              label="Your Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              placeholder="How should we address you?"
              autoCapitalize="words"
            />
          )}
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              isSignUp ? 'Create Account' : 'Login'
            )}
          </Button>
          
          <View style={styles.switchMode}>
            <Text variant="bodyMedium">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <Button
              mode="text"
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.switchButton}
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </Button>
          </View>
          
          {!isSignUp && (
            <View style={styles.demoInfo}>
              <Text variant="bodySmall" style={styles.demoText}>
                Demo credentials:
              </Text>
              <Text variant="bodySmall" style={styles.demoCredentials}>
                demo@mindfulmeals.com / demo123
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            By continuing, you agree to practice mindful eating
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    padding: 24,
    marginTop: 20,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  switchMode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchButton: {
    marginLeft: 4,
  },
  demoInfo: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    alignItems: 'center',
  },
  demoText: {
    opacity: 0.7,
    marginBottom: 4,
  },
  demoCredentials: {
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default LoginScreen;