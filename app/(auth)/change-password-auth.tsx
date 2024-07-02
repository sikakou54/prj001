import React from 'react'
import {
    Box,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import { Stack } from 'expo-router'
import { COLOR } from '../../src/Type'

const Page = () => {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'パスワードを変更する',
                }}
            />
            <VStack
                w={'90%'}
                alignItems={'center'}
                justifyContent={'center'}
                mt={5}
                space={5}
            >
                <VStack
                    w={'full'}
                    h={12}
                    alignItems={'center'}
                    justifyContent={'center'}
                    space={1}
                >
                    <Text>認証メールを送信しました</Text>
                    <Text>リンクを押してパスワード変更を行なってください</Text>
                </VStack>
            </VStack>

        </Box>
    )
}

export default Page
