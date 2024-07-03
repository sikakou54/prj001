import React, { useCallback, useState } from 'react'
import {
    Box,
    Button,
    HStack,
    Text,
    VStack,
    useColorModeValue
} from 'native-base'
import { AppDispatch } from '../../src/Store'
import { useDispatch } from 'react-redux'
import { search_group } from '../../src/Store/Reducer'
import { ApplicationStatus, ApplicationState, COLOR } from '../../src/Type'
import { Stack, router } from 'expo-router'
import TextInput from '../../src/Compenent/TextInput'
import { AntDesign } from '@expo/vector-icons'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const [code, setCode] = useState<string>('')
    const dispatch: AppDispatch = useDispatch()
    const [message, sestMessage] = useState<string | undefined>(undefined)

    const search = useCallback(() => {
        dispatch(search_group({ code })).then((item) => {
            const { status, data }: ApplicationStatus = item.payload as ApplicationStatus
            if (status === ApplicationState.Success) {
                router.push({
                    pathname: '/group-search-result',
                    params: {
                        isExist: data.isExist,
                        group_id: data.group_id,
                        name: data.name,
                        img: data.img
                    }
                })
            } else {
                console.log('aaaa')
                sestMessage('グループが見つかりませんでした')
            }
        })
    }, [code])

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
                    >グループを検索する</Text>
                </Box>
            </HStack>
            <Box w={'full'} h={'full'} bg={bg} alignItems={'center'}>
                <VStack
                    w={'95%'}
                    mt={5}
                    mb={5}
                    alignItems={'center'}
                >
                    <TextInput
                        bg={cardBg}
                        roundedTop={'md'}
                        roundedBottom={'md'}
                        label='招待コード'
                        onChangeText={(text) => setCode(text)}
                        text={code}
                        onSubmitEditing={() => { '' !== code && search() }}
                        errorMessage={message}
                    />
                </VStack>
                <Button
                    isDisabled={code === ''}
                    w={'95%'}
                    h={12}
                    textAlign={'center'}
                    onPress={search}
                    bg={COLOR.LIGHT_GREEN}
                    borderRadius={10}
                    rounded={'md'}
                >検索する</Button>
            </Box>
        </Box>
    )
}

export default Page
