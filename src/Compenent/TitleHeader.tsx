import { AntDesign } from '@expo/vector-icons'
import { Box, HStack, Text, useColorModeValue } from 'native-base'
import React from 'react'
import { COLOR } from '../Type'
import { router } from 'expo-router'

interface Props {
    title?: string
    bg?: string
}
export default function TitleHeader(props: Props) {
    return (
        <HStack
            alignItems={'center'}
            w={'full'}
            h={'8%'}
            pl={3}
            pr={3}
            space={2}
            bg={props.bg}
        >
            <AntDesign
                name='closecircleo'
                size={30}
                color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                onPress={(() => router.back())}
            />
            {undefined !== props.title && (
                <Box w={'full'}>
                    <Text
                        fontSize={'md'}
                        w={'90%'}
                        numberOfLines={2}
                        ellipsizeMode={'tail'}
                    >{props.title}</Text>
                </Box>
            )}
        </HStack>
    )
}
