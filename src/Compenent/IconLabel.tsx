import { HStack, Text } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'

interface Props {
    h?: string | number | undefined
    w?: string | number | undefined
    borderColor?: string | undefined
    borderRadius?: string | undefined
    icon?: React.ReactNode
    text: string
    text_color?: string | undefined
    onPress?: () => void | undefined
}
export default function IconLabel({ borderColor, borderRadius, icon, text, text_color, w, h, onPress }: Props) {
    if (undefined !== onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                <HStack
                    w={w}
                    h={h}
                    justifyContent={'center'}
                    alignItems={'center'}
                    space={2}
                >
                    {icon}
                    <Text color={text_color}>{text}</Text>
                </HStack>
            </TouchableOpacity>
        )
    } else {
        return (
            <HStack
                w={w}
                h={h}
                justifyContent={'center'}
                alignItems={'center'}
                space={2}
                borderWidth={'1'}
                borderRadius={borderRadius}
                borderColor={borderColor}
            >
                {icon}
                <Text color={text_color}>{text}</Text>
            </HStack>
        )
    }
}
