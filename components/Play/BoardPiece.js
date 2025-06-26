import { memo, useEffect } from "react";
import { Pressable } from "react-native";
import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import Animated from "react-native-reanimated";
import { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated";
import { useSettings } from "../utils/SettingsContext";

const BoardPiece = (props) => {
    const theme = useTheme();
    const progress = useSharedValue(1);
    const scale = useSharedValue(1);
    const {settings} = useSettings()

    let background = 'white';
    let textColor;
    if(!theme.dark){
        
        textColor =  props.black? theme.colors.surface : theme.colors.onSurface;
    }
    else{
        textColor =  props.black? theme.colors.onSurface : theme.colors.surface;
    }

    const isHighlighted = props.state === "moveTo";

    const animatedStyle = useAnimatedStyle(() => {
        let normalColor, highlightedColor;
        if(!theme.dark){
            normalColor = props.black? theme.colors.onSurface : theme.colors.surface;
            highlightedColor = theme.colors.secondary;
        }
        else{
            normalColor = props.black?  theme.colors.surface : theme.colors.onSurface;
            highlightedColor = theme.colors.onSecondary;
        }
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1], // Input range: 0 (not highlighted) to 1 (highlighted)
            [normalColor, highlightedColor] // Output colors
        );
        
        
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: backgroundColor, // Change color based on highlight
      zIndex: isHighlighted ? 10 : 1
    };
    });

     useEffect(() => {
    'worklet';
    const animationConfig = { duration: settings.boardAnimations ? 200 : 0 }; // Duration is 0 if animations are off
    const fadeConfig = { duration: settings.boardAnimations ? 500 : 0 }; // Duration is 0 if animations are off
    if (isHighlighted) {
      // Animate progress to 1 when highlighted
      progress.value = withTiming(1, animationConfig); // Quick highlight
      scale.value = withTiming(1.05, animationConfig);
    } else {
      // Animate progress back to 0 when unhighlighted, triggering the color blend
      progress.value = withTiming(0, fadeConfig); // Blend back over 500ms
      scale.value = withTiming(1, fadeConfig);
    }
  }, [isHighlighted, progress, scale]);
    return (
        <>
        <Animated.View style={[{width: props.size, height: props.size, backgroundColor: background, borderRadius: props.size/ 10}, animatedStyle]}>
            <Pressable style={{ width: props.size, height: props.size, position: 'absolute', padding: props.size/ 20}} onPress={() => props.select(props.index)}>
                <Text style={{color: textColor}}>{props.indexText}</Text>
            </Pressable>
        </Animated.View>
        </>
    );
}
export default memo(BoardPiece);