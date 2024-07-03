import {
    Box,
    NativeBaseProvider,
    Spinner,
    Text,
    ZStack,
    extendTheme,
    useColorModeValue,
    useToast,
} from 'native-base'
import {
    Provider,
    shallowEqual,
    useSelector
} from 'react-redux'
import { store } from '../src/Store'
import {
    Stack,
    router,
    useNavigation
} from 'expo-router'
import {
    AppConfig,
    ApplicationStatus,
    COLOR,
    SystemException,
    RootState,
    UserInfo,
    AlertResult,
    AlertType
} from '../src/Type'
import {
    AntDesign
} from '@expo/vector-icons'
import {
    useCallback,
    useEffect,
    useState
} from 'react'
import 'react-native-get-random-values'
import ToastItem from '../src/Compenent/ToastItem'
import * as Notifications from 'expo-notifications'
import CircularProgress from '../src/Compenent/CircularProgress'
import { BackHandler } from 'react-native'
import {
    AppConfigContext,
    AlertContext,
    ToastContext
} from '../src/context'
import Alert from '../src/Compenent/Alert'

const customTheme = extendTheme({
    config: {
        useSystemColorMode: true,
    },
    colors: {
        unset: undefined
    },
    components: {
        Text: {
            baseStyle: {
                fontFamily: 'NotoSansJP',
            },
        },
        Input: {
            baseStyle: {
                fontFamily: 'NotoSansJP',
                _focus: {
                    _android: {
                        selectionColor: 'unset',
                    },
                },
            },

        }
    }
})

function AppContainer() {
    const navigation = useNavigation()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const isGlobalLoading: boolean = useSelector((state: RootState) => state.Condition.isGlobalLoading, shallowEqual)
    const Config: AppConfig = useSelector((state: RootState) => state.Config, shallowEqual)
    const Error: ApplicationStatus = useSelector((state: RootState) => state.Application.Error, shallowEqual)
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const progress: number = useSelector((state: RootState) => state.Condition.progress, shallowEqual)
    const toast = useToast()
    const [alertText, setAlertText] = useState<{
        type: AlertType
        title: string
        disc?: string
        callback?: (result: AlertResult) => void
    }>({
        type: AlertType.None,
        title: '',
        disc: '',
        callback: (result: AlertResult) => { }
    })

    const onClose = useCallback((result: AlertResult) => {
        if (undefined !== alertText.callback) {
            alertText.callback(result)
        }
        setAlertText({
            type: AlertType.None,
            title: '',
            callback: (result: AlertResult) => { }
        })
    }, [alertText])
    const showToast = useCallback((param: { title: string, disc?: string, bg?: string, onClose?: () => void }) => {
        const { title, disc, bg, onClose } = param
        toast.show({
            placement: "top",
            duration: 1500,
            render: ({ id }) => {
                return <ToastItem
                    onClose={undefined !== onClose ? () => {
                        toast.close(id)
                        onClose()
                    } : () => toast.close(id)}
                    bg={undefined !== bg ? bg : COLOR.LIGHT_GREEN}
                    color={COLOR.WHITE}
                    w={'95%'}
                    title={title}
                    description={disc}
                    variant={"subtle"}
                />
            }
        })
    }, [toast])

    useEffect(() => {
        Notifications.setBadgeCountAsync(UserInfo.receive_notify_num)
    }, [UserInfo.receive_notify_num])

    useEffect(() => {
        //Android用の戻る操作無効制御
        const backAction = () => {
            return isGlobalLoading
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => backHandler.remove()
    }, [isGlobalLoading])

    useEffect(() => {
        if (Config.maintenance) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: '(error)/maintenance' as never
                }]
            })
        } else if (SystemException.SystemError === Error.code) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: '(error)/system-error' as never
                }]
            })
        } else if (SystemException.NetworkingError === Error.code) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: '(error)/network-error' as never
                }]
            })
        } else if (SystemException.NotFoundUser === Error.code) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: '(auth)/home' as never
                }]
            })
        }
    }, [Error, Config])

    return (
        <ToastContext.Provider value={{ showToast }} >
            <AlertContext.Provider value={{ setAlert: setAlertText }} >
                <AppConfigContext.Provider value={Config}>
                    <ZStack
                        w={'full'}
                        h={'full'}
                        bg={bg}
                    >
                        <Stack
                            screenOptions={{
                                headerTitleAlign: 'center',
                                headerLeft: () => (
                                    <AntDesign
                                        size={18}
                                        name='left'
                                        color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                        onPress={() => router.back()}
                                    />
                                ),
                                headerStyle: {
                                    backgroundColor: useColorModeValue(COLOR.WHITE, COLOR.BLACK),
                                },
                                headerTintColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE),
                                headerTitleStyle: {
                                    fontFamily: 'NotoSansJP',
                                    fontSize: 16
                                },
                                headerShadowVisible: false
                            }}
                        />
                        {isGlobalLoading && (
                            <Box
                                w={'full'}
                                h={'full'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <Box
                                    w={100}
                                    h={100}
                                    bg={COLOR.DEEP_GREEN}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    rounded={'md'}
                                    shadow={1}
                                >
                                    <>
                                        {progress > 0 ? (
                                            <>
                                                {progress >= 100 ? (
                                                    <>
                                                        <Spinner size={'lg'} color={COLOR.WHITE} />
                                                        <Text color={COLOR.WHITE} fontSize={'sm'}>読み込み中</Text>
                                                    </>
                                                ) : (
                                                    <CircularProgress size={70} progress={progress} />
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Spinner size={'lg'} color={COLOR.WHITE} />
                                                <Text color={COLOR.WHITE} fontSize={'sm'}>読み込み中</Text>
                                            </>
                                        )}
                                    </>
                                </Box>
                            </Box>
                        )}
                    </ZStack>
                    <Alert
                        isOpen={alertText.title !== ''}
                        title={alertText.title}
                        subText={alertText.disc}
                        type={alertText.type}
                        onClose={onClose}
                    />
                </AppConfigContext.Provider>
            </AlertContext.Provider>
        </ToastContext.Provider >
    )
}

export default function App() {
    return (
        <Provider store={store}>
            <NativeBaseProvider theme={customTheme}>
                <AppContainer />
            </NativeBaseProvider>
        </Provider>
    )
}
