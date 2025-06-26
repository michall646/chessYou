import { Portal, Modal, Text, TouchableRipple, Dialog, useTheme } from "react-native-paper"
import PieceSvg from "./Pieces/PieceSVG"
import { View } from "react-native"
import { useTranslation } from "react-i18next"
const PromotionModal = (props) => {
    const {t} = useTranslation();
    const theme = useTheme();

    const stroke = theme.dark ? theme.colors.primaryContainer : theme.colors.onSecondaryContainer;
    const color = theme.dark? theme.colors.onSecondaryContainer : theme.colors.primaryContainer;

return(
    <Portal>
        <Dialog visible={props.visible} onDismiss={() => props.setVisible(!props.visible)} contentContainerStyle={{width: 100, height: 100}}>
        <Dialog.Title>{t("promotion")}</Dialog.Title>
        <Dialog.Content>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableRipple onPress={() => props.select(0)}>
                    <View style={{width: 40, height: 40, margin: 5}}>
                        <PieceSvg 
                        width={40}
                        height={40}
                        fill={color}
                        stroke={stroke}
                        strokeWidth={4}
                        piece={"R"}
                        style={{position: 'absolute', top: 0, left: 0,}}
                        />
                        <PieceSvg 
                        width={40}
                        height={40}
                        fill={color}
                        piece={"R"}
                        style={{position: 'absolute', top: 0, left: 0,}}
                        />
                    </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => props.select(1)}>
                <View style={{width: 40, height: 40, margin: 5}}>
                        <PieceSvg 
                        width={40}
                        height={40}
                        fill={color}
                        stroke={stroke}
                        strokeWidth={4}
                        piece={"N"}
                        style={{position: 'absolute', top: 0, left: 0,}}
                        />
                        <PieceSvg 
                        width={40}
                        height={40}
                        fill={color}
                        piece={"N"}
                        style={{position: 'absolute', top: 0, left: 0,}}
                        />
                    </View>
                </TouchableRipple>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableRipple onPress={() => props.select(2)}>
                    <View style={{width: 40, height: 40, margin: 5}}>
                        <PieceSvg 
                        width={40}
                        height={40}
                        fill={color}
                        stroke={stroke}
                        strokeWidth={4}
                        piece={"B"}
                        style={{position: 'absolute', top: 0, left: 0,}}
                        />
                        <PieceSvg 
                        width={40}
                        height={40}
                        fill={color}
                        piece={"B"}
                        style={{position: 'absolute', top: 0, left: 0,}}
                        />
                    </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => props.select(3)}>
                    <View style={{width: 40, height: 40, margin: 5}}>
                        <PieceSvg 
                        width={40}
                        height={40}
                        fill={color}
                        stroke={stroke}
                        strokeWidth={4}
                        piece={"Q"}
                        style={{position: 'absolute', top: 0, left: 0,}}
                        />
                        <PieceSvg 
                        width={40}
                        height={40}
                        fill={color}
                        piece={"Q"}
                        style={{position: 'absolute', top: 0, left: 0,}}
                        />
                    </View>
                </TouchableRipple>
            </View>
        </Dialog.Content>
            
        </Dialog>
    </Portal>
)

}
export default PromotionModal