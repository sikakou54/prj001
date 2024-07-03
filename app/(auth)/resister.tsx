import { useState, useCallback } from 'react';
import {
    checkMailFormat,
    isEmpty,
    strComp,
    validatePassword,
} from '../../src/Api/Common';
import {
    AppConfig,
    ApplicationState,
    ApplicationStatus,
    COLOR,
    ERROR_CODE,
    ERROR_MESSAGE,
    RootState,
    SystemException,
} from '../../src/Type';
import {
    Box,
    Button,
    VStack,
    useColorModeValue,
} from 'native-base';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../src/Store/Reducer';
import { AppDispatch } from '../../src/Store';
import { Stack, useRouter } from 'expo-router';
import TextInput from '../../src/Compenent/TextInput';
import TermsPolicyModel from '../../src/Compenent/TermsPolicyModel';

const ResistScreen = () => {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK);
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK);
    const [userName, set_username] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<number>(0);
    const dispatch: AppDispatch = useDispatch();
    const Config: AppConfig = useSelector((state: RootState) => state.Config, shallowEqual);
    const router = useRouter();

    const check = useCallback(() => {
        if (isEmpty(userName)) {
            setError(ERROR_CODE.USERNAME_EMPTY_ERROR);
            return false;
        }
        if (isEmpty(mail)) {
            setError(ERROR_CODE.MAIL_EMPTY_ERROR);
            return false;
        }
        if (!checkMailFormat(mail)) {
            setError(ERROR_CODE.MAIL_FORMAT_ERROR);
            return false;
        }
        if (isEmpty(password)) {
            setError(ERROR_CODE.PASSWORD_EMPTY_ERROR);
            return false;
        }
        if (isEmpty(confirm)) {
            setError(ERROR_CODE.CONFIRM_EMPTY_ERROR);
            return false;
        }
        if (!strComp(password, confirm)) {
            setError(ERROR_CODE.PASSWORD_COMP_ERROR);
            return false;
        }
        if (!validatePassword(password)) {
            setError(ERROR_CODE.PASSWORD_VALIDATE_ERROR);
            return false;
        }
        return true;
    }, [userName, mail, password, confirm]);

    const resist = useCallback(() => {
        if (!check()) {
            return;
        }
        dispatch(signUp({
            mail,
            password,
            name: userName,
            policy_ver: Config.policy.version,
            terms_ver: Config.terms.version,
        })).then((item) => {
            const { status, code }: ApplicationStatus = item.payload as ApplicationStatus;
            if (status === ApplicationState.Success) {
                router.push({
                    pathname: '/send-auth-mail-sinup',
                    params: {
                        mail
                    }
                });
            } else if (code === SystemException.UsernameExistsException) {
                setError(ERROR_CODE.MAIL_EXIST_ERROR);
            }
        });
    }, [check, dispatch, mail, password, userName, Config, router]);

    const errorMessageUserName = useCallback(() => {
        return error === ERROR_CODE.USERNAME_EMPTY_ERROR
            ? ERROR_MESSAGE.USERNAME_EMPTY_ERROR
            : undefined;
    }, [error]);

    const errorMessageMail = useCallback(() => {
        switch (error) {
            case ERROR_CODE.MAIL_EMPTY_ERROR:
                return ERROR_MESSAGE.MAIL_FORMAT_ERROR;
            case ERROR_CODE.MAIL_EXIST_ERROR:
                return ERROR_MESSAGE.MAIL_EXIST_ERROR;
            default:
                return undefined;
        }
    }, [error]);

    const errorMessagePassword = useCallback(() => {
        switch (error) {
            case ERROR_CODE.PASSWORD_EMPTY_ERROR:
                return ERROR_MESSAGE.PASSWORD_EMPTY_ERROR;
            case ERROR_CODE.PASSWORD_VALIDATE_ERROR:
                return ERROR_MESSAGE.PASSWORD_VALIDATE_ERROR;
            default:
                return undefined;
        }
    }, [error]);

    const errorMessageConfirm = useCallback(() => {
        switch (error) {
            case ERROR_CODE.CONFIRM_EMPTY_ERROR:
                return ERROR_MESSAGE.CONFIRM_EMPTY_ERROR;
            case ERROR_CODE.PASSWORD_COMP_ERROR:
                return ERROR_MESSAGE.PASSWORD_COMP_ERROR;
            default:
                return undefined;
        }
    }, [error]);

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
                    title: '新規登録'
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
                    label='名前'
                    maxLength={15}
                    onChangeText={(text) => set_username(text)}
                    text={userName}
                    errorMessage={errorMessageUserName()}
                />
                <TextInput
                    bg={cardBg}
                    label='メールアドレス'
                    maxLength={30}
                    onChangeText={(text) => setMail(text)}
                    text={mail}
                    errorMessage={errorMessageMail()}
                />
                <TextInput
                    bg={cardBg}
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
                onPress={resist}
                bg={COLOR.LIGHT_GREEN}
                borderRadius={10}
                isDisabled={
                    userName === '' ||
                    mail === '' ||
                    password === '' ||
                    confirm === ''
                }
                rounded={'md'}
            >次へ</Button>
            <TermsPolicyModel
                isRequired={false}
                onClose={(result) => {
                    if (!result) {
                        router.back();
                    }
                }}
                terms={Config.terms.url}
                policy={Config.policy.url}
                isOpen={true} />
        </Box>
    );
};

export default ResistScreen;
