import React, { useCallback, useContext } from 'react'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    SendNotifyContent,
    RootState
} from '../Type'
import {
    Box,
    FlatList,
    ScrollView,
    Text,
    useColorModeValue,
} from 'native-base'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RefreshControl } from 'react-native'
import { AppDispatch } from '../Store'
import { router } from 'expo-router'
import {
    load_send_notify,
    load_send_notify_detail,
    load_send_notify_paging,
} from '../Store/Reducer'
import { ToastContext } from '../context'
import SendNotifyListItem from './SendNotifyListItem'

export default function SendNotifyList() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const contents: SendNotifyContent[] = useSelector((state: RootState) => state.Notify.Send.contents, shallowEqual)
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)

    const keyExtractor = useCallback((item: SendNotifyContent) => item.notify_id, [])
    const onEndReached = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        //console.log('onEndReached!', distanceFromEnd)
        dispatch(load_send_notify_paging({ offset: contents.length }))
    }, [contents])
    const onNotifyListPress = useCallback((notify_id: string) => {
        dispatch(load_send_notify_detail({ notify_id })).then((item) => {
            const { status }: ApplicationStatus = item.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                router.push({
                    pathname: '/(notify)/notify-answer-detail',
                    params: {
                        notify_id
                    },
                })
            } else {
                toast?.showToast({
                    title: 'この通知は存在しません',
                    disc: 'CLOSEまたは削除されました',
                    bg: COLOR.GRAY
                })
            }
        })
    }, [dispatch])
    const renderItem = useCallback(({ item }: { item: SendNotifyContent }) => (
        <SendNotifyListItem
            onPress={onNotifyListPress}
            notify_id={item.notify_id}
            name={item.name}
            percent={item.percent}
            is_anonym={item.is_anonym}
            group_name={item.group_name}
            img={item.img}
        />
    ), [])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
        >
            {contents.length > 0 ? (
                <FlatList
                    w={'full'}
                    h={'full'}
                    data={contents}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    refreshing={false}
                    onRefresh={() => dispatch(load_send_notify())}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.3}
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                />
            ) : (
                <ScrollView
                    w={'full'}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => dispatch(load_send_notify())}
                        />
                    }
                >
                    <Box
                        w={'full'}
                        alignItems={'center'}
                        mt={8}
                    >
                        <Text
                            fontSize={'sm'}
                            color={COLOR.GRAY}
                        >通知がありません</Text>
                    </Box>
                </ScrollView>
            )}
        </Box>
    )
}
