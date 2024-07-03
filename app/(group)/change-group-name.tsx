import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Text, VStack, useColorModeValue } from 'native-base'
import { AppDispatch } from '../../src/Store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { update_group_name } from '../../src/Store/Reducer'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    SystemException,
    RootState,
} from '../../src/Type'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import TextInput from '../../src/Compenent/TextInput'
import { GroupContent } from '../../src/Type'
import { ToastContext } from '../../src/context'
import { AntDesign } from '@expo/vector-icons'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const { group_id } = useLocalSearchParams<{ group_id: string }>()
    const contents: GroupContent[] = useSelector((state: RootState) => state.Group.contents, shallowEqual)
    const content: GroupContent | undefined = contents.find((item) => item.group_id === group_id)
    const [group_name, setName] = useState<string>(content ? content.name : '')
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)

    const regist = useCallback(() => {
        dispatch(update_group_name({
            group_id,
            group_name
        })).then((item) => {
            const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
            if (ApplicationState.Success === status) {
                toast?.showToast({
                    title: 'グループ名を更新しました',
                    bg: COLOR.LIGHT_GREEN,

                })
                router.back()
            } else if (code === SystemException.ConditionalCheckFailedException) {
                toast?.showToast({
                    title: '他の端末によって情報が更新されています',
                    bg: COLOR.GRAY,

                })
            }
        })
    }, [group_id, group_name])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    title: 'グループ名を変更する',
                }}
            />
            {undefined !== content ? (
                <>
                    <VStack
                        w={'95%'}
                        alignItems={'center'}
                        mt={5}
                        mb={5}
                    >
                        <TextInput
                            bg={cardBg}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                            label='グループ名'
                            maxLength={20}
                            onChangeText={setName}
                            text={group_name}
                        />
                    </VStack>
                    <Button
                        w={'95%'}
                        h={12}
                        borderRadius={10}
                        onPress={regist}
                        bg={COLOR.LIGHT_GREEN}
                        isDisabled={'' === group_name || content?.name === group_name}
                        rounded={'md'}
                    >変更する</Button>
                </>
            ) : (
                <VStack
                    w={'full'}
                    h={'full'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    bg={bg}
                    space={1}
                >
                    <AntDesign
                        name='question'
                        size={100}
                        color={COLOR.GRAY}
                    />
                    <Text
                        fontWeight={'bold'}
                        fontSize={'md'}
                        color={COLOR.GRAY}
                    >グループが存在しません</Text>
                </VStack>
            )}
        </Box>
    )

}

export default Page
