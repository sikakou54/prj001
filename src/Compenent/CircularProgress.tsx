import { Text, ZStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import Svg, { Circle } from 'react-native-svg'
import { COLOR } from '../Type'

const CircularProgress = ({ size = 100, progress = 0, isProgressShow = false }) => {
    const [radius, setRadius] = useState(0)
    const [circumference, setCircumference] = useState(0)

    useEffect(() => {
        const calculatedRadius = (size - 10) / 2 // 余白を考慮してサイズから10を引いて半径を計算
        const calculatedCircumference = calculatedRadius * 2 * Math.PI // 円周を計算
        setRadius(calculatedRadius)
        setCircumference(calculatedCircumference)
    }, [size])

    const progressStrokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <ZStack w={size} h={size} alignItems={'center'} justifyContent={'center'}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#ccc"
                    strokeWidth="10"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={COLOR.LIGHT_GREEN}
                    strokeWidth="10"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={progressStrokeDashoffset}
                    strokeLinecap="round"
                />
            </Svg>
            <Text fontSize={'md'} fontWeight={'bold'}>{Math.floor(progress)}%</Text>
        </ZStack>
    )
}

export default CircularProgress
