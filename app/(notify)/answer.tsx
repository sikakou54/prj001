import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
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
    Checkbox,
    FormControl,
    HStack,
    Input,
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
    AlertType,
    answer_choice_type
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
import TextInput from '../../src/Compenent/TextInput'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const params = useLocalSearchParams<{ notify_id: string }>()
    const dispatch: AppDispatch = useDispatch()
    const contents: ReceiveNotifyContent[] = useSelector((state: RootState) => state.Notify.Receive.contents, shallowEqual)
    const choices: Choice[] = useSelector((state: RootState) => state.Notify.Receive.choices, shallowEqual)
    const content = contents.find((item) => item.notify_id === params.notify_id)
    const [checked, setChecked] = useState<string[]>([])
    const groupValues = useRef<string[]>([])
    const remarks = useRef<{ idx: number, text: string }[]>([])
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const config = useContext(AppConfigContext)

    useEffect(() => {
        console.log(groupValues.current)
    }, [groupValues.current])

    const onChangeChoice = useCallback((idx: number, check: boolean) => {
        console.log('onChangeChoice', idx, check, groupValues.current, content?.format)
        //　単選択の場合チェックされたらOFFにする
        // 他のチェックの場合はリセットしてONにする
        if (content?.format === 1) {
            if (groupValues.current.filter((value) => value === idx.toString()).length > 0) {
                groupValues.current = []
            } else {
                groupValues.current = [idx.toString()]
            }
        } else {
            if (groupValues.current.filter((value) => value === idx.toString()).length > 0) {
                groupValues.current = groupValues.current.filter((value) => value !== idx.toString())
            } else {
                groupValues.current = groupValues.current.concat(idx.toString())
            }
        }
        setChecked(groupValues.current)
    }, [groupValues.current])

    const onChangeRemarks = useCallback((idx: number, text: string) => {

        if (remarks.current.find((item) => item.idx === idx) !== undefined) {
            remarks.current = remarks.current.map((item) => {
                return item.idx === idx ? { idx, text } : item
            })
        } else {
            remarks.current.push({ idx, text })
        }

    }, [remarks.current])

    const answer = useCallback(() => {
        if (content) {
            dispatch(update_answer({
                choices: checked.map((value) => {
                    const text = remarks.current.find(({ idx }) => idx === Number(value))?.text
                    return {
                        choice: Number(value) + 1,
                        remarks: undefined !== text ? text : null
                    } as answer_choice_type
                }),
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
                } else if (code === SystemException.TransactionCanceledException) {
                    alert?.setAlert({
                        type: AlertType.Ok,
                        title: '既に回答済みです',
                        disc: '情報を最新化してください'
                    })
                }
            })
        }
    }, [content, checked, remarks])

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
                            <Box w={'full'} alignItems={'center'}>
                                <VStack justifyContent={'center'} w={'95%'}>
                                    <Checkbox.Group value={checked} >
                                        {choices.map((item, index) => (
                                            <Card
                                                key={index}
                                                p={3}
                                                bg={cardBg}
                                                roundedTop={0 === index ? 'md' : undefined}
                                                roundedBottom={choices.length - 1 === index ? 'md' : undefined}
                                            >
                                                <HStack w={'full'} alignItems={'center'} space={3}>
                                                    <Checkbox
                                                        value={index.toString()}
                                                        onChange={(flg) => onChangeChoice(index, flg)}
                                                        _checked={{ backgroundColor: COLOR.LIGHT_GREEN, borderColor: COLOR.LIGHT_GREEN }}
                                                        _icon={{ color: COLOR.WHITE }}
                                                        size={'lg'}
                                                        aria-label={'Checkbox'}
                                                    />
                                                    <VStack w={'full'} space={1} justifyContent={'center'}>
                                                        <Text
                                                            fontSize={'sm'}
                                                            numberOfLines={2}
                                                            w={'90%'}
                                                        >{item.text}</Text>
                                                        {item.is_remarks === 1 && checked.find((value) => value === index.toString()) !== undefined && (
                                                            <Input
                                                                size={'sm'}
                                                                w={'90%'}
                                                                variant="filled"
                                                                backgroundColor={useColorModeValue(COLOR.WHITE, COLOR.BLACK)}
                                                                borderColor={COLOR.GRAY}
                                                                _focus={{ backgroundColor: useColorModeValue(COLOR.WHITE, COLOR.BLACK), borderColor: COLOR.GRAY }}
                                                                _input={{
                                                                    selectionColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE),
                                                                    cursorColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE)
                                                                }}
                                                                numberOfLines={2}
                                                                onChangeText={(text) => onChangeRemarks(index, text)}
                                                            />
                                                        )}
                                                    </VStack>
                                                </HStack>
                                            </Card>
                                        ))}
                                    </Checkbox.Group>
                                </VStack>
                            </Box>

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
                        isDisabled={checked.length === 0}
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
