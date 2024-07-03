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
    HStack,
    ScrollView,
    Text,
    ZStack,
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
import Card from './Card'
import AvatarIcon from './AvatorIcon'

export default function ReceiveNotifyList() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const contents: ReceiveNotifyContent[] = useSelector((state: RootState) => state.Notify.Receive.contents, shallowEqual)
    const dispatch: AppDispatch = useDispatch()
    const ListItem = React.memo(({
        name,
        notify_id,
        group_name,
        img,
        img_user,
        is_anonym
    }: {
        name: string,
        notify_id: string,
        group_name: string,
        img: string | null,
        img_user: string | null
        is_anonym: number,
    }) => (
        <Card
            bg={useColorModeValue(COLOR.WHITE, COLOR.BLACK)}
            onPress={() => dispatch(load_receive_notify_choice({ notify_id })).then((item) => {
                const { status }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    router.push({
                        pathname: '/answer',
                        params: {
                            notify_id: notify_id,
                        },
                    })
                }
            })}
        >
            <HStack
                w={'full'}
                h={70}
                alignItems={'center'}
            >
                <ZStack
                    w={'15%'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <AvatarIcon
                        img={img}
                        defaultIcon={<Text color={COLOR.WHITE}>{group_name.substring(0, 1)}</Text>}
                        size={45}
                    />
                    <Box top={-5} right={0.5}>
                        <AvatarIcon
                            img={img_user}
                            defaultIcon={<Text color={COLOR.WHITE}>{group_name.substring(0, 1)}</Text>}
                            size={35}
                        />
                    </Box>
                </ZStack>
                <Box
                    w={is_anonym === 0 ? '85%' : '70%'}
                    pl={2}
                    pr={1}
                >
                    <Text
                        w={'full'}
                        fontSize={'sm'}
                        fontWeight={'bold'}
                        numberOfLines={2}
                        ellipsizeMode={'tail'}
                    >{name}</Text>
                </Box>
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
        </Card >
    ))
    const renderItem = useCallback(({ item }: { item: ReceiveNotifyContent }) => (
        <ListItem
            notify_id={item.notify_id}
            name={item.name}
            group_name={item.group_name}
            img={item.img}
            img_user={item.img_user}
            is_anonym={item.is_anonym}
        />
    ), [])
    const keyExtractor = useCallback((item: ReceiveNotifyContent) => item.notify_id, [])
    const onEndReached = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        //console.log('onEndReached!', distanceFromEnd)
        dispatch(load_receive_notify_list_paging({ offset: contents.length }))
    }, [contents])

    return (
        <Box w={'full'} h={'full'} bg={bg}>
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
