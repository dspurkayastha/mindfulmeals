import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  ActivityIndicator,
  IconButton,
  HelperText,
  Checkbox,
  Card,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SunsetHeader } from '../../components';
import { STORAGE_KEYS } from '../../config/constants';
import { showToast } from '../../utils/toast';
import { useTranslation } from '../../hooks/useTranslation';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  wantsNewsletter: boolean;
}

const SignupScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    wantsNewsletter: true,
  });
  
  const [errors, setErrors] = useState<Partial<SignupForm>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupForm> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(form.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!form.acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the terms to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof SignupForm, value: any) => {
    setForm({ ...form, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast({
        message: 'Please fix the errors before continuing',
        preset: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would call the signup API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For MVP, save user data locally
      const userData = {
        name: form.name,
        email: form.email,
        createdAt: new Date().toISOString(),
        preferences: {
          newsletter: form.wantsNewsletter,
        },
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock-token');
      
      showToast({
        message: `Welcome ${form.name}! Let's start your mindful journey`,
        preset: 'success',
      });
      
      // Navigate to onboarding
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' as never }],
      });
    } catch (error) {
      showToast({
        message: 'Failed to create account. Please try again.',
        preset: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SunsetHeader
            title="Join MindfulMeals"
            subtitle="Begin your journey to mindful eating"
          />
          
          <Card style={styles.formCard}>
            <Card.Content>
              <TextInput
                label="Full Name *"
                value={form.name}
                onChangeText={(text) => updateField('name', text)}
                mode="outlined"
                placeholder="How should we address you?"
                autoCapitalize="words"
                error={!!errors.name}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
              
              <TextInput
                label="Email *"
                value={form.email}
                onChangeText={(text) => updateField('email', text)}
                mode="outlined"
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={!!errors.email}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
              
              <TextInput
                label="Password *"
                value={form.password}
                onChangeText={(text) => updateField('password', text)}
                mode="outlined"
                placeholder="At least 6 characters"
                secureTextEntry={!showPassword}
                error={!!errors.password}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
              
              <TextInput
                label="Confirm Password *"
                value={form.confirmPassword}
                onChangeText={(text) => updateField('confirmPassword', text)}
                mode="outlined"
                placeholder="Re-enter your password"
                secureTextEntry={!showConfirmPassword}
                error={!!errors.confirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>
              
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={form.acceptedTerms ? 'checked' : 'unchecked'}
                  onPress={() => updateField('acceptedTerms', !form.acceptedTerms)}
                  color={theme.colors.primary}
                />
                <TouchableOpacity
                  onPress={() => updateField('acceptedTerms', !form.acceptedTerms)}
                  style={styles.checkboxLabel}
                >
                  <Text>
                    I accept the{' '}
                    <Text style={styles.link}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.link}>Privacy Policy</Text> *
                  </Text>
                </TouchableOpacity>
              </View>
              <HelperText type="error" visible={!!errors.acceptedTerms}>
                {errors.acceptedTerms}
              </HelperText>
              
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={form.wantsNewsletter ? 'checked' : 'unchecked'}
                  onPress={() => updateField('wantsNewsletter', !form.wantsNewsletter)}
                  color={theme.colors.primary}
                />
                <TouchableOpacity
                  onPress={() => updateField('wantsNewsletter', !form.wantsNewsletter)}
                  style={styles.checkboxLabel}
                >
                  <Text>Send me mindful eating tips and recipes</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.passwordTips}>
            <Text style={styles.tipsTitle}>Password Requirements:</Text>
            <Text style={styles.tipItem}>• At least 6 characters long</Text>
            <Text style={styles.tipItem}>• Mix of letters and numbers recommended</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            Create Account
          </Button>
          
          <View style={styles.switchMode}>
            <Text variant="bodyMedium">
              Already have an account?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login' as never)}
              style={styles.switchButton}
            >
              Login
            </Button>
          </View>
          
          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              By signing up, you're committing to a journey of{'\n'}
              mindful eating and self-discovery
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formCard: {
    margin: 20,
    marginTop: -20,
    borderRadius: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
  link: {
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
  passwordTips: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1565C0',
  },
  tipItem: {
    fontSize: 12,
    color: '#1976D2',
    marginVertical: 2,
  },
  submitButton: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  switchMode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  switchButton: {
    marginLeft: 4,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SignupScreen;