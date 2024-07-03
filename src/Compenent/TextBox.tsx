import { Box, HStack, Text, useColorModeValue } from 'native-base'
import React from 'react'
import Card from './Card'
import { COLOR } from '../Type'

interface Props {
    key?: any,
    onPress?: () => void,
    text: string,
    rightIcon?: React.ReactNode,
    leftIcon?: React.ReactNode,
    numberOfLines?: number,
    fontSize?: string | number,
    h?: string | number,
    rounded?: string,
    roundedBottom?: string,
    roundedTop?: string,
}
export default function TextBox(props: Props) {
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)

    return (
        <Card
            key={props.key}
            onPress={props.onPress}
            bg={cardBg}
            rounded={props.rounded}
            roundedBottom={props.roundedBottom}
            roundedTop={props.roundedTop}
        >
            <HStack
                w={'full'}
                h={undefined !== props.h ? props.h : 16}
                alignItems={'center'}
                justifyContent={'space-between'}
            >
                <HStack
                    alignItems={'center'}
                    space={3}
                    w={undefined !== props.rightIcon ? '85%' : 'full'}
                >
                    {props.leftIcon && (
                        <Box
                            alignItems={'center'}
                            justifyContent={'center'}
                            pl={3}
                        >{props.leftIcon}</Box>
                    )}
                    <Text
                        pl={undefined === props.leftIcon ? 3 : 0}
                        pr={undefined === props.rightIcon ? 3 : 0}
                        maxW={undefined !== props.leftIcon ? '85%' : 'full'}
                        fontSize={undefined !== props.fontSize ? props.fontSize : 'sm'}
                        numberOfLines={undefined !== props.numberOfLines ? props.numberOfLines : 1}
                        ellipsizeMode={'tail'}
                    >{props.text}</Text>
                </HStack>
                {props.rightIcon && (
                    <Box
                        w={'15%'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >{props.rightIcon}</Box>
                )}
            </HStack>
        </Card>
    )
}
