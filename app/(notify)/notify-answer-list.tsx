import React, { useCallback } from 'react'
import {
    COLOR,
    SendNotifyAsnwer,
    SendNotifyChoice,
    RootState
} from '../../src/Type'
import {
    Box,
    FlatList,
    ScrollView,
    Text,
    useColorModeValue,
} from 'native-base'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RefreshControl } from 'react-native'
import { AppDispatch } from '../../src/Store'
import { Stack, useLocalSearchParams } from 'expo-router'
import { load_send_notify_answer_list, load_send_notify_answer_list_paging } from '../../src/Store/Reducer'
import { textTrim } from '../../src/Api/Common'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import TextBox from '../../src/Compenent/TextBox'
import { GroupContent } from '../../src/Type'

export default function NotifyAnswerMemberList() {
    const { notify_id, choice } = useLocalSearchParams<{
        notify_id: string
        choice: string
        group_id: string
    }>()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const dispatch: AppDispatch = useDispatch()
    const answer: SendNotifyAsnwer[] = useSelector((state: RootState) => state.Notify.Send.answer, shallowEqual)
    const ChoiceItem: SendNotifyChoice[] = useSelector((state: RootState) => state.Notify.Send.choices, shallowEqual)
    const contents: GroupContent[] = useSelector((state: RootState) => state.Group.contents, shallowEqual)
    const ListItem = React.memo(({ name, img, }: { name: string, img: string | null }) => {
        return (
            <TextBox
                text={name}
                leftIcon={
                    <AvatarIcon
                        img={img}
                        defaultIcon={<Text color={COLOR.WHITE}>{name.substring(0, 1)}</Text>}
                    />
                }
            />
        )
    })

    const renderItem = useCallback(({ item }: { item: SendNotifyAsnwer }) => (
        <ListItem
            name={item.name}
            img={item.img}
        />
    ), [contents])
    const keyExtractor = useCallback((item: SendNotifyAsnwer) => item.user_id, [])
    const useTitle = useCallback(() => {
        const title = ChoiceItem.find((item) => item.choice === Number(choice))?.text
        return undefined !== title ? title : ''
    }, [ChoiceItem])
    const onEndReached = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        //console.log('onEndReached!', distanceFromEnd)
        dispatch(load_send_notify_answer_list_paging({ choice: Number(choice), notify_id, offset: answer.length }))
    }, [answer, choice, notify_id])

    if (answer.length > 0) {

        return (
            <Box h={'full'} bg={bg}>
                <Stack.Screen
                    options={{
                        title: textTrim(useTitle(), 20)
                    }}
                />
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
            </Box>
        )

    } else {

        return (
            <Box
                w={'full'}
                h={'full'}
                bg={bg}
                alignItems={'center'}
            >
                <Stack.Screen
                    options={{
                        title: textTrim(useTitle(), 20)
                    }}
                />
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
            </Box>
        )
    }
}
