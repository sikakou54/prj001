import React, { useCallback, useMemo } from 'react'
import {
    COLOR,
    SendNotifyAsnwer,
    SendNotifyChoice,
    RootState,
    SendNotifyContent
} from '../../src/Type'
import {
    Box,
    FlatList,
    HStack,
    ScrollView,
    Text,
    useColorModeValue,
    VStack,
} from 'native-base'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RefreshControl } from 'react-native'
import { AppDispatch } from '../../src/Store'
import { Stack, useLocalSearchParams } from 'expo-router'
import { load_send_notify_answer_list, load_send_notify_answer_list_paging } from '../../src/Store/Reducer'
import { textTrim } from '../../src/Api/Common'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import Card from '../../src/Compenent/Card'

export default function NotifyAnswerMemberList() {
    const { notify_id, choice } = useLocalSearchParams<{
        notify_id: string
        choice: string
        group_id: string
    }>()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const dispatch: AppDispatch = useDispatch()
    const answer: SendNotifyAsnwer[] = useSelector((state: RootState) => state.Notify.Send.answer, shallowEqual)
    const choices: SendNotifyChoice[] = useSelector((state: RootState) => state.Notify.Send.choices, shallowEqual)
    const contents: SendNotifyContent[] = useSelector((state: RootState) => state.Notify.Send.contents, shallowEqual)
    const Choice = useMemo(() => choices.find((item) => item.choice === Number(choice)), [choices])
    const content = useMemo(() => contents.find((item) => item.notify_id === notify_id), [contents])
    const ListItem = React.memo(({ name, img, remarks, is_anonym }: { name: string, img: string | null, remarks: string | null, is_anonym: boolean }) => {
        return (
            <Card bg={cardBg} p={3}>
                <HStack
                    w={'full'}
                    alignItems={'center'}
                    space={3}
                >
                    <AvatarIcon
                        img={is_anonym ? null : img}
                        defaultIcon={<Text color={COLOR.WHITE}>{is_anonym ? '匿' : name.substring(0, 1)}</Text>}
                    />
                    <VStack w={'full'} space={1}>
                        {!is_anonym && (
                            <Text fontSize={'sm'}>{name}</Text>
                        )}
                        {remarks !== null && (
                            <Text w={'90%'} fontSize={is_anonym ? 'sm' : 'xs'} color={is_anonym ? undefined : COLOR.GRAY}>{remarks}</Text>
                        )}
                    </VStack>
                </HStack>
            </Card>
        )
    })
    const renderItem = useCallback(({ item }: { item: SendNotifyAsnwer }) => (
        <ListItem
            name={item.name}
            img={item.img}
            remarks={item.remarks}
            is_anonym={content?.is_anonym === 1 ? true : false}
        />
    ), [content])
    const keyExtractor = useCallback((item: SendNotifyAsnwer) => item.user_id, [])
    const useTitle = useCallback(() => {
        return undefined !== Choice?.text ? Choice?.text : ''
    }, [Choice])
    const onEndReached = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        //console.log('onEndReached!', distanceFromEnd)
        dispatch(load_send_notify_answer_list_paging({ choice: Number(choice), notify_id, offset: answer.length }))
    }, [answer, choice, notify_id])

    return (
        <Box h={'full'} bg={bg}>
            <Stack.Screen
                options={{
                    title: textTrim(useTitle(), 20)
                }}
            />
            {answer.length > 0 ? (
                <FlatList
                    w={'full'}
                    h={'full'}
                    data={answer}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    refreshing={false}
                    onRefresh={() => dispatch(load_send_notify_answer_list({ choice: Number(choice), notify_id }))}
                    onEndReached={onEndReached}
                    onStartReachedThreshold={0}
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                />
            ) : (
                <ScrollView
                    w={'full'}
                    h={'full'}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => dispatch(load_send_notify_answer_list({ choice: Number(choice), notify_id }))}
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
                            fontWeight={'bold'}
                            fontSize={'md'}
                        >回答がありません</Text>
                    </Box>
                </ScrollView>
            )}
        </Box>
    )
}
