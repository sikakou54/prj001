import { Stack } from "expo-router"
import { AppDispatch } from "../../src/Store"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { Box, Button, Divider, HStack, ScrollView, Text, VStack, useColorModeValue } from 'native-base'
import { ApplicationState, ApplicationStatus, COLOR, SystemException, RootState, UserInfo, Ticket } from "../../src/Type"
import TextBox from "../../src/Compenent/TextBox"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Card from "../../src/Compenent/Card"
import React, { useContext } from 'react'
import { load_ticket, update_ticket } from "../../src/Store/Reducer"
import { router } from "expo-router"
import { RefreshControl } from 'react-native'
import { ToastContext } from "../../src/context"
import TitleHeader from "../../src/Compenent/TitleHeader"

export default function Page() {
    const dispatch: AppDispatch = useDispatch()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const Tickets: Ticket[] = useSelector((state: RootState) => state.Notify.Tickets, shallowEqual)
    const toast = useContext(ToastContext)
    const ListItem = React.memo(({ ticket_id, comment, count }: { ticket_id: string, comment: string, count: number, }) => {
        return (
            <Box
                w={'full'}
            >
                <HStack
                    w={'full'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    p={3}
                >
                    <Text w={'60%'}>{comment}</Text>
                    <Text w={'15%'}>{count}</Text>
                    <Box w={'25%'}>
                        <Button
                            bg={COLOR.LIGHT_GREEN}
                            onPress={() => dispatch(update_ticket({
                                ticket_id
                            })).then((item) => {
                                const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                                if (ApplicationState.Success === status) {
                                    toast?.showToast({
                                        title: 'チケットを受け取りました',
                                        bg: COLOR.LIGHT_GREEN,

                                    })
                                } else if (code === SystemException.ConditionalCheckFailedException) {
                                    toast?.showToast({
                                        title: '他の端末によって情報が更新されています',
                                        bg: COLOR.GRAY,

                                    })
                                }
                            })}
                            rounded={'md'}
                        >受け取る</Button>
                    </Box>
                </HStack>
            </Box>
        )
    })

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
                    gestureDirection: 'vertical',
                }}
            />
            <TitleHeader title={'チケット'} />
            <ScrollView
                w={'full'}
                h={'90%'}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => dispatch(load_ticket())}
                    />
                }
                bg={bg}
            >
                <VStack
                    w={'full'}
                    h={'full'}
                    alignItems={'center'}
                    space={3}
                >
                    <Box w={'95%'} pt={3}>
                        <TextBox
                            fontSize={'md'}
                            leftIcon={
                                <MaterialCommunityIcons
                                    name='ticket-confirmation'
                                    size={30}
                                    color={useColorModeValue(COLOR.DEEP_GREEN, COLOR.WHITE)}
                                />
                            }
                            text={String(UserInfo.ticket_num)}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                        />
                    </Box>
                    <Divider color={'gray.300'} w={'95%'} />
                    <Box w={'95%'} >
                        <Card
                            bg={cardBg}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                        >
                            <HStack
                                w={'full'}
                                alignItems={'center'}
                                p={3}
                            >
                                <Text w={'60%'}>コメント</Text>
                                <Text w={'15%'}>枚数</Text>
                            </HStack>
                        </Card>
                    </Box>
                    {Tickets.length > 0 ? (
                        <Box w={'95%'} h={'full'}>
                            <Card
                                bg={cardBg}
                                roundedTop={'md'}
                                roundedBottom={'md'}
                            >
                                {Tickets.map(({ comment, count, ticket_id, update_at }, index) => (
                                    <ListItem key={index} comment={comment} count={count} ticket_id={ticket_id} />
                                ))}
                            </Card>
                        </Box>
                    ) : (
                        <Text
                            fontSize={'sm'}
                            color={COLOR.GRAY}
                        >受け取り可能なチケットはありません</Text>
                    )}
                </VStack>
            </ScrollView>
            <Button
                w={'full'}
                h={'10%'}
                bg={COLOR.LIGHT_GREEN}
                borderRadius={0}
                onPress={() => router.push('/reword')}
            >
                <Text
                    color={'white'}
                    fontSize={'md'}
                >動画を見てチケットを獲得する</Text>
            </Button>
        </Box>
    )
}
