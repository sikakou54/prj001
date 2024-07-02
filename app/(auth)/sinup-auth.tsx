import React, { useContext } from 'react'

import {
    Box,
    Button,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { AppDispatch } from '../../src/Store'
import { useDispatch } from 'react-redux'
import { resend_signup } from '../../src/Store/Reducer'
import { ApplicationState, ApplicationStatus, COLOR, SystemException } from '../../src/Type'
import { ToastContext } from '../../src/context'

const Page = () => {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const dispatch: AppDispatch = useDispatch()
    const { mail } = useLocalSearchParams()
    const toast = useContext(ToastContext)

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
                    title: '仮登録完了',
                }}
            />
            <VStack
                h={'full'}
                w={'90%'}
                space={5}
                mt={5}
            >
                <VStack
                    w={'full'}
                    h={12}
                    alignItems={'center'}
                    justifyContent={'center'}
                    space={1}
                >
                    <Text>仮登録の確認メールを送信しました</Text>
                    <Text>リンクを押して本登録を行なってください</Text>
                </VStack>
                <Button
                    onPress={() => router.push('/(auth)/login')}
                    w={'full'}
                    h={12}
                    bg={COLOR.LIGHT_GREEN}
                    rounded={'full'}
                >ログインする</Button>
                <Box
                    w={'full'}
                    h={12}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <TouchableOpacity
                        onPress={() => dispatch(resend_signup({ mail: mail as string })).then((item) => {
                            const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                            if (status === ApplicationState.Success) {
                                toast?.showToast({
                                    title: 'メールを送信しました',
                                    bg: COLOR.LIGHT_GREEN,
                                })
                            } else if (code === SystemException.LimitExceededException) {
                                toast?.showToast({
                                    title: '送信制限に達しました',
                                    disc: 'しばらく待ってからお試しください',
                                    bg: COLOR.GRAY
                                })
                            }
                        })}
                    >
                        <Text
                            color={COLOR.GRAY}
                            fontSize={'sm'}
                            fontWeight={'normal'}
                        >再送する</Text>
                    </TouchableOpacity>
                </Box>

            </VStack>
        </Box>
    )
}

export default Page
