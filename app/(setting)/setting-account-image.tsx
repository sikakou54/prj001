import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
    Box,
    HStack,
    Image,
    useColorModeValue,
} from 'native-base'
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons'
import { AppDispatch } from '../../src/Store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { delete_user_avator, upload_user_avator } from '../../src/Store/Reducer'
import {
    AlertResult,
    AlertType,
    ApplicationState,
    ApplicationStatus,
    COLOR,
    RootState,
    UserInfo,
} from '../../src/Type'
import { Dimensions } from 'react-native'
import { Stack, router } from 'expo-router'
import IconLabel from '../../src/Compenent/IconLabel'
import { pickUpImage } from '../../src/Api/Common'
import * as ImagePicker from 'expo-image-picker'
import { AlertContext, ToastContext } from '../../src/context'

const width = Dimensions.get('window').width

function Page() {
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)
    const alert = useContext(AlertContext)
    const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const callback = useCallback((result: AlertResult) => {
        if (result === AlertResult.Ok &&
            null !== UserInfo.img &&
            null !== UserInfo.id) {
            dispatch(delete_user_avator({
                path: UserInfo.img
            })).then((item) => {
                const { status }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    toast?.showToast({
                        title: '削除しました',
                        bg: COLOR.LIGHT_GREEN
                    })
                }
            })
        }
    }, [UserInfo.id, UserInfo.img])
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

            dispatch(upload_user_avator({ asset })).then((item) => {
                const { status }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    toast?.showToast({
                        title: '更新しました',
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
                pr={2}
            >
                <AntDesign
                    name='closecircleo'
                    size={26}
                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                    onPress={(() => router.back())}
                />
                <HStack w={180} alignItems={'center'} justifyContent={null !== UserInfo.img ? 'space-around' : 'flex-end'}>
                    {UserInfo.img && (
                        <IconLabel
                            onPress={onDeleteImage}
                            w={90}
                            h={12}
                            borderColor={'none'}
                            text={'削除'}
                            icon={
                                <AntDesign
                                    name='delete'
                                    size={26}
                                    color={COLOR.RED}
                                />
                            }
                        />
                    )}
                    <IconLabel
                        onPress={(pickImage)}
                        w={90}
                        h={12}
                        borderColor={'none'}
                        text={'変更'}
                        icon={
                            <FontAwesome
                                name='exchange'
                                size={26}
                                color={COLOR.GREEN}
                            />
                        }
                    />
                </HStack>
            </HStack>
            <Box
                w={'full'}
                h={'92%'}
                justifyContent={'center'}
                alignItems={'center'} >
                {UserInfo.img ? (
                    <Image
                        alt={UserInfo.name}
                        w={width}
                        h={width}
                        source={{ uri: UserInfo.img }}
                    />
                ) : (
                    <Entypo
                        name='image'
                        size={250}
                        color={COLOR.GRAY}
                    />
                )}
            </Box>
        </Box>
    )
}

export default Page
