import { Stack, router } from 'expo-router'
import {
    Box,
    Button,
    VStack,
    useColorModeValue,
} from 'native-base'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    SystemException,
    RootState,
    UserInfo,
} from '../../src/Type'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useContext, useState } from 'react'
import { AppDispatch } from '../../src/Store'
import { update_acount_name } from '../../src/Store/Reducer'
import TextInput from '../../src/Compenent/TextInput'
import { ToastContext } from '../../src/context'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const dispatch: AppDispatch = useDispatch()
    const UserInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const [username, setUsername] = useState<string>(UserInfo.name)
    const toast = useContext(ToastContext)
    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    title: '名前を変更する',
                }}
            />

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
                    label='名前'
                    maxLength={15}
                    onChangeText={setUsername}
                    text={username}
                />
            </VStack>
            <Button
                w={'95%'}
                h={12}
                bg={COLOR.LIGHT_GREEN}
                borderRadius={10}
                onPress={() => dispatch(update_acount_name({
                    name: username
                })).then((item) => {
                    const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                    if (status === ApplicationState.Success) {
                        toast?.showToast({
                            title: '名前を変更しました',
                            bg: COLOR.LIGHT_GREEN,

                        })
                        router.back()
                    } else if (code === SystemException.ConditionalCheckFailedException) {
                        toast?.showToast({
                            title: '他の端末によって情報が更新されています',
                            bg: COLOR.GRAY,

                        })
                    }
                })}
                isDisabled={username === '' || username === UserInfo.name}
                rounded={'md'}
            >変更する</Button>
        </Box>
    )
}

export default Page
