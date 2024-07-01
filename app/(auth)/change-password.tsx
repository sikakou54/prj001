import { useCallback, useState } from 'react'
import {
    isEmpty,
    strComp,
    validatePassword,
} from '../../src/Api/Common'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    ERROR_CODE,
    ERROR_MESSAGE,
} from '../../src/Type'
import {
    Box,
    Button,
    VStack,
    useColorModeValue,
} from 'native-base'
import { useDispatch } from 'react-redux'
import { update_password } from '../../src/Store/Reducer'
import { AppDispatch } from '../../src/Store'
import { Stack, useRouter } from 'expo-router'
import TextInput from '../../src/Compenent/TextInput'

const ResistScreen = () => {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const [password, setPassword] = useState<string>('')
    const [confirm, setConfirm] = useState<string>('')
    const [error, setError] = useState<number>(0)
    const dispatch: AppDispatch = useDispatch()
    const router = useRouter()
    const check = useCallback(() => {
        if (isEmpty(password)) {
            setError(ERROR_CODE.PASSWORD_EMPTY_ERROR)
            return false
        }
        if (isEmpty(confirm)) {
            setError(ERROR_CODE.CONFIRM_EMPTY_ERROR)
            return false
        }
        if (!strComp(password, confirm)) {
            setError(ERROR_CODE.PASSWORD_COMP_ERROR)
            return false
        }
        if (!validatePassword(password)) {
            setError(ERROR_CODE.PASSWORD_VALIDATE_ERROR)
            return false
        }
        return true
    }, [password, confirm])
    const resist = useCallback(() => {
        if (!check()) {
            return
        }
        dispatch(update_password({ password })).then((item) => {
            const { status }: ApplicationStatus = item.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                router.push({
                    pathname: '/'
                })
            }
        })
    }, [password, check])
    const errorMessagePassword = useCallback(() => {
        switch (error) {
            case ERROR_CODE.PASSWORD_EMPTY_ERROR:
                return ERROR_MESSAGE.PASSWORD_EMPTY_ERROR
            case ERROR_CODE.PASSWORD_VALIDATE_ERROR:
                return ERROR_MESSAGE.PASSWORD_VALIDATE_ERROR
            default:
                return undefined
        }
    }, [error])
    const errorMessageConfirm = useCallback(() => {
        switch (error) {
            case ERROR_CODE.CONFIRM_EMPTY_ERROR:
                return ERROR_MESSAGE.CONFIRM_EMPTY_ERROR
            case ERROR_CODE.PASSWORD_COMP_ERROR:
                return ERROR_MESSAGE.PASSWORD_COMP_ERROR
            default:
                return undefined
        }
    }, [error])

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
                    title: 'パスワード変更',
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
                    label='パスワード'
                    onChangeText={(text) => setPassword(text)}
                    text={password}
                    secureTextEntry={true}
                    errorMessage={errorMessagePassword()}
                />
                <TextInput
                    bg={cardBg}
                    roundedBottom={'md'}
                    label='パスワード（確認用）'
                    onChangeText={(text) => setConfirm(text)}
                    text={confirm}
                    secureTextEntry={true}
                    errorMessage={errorMessageConfirm()}
                />
            </VStack>
            <Button
                w={'95%'}
                h={12}
                textAlign={'center'}
                onPress={resist}
                bg={COLOR.LIGHT_GREEN}
                borderRadius={10}
                isDisabled={
                    password === '' ||
                    confirm === ''
                }
                rounded={'md'}
            >変更する</Button>
        </Box>
    )
}

export default ResistScreen
