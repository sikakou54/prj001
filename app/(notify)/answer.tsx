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
import { TouchableOpacity } from 'react-native'
import AnswerRemarksModal from '../../src/Compenent/AnswerRemarksModal'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const params = useLocalSearchParams<{ notify_id: string }>()
    const dispatch: AppDispatch = useDispatch()
    const contents: ReceiveNotifyContent[] = useSelector((state: RootState) => state.Notify.Receive.contents, shallowEqual)
    const choices: Choice[] = useSelector((state: RootState) => state.Notify.Receive.choices, shallowEqual)
    const content = contents.find((item) => item.notify_id === params.notify_id)
    const [checked, setChecked] = useState<string[]>([])
    const [remarks, setRemarks] = useState<{ idx: number, text: string }[]>([])
    const [modal, setModal] = useState<{ open: boolean, idx: number, text: string }>({ open: false, idx: 0, text: '' })
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const config = useContext(AppConfigContext)

    useEffect(() => {
        console.log(checked)
    }, [checked])

    useEffect(() => {
        console.log(remarks)
    }, [remarks])

    const onChangeChoice = useCallback((idx: number, check: boolean) => {
        console.log('onChangeChoice', idx, check, checked, content?.format)
        //　単選択の場合チェックされたらOFFにする
        // 他のチェックの場合はリセットしてONにする
        if (content?.format === 1) {
            if (checked.filter((value) => value === idx.toString()).length > 0) {
                setChecked([])
            } else {
                setChecked([idx.toString()])
            }
        } else {
            if (checked.filter((value) => value === idx.toString()).length > 0) {
                setChecked(prev => prev.filter((value) => value !== idx.toString()))
            } else {
                setChecked(prev => prev.concat(idx.toString()))
            }
        }
    }, [checked])

    const onChangeRemarks = useCallback((idx: number, text: string) => {
        if (remarks.find((item) => item.idx === idx) !== undefined) {
            setRemarks(prev => prev.map((item) => {
                return item.idx === idx ? { idx, text } : item
            }))
        } else {
            setRemarks(prev => [...prev, { idx, text }])
        }
    }, [remarks])

    const answer = useCallback(() => {
        if (content) {
            for (let index = 0; index < checked.length; index++) {
                const item = choices.find((value) => value.choice - 1 === Number(checked[index]))
                if (undefined !== item && item.desc_type === 1) {
                    const text = remarks.find((value) => value.idx === item.choice - 1)?.text
                    if (text === undefined || text === '') {
                        toast?.showToast({
                            title: '必須入力項目が入力されていません',
                            bg: COLOR.RED
                        })
                        return
                    }
                }
            }
            dispatch(update_answer({
                choices: checked.map((value) => {
                    const text = remarks.find(({ idx }) => idx === Number(value))?.text
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
    }, [content, checked, remarks, choices])

    const onModalClose = useCallback((idx: number, text: string) => {
        onChangeRemarks(idx, text)
        setModal({ idx: 0, open: false, text: '' })
    }, [modal])

    const RemarksItem = useCallback(({ desc_type, idx }: { idx: number, desc_type: number }) => {
        const text = remarks.find((value) => value.idx === idx)?.text
        return (
            <TouchableOpacity onPress={() => setModal({ idx, open: true, text: text !== undefined ? text : '' })}>
                {text === undefined || text === '' ? (
                    <HStack alignItems={'center'} space={1}>
                        <Box p={0.5} w={8} bg={desc_type === 1 ? COLOR.RED : COLOR.GRAY} rounded={'md'} alignItems={'center'} justifyContent={'center'}>
                            <Text fontSize={'xs'}>{desc_type === 1 ? '必須' : '任意'}</Text>
                        </Box>
                        <Text fontSize={'xs'} color={COLOR.GRAY}>コメントを入力する</Text>
                    </HStack>
                ) : (
                    <Text fontSize={'xs'} color={COLOR.GRAY}>{text}</Text >
                )}
            </TouchableOpacity>
        )
    }, [remarks])

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
                                                        {
                                                            item.desc_type !== 0 &&
                                                            checked.find((value) => value === index.toString()) !== undefined &&
                                                            (
                                                                <RemarksItem
                                                                    idx={index}
                                                                    desc_type={item.desc_type}
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
                    <AnswerRemarksModal
                        onClose={onModalClose}
                        isOpen={modal.open}
                        idx={modal.idx}
                    />
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
            )
            }
        </Box >
    )
}

export default Page
