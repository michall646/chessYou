import { View, Text } from 'react-native'
import React from 'react'
import ArrowView from './ArrowView'
import { useTheme } from 'react-native-paper'
import { memo } from 'react'

const NoteOverlay = ({arrowsList, mode}) => {
    if(!mode) return <></>
    const theme = useTheme();
    const mapArrows = (item, index) => {
        return( <ArrowView
        from={{ x: item.from.x, y: item.from.y }}
        to={{ x: item.to.x, y: item.to.y }}
        color={theme.colors.primary}
        width={10}
        />)
    }
    console.log(arrowsList)
    const arrows = arrowsList.map(mapArrows)
  return (
    [arrows]
  )
}

export default memo(NoteOverlay)