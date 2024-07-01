import React, { useCallback } from 'react'
import {
    Box,
    FlatList,
    HStack,
    ScrollView,
    Text,
    useColorMode,
    useColorModeValue,
} from 'native-base'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RefreshControl } from 'react-native'
import { Stack, router } from 'expo-router'
import Card from '../../src/Compenent/Card'
import { AppDispatch } from '../../src/Store'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import { COLOR, GroupContent } from '../../src/Type'
import { RootState, UserInfo } from '../../src/Type'
import { load_group, load_group_paging } from '../../src/Store/Reducer'
import { AntDesign } from '@expo/vector-icons'

export default function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const contents: GroupContent[] = useSelector((state: RootState) => state.Group.contents, shallowEqual)
    const userInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const dispatch: AppDispatch = useDispatch()
    const { colorMode } = useColorMode()
    const ListItem = React.memo(({ group_id, name, count, img }: { group_id: string, name: string, img: string | null, count: number }) => {
        return (
            <Card onPress={() => onPress(group_id)} bg={useColorModeValue(COLOR.WHITE, COLOR.BLACK)}>
                <HStack
                    h={70}
                    alignItems={'center'}
                    pl={1}
                    w={'full'}
                    space={1}
                >
                    <Box
                        w={'15%'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <AvatarIcon
                            size={45}
                            img={img}
                            defaultIcon={<Text color={COLOR.WHITE}>{name.substring(0, 1)}</Text>}
                        />
                    </Box>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'normal'}
                        numberOfLines={2}
                        ellipsizeMode={'tail'}
                        maxW={'65%'}
                    >{name}</Text>
                    <Text
                        fontWeight={'normal'}
                        fontSize={'sm'}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        maxW={'20%'}
                    >（{count}）</Text>
                </HStack>
            </Card>
        )
    })
    const renderItem = useCallback(({ item }: { item: GroupContent }) => (
        <ListItem
            group_id={item.group_id}
            name={item.name}
            count={item.count}
            img={item.img}
        />
    ), [])
    const keyExtractor = useCallback((item: GroupContent) => item.group_id, [])
    const onPress = useCallback((group_id: string) => {
        router.push({
            pathname: '/setting-group',
            params: {
                group_id
            },
        })
    }, [])
    const Header = useCallback(() => {
        return (
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'グループ',
                    headerRight: () => {
                        return (
                            <AntDesign
                                name='pluscircle'
                                style={{ paddingRight: 15 }}
                                size={30}
                                color={colorMode === 'light' ? COLOR.DEEP_GREEN : COLOR.WHITE}
                                onPress={() => router.push('/add-create-group')}
                            />
                        )
                    },
                    headerLeft: () => {
                        return (
                            <AntDesign
                                name='search1'
                                style={{ paddingLeft: 15 }}
                                size={30}
                                color={colorMode === 'light' ? COLOR.DEEP_GREEN : COLOR.WHITE}
                                onPress={() =>
                                    router.push('/(group)/add-join-group')
                                } />
                        )
                    },
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: useColorModeValue(COLOR.WHITE, COLOR.BLACK)
                    },
                    headerTintColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE),
                    headerShadowVisible: false
                }}
            />
        )
    }, [colorMode])
    const onEndReached = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        //console.log('onEndReached!', distanceFromEnd)
        dispatch(load_group_paging({ user_id: userInfo.id, offset: contents.length }))
    }, [contents])

    if (contents.length > 0) {

        return (
            <Box
                w={'full'}
                h={'full'}
                bg={bg}
            >
                <Header />
                <FlatList
                    w={'full'}
                    h={'full'}
                    data={contents}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    refreshing={false}
                    onEndReached={onEndReached}
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    onStartReachedThreshold={0}
                    onEndReachedThreshold={0.3}
                    onRefresh={() => dispatch(load_group())}
                />
            </Box>
        )

    } else {

        return (
            <Box
                w={'full'}
                h={'full'}
                bg={bg}
            >
                <Header />
                <ScrollView
                    w={'full'}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => dispatch(load_group())}
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
                        >グループがありません</Text>
                    </Box>
                </ScrollView>
            </Box>
        )
    }
}
