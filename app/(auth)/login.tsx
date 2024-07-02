import React, { useState } from 'react'
import {
    ApplicationStatus,
    ApplicationState,
    ERROR_CODE,
    ERROR_MESSAGE,
    COLOR,
    SystemException,
} from '../../src/Type'
import {
    Box,
    Button,
    FormControl,
    Text,
    VStack,
    WarningOutlineIcon,
    useColorModeValue,
} from 'native-base'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../src/Store'
import { resend_signup, signIn } from '../../src/Store/Reducer'
import { Stack, router, useNavigation } from 'expo-router'
import { checkMailFormat, isEmpty } from '../../src/Api/Common'
import TextInput from '../../src/Compenent/TextInput'
import { CommonActions } from '@react-navigation/native';

const Page = () => {
    const navigation = useNavigation()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const dispatch: AppDispatch = useDispatch()
    const [mail, setMail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<number>(ERROR_CODE.NONE)

    function check() {
        if (isEmpty(mail)) {
            setError(ERROR_CODE.MAIL_EMPTY_ERROR)
            return false
        }
        if (!checkMailFormat(mail)) {
            setError(ERROR_CODE.MAIL_FORMAT_ERROR)
            return false
        }
        if (isEmpty(password)) {
            setError(ERROR_CODE.PASSWORD_EMPTY_ERROR)
            return false
        }
        return true
    }

    function login() {

        if (!check()) {
            return
        }

        dispatch(signIn({ mail, password })).then((item) => {
            const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'index' as never
                    }]
                })
            } else if (code === SystemException.UserUnAuthenticatedException) {
                dispatch(resend_signup({ mail: mail as string })).then((item) => {
                    const { status }: ApplicationStatus = item.payload as ApplicationStatus
                    if (ApplicationState.Success === status) {
                        router.push({
                            pathname: '/sinup-auth',
                            params: {
                                mail
                            }
                        })
                    }
                })
            } else {
                setError(ERROR_CODE.NOT_LOGIN_ERROR)
            }
        })
    }

    function onChangeMain(text: string) {
        setMail(text)
    }

    function onChangePassword(text: string) {
        setPassword(text)
    }

    function errorMessageMail() {
        if (error == ERROR_CODE.MAIL_EMPTY_ERROR) {
            return ERROR_MESSAGE.MAIL_FORMAT_ERROR
        }
        if (error == ERROR_CODE.MAIL_FORMAT_ERROR) {
            return ERROR_MESSAGE.MAIL_FORMAT_ERROR
        }
        if (error == ERROR_CODE.MAIL_EXIST_ERROR) {
            return ERROR_MESSAGE.MAIL_EXIST_ERROR
        }
        return undefined
    }

    function errorMessagePassword() {
        if (error == ERROR_CODE.PASSWORD_EMPTY_ERROR) {
            return ERROR_MESSAGE.PASSWORD_EMPTY_ERROR
        } else if (error === ERROR_CODE.NOT_LOGIN_ERROR) {
            return ERROR_MESSAGE.NOT_LOGIN_ERROR
        }
        return undefined
    }

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
                    title: 'ログイン'
                }}
            />
            <VStack
                w={'95%'}
                mt={5}
                mb={5}
                alignItems='center'
            >
                <TextInput
                    bg={cardBg}
                    roundedTop={'md'}
                    label='メールアドレス'
                    //maxLength={30}
                    onChangeText={(text) => onChangeMain(text)}
                    text={mail}
                    errorMessage={errorMessageMail()}
                />
                <TextInput
                    bg={cardBg}
                    roundedBottom={'md'}
                    label='パスワード'
                    //maxLength={30}
                    onChangeText={(text) => onChangePassword(text)}
                    text={password}
                    secureTextEntry={true}
                    errorMessage={errorMessagePassword()}
                />
            </VStack>
            <VStack
                w={'95%'}
                space={3}
                alignItems={'center'}
            >
                <Button
                    w={'full'}
                    h={12}
                    textAlign={'center'}
                    onPress={login}
                    bg={COLOR.LIGHT_GREEN}
                    borderRadius={10}
                    isDisabled={mail === '' || password === ''}
                    rounded={'md'}
                >ログイン</Button>
                <Button
                    onPress={() => router.push('/send-password-reset')}
                    size='sm'
                    variant='link'
                    borderRadius={10}
                    rounded={'md'}
                >
                    <Text
                        color={COLOR.GRAY}
                        fontSize={'sm'}
                    >パスワードを忘れた方はこちら</Text>
                </Button>
            </VStack>
        </Box >
    )
}

export default Page
