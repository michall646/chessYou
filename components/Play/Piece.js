import { Pressable, Text, View } from "react-native"
import { Icon, useTheme } from "react-native-paper"
import Animated from "react-native-reanimated"
import { useAnimatedStyle } from "react-native-reanimated"
import { SvgUri } from "react-native-svg"
import PieceSvg from "./Pieces/PieceSVG"
import { memo } from "react"
const Piece = (props) => {
    //console.log(props.x.value, props.y.value)
    if(!props.exists) return <></>

    const animatedStyle = useAnimatedStyle(() => {
        // This function runs on the UI thread
        return {
          // Read the .value property HERE
          transform: [
             { translateX: props.x.value },
             { translateY: props.y.value },
          ]
          // OR using top/left if you prefer (transform is often smoother):
          // left: props.x.value,
          // top: props.y.value,
        };
      })
      const theme = useTheme();
      const bg= props.isAttacked ? theme.colors.secondary : props.selected? theme.colors.primary: 'transparent';
      let color, stroke;
      if(!theme.dark){
        color = props.color === "w" ? theme.colors.primaryContainer : theme.colors.onSecondaryContainer;
        stroke =props.color === "w" ?  theme.colors.onSecondaryContainer : theme.colors.primaryContainer;
      }
      else{
        color = props.color === "w" ? theme.colors.onSecondaryContainer: theme.colors.primaryContainer;
        stroke =props.color === "w" ? theme.colors.primaryContainer : theme.colors.onSecondaryContainer ;
      }

      
      const size = props.size;
      const iconSize = props.size * 0.8;
      const borderWidth = props.size * 0.1;

      

    return (<Animated.View style={[{borderColor: bg, borderWidth: borderWidth, borderRadius: 5, width: size, height: size, position: 'absolute', zIndex: 2, margin: 0} ,animatedStyle]}>
                <Pressable style={{zIndex: 3, width: size, height: size, position: 'absolute'}} onPress={() => props.select(props.index)}>
                    
                    <PieceSvg 
                      width={iconSize}
                      height={iconSize}
                      fill={color}
                      stroke={stroke}
                      strokeWidth={4}
                      piece={props.piece.toUpperCase()}
                      style={{position: 'absolute', top: 0, left: 0,}}
                    />
                    <PieceSvg 
                      width={iconSize}
                      height={iconSize}
                      fill={color}
                      piece={props.piece.toUpperCase()}
                      style={{position: 'absolute', top: 0, left: 0,}}
                    />
                </Pressable>
            </Animated.View>)
}
export default memo(Piece)