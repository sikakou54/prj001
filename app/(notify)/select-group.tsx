import React, { memo, useCallback } from 'react'
import { COLOR, RootState } from '../../src/Type'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
    Box,
    FlatList,
    HStack,
    Text,
    useColorModeValue,
} from 'native-base'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import Card from '../../src/Compenent/Card'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import { GroupContent } from '../../src/Type'
import { AppDispatch } from '../../src/Store'
import { load_group_list, load_group_list_paging } from '../../src/Store/Reducer'

function Page() {
    const dispatch: AppDispatch = useDispatch()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const { title, choiceItems, isChecked } = useLocalSearchParams<{
        title: string
        choiceItems: string
        isChecked: string
    }>()
    const contents: GroupContent[] = useSelector((state: RootState) => state.Group.contents, shallowEqual)

    const onPressSelectList = useCallback((group_id: string) => {
        router.push({
            pathname: '/confirm-notify',
            params: {
                title,
                group_id,
                choiceItems,
                isChecked
            }
        })
    }, [])
    const SelectListItem = memo(({ group_id, name, img }: { group_id: string, name: string, img: string | null }) => {
        return (
            <Box >
                <Card
                    bg={cardBg}
                    onPress={() => onPressSelectList(group_id)}
                >
                    <HStack
                        w={'full'}
                        alignItems={'center'}
                        space={3}
                        mr={0.5}
                        ml={0.5}
                        p={2}
                    >
                        <HStack
                            w={'85%'}
                            alignItems={'center'}
                            space={2}
                        >
                            <AvatarIcon
                                img={img}
                                defaultIcon={<Text
                                    color={COLOR.WHITE}>{name.substring(0, 1)}</Text>}
                            />
                            <Text maxW={'80%'} numberOfLines={2}>{name}</Text>
                        </HStack>
                    </HStack>
                </Card>
            </Box>
        )
    })
    const renderItem = useCallback(({ item }: { item: GroupContent }) => {
        return (
            <SelectListItem
                group_id={item.group_id}
                name={item.name}
                img={item.img}
            />
        )
    }, [])
    const keyExtractor = useCallback((item: GroupContent) => item.group_id, [])
    const onEndReached = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        //console.log('onEndReached!', distanceFromEnd)
        dispatch(load_group_list_paging({ offset: contents.length }))
    }, [contents])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    title: 'グループの選択'
                }}
            />
            <FlatList
                w={'full'}
                h={'full'}
                data={contents.filter((item) => item.count > 0)}
                onRefresh={() => dispatch(load_group_list())}
                refreshing={false}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                initialNumToRender={30}
                maxToRenderPerBatch={30}
                onEndReached={onEndReached}
                onStartReachedThreshold={0}
            />
        </Box>

    )
}

export default Page
