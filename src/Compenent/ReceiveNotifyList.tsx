import React, { useCallback } from 'react'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    ReceiveNotifyContent,
    RootState,
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
    load_receive_notify_list,
    load_receive_notify_choice,
    load_receive_notify_list_paging,
} from '../Store/Reducer'
import ReceiveNotifyListItem from './ReceiveNotifyListItem'

export default function ReceiveNotifyList() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const contents: ReceiveNotifyContent[] = useSelector((state: RootState) => state.Notify.Receive.contents, shallowEqual)
    const dispatch: AppDispatch = useDispatch()
    const onReceiveNotifyItemPress = useCallback((notify_id: string) => {
        dispatch(load_receive_notify_choice({ notify_id })).then((item) => {
            const { status }: ApplicationStatus = item.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                router.push({
                    pathname: '/answer',
                    params: {
                        notify_id
                    }
                })
            }
        })
    }, [dispatch])
    const renderItem = useCallback(({ item }: { item: ReceiveNotifyContent }) => (
        <ReceiveNotifyListItem
            onPress={() => onReceiveNotifyItemPress(item.notify_id)}
            notify_id={item.notify_id}
            name={item.name}
            group_name={item.group_name}
            img={item.img}
            img_user={item.img_user}
            user_name={item.user_name}
            is_anonym={item.is_anonym}
        />
    ), [])
    const keyExtractor = useCallback((item: ReceiveNotifyContent) => item.notify_id, [])
    const onEndReached = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        //console.log('onEndReached!', distanceFromEnd)
        dispatch(load_receive_notify_list_paging({ offset: contents.length }))
    }, [contents])

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
                    onRefresh={() => dispatch(load_receive_notify_list())}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.3}
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    onStartReachedThreshold={0}
                />
            ) : (
                <ScrollView
                    w={'full'}
                    h={'full'}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => dispatch(load_receive_notify_list())}
                        />
                    }
                >
                    <Box
                        w={'full'}
                        h={'full'}
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
