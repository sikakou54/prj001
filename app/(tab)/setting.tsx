import { Box, VStack, useColorModeValue } from 'native-base'
import React, { useCallback, useContext } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AlertResult, AlertType, ApplicationState, ApplicationStatus, COLOR, DeviceInfo, RootState, UserInfo } from '../../src/Type'
import { Stack, router, useNavigation } from 'expo-router'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { AppDispatch } from '../../src/Store'
import { signOut } from '../../src/Store/Reducer'
import TextBox from '../../src/Compenent/TextBox'
import { AlertContext } from '../../src/context'

export default function Page() {
    const navigation = useNavigation()
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const dispatch: AppDispatch = useDispatch()
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const DeviceInfo: DeviceInfo = useSelector((state: RootState) => state.DeviceInfo, shallowEqual)
    const alert = useContext(AlertContext)

    const onPressLogOut = useCallback(() => {
        alert?.setAlert({
            type: AlertType.YesNo,
            title: 'ログアウトしますか？',
            callback: (result: AlertResult) => {
                if (result === AlertResult.Yes) {
                    dispatch(signOut({
                        device_id: DeviceInfo.device_id
                    })).then((item) => {
                        const { status }: ApplicationStatus = item.payload as ApplicationStatus
                        if (status === ApplicationState.Success) {
                            navigation.reset({
                                index: 0,
                                routes: [{
                                    name: '(auth)/home' as never
                                }]
                            })
                        }
                    })
                }
            }
        })
    }, [UserInfo, DeviceInfo])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: '設定',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: useColorModeValue(COLOR.WHITE, COLOR.BLACK),
                    },
                    headerTintColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE),
                    headerShadowVisible: false
                }}
            />
            <VStack
                w={'95%'}
                mt={5}
            >
                <TextBox
                    onPress={() => router.push('/account')}
                    leftIcon={
                        <AntDesign name='profile'
                            size={18}
                            color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                        />
                    }
                    text={'アカウント'}
                    fontSize={'sm'}
                    roundedTop={'md'}
                />
                <TextBox
                    onPress={() => router.push('/policy')}
                    leftIcon={
                        <MaterialIcons
                            name="policy"
                            size={18}
                            color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                        />
                    }
                    text={'プライバシーポリシー'}
                    fontSize={'sm'}
                />
                <TextBox
                    onPress={() => router.push('/terms')}
                    leftIcon={
                        <AntDesign
                            name="filetext1"
                            size={18}
                            color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                        />
                    }
                    text={'利用規約'}
                    fontSize={'sm'}
                />
                <TextBox
                    onPress={onPressLogOut}
                    leftIcon={
                        <MaterialIcons
                            name="logout"
                            size={18}
                            color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                        />
                    }
                    text={'ログアウト'}
                    fontSize={'sm'}
                    roundedBottom={'md'}
                />
            </VStack>
        </Box>
    )
}
