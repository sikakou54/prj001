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
    ZStack,
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
import Card from '../../src/Compenent/Card'
import AdmobBanner from '../../src/Compenent/AdmobBanner'
import { BannerAdSize } from 'react-native-google-mobile-ads'
import {
    FontAwesome
} from '@expo/vector-icons'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import {
    AppConfigContext,
    AlertContext,
    ToastContext
} from '../../src/context'
import TitleHeader from '../../src/Compenent/TitleHeader'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const params = useLocalSearchParams<{ notify_id: string }>()
    const dispatch: AppDispatch = useDispatch()
    const contents: ReceiveNotifyContent[] = useSelector((state: RootState) => state.Notify.Receive.contents, shallowEqual)
    const choices: Choice[] = useSelector((state: RootState) => state.Notify.Receive.choices, shallowEqual)
    const content = contents.find((item) => item.notify_id === params.notify_id)
    const [choice, setChoice] = useState<string>('')
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const config = useContext(AppConfigContext)

    const answer = useCallback(() => {
        if (content) {
            dispatch(update_answer({
                choice: Number(choice),
                group_id: content.group_id,
                notify_id: content.notify_id
            })).then((item) => {
                const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    toast?.showToast({
                        title: '回答しました',
                        bg: COLOR.LIGHT_GREEN
                    })
                    router.back()
                } else if (code === SystemException.ConditionalCheckFailedException) {
                    alert?.setAlert({
                        type: AlertType.Ok,
                        title: '既に回答済みです',
                        disc: '情報を最新化してください'
                    })
                }
            })
        }
    }, [content, choice])

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
                    gestureDirection: 'vertical'
                }}
            />
            <TitleHeader title={undefined !== content ? content.name : '回答済またはCLOSE済の通知'} />
            {undefined !== content ? (
                <>
                    <VStack
                        w={'full'}
                        h={'72%'}
                        space={2}
                        pt={3}
                        alignItems={'center'}
                    >
                        {content.is_anonym === 1 && (
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
                            fontSize={'md'}
                        >送信者</FormControl.Label>
                        <Box w={'95%'}>
                            <Card
                                rounded={'md'}
                                p={3}
                                bg={cardBg}
                            >
                                <HStack
                                    w={'full'}
                                    alignItems={'center'}
                                    space={1}
                                >
                                    <Box
                                        w={'15%'}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                    >
                                        <ZStack
                                            w={'full'}
                                        >
                                            <AvatarIcon
                                                img={content.img_user}
                                                defaultIcon={<Text color={COLOR.WHITE}>{content.user_name.substring(0, 1)}</Text>}
                                                size={42}
                                            />
                                            <Box
                                                top={-8}
                                                right={1}
                                            >
                                                <AvatarIcon
                                                    img={content.img}
                                                    defaultIcon={<Text color={COLOR.WHITE}>{content.group_name.substring(0, 1)}</Text>}
                                                    size={36}
                                                />
                                            </Box>
                                        </ZStack>
                                    </Box>
                                    <VStack
                                        w={'95%'}
                                        alignItems={'center'}
                                    >
                                        <Text
                                            w={'full'}
                                            fontSize={'sm'}
                                        >{content.user_name}</Text>
                                        <Text
                                            w={'full'}
                                            fontSize={'xs'}
                                            color={COLOR.GRAY}
                                        >{content.group_name}</Text>
                                    </VStack>
                                </HStack>
                            </Card>
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
                        h={'10%'}
                        onPress={answer}
                        isDisabled={choice === ''}
                        bg={COLOR.LIGHT_GREEN}
                        borderRadius={0}
                    >
                        <Text fontSize={'md'} color={'white'}>回答する</Text>
                    </Button>
                </>
            ) : (
                <Box
                    w={'full'}
                    h={'92%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <FontAwesome name='check-circle' size={100} color={COLOR.GREEN} />
                    <Text
                        w={'full'}
                        textAlign={'center'}
                        fontSize={'2xl'}
                        color={COLOR.GRAY}
                    >回答済み</Text>
                </Box>
            )}
        </Box >
    )
}

export default Page
