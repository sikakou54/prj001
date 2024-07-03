import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Text, VStack, useColorModeValue } from 'native-base'
import { AppDispatch } from '../../src/Store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { update_group_public } from '../../src/Store/Reducer'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    SystemException,
    RootState,
} from '../../src/Type'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { GroupContent } from '../../src/Type'
import TextBox from '../../src/Compenent/TextBox'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { ToastContext } from '../../src/context'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const { group_id } = useLocalSearchParams<{ group_id: string }>()
    const contents: GroupContent[] = useSelector((state: RootState) => state.Group.contents, shallowEqual)
    const content: GroupContent | undefined = contents.find((item) => item.group_id === group_id)
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)
    const [isPublic, setPublic] = useState<number>(undefined !== content ? content.public : 0)

    const setting = useCallback(() => {
        dispatch(update_group_public({
            group_id,
            public: isPublic
        })).then((item) => {
            const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                toast?.showToast({
                    title: `グループへの参加を${isPublic === 0 ? '禁止' : '許可'}しました`,
                    bg: COLOR.LIGHT_GREEN
                })
                router.back()
            } else if (code === SystemException.ConditionalCheckFailedException) {
                toast?.showToast({
                    title: '他の端末によって情報が更新されています',
                    bg: COLOR.GRAY,

                })
            }
        })
    }, [group_id, isPublic])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    title: 'グループの参加を設定する',
                }}
            />
            {undefined !== content ? (
                <>
                    <VStack
                        alignItems={'center'}
                        mt={5}
                        w={'95%'}
                        mb={5}
                    >
                        <TextBox
                            onPress={() => setPublic(1)}
                            text={'許可する'}
                            roundedTop={'md'}
                            rightIcon={
                                isPublic === 1 ? (<FontAwesome
                                    name='check-circle'
                                    size={30}
                                    color={COLOR.GREEN}
                                />) : (undefined)
                            }
                        />
                        <TextBox
                            onPress={() => setPublic(0)}
                            text={'禁止する'}
                            roundedBottom={'md'}
                            rightIcon={
                                isPublic === 0 ? (<FontAwesome
                                    name='check-circle'
                                    size={30}
                                    color={COLOR.GREEN}
                                />) : (undefined)
                            }
                        />
                    </VStack>
                    <Button
                        w={'95%'}
                        h={12}
                        borderRadius={10}
                        onPress={setting}
                        bg={COLOR.LIGHT_GREEN}
                        isDisabled={isPublic === content.public}
                        rounded={'md'}
                    >変更する</Button>
                </>
            ) : (
                <Box
                    w={'full'}
                    h={'full'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    bg={bg}
                >
                    <AntDesign
                        name='question'
                        size={100}
                        color={COLOR.GRAY}
                    />
                    <Text
                        fontWeight={'bold'}
                        fontSize={'sm'}
                    >グループが存在しません</Text>
                </Box>
            )}
        </Box>
    )
}

export default Page
