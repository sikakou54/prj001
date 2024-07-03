import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
    Box,
    HStack,
    Image,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons'
import { AppDispatch } from '../../src/Store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { delete_group_avator, upload_group_avator } from '../../src/Store/Reducer'
import {
    AlertResult,
    AlertType,
    ApplicationState,
    ApplicationStatus,
    COLOR,
    RootState,
} from '../../src/Type'
import { Dimensions } from 'react-native'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { GroupContent } from '../../src/Type'
import IconLabel from '../../src/Compenent/IconLabel'
import * as ImagePicker from 'expo-image-picker'
import { pickUpImage } from '../../src/Api/Common'
import { AlertContext, ToastContext } from '../../src/context'

const width = Dimensions.get('window').width

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const { group_id } = useLocalSearchParams<{ group_id: string }>()
    const contents: GroupContent[] = useSelector((state: RootState) => state.Group.contents, shallowEqual)
    const content: GroupContent | undefined = contents.find((item) => item.group_id === group_id)
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null)

    const callback = useCallback((result: AlertResult) => {
        if (result === AlertResult.Ok &&
            undefined !== content?.group_id &&
            null !== content?.img) {
            dispatch(delete_group_avator({
                group_id: content.group_id,
                path: content.img
            })).then((item) => {
                const { status }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    toast?.showToast({
                        title: '削除しました',
                        bg: COLOR.LIGHT_GREEN,

                    })
                }
            })
        }
    }, [content?.group_id, content?.img])
    const onDeleteImage = useCallback(() => {
        alert?.setAlert({
            type: AlertType.OkCancel,
            title: '画像を削除します',
            disc: 'よろしいですか？',
            callback
        })
    }, [callback])
    const pickImage = useCallback(() => {
        pickUpImage().then((data) => setAsset(data))
    }, [])

    useEffect(() => {
        if (null !== asset) {
            dispatch(upload_group_avator({ group_id: group_id as string, asset })).then((item) => {
                const { status, data }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success && !data.isCancel) {
                    toast?.showToast({
                        title: `更新しました`,
                        bg: COLOR.LIGHT_GREEN,

                    })
                }
            })
        }
    }, [asset])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            safeAreaTop
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'fade',
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
                {undefined !== content && (
                    <HStack w={180} alignItems={'center'} justifyContent={null !== content.img ? 'space-around' : 'flex-end'}>
                        {content.img && (
                            <IconLabel
                                onPress={onDeleteImage}
                                w={90}
                                h={12}
                                borderColor={'none'}
                                text={'削除'}
                                icon={
                                    <AntDesign
                                        name='delete'
                                        onPress={() => { }}
                                        size={26}
                                        color={COLOR.RED}
                                    />
                                }
                            />
                        )}
                        <IconLabel
                            onPress={pickImage}
                            w={90}
                            h={12}
                            borderColor={'none'}
                            text={'変更'}
                            icon={
                                <FontAwesome
                                    name='exchange'
                                    onPress={() => { }}
                                    size={26}
                                    color={COLOR.GREEN}
                                />
                            }
                        />
                    </HStack>
                )}
            </HStack>
            {undefined !== content ? (
                <Box
                    w={'full'}
                    h={'92%'}
                    justifyContent={'center'}
                    alignItems={'center'} >
                    {content.img ? (
                        <Image
                            alt={content.name}
                            w={width}
                            h={width}
                            source={{ uri: content.img }}
                        />
                    ) : (
                        <Entypo
                            name='image'
                            size={250}
                            color={COLOR.GRAY}
                        />
                    )}
                </Box>
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
                        fontSize={'sm'}
                        color={COLOR.GRAY}
                    >グループが存在しません</Text>
                </VStack>
            )}
        </Box>
    )
}

export default Page
