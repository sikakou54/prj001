import messaging from '@react-native-firebase/messaging'
import { Stack, Tabs, router } from 'expo-router'
import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { AppConfig, ApplicationState, ApplicationStatus, COLOR, NotificationMessage, NotificationMessageItem, RootState, UserInfo } from '../../src/Type'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { Badge, Box, Text, ZStack, useColorModeValue } from 'native-base'
import { AppState, AppStateStatus } from 'react-native'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../src/Store'
import { change_ground_state, load_send_notify_detail, on_touch_push_new_notify, on_touch_push_comp_notify, update_terms_policy } from '../../src/Store/Reducer'
import { ToastContext } from '../../src/context'
import TermsPolicyModel from '../../src/Compenent/TermsPolicyModel'

export default function TabLayout() {
    const appState = useRef(AppState.currentState)
    const toast = useContext(ToastContext)
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const isGlobalLoading: Boolean = useSelector((state: RootState) => state.Condition.isGlobalLoading, shallowEqual)
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const Config: AppConfig = useSelector((state: RootState) => state.Config, shallowEqual)
    const dispatch: AppDispatch = useDispatch()
    const onFetchNotification = useCallback((message: NotificationMessage) => {
        console.log('onFetchNotification', message)
        const { id, item } = message
        if (id === 'NEW_NOTIFY') {
            const { notify_id } = item as NotificationMessageItem
            dispatch(on_touch_push_new_notify({
                notify_id
            })).then((item) => {
                const { status } = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    router.push({
                        pathname: '/(notify)/answer',
                        params: {
                            notify_id,
                        },
                    })
                }
            })
        } else if (id === 'COMPLETE_NOTIFY') {
            const { notify_id } = item as NotificationMessageItem
            dispatch(on_touch_push_comp_notify({
                notify_id
            })).then((item) => {
                const payload_1 = item.payload as ApplicationStatus
                if (payload_1.status === ApplicationState.Success) {
                    dispatch(load_send_notify_detail({ notify_id })).then((item2) => {
                        const payload_2 = item2.payload as ApplicationStatus
                        if (payload_2.status === ApplicationState.Success) {
                            router.push({
                                pathname: '/(notify)/notify-answer-detail',
                                params: {
                                    notify_id
                                }
                            })
                        }
                    })
                }
            })
        }
    }, [UserInfo])

    useEffect(() => {

        const onMessage = messaging().onMessage((remoteMessage) => {
            console.log('onMessage', remoteMessage)
            if (null !== remoteMessage && undefined !== remoteMessage.data) {
                const { id, item } = JSON.parse(remoteMessage.data.message as string) as NotificationMessage
                const title = remoteMessage.notification?.title
                const disc = remoteMessage.notification?.body
                if (undefined !== title && undefined !== disc) {
                    toast?.showToast({
                        title,
                        disc,
                        bg: COLOR.LIGHT_GREEN,
                        onClose: () => onFetchNotification({ id, item })
                    })
                }
            }
        })
        const onNotificationOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('onNotificationOpenedApp', remoteMessage)
        })
        const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                const remoteMessage = await messaging().getInitialNotification()
                if (null !== remoteMessage && undefined !== remoteMessage.data) {
                    onFetchNotification(JSON.parse(remoteMessage.data.message as string) as NotificationMessage)
                } else {
                    dispatch(change_ground_state())
                }
            }
            appState.current = nextAppState
        })
        messaging().setBackgroundMessageHandler(async (remoteMessage) => { console.log('setBackgroundMessageHandler', remoteMessage) })

        // 通知をタップして起動した時の処理
        messaging().getInitialNotification().then((remoteMessage) => {
            if (null !== remoteMessage && undefined !== remoteMessage.data) {
                const message = JSON.parse(remoteMessage.data.message as string) as NotificationMessage
                onFetchNotification(message)
            }
        })

        return () => {
            onMessage()
            onNotificationOpenedApp()
            subscription.remove()
        }
    }, [])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'fade',
                }}
            />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarLabel: () => null,
                    tabBarStyle: {
                        backgroundColor: useColorModeValue(COLOR.WHITE, COLOR.BLACK),
                        borderRadius: 10,
                        height: 70,
                        borderTopWidth: 0
                    },
                    tabBarItemStyle: {
                        height: 70
                    }
                }}
            >
                <Tabs.Screen
                    name='group'
                    options={{
                        headerShown: true,
                        tabBarIcon: (props) => (
                            <Feather
                                name='users'
                                size={26}
                                color={props.focused ? useColorModeValue(COLOR.DEEP_GREEN, COLOR.WHITE) : COLOR.GRAY}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name='notify'
                    options={{
                        headerShown: true,
                        title: '通知',
                        tabBarIcon: (props) => (
                            <ZStack alignItems={'center'} justifyContent={'center'}>
                                {UserInfo.receive_notify_num > 0 && (
                                    <Badge
                                        bg={COLOR.RED}
                                        rounded="full"
                                        zIndex={1}
                                        variant="solid"
                                        left={0}
                                        bottom={0}
                                    >
                                        <Text color={COLOR.WHITE}>{UserInfo.receive_notify_num}</Text>
                                    </Badge>
                                )}
                                <Ionicons
                                    name='notifications-outline'
                                    size={26}
                                    color={props.focused ? useColorModeValue(COLOR.DEEP_GREEN, COLOR.WHITE) : COLOR.GRAY}
                                />
                            </ZStack>
                        )
                    }}
                />
                <Tabs.Screen
                    name='setting'
                    options={{
                        headerShown: true,
                        title: '設定',
                        tabBarIcon: (props) => (
                            <AntDesign
                                name='setting'
                                size={26}
                                color={props.focused ? useColorModeValue(COLOR.DEEP_GREEN, COLOR.WHITE) : COLOR.GRAY}
                            />
                        ),
                    }}
                />
            </Tabs>
            {/*　ローディングしていなかったら表示 */}
            {!isGlobalLoading && (
                <TermsPolicyModel
                    isRequired={true}
                    terms={UserInfo.terms_version !== Config.terms.version ? Config.terms.url : undefined}
                    policy={UserInfo.policy_version !== Config.policy.version ? Config.policy.url : undefined}
                    isOpen={UserInfo.terms_version !== Config.terms.version || UserInfo.policy_version !== Config.policy.version}
                    onClose={(result) => {
                        if (result) {
                            dispatch(update_terms_policy({
                                policy_version: Config.policy.version,
                                terms_version: Config.terms.version
                            })).then((item) => {
                                const { status } = item.payload as ApplicationStatus
                                if (status === ApplicationState.Success) {
                                    toast?.showToast({
                                        title: `ご対応ありがとうございます`,
                                        bg: COLOR.LIGHT_GREEN,

                                    })
                                }
                            })
                        }
                    }}
                />
            )}
        </Box>
    )
}
