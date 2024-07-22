import React, { useCallback, useContext, useState } from 'react'
import { Box, Button, VStack, useColorModeValue } from 'native-base'
import { AppDispatch } from '../../src/Store'
import { useDispatch } from 'react-redux'
import { add_group } from '../../src/Store/Reducer'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    SystemException,
} from '../../src/Type'
import { Stack, router } from 'expo-router'
import TextInput from '../../src/Compenent/TextInput'
import { ToastContext } from '../../src/context'
import TitleHeader from '../../src/Compenent/TitleHeader'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const [group_name, update_group_name] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)

    const regist = useCallback(() => {
        dispatch(add_group({ code, group_name })).then((item) => {
            const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                toast?.showToast({
                    title: 'グループを作成しました',
                    bg: COLOR.LIGHT_GREEN,

                })
                router.back()
            } else if (code === SystemException.TransactionCanceledException) {
                setErrorMessage('この招待コードは既に使用されています。')
            }
        })
    }, [code, group_name])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
            safeAreaTop
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                }}
            />
            <TitleHeader title={'グループを作成する'} />
            <Box w={'full'} h={'full'} alignItems={'center'}>
                <VStack
                    w={'95%'}
                    mt={5}
                    mb={5}
                    alignItems={'center'}
                >
                    <TextInput
                        bg={cardBg}
                        roundedTop={'md'}
                        label='グループ名'
                        maxLength={20}
                        onChangeText={update_group_name}
                        text={group_name}
                    />
                    <TextInput
                        bg={cardBg}
                        roundedBottom={'md'}
                        label='招待コード'
                        maxLength={30}
                        onChangeText={setCode}
                        text={code}
                        errorMessage={errorMessage}
                    />
                </VStack>
                <Button
                    w={'95%'}
                    h={12}
                    textAlign={'center'}
                    onPress={regist}
                    bg={COLOR.LIGHT_GREEN}
                    borderRadius={10}
                    isDisabled={'' === group_name || '' === code}
                    rounded={'md'}
                >登録する</Button>
            </Box>
        </Box>
    )
}

export default Page
