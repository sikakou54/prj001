import { VStack, Text, Box, useColorModeValue } from 'native-base'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { COLOR } from '../../src/Type'
import { TouchableOpacity } from 'react-native'
import { Stack, router } from 'expo-router'

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
            <MaterialCommunityIcons
                name='access-point-network-off'
                size={100}
                color={COLOR.GRAY}
            />
            <Text
                fontWeight={'bold'}
                fontSize={'md'}
            >ネットワーク接続が不安定です</Text>
            <Text
                fontWeight={'bold'}
                fontSize={'md'}
            >通信環境の良いところで再度お試しください</Text>
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