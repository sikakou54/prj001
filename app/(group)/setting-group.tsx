import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
    Avatar,
    Box,
    FormControl,
    HStack,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import { AntDesign, Entypo, Feather } from '@expo/vector-icons'
import { AppDispatch } from '../../src/Store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { load_group_member, delete_group_member } from '../../src/Store/Reducer'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    SystemException,
    RootState,
    AlertResult,
    AlertType
} from '../../src/Type'
import { TouchableOpacity } from 'react-native'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import TextBox from '../../src/Compenent/TextBox'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import { GroupContent } from '../../src/Type'
import { AlertContext, ToastContext } from '../../src/context'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const { group_id } = useLocalSearchParams<{ group_id: string }>()
    const contents: GroupContent[] = useSelector((state: RootState) => state.Group.contents, shallowEqual)
    const content: GroupContent | undefined = contents.find((item) => item.group_id === group_id)
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const [btnClickState, setBtnClickState] = useState<boolean>(false)

    const callbackGroupDelete = useCallback((result: AlertResult) => {
        if (result === AlertResult.Yes) {
            if (undefined !== content) {
                dispatch(delete_group_member({ group_id: content.group_id })).then((item) => {
                    const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                    if (status === ApplicationState.Success) {
                        toast?.showToast({
                            title: `グループを退会しました`,
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
            }
        }
    }, [contents, content])
    const pickImage = useCallback(async () => {
        try {
            router.push({
                pathname: '/(group)/setting-group-image',
                params: {
                    group_id
                },
            })
        } catch (e) {
            console.error('pickImage', e)
        }
    }, [group_id, content])
    const onCopy = useCallback(async () => {
        if (undefined !== content && !btnClickState) {
            setBtnClickState(true)
            Clipboard.setStringAsync(content.code).then(() => {
                toast?.showToast({
                    title: `コピーしました`,
                    bg: COLOR.LIGHT_GREEN,

                })
            })
        }
    }, [btnClickState, content])

    useEffect(() => {
        if (undefined === content) {
            router.replace('/(error)/question')
        }
    }, [content])

    useEffect(() => {
        //コピーを連打したした時の対応
        if (true === btnClickState) {
            setTimeout(() => setBtnClickState(false), 2500);
        }
    }, [btnClickState])

    if (undefined !== content) {
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
                <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    w={'full'}
                    h={'8%'}
                    pl={3}
                    pr={3}
                >
                    <AntDesign
                        name='closecircleo'
                        size={26}
                        color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                        onPress={(() => router.back())}
                    />
                </HStack>
                <VStack w={'95%'} space={3} mt={5}>
                    <Box w={'full'} alignItems={'center'} justifyContent={'center'}>
                        <TouchableOpacity onPress={pickImage}>
                            <Avatar borderColor={cardBg} borderWidth={4} bg="gray.400" size={120}>
                                <AvatarIcon
                                    img={content.img}
                                    defaultIcon={<Text color={COLOR.WHITE} fontSize={'4xl'}>{(content.name).substring(0, 1)}</Text>}
                                    size={120}
                                />
                                <Avatar.Badge bg={bg} borderColor={cardBg} borderWidth={2} size={9} alignItems={'center'} justifyContent={'center'}><Feather name='edit-2' size={18} color={COLOR.GRAY} /></Avatar.Badge>
                            </Avatar>
                        </TouchableOpacity>
                    </Box>
                    <FormControl.Label>グループ情報</FormControl.Label>
                    <VStack w={'full'}>
                        <TextBox
                            onPress={() => {
                                router.push({
                                    pathname: '/change-group-name',
                                    params: {
                                        group_id: group_id as string,
                                    }
                                })
                            }}
                            fontSize={'sm'}
                            leftIcon={
                                <Feather
                                    name='users'
                                    size={18}
                                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                />
                            }
                            rightIcon={
                                <AntDesign
                                    name='right'
                                    size={18}
                                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                />
                            }
                            text={content.name}
                            roundedTop={'md'}
                        />
                        <TextBox
                            onPress={() =>
                                dispatch(load_group_member({ group_id: group_id as string })).then((item) => {
                                    const { status }: ApplicationStatus = item.payload as ApplicationStatus
                                    if (status === ApplicationState.Success) {
                                        router.push({
                                            pathname: '/group-member-list',
                                            params: {
                                                group_id
                                            }
                                        })
                                    }
                                })
                            }
                            leftIcon={
                                <Feather
                                    name='user'
                                    size={18}
                                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                />
                            }
                            rightIcon={
                                <AntDesign
                                    name='right'
                                    size={18}
                                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                />
                            }
                            text={`${content.count}人`}
                            fontSize={'sm'}
                        />
                        <TextBox
                            onPress={onCopy}
                            leftIcon={
                                <Entypo
                                    name='code'
                                    size={18}
                                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                />
                            }
                            rightIcon={
                                <Feather
                                    name='copy'
                                    size={18}
                                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                />
                            }
                            roundedBottom={'md'}
                            fontSize={'sm'}
                            text={content.code}
                        />
                    </VStack>
                    <FormControl.Label>設定</FormControl.Label>
                    <TextBox
                        rounded={'md'}
                        onPress={() => router.push({
                            pathname: '/(group)/change-group-public',
                            params: {
                                group_id
                            },
                        })}
                        rightIcon={
                            <HStack alignItems={'center'} justifyContent={'flex-end'} pr={3}>
                                <Text w={60} fontSize={'xs'} color={COLOR.GRAY}>{content.public === 1 ? '許可する' : '禁止する'}</Text>
                                <AntDesign
                                    name='right'
                                    size={18}
                                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                />
                            </HStack>
                        }
                        text={'グループへの参加'}
                        fontSize={'sm'}
                    />
                    <Box
                        w={'full'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <TouchableOpacity
                            onPress={
                                () => {
                                    alert?.setAlert({
                                        type: AlertType.YesNo,
                                        title: 'グループを退会します',
                                        disc: 'よろしいですか？',
                                        callback: callbackGroupDelete
                                    })
                                }
                            }
                        >
                            <Text
                                m={5}
                                fontSize={'md'}
                                fontWeight={'bold'}
                                color={'red.500'}
                            >退会する</Text>
                        </TouchableOpacity>
                    </Box>
                </VStack>
            </Box>
        )
    } else {
        return null
    }
}

export default Page
