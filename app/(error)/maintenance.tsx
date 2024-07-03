import { VStack, Text, useColorModeValue, Box } from 'native-base'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { COLOR } from '../../src/Type'
import { Stack, router } from 'expo-router'
import { TouchableOpacity } from 'react-native'

export default function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)

    return (
        <VStack
            w={'full'}
            h={'full'}
            alignItems={'center'}
            justifyContent={'center'}
            bg={bg}
            space={1}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'fade_from_bottom'
                }}
            />
            <Ionicons
                name='build-outline'
                size={100}
                color={COLOR.GRAY}
            />
            <Text
                fontWeight={'bold'}
                fontSize={'md'}
            >ただいまメンテナンス中です</Text>
            <Text
                fontWeight={'bold'}
                fontSize={'sm'}
            >しばらくお待ちください</Text>
            <Box
                w={'full'}
                h={100}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <TouchableOpacity
                    onPress={() => router.replace('/')}
                >
                    <AntDesign
                        name='reload1'
                        size={45}
                        color={COLOR.GRAY}
                    />
                </TouchableOpacity>
            </Box>
        </VStack>
    )
}