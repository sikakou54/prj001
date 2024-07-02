import { Stack, router, useNavigation } from 'expo-router'
import { Avatar, Box, FormControl, HStack, Text, VStack, useColorModeValue } from 'native-base'
import { AlertResult, AlertType, ApplicationState, ApplicationStatus, COLOR, RootState, UserInfo } from '../../src/Type'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AntDesign, Entypo, Feather } from '@expo/vector-icons'
import TextBox from '../../src/Compenent/TextBox'
import { TouchableOpacity } from 'react-native'
import { AppDispatch } from '../../src/Store'
import { delete_user } from '../../src/Store/Reducer'
import { useCallback, useContext } from 'react'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import * as Notifications from 'expo-notifications'
import { AlertContext } from '../../src/context'

function Page() {
    const navigation = useNavigation()
    const dispatch: AppDispatch = useDispatch()
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const alert = useContext(AlertContext)
    const pickImage = useCallback(async () => {
        router.push({ pathname: '/(setting)/setting-account-image' })
    }, [])
    const onPressAcountDelete = useCallback(() => {
        alert?.setAlert({
            type: AlertType.OkCancel,
            title: 'アカウントを削除します',
            disc: '削除すると全てのデータが削除されます',
            callback: (result: AlertResult) => {
                if (result === AlertResult.Ok) {
                    dispatch(delete_user()).then((item) => {
                        const { status }: ApplicationStatus = item.payload as ApplicationStatus
                        if (status === ApplicationState.Success) {
                            Notifications.setBadgeCountAsync(0)
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
    }, [alert])

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
                space={2}
            >
                <AntDesign
                    name='closecircleo'
                    size={26}
                    color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                    onPress={(() => router.back())}
                />
                <Box w={'full'}>
                    <Text
                        fontSize={'sm'}
                        w={'90%'}
                        numberOfLines={2}
                        ellipsizeMode={'tail'}
                    >アカウント</Text>
                </Box>
            </HStack>
            <VStack h={'full'} alignItems={'center'} space={3} pt={3} bg={bg}>
                <Box w={'full'} alignItems={'center'} justifyContent={'center'}>
                    <TouchableOpacity onPress={pickImage}>
                        <Avatar borderColor={cardBg} borderWidth={4} bg="gray.400" size={120}>
                            <AvatarIcon
                                img={UserInfo.img}
                                defaultIcon={<Text color={COLOR.WHITE} fontSize={'4xl'}>{(UserInfo.name).substring(0, 1)}</Text>}
                                size={120}
                            />
                            <Avatar.Badge
                                bg={bg}
                                borderColor={cardBg}
                                borderWidth={2}
                                size={9}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <Feather name='edit-2' size={18} color={COLOR.GRAY} />
                            </Avatar.Badge>
                        </Avatar>
                    </TouchableOpacity>
                </Box>
                <VStack w={'95%'} space={3}>
                    <FormControl.Label>名前</FormControl.Label>
                    <TextBox
                        onPress={() => router.push('/change-username')}
                        leftIcon={
                            <AntDesign
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
                        text={UserInfo.name}
                        roundedTop={'md'}
                        roundedBottom={'md'}
                        fontSize={'sm'}
                    />
                </VStack>
                <VStack w={'95%'} space={3}>
                    <FormControl.Label>パスワード</FormControl.Label>
                    <TextBox
                        onPress={() => router.push({
                            pathname: '/send-password-reset',
                            params: {
                                mail: UserInfo.mail
                            }
                        })}
                        leftIcon={
                            <Entypo name='key'
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
                        text={'登録完了'}
                        roundedTop={'md'}
                        roundedBottom={'md'}
                        fontSize={'sm'}
                    />
                </VStack>
                <TouchableOpacity onPress={onPressAcountDelete}>
                    <Box w={'full'} alignItems={'center'} justifyContent={'center'} >
                        <Text m={5} color={COLOR.RED} fontSize={'sm'}>アカウントを削除する</Text>
                    </Box>
                </TouchableOpacity>
            </VStack>
        </Box>
    )
}

export default Page
