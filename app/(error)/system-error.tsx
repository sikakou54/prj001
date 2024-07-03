import { VStack, Text, Box, useColorModeValue } from 'native-base'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
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
            <MaterialIcons
                name='error-outline'
                size={100}
                color={COLOR.GRAY}
            />
            <Text
                fontWeight={'bold'}
                fontSize={'md'}
            >システムエラーが発生しました</Text>
            <Text
                fontWeight={'bold'}
                fontSize={'md'}
            >アプリを再起動してもう一度お試しください</Text>
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