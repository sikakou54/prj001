import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'
import {
    ApplicationStatus,
    ApplicationState,
    COLOR,
    SendNotify,
    RootState,
    SystemException,
    AlertResult,
    AlertType
} from '../../src/Type'
import {
    Box,
    HStack,
    Icon,
    ScrollView,
    Text,
    useColorModeValue,
} from 'native-base'
import {
    shallowEqual,
    useDispatch,
    useSelector
} from 'react-redux'
import {
    Dimensions,
    RefreshControl,
    TouchableOpacity,
} from 'react-native'
import { AppDispatch } from '../../src/Store'
import {
    update_notify_close,
    load_send_notify_answer_list,
    load_send_notify_detail
} from '../../src/Store/Reducer'
import {
    Stack,
    router,
    useLocalSearchParams,
} from 'expo-router'
import { VictoryPie } from 'victory-native'
import {
    AntDesign,
    FontAwesome
} from '@expo/vector-icons'
import {
    impactAsync,
    ImpactFeedbackStyle
} from 'expo-haptics'
import Card from '../../src/Compenent/Card'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import TextBox from '../../src/Compenent/TextBox'
import Number_1_10 from '../../src/Compenent/Number_1_10'
import { BannerAdSize } from 'react-native-google-mobile-ads'
import AdmobBanner from '../../src/Compenent/AdmobBanner'
import {
    AppConfigContext,
    AlertContext,
    ToastContext
} from '../../src/context'
import TitleHeader from '../../src/Compenent/TitleHeader'

const width = Dimensions.get('window').width

