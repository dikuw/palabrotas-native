import React, { useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export const Spinner = ({ size = 20 }) => {
  const theme = useThemeStore(state => state.theme);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const styles = {
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spinnerOuter: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    spinner: {
      position: 'absolute',
      width: size * 0.15,
      height: size * 0.15,
      backgroundColor: themes[theme].colors.primary,
      borderRadius: (size * 0.15) / 2,
      top: 0,
      left: '50%',
      marginLeft: -(size * 0.15) / 2,
    },
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.spinnerOuter,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <View style={styles.spinner} />
      </Animated.View>
    </View>
  );
};

export default Spinner;
