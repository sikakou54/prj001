import React, { useCallback, useContext, useState } from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import {
    Box,
    Button,
    VStack,
    useColorModeValue,
} from 'native-base'
import { AppDispatch } from '../../src/Store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { reset_password } from '../../src/Store/Reducer'
import {
    ApplicationStatus,
    ApplicationState,
    ERROR_CODE,
    ERROR_MESSAGE,
    SystemException,
    COLOR,
    UserInfo,
    RootState,
} from '../../src/Type'
import TextInput from '../../src/Compenent/TextInput'
import { ToastContext } from '../../src/context'

function Page() {
    const { mail } = useLocalSearchParams<{ mail: string }>()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const dispatch: AppDispatch = useDispatch()
    const [error, setError] = useState<number>(ERROR_CODE.NONE)
    const [text, setText] = useState<string>(undefined !== mail ? mail : '')
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const toast = useContext(ToastContext)

    const reset = useCallback(() => {
        dispatch(reset_password({ mail: UserInfo.mail })).then((item) => {
            const { status, code } = item.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                router.push({
                    pathname: '/(auth)/send-auth-mail-change-password',
                    params: {
                        mail: UserInfo.mail,
                    },
                })
            } else if (code === SystemException.LimitExceededException) {
                toast?.showToast({
                    title: '送信制限に達しました',
                    disc: 'しばらく待ってからお試しください',
                    bg: COLOR.GRAY
                })
            } else if (code === SystemException.InvalidEmailException) {
                setError(ERROR_CODE.MAIL_ERROR)
            }
        })
    }, [UserInfo])

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
                w={'95%'}
                mt={5}
                mb={5}
                alignItems={'center'}
                bg={bg}
            >
                <TextInput
                    bg={cardBg}
                    roundedTop={'md'}
                    roundedBottom={'md'}
                    onChangeText={setText}
                    text={text}
                    isReadOnly={undefined !== mail}
                    label={'メールアドレス'}
                    errorMessage={error === ERROR_CODE.MAIL_ERROR ? ERROR_MESSAGE.MAIL_ERROR : undefined}
                />
            </VStack>
            <Button
                w={'95%'}
                h={12}
                textAlign={'center'}
                onPress={reset}
                bg={COLOR.LIGHT_GREEN}
                borderRadius={10}
                rounded={'md'}
                isDisabled={'' === text}
            >変更する</Button>
        </Box>
    )
}

export default Page
