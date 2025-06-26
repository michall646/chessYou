import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
const Evalbar = (props) => {

    const {height, width} = Dimensions.get('window');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height/2 - props.height.value,
      backgroundColor: 'black',
      width: 20,
    };
  });


  return (
    <View style={{zIndex: 50, backgroundColor: 'blue', height: '100%', width: 20}}>
      <Animated.View  style={[{zIndex: 100},animatedStyle]} />
    </View>
  );
}
export default Evalbar