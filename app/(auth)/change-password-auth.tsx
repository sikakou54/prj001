import React from 'react'
import {
    Box,
    Button,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import { Stack, router, useNavigation } from 'expo-router'
import { COLOR } from '../../src/Type'

const Page = () => {
    const navigation = useNavigation()
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
                <Button
                    onPress={() => {
                        router.back()
                        router.back()
                    }}
                    w={'full'}
                    h={12}
                    bg={COLOR.LIGHT_GREEN}
                    rounded={'full'}
                >完了</Button>
            </VStack>

        </Box>
    )
}

export default Page
