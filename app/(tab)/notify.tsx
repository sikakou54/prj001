import { Stack, router } from 'expo-router'
import { Badge, Box, HStack, Text, ZStack, useColorMode, useColorModeValue } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Dimensions, useWindowDimensions } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'
import { TouchableOpacity } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import SendNotifyList from '../../src/Compenent/SendNotifyList'
import ReceiveNotifyList from '../../src/Compenent/ReceiveNotifyList'
import Card from '../../src/Compenent/Card'
import { COLOR, RootState, Ticket, UserInfo } from '../../src/Type'
import { shallowEqual, useSelector } from 'react-redux'

const renderScene = SceneMap({
    ID1: SendNotifyList,
    ID2: ReceiveNotifyList,
})
const width = Dimensions.get('window').width
export default function Page() {
    const { colorMode } = useColorMode()
    const bg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const bg2 = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const layout = useWindowDimensions()
    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'ID1', title: '送信' },
        { key: 'ID2', title: '受信' },
    ])
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const Tickets: Ticket[] = useSelector((state: RootState) => state.Notify.Tickets, shallowEqual)
    const renderTabBar = (props: any) => {

        useEffect(() => {
            setSelectedTabIndex(props.navigationState.index)
        }, [props.navigationState.index])

        return (
            <Box
                w={'full'}
                bg={bg}
                alignItems={'center'}
            >
                <HStack
                    w={width}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    {props.navigationState.routes.map((route: any, i: number) => {
                        return (
                            <TouchableOpacity key={i} onPress={() => setIndex(i)}>
                                <Box
                                    w={width / 2}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    p={2}
                                    borderBottomColor={useColorModeValue(
                                        COLOR.DEEP_GREEN,
                                        COLOR.WHITE
                                    )}
                                    borderBottomWidth={i === index ? 5 : 0}
                                >
                                    <Text
                                        fontSize={i === index ? 'lg' : 'md'}
                                        fontWeight={i === index ? 'bold' : 'normal'}
                                    >{route.title}</Text>
                                </Box>
                            </TouchableOpacity>
                        )
                    })}
                </HStack>
            </Box>

        )
    }

    return (
        <ZStack
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: '通知',
                    headerRight: UserInfo.ticket_num > 0 ? () => {
                        if (0 === selectedTabIndex) {
                            return (
                                <AntDesign
                                    name='pluscircle'
                                    style={{ paddingRight: 15 }}
                                    size={30}
                                    color={
                                        colorMode === 'light'
                                            ? COLOR.DEEP_GREEN
                                            : COLOR.WHITE
                                    }
                                    onPress={() =>
                                        router.push('/create-notify')
                                    } />
                            )
                        } else {
                            return null
                        }
                    } : undefined,
                    headerLeft: () => {
                        if (0 === selectedTabIndex) {
                            return (
                                <TouchableOpacity onPress={() => router.push('/ticket-detail')}>
                                    <Box
                                        w={85}
                                        ml={1}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                    >
                                        <Card
                                            bg={bg2}
                                            p={2}
                                            roundedTop={'md'}
                                            roundedBottom={'md'}
                                        >
                                            <HStack
                                                w={'full'}
                                                alignItems={'center'}
                                                justifyContent={'space-around'}
                                            >
                                                <ZStack
                                                    w={45}
                                                    alignItems={'center'}
                                                    justifyContent={'center'}
                                                >
                                                    <MaterialCommunityIcons
                                                        name='ticket-confirmation'
                                                        style={{ paddingRight: 10 }}
                                                        size={30}
                                                        color={
                                                            colorMode === 'light'
                                                                ? COLOR.DEEP_GREEN
                                                                : COLOR.WHITE
                                                        }
                                                    />
                                                    {Tickets.length > 0 && (
                                                        <Badge
                                                            w={45}
                                                            bg={COLOR.LIGHT_GREEN}
                                                            rounded={"full"}
                                                            variant={"solid"}
                                                            bottom={1}
                                                            right={-15}
                                                        >
                                                            <Text color={COLOR.WHITE}>{Tickets.length > 99 ? '99+' : Tickets.length}</Text>
                                                        </Badge>
                                                    )}
                                                </ZStack>
                                                <Box
                                                    w={'55%'}
                                                    alignItems={'center'}
                                                    justifyContent={'center'}
                                                >
                                                    <Text fontSize={'sm'}>{UserInfo.ticket_num > 999 ? '999+' : UserInfo.ticket_num}</Text>
                                                </Box>
                                            </HStack>
                                        </Card>
                                    </Box>
                                </TouchableOpacity>
                            )
                        } else {
                            return null
                        }
                    },
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: useColorModeValue(COLOR.WHITE, COLOR.BLACK),
                    },
                    headerTintColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE),
                    headerShadowVisible: false
                }}
            />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
            />
        </ZStack>
    )
}
