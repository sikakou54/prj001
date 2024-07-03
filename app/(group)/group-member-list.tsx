import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
    ApplicationStatus,
    ApplicationState,
    COLOR,
    RootState,
    SystemException,
    UserInfo,
    GroupMember,
    AlertResult,
    AlertType,
} from '../../src/Type'
import {
    Box,
    HStack,
    ScrollView,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RefreshControl, TouchableOpacity } from 'react-native'
import { AppDispatch } from '../../src/Store'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import {
    delete_group_member,
    load_group_member,
    load_group_member_paging,
} from '../../src/Store/Reducer'
import Card from '../../src/Compenent/Card'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import { AlertContext, ToastContext } from '../../src/context'
import { SwipeListView } from 'react-native-swipe-list-view'

export default function GroupMemberList() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const { group_id } = useLocalSearchParams<{ group_id: string, is_admin: string }>()
    const dispatch: AppDispatch = useDispatch()
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const member: GroupMember[] = useSelector((state: RootState) => state.Group.member, shallowEqual)
    const [select_user, set_selecte_user] = useState<{ user_id: string, name: string } | undefined>(undefined)
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const ListItem = React.memo(({
        user_id,
        name,
        img,
    }: {
        user_id: string
        name: string
        img: string | null
    }) => {
        return (
            <Card
                key={user_id}
                bg={useColorModeValue(COLOR.WHITE, COLOR.BLACK)}
            >
                <HStack
                    w={'full'}
                    h={70}
                    alignItems={'center'}
                    pl={1}
                    space={1}
                >
                    <Box
                        w={'15%'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <AvatarIcon
                            img={img}
                            defaultIcon={<Text color={COLOR.WHITE}>{name.substring(0, 1)}</Text>}
                            size={45}
                        />
                    </Box>
                    <Text
                        fontSize={'sm'}
                        maxW={'full'}
                        fontWeight={'bold'}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                    >{name}</Text>
                </HStack>
            </Card>
        )
    })

    const renderItem = useCallback(({ item }: { item: GroupMember }) => (
        <ListItem
            user_id={item.user_id}
            name={item.name}
            img={item.img}
        />
    ), [])
    const keyExtractor = useCallback((item: GroupMember) => item.user_id, [])
    const onEndReached = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        //console.log('onEndReached!', distanceFromEnd)
        dispatch(load_group_member_paging({ group_id: group_id as string, offset: member.length }))
    }, [group_id, member])
    const callback = useCallback((result: AlertResult) => {
        if (AlertResult.Yes === result && undefined !== select_user) {
            if (UserInfo.id === select_user.user_id) {
                dispatch(delete_group_member({ group_id: group_id as string })).then((item) => {
                    const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                    if (status === ApplicationState.Success) {
                        toast?.showToast({
                            title: `グループを退会しました`,
                            bg: COLOR.LIGHT_GREEN,

                        })
                        router.back()
                        router.back()
                    } else if (code === SystemException.ConditionalCheckFailedException) {
                        toast?.showToast({
                            title: '他の端末によって情報が更新されています',
                            bg: COLOR.GRAY,

                        })
                    }
                })
                return
            }
            dispatch(delete_group_member({
                group_id: group_id as string,
                user_id: select_user.user_id
            })).then((item) => {
                const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    const user = member.find((item) => item.user_id === select_user.user_id)
                    toast?.showToast({
                        title: `${user?.name}さんがグループから退会しました`,
                        bg: COLOR.LIGHT_GREEN
                    })
                    set_selecte_user(undefined)
                } else if (code === SystemException.ConditionalCheckFailedException) {
                    toast?.showToast({
                        title: '他の端末によって情報が更新されています',
                        bg: COLOR.GRAY,

                    })
                }
            })
        }
    }, [select_user])
    const renderHiddenItem = useCallback((data: any, rowMap: any) => (
        <HStack flex={1} justifyContent="flex-end" alignItems="center">
            <TouchableOpacity onPress={() => set_selecte_user({ user_id: data.item.user_id, name: data.item.name })}>
                <Box
                    w={75}
                    h={'full'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    bg={COLOR.RED}
                >
                    <Text
                        fontSize={'sm'}
                        color={COLOR.WHITE}
                    >退会</Text>
                </Box>
            </TouchableOpacity>
        </HStack>
    ), [])

    useEffect(() => {
        if (undefined !== select_user) {
            alert?.setAlert({
                type: AlertType.YesNo,
                title: `${select_user.name}さんがグループから退会となります。よろしいですか？`,
                callback
            })
        }
    }, [select_user])

    return (
        <Box
            w={'full'}
            h={'full'}
            alignItems={'center'}
            bg={bg}
        >
            <Stack.Screen
                options={{
                    title: 'メンバー',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: useColorModeValue(COLOR.WHITE, COLOR.BLACK),
                    },
                    headerTintColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE)
                }}
            />
            {member.length > 0 ? (
                <VStack
                    w={'full'}
                    h={'full'}
                >
                    <SwipeListView
                        data={member}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        refreshing={false}
                        onRefresh={() =>
                            dispatch(load_group_member({ group_id: group_id as string }))
                        }
                        initialNumToRender={30}
                        maxToRenderPerBatch={30}
                        onEndReached={onEndReached}
                        onStartReachedThreshold={0}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-75}
                        disableRightSwipe={true}
                        stopRightSwipe={-75}
                    />
                </VStack>
            ) : (
                <ScrollView
                    w={'full'}
                    h={'full'}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() =>
                                dispatch(load_group_member({ group_id: group_id as string }))
                            }
                        />
                    }
                >
                    <Box
                        w={'full'}
                        h={'full'}
                        alignItems={'center'}
                    >
                        <Text
                            mt={5}
                            fontSize={'md'}
                            fontWeight={'bold'}
                        >メンバーがいません</Text>
                    </Box>
                </ScrollView>
            )}
        </Box>
    )
}
