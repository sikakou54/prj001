import React, {
    useCallback,
    useContext,
    useState
} from 'react'
import {
    Stack,
    router,
    useLocalSearchParams
} from 'expo-router'
import {
    Box,
    Button,
    FormControl,
    HStack,
    Radio,
    ScrollView,
    Text,
    VStack,
    useColorModeValue
} from 'native-base'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    ReceiveNotifyContent,
    SystemException,
    RootState,
    Choice,
    AlertType
} from '../../src/Type'
import {
    shallowEqual,
    useDispatch,
    useSelector
} from 'react-redux'
import { AppDispatch } from '../../src/Store'
import { update_answer } from '../../src/Store/Reducer'
import TextBox from '../../src/Compenent/TextBox'
import Card from '../../src/Compenent/Card'
import AdmobBanner from '../../src/Compenent/AdmobBanner'
import { BannerAdSize } from 'react-native-google-mobile-ads'
import {
    AntDesign,
    FontAwesome
} from '@expo/vector-icons'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import {
    AppConfigContext,
    AlertContext,
    ToastContext
} from '../../src/context'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const params = useLocalSearchParams<{ notify_id: string }>()
    const dispatch: AppDispatch = useDispatch()
    const contents: ReceiveNotifyContent[] = useSelector((state: RootState) => state.Notify.Receive.contents, shallowEqual)
    const choices: Choice[] = useSelector((state: RootState) => state.Notify.Receive.choices, shallowEqual)
    const ReceiveNotifyContent = contents.find((item) => item.notify_id === params.notify_id)
    const [choice, setChoice] = useState<string>('')
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const config = useContext(AppConfigContext)
    const answer = useCallback(() => {
        if (ReceiveNotifyContent) {
            dispatch(update_answer({
                choice: Number(choice),
                group_id: ReceiveNotifyContent.group_id,
                notify_id: ReceiveNotifyContent.notify_id
            })).then((item) => {
                const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    toast?.showToast({
                        title: '回答しました',
                        bg: COLOR.LIGHT_GREEN,

                    })
                    router.back()
                } else if (code === SystemException.ConditionalCheckFailedException) {
                    alert?.setAlert({
                        type: AlertType.Ok,
                        title: '既に回答済みです',
                        disc: '情報を最新化してください',
                    })
                }
            })
        }
    }, [ReceiveNotifyContent, choice])

    if (undefined !== ReceiveNotifyContent) {

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
                        title: '回答',
                        headerShown: false,
                        animation: 'slide_from_bottom',
                        gestureEnabled: true,
                        gestureDirection: 'vertical',
                        headerLeft: () => (
                            <AntDesign
                                name='closecircleo'
                                size={26}
                                color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                onPress={(() => router.back())}
                            />
                        )
                    }}
                />
                <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    w={'full'}
                    h={'8%'}
                    pl={3}
                    pr={3}
                    space={2}
                >
                    <AntDesign
                        name='closecircleo'
                        size={26}
                        color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                        onPress={(() => router.back())}
                    />
                    <Box w={'full'}>
                        <Text
                            fontSize={'sm'}
                            w={'90%'}
                            numberOfLines={2}
                            ellipsizeMode={'tail'}
                        >{ReceiveNotifyContent.name}</Text>
                    </Box>
                </HStack>

                <VStack
                    w={'full'}
                    h={'74%'}
                    space={2}
                    pt={3}
                    alignItems={'center'}
                >
                    {ReceiveNotifyContent.is_anonym === 1 && (
                        <Text
                            w={'95%'}
                            color={COLOR.RED}
                            fontWeight={'bold'}
                            fontSize={'sm'}
                        >こちらは匿名回答です</Text>
                    )}
                    <FormControl.Label
                        w={'95%'}
                        fontWeight={'bold'}
                        fontSize={'sm'}
                    >グループ</FormControl.Label>
                    <Box w={'95%'}>
                        <TextBox
                            leftIcon={
                                <AvatarIcon
                                    img={ReceiveNotifyContent.img}
                                    defaultIcon={<Text color={COLOR.WHITE}>{ReceiveNotifyContent.group_name.substring(0, 1)}</Text>}
                                    size={38}
                                />
                            }
                            numberOfLines={2}
                            text={ReceiveNotifyContent.group_name}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                        />
                    </Box>
                    <FormControl.Label
                        w={'95%'}
                        fontWeight={'bold'}
                        fontSize={'md'}
                    >送信者</FormControl.Label>
                    <Box w={'95%'}>
                        <TextBox
                            leftIcon={
                                <AvatarIcon
                                    img={ReceiveNotifyContent.img_user}
                                    defaultIcon={<Text color={COLOR.WHITE}>{ReceiveNotifyContent.group_name.substring(0, 1)}</Text>}
                                    size={38}
                                />
                            }
                            numberOfLines={2}
                            text={ReceiveNotifyContent.user_name}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                        />
                    </Box>
                    <FormControl.Label
                        w={'95%'}
                        fontWeight={'bold'}
                        fontSize={'md'}
                    >選択肢</FormControl.Label>
                    <ScrollView
                        w={'full'}
                        bg={bg}
                    >
                        <Radio.Group
                            w={'full'}
                            name='RadioGroup'
                            value={choice}
                            onChange={(nextValue) => setChoice(nextValue)}
                        >
                            <Box w={'full'} alignItems={'center'}>
                                <VStack justifyContent={'center'} w={'95%'}>
                                    {choices.map((item, index) => (
                                        <Card
                                            key={index}
                                            p={3}
                                            bg={cardBg}
                                            roundedTop={0 === index ? 'md' : undefined}
                                            roundedBottom={choices.length - 1 === index ? 'md' : undefined}
                                        >
                                            <Radio
                                                my={1}
                                                value={item.choice.toString()}
                                                size={'lg'}
                                                w={'full'}
                                                _checked={{ backgroundColor: useColorModeValue(COLOR.DEEP_GREEN, COLOR.WHITE), borderColor: useColorModeValue(COLOR.DEEP_GREEN, COLOR.WHITE) }}
                                                _icon={{ color: COLOR.LIGHT_GREEN }}
                                            >
                                                <Text
                                                    fontSize={'sm'}
                                                    numberOfLines={2}
                                                    w={'90%'}
                                                >{item.text}</Text>
                                            </Radio>
                                        </Card>
                                    ))}
                                </VStack>
                            </Box>

                        </Radio.Group>
                    </ScrollView>
                </VStack>
                <Box
                    w={'full'}
                    h={'10%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <AdmobBanner
                        size={BannerAdSize.BANNER}
                        debug={config.debug}
                        android={config.admob.banner.android}
                        ios={config.admob.banner.ios}
                    />
                </Box>
                <Button
                    w={'full'}
                    h={'8%'}
                    onPress={answer}
                    isDisabled={choice === ''}
                    bg={COLOR.LIGHT_GREEN}
                    borderRadius={0}
                >
                    <Text fontSize={'md'} color={'white'}>回答する</Text>
                </Button>
            </Box >
        )
    } else {

        return (
            <Box
                w={'full'}
                h={'full'}
                bg={bg}
                safeAreaTop
            >
                <Stack.Screen
                    options={{
                        title: '回答',
                        headerShown: false,
                        animation: 'slide_from_bottom',
                        gestureEnabled: true,
                        gestureDirection: 'vertical',
                        headerLeft: () => (
                            <AntDesign
                                name='closecircleo'
                                size={26}
                                color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                onPress={(() => router.back())}
                            />
                        )
                    }}
                />
                <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    w={'full'}
                    h={'5%'}
                    pl={3}
                    pr={2}
                    bg="transparent"
                >
                    <AntDesign
                        name='closecircleo'
                        size={26}
                        color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                        onPress={(() => router.back())}
                    />
                </HStack>
                <Box
                    w={'full'}
                    h={'95%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <FontAwesome name='check-circle' size={100} color={COLOR.GREEN} />
                    <Text
                        w={'full'}
                        textAlign={'center'}
                        fontSize={'3xl'}
                        color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                    >回答済み</Text>
                </Box>
            </Box>
        )
    }
}

export default Page