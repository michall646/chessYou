import { memo, useEffect } from "react";
import { Pressable } from "react-native";
import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import Animated from "react-native-reanimated";
import { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated";
import { useSettings } from "../utils/SettingsContext";

const StaticSquare = (props) => {

    let background = props.backgroundColor;
    let textColor = props.textColor;

    if(props.state === "moveTo") background = props.highlightColor;

  return (
          <View style={{width: props.size, height: props.size, backgroundColor: background, borderRadius: props.size/ 10}}>
              <Pressable style={{ width: props.size, height: props.size, position: 'absolute', padding: props.size/ 20}} onPress={() => props.select(props.index)}>
                  <Text style={{color: textColor}}>{props.indexText}</Text>
              </Pressable>
          </View>
      );
}

export default memo(StaticSquare)