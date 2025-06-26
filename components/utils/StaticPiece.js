import { Pressable, Text, View } from "react-native"
import { Icon, useTheme } from "react-native-paper"
import Animated from "react-native-reanimated"
import { useAnimatedStyle } from "react-native-reanimated"
import { SvgUri } from "react-native-svg"
import PieceSvg from "../Play/Pieces/PieceSVG"
import { memo } from "react"
const StaticPiece = (props) => {
    //console.log(props.x.value, props.y.value)
    if(!props.exists) return <></>

      const theme = useTheme();
      console.log(props.selected)
      const bg= props.isAttacked ? theme.colors.secondary : props.selected? theme.colors.primary: 'transparent';
      const color = props.color === "w" ? theme.colors.primaryContainer : theme.colors.onSecondaryContainer;
      const stroke =props.color === "w" ?  theme.colors.onSecondaryContainer : theme.colors.primaryContainer;
      const size = props.size;
      const iconSize = props.size * 0.8;
      const borderWidth = props.size * 0.1;
      

    return (<View style={[{borderColor: bg, borderWidth: borderWidth, borderRadius: 5, width: size, height: size, position: 'absolute', zIndex: 2, margin: 0, top: props.y, left: props.x}]}>
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
            </View>)
}
export default memo(StaticPiece)