export default function Page() {
    const { notify_id } = useLocalSearchParams<{ notify_id: string }>()
    const dispatch: AppDispatch = useDispatch()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const SendNotify: SendNotify = useSelector((state: RootState) => state.Notify.Send, shallowEqual)
    const content = useMemo(() => { return SendNotify.contents.find((item) => item.notify_id === notify_id) }, [SendNotify.contents, notify_id])
    const Choices = useMemo(() => (SendNotify.choices), [SendNotify.choices])
    const [data, setChartData] = useState<{
        choice: number
        y: number
        labels: string
        text: string
        fill: string
        color: string
        isSelect: boolean
    }[]>([])
    const [selectChoice, setSelectChoice] = useState<number | undefined>(undefined)
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const config = useContext(AppConfigContext)

    const callback = useCallback((result: AlertResult) => {
        if (result === AlertResult.Yes) {
            dispatch(update_notify_close({ notify_id })).then((item) => {
                const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    toast?.showToast({
                        title: '通知をCLOSEしました',
                        bg: COLOR.LIGHT_GREEN
                    })
                    router.back()
                } else if (code === SystemException.ConditionalCheckFailedException) {
                    toast?.showToast({
                        title: '他の端末によって情報が更新されています',
                        bg: COLOR.GRAY
                    })
                }
            })
        }
    }, [notify_id])
    const onCloseNotify = useCallback(() => {
        alert?.setAlert({
            type: AlertType.YesNo,
            title: '通知をCLOSEしますか？',
            disc: 'CLOSEするとリストから削除されます',
            callback
        })
    }, [])

    useEffect(() => {
        setChartData(Choices.map((item) => ({
            fill: COLOR.GRAY,
            color: COLOR.WHITE,
            labels: item.choice === 0 ? '未' : item.choice.toString(),
            text: item.text,
            choice: item.choice,
            y: item.count,
            isSelect: false,
        })))
    }, [Choices])

    useEffect(() => {

        if (undefined !== selectChoice) {

            setChartData(data.map((item) => {
                return {
                    ...item,
                    fill:
                        item.choice === selectChoice
                            ? item.fill === COLOR.SKYBLUE
                                ? COLOR.GRAY
                                : COLOR.SKYBLUE
                            : COLOR.GRAY,
                    color:
                        item.choice === selectChoice
                            ? item.color === COLOR.WHITE
                                ? COLOR.WHITE
                                : COLOR.WHITE
                            : COLOR.WHITE,
                    isSelect:
                        item.choice === selectChoice
                            ? item.isSelect
                                ? false
                                : true
                            : false,
                }
            }))
            setSelectChoice(undefined)
        }

    }, [selectChoice])

    const fetch_notify_choice_user_list = useCallback((choice: number) => {
        dispatch(load_send_notify_answer_list({
            notify_id,
            choice
        })).then((res) => {
            const { status }: ApplicationStatus = res.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                router.push({
                    pathname: '/notify-answer-list',
                    params: {
                        notify_id,
                        choice
                    },
                })
            }
        })
    }, [notify_id])

    const ChoiceListItem = useCallback(({ isSelect, choice, text }: { isSelect: boolean, choice: number, text: string }) => {
        const count = Choices.find((choceItem) => choice === choceItem.choice)?.count
        if (choice === 0 && (undefined !== count && count === 0)) {
            return null
        } else if (undefined !== content && undefined !== count) {
            return (
                <Card
                    bg={isSelect ? COLOR.SKYBLUE : cardBg}
                    key={choice}
                    onPress={() => {
                        if (content.is_anonym !== 1 && undefined !== count && count > 0) {
                            fetch_notify_choice_user_list(choice)
                        }
                    }}
                >
                    <Box
                        w={'full'}
                        h={75}
                        pl={3}
                    >
                        <HStack
                            w={'full'}
                            h={'full'}
                            space={3}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            <Box
                                w={'10%'}
                                h={'full'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                {choice === 0 ? (
                                    <AntDesign
                                        name='exclamationcircle'
                                        size={26}
                                        color={COLOR.RED}
                                    />
                                ) : (
                                    <Icon
                                        as={
                                            <Number_1_10
                                                num={choice}
                                                size={25}
                                                color={isSelect ? COLOR.WHITE : COLOR.GRAY}
                                            />
                                        }
                                        size={26}
                                    />
                                )}
                            </Box>
                            <HStack
                                w={'90%'}
                                h={'full'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                space={1}
                                pr={1.5}
                            >
                                <Text
                                    fontSize={'sm'}
                                    numberOfLines={2}
                                    color={isSelect ? COLOR.WHITE : undefined}
                                    w={'80%'}
                                >{text}</Text>
                                <Text
                                    w={'20%'}
                                    fontSize={'sm'}
                                    numberOfLines={2}
                                    color={isSelect ? COLOR.WHITE : undefined}
                                    textAlign={'center'}
                                >{count}人</Text>
                            </HStack>
                        </HStack>
                    </Box>
                </Card>
            )
        } else {
            return null
        }
    }, [content, Choices])

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
            <TitleHeader
                title={undefined !== content ? content.name : 'CLOSE済みの通知'}
            />
            {undefined !== content ? (
                <>
                    <ScrollView
                        w={'full'}
                        h={'84%'}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => dispatch(load_send_notify_detail({ notify_id })).then((item) => {
                                    const payload = item.payload as ApplicationStatus
                                    if (payload.status === ApplicationState.Failed) {
                                        toast?.showToast({
                                            title: 'この通知は存在しません',
                                            disc: 'CLOSEまたは削除されました',
                                            bg: COLOR.GRAY
                                        })
                                        router.back()
                                    }
                                })}
                            />
                        }
                    >
                        <TextBox
                            text={content.group_name}
                            leftIcon={
                                <AvatarIcon
                                    img={content.img}
                                    size={45}
                                    defaultIcon={<Text color={COLOR.WHITE}>{content.group_name.substring(0, 1)}</Text>}
                                />
                            }
                        />
                        {data.filter((item) => item.y !== 0).length !== 0 ? (
                            <VictoryPie
                                width={width}
                                height={width}
                                data={data.filter((item) => item.y !== 0)}
                                labels={({ datum }) => datum.labels}
                                key={notify_id}
                                events={[
                                    {
                                        target: 'data',
                                        eventHandlers: {
                                            onPressOut: () => {
                                                return [
                                                    {
                                                        target: 'data',
                                                        mutation: ({ datum }) => {
                                                            setSelectChoice(datum.choice)
                                                            impactAsync(
                                                                ImpactFeedbackStyle.Light
                                                            )
                                                        },
                                                    },
                                                ]
                                            },
                                        },
                                    },
                                ]}
                                labelRadius={105}
                                padAngle={2}
                                innerRadius={80}
                                style={{
                                    data: {
                                        fill: ({ datum }: any) => datum.fill,
                                        fillOpacity: 0.9,
                                        stroke: COLOR.GRAY,
                                        strokeWidth: 1,
                                    },
                                    labels: {
                                        fill: ({ datum }: any) => datum.color,
                                        fontSize: 20,
                                        fontFamily: 'NotoSansJP'
                                    },
                                }}
                            />
                        ) : (
                            <Box
                                w={width}
                                h={width}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <Text color={COLOR.GRAY}>メンバーがいません</Text>
                            </Box>
                        )}
                        {data.map((item) => (
                            <ChoiceListItem
                                key={item.choice}
                                choice={item.choice}
                                isSelect={item.isSelect}
                                text={item.text}
                            />
                        ))}
                        <Box
                            w={'full'}
                            h={90}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <TouchableOpacity
                                onPress={onCloseNotify}>
                                <Text
                                    fontSize={'md'}
                                    color={COLOR.RED}
                                >CLOSE</Text>
                            </TouchableOpacity>
                        </Box>
                    </ScrollView>
                    <Box
                        w={'full'}
                        h={'8%'}
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
                </>
            ) : (
                <Box
                    w={'full'}
                    h={'full'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <FontAwesome
                        name='check-circle'
                        size={100}
                        color={COLOR.GREEN}
                    />
                </Box>
            )}
        </Box>
    )
}
