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
                h={'full'}
                w={'90%'}
                space={1}
                m={5}
            >
                <Text>認証メールを送信しました</Text>
                <Text>こちらの端末でリンクを押してパスワード変更を行なってください</Text>
            </VStack>

        </Box>
    )
}

export default Page
