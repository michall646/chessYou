import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Dialog, Modal, Portal, Text, Button} from "react-native-paper"
import { memo } from "react";

const GameOverModal = (props) => {
    const gameResult = props.gameResult;
    const {t} = useTranslation();
    let mainText = "";
    let disc = "";
    if(gameResult.color === 'w'){
        mainText = t("blackWon");
    }
    else if(gameResult.color === 'b'){
        mainText = t("whiteWon");
    }
    else{
        mainText = t("draw");
    }
    if(gameResult.result === "mate"){
        disc = t("byCheckmate");
    }
    if(gameResult.result === "materialDraw"){
        disc = t("byMaterial");
    }
    if(gameResult.result === "stalemate"){
        disc = t("byStalemate");
    }
    if(gameResult.result === "resign"){
        disc = t("byResign");
    }
    if(gameResult.result === "time"){
        disc = t("byTime");
    }
    return (
        <>
        <Portal>
            <Dialog visible={props.visible}>
            <Dialog.Title>{mainText}</Dialog.Title>
            <Dialog.Content>
                <Text>{disc}</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => {router.back(); props.setVisible(false)}}>Exit</Button>
            </Dialog.Actions>
            </Dialog>
        </Portal>
        </>
    )
}
export default memo(GameOverModal)