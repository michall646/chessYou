import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */
const PieceSvg = (props) => {
    switch (props.piece) {
        case 'R':
            return (
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                    <Path d="M5 20h14v2H5v-2M17 2v3h-2V2h-2v3h-2V2H9v3H7V2H5v6h2v10h10V8h2V2h-2Z" />
                </Svg>)
        case 'P':
            return (
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                    <Path d="M19 22H5v-2h14v2m-3-4H8l2.18-8H8V8h2.72l.07-.26A2.97 2.97 0 0 1 9.25 6.2c-.67-1.52.02-3.29 1.54-3.95 1.52-.67 3.29.02 3.95 1.54a2.99 2.99 0 0 1-1.54 3.95l.07.26H16v2h-2.18L16 18Z" />
                </Svg>)
        case 'N':
            return (
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                    <Path d="M19 22H5v-2h14v2M13 2c-1.25 0-2.42.62-3.11 1.66L7 8l2 2 2.06-1.37c.44-.31 1.08-.19 1.39.27.02.03.05.06.05.1.3.59.19 1.3-.28 1.77l-4.8 4.8c-.55.56-.55 1.46.01 2.01.26.26.62.42.99.42H17V6a4 4 0 0 0-4-4Z" />
                </Svg>)
        case 'B':
            return (
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                    <Path d="M19 22H5v-2h14v2M17.16 8.26A8.94 8.94 0 0 1 19 13c0 2.76-3.13 5-7 5s-7-2.24-7-5c0-2.38 2.33-6.61 5.46-7.73-.3-.36-.46-.81-.46-1.27a2 2 0 0 1 2-2 2 2 0 0 1 2 2c0 .46-.16.91-.46 1.27.86.33 1.64.83 2.3 1.47l-4.55 4.55 1.42 1.42 4.45-4.45Z" />
                </Svg>)
        case 'K':
            return (
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                    <Path d="M19 22H5v-2h14v2m-2-12c-1.42 0-2.74.77-3.45 2H13V7h3V5h-3V2h-2v3H8v2h3v5h-.55C9.35 10.09 6.9 9.43 5 10.54A4.013 4.013 0 0 0 3.5 16c.74 1.24 2.07 2 3.5 2h10a4 4 0 0 0 4-4 4 4 0 0 0-4-4Z" />
                </Svg>)
        case 'Q':
            return (
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                    <Path d="M18 3a2 2 0 0 1 2 2c0 .81-.5 1.5-1.17 1.82L17 13.15V18H7v-4.85L5.17 6.82C4.5 6.5 4 5.81 4 5a2 2 0 0 1 2-2 2 2 0 0 1 2 2c0 .5-.18.95-.5 1.3l2.8 3.05.53-3.73C10.33 5.26 10 4.67 10 4a2 2 0 0 1 2-2 2 2 0 0 1 2 2c0 .67-.33 1.26-.83 1.62l.53 3.73 2.77-3.06A2 2 0 0 1 16 5a2 2 0 0 1 2-2M5 20h14v2H5v-2Z" />
                </Svg>)             
        default:
            break;
    }

  
}
export default PieceSvg