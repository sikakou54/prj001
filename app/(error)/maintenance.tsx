import { VStack, Text, useColorModeValue } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { COLOR } from '../../src/Type'
import { Stack } from 'expo-router'

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
                fontSize={'md'}
            >しばらくお待ちください</Text>
        </VStack>
    )
}