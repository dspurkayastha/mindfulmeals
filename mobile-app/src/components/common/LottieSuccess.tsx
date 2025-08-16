import React from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

interface LottieSuccessProps {
  autoPlay?: boolean;
  loop?: boolean;
}

const LottieSuccess: React.FC<LottieSuccessProps> = ({ autoPlay = true, loop = false }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/lottie/success.json')}
        autoPlay={autoPlay}
        loop={loop}
        style={{ width: 120, height: 120 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
});

export default LottieSuccess;