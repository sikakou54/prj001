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
    HStack,
    Progress,
    ScrollView,
    Text,
    VStack,
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
import Card from './Card'
import AvatarIcon from './AvatorIcon'
import { ToastContext } from '../context'

export default function SendNotifyList() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const contents: SendNotifyContent[] = useSelector((state: RootState) => state.Notify.Send.contents, shallowEqual)
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)
    const ListItem = React.memo(({
        notify_id,
        name,
        percent,
        is_anonym,
        img,
        group_name
    }: {
        notify_id: string,
        group_name: string,
        img: string | null
        name: string,
        percent: number,
        is_anonym: number,
    }) => {
        return (
            <Card
                onPress={() => onNotifyListPress(notify_id)}
                bg={useColorModeValue(COLOR.WHITE, COLOR.BLACK)}
            >
                <VStack
                    w={'full'}
                    space={3}
                    h={110}
                    pl={3}
                    justifyContent={'center'}
                >
                    <HStack
                        w={'full'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <HStack
                            w={'85%'}
                            alignItems={'center'}
                            space={2}
                        >
                            <Box
                                w={'10%'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <AvatarIcon
                                    img={img}
                                    defaultIcon={<Text color={COLOR.WHITE}>{group_name.substring(0, 1)}</Text>}
                                    size={38}
                                />
                            </Box>
                            <Box
                                w={'85%'}
                            >
                                <Text
                                    w={'full'}
                                    fontSize={'sm'}
                                    fontWeight={'bold'}
                                    numberOfLines={2}
                                    ellipsizeMode={'tail'}
                                >{name}</Text>
                            </Box>
                        </HStack>
                        {is_anonym === 1 && (
                            <Box
                                alignItems={'center'}
                                justifyContent={'center'}
                                w={'15%'}
                            >
                                <Box
                                    bg={COLOR.RED}
                                    borderRadius={30}
                                    w={12}
                                    p={1}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                >
                                    <Text
                                        fontSize={'sm'}
                                        color={COLOR.WHITE}
                                    >匿名</Text>
                                </Box>
                            </Box>
                        )}
                    </HStack>
                    <HStack
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Progress
                            w={'85%'}
                            bg={COLOR.GRAY}
                            size={'2xl'}
                            _filledTrack={{
                                bg: COLOR.LIGHT_GREEN
                            }}
                            value={Math.floor(percent)}
                        />
                        <Box
                            w={'15%'}
                            h={8}
                            alignItems={'center'}
                            justifyContent={'center'}
                            pl={1}
                        >
                            <Text fontSize={'sm'}>{Math.floor(percent)}%</Text>
                        </Box>
                    </HStack>
                </VStack>
            </Card>
        )
    })
    const renderItem = useCallback(({ item }: { item: SendNotifyContent }) => (
        <ListItem
            notify_id={item.notify_id}
            name={item.name}
            percent={item.percent}
            is_anonym={item.is_anonym}
            group_name={item.group_name}
            img={item.img}
        />
    ), [])
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
    }, [])

    if (contents.length > 0) {
        return (
            <Box w={'full'} h={'full'} bg={bg}>
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
            </Box>
        )
    } else {
        return (
            <Box w={'full'} h={'full'} bg={bg}>
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
            </Box>
        )
    }
}
