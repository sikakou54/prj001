import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Box, Button, Image, Text, VStack } from 'native-base'
import { Stack, useRouter } from 'expo-router'
import { COLOR } from '../../src/Type'

function Page() {
    const router = useRouter()
    return (
        <Box
            w={'full'}
            h={'full'}
            alignItems={'center'}
            bg={COLOR.WHITE}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'fade',
                }}
            />
            <VStack
                h={'full'}
                w={'full'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Box
                    h={'60%'}
                    w={'full'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Image
                        source={require('../../assets/images/brandmark-design.png')}
                        resizeMode="contain"
                        alt='splash'
                        w={'60%'}
                    />
                </Box>
                <VStack
                    h={'40%'}
                    w={'full'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    space={12}
                >
                    <Box
                        w={'full'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Button
                            w={'90%'}
                            h={16}
                            onPress={() => router.push('/login')}
                            bg={COLOR.LIGHT_GREEN}
                            borderRadius={10}
                            rounded={'full'}
                        >
                            <Text
                                color={'white'}
                                fontSize={'md'}
                                fontWeight={'bold'}
                            >ログインする</Text>
                        </Button>
                    </Box>
                    <Box
                        w={'90%'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <TouchableOpacity
                            onPress={() => router.push('/resister')}
                        >
                            <Text
                                color={COLOR.DEEP_GREEN}
                                fontSize={'sm'}
                                fontWeight={'bold'}
                            >新しいアカウントを作成する</Text>
                        </TouchableOpacity>
                    </Box>
                </VStack>
            </VStack>
        </Box>
    )
}

export default Page
