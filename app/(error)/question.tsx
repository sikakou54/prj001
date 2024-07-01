import { AntDesign } from '@expo/vector-icons'
import { Box } from 'native-base'
import React from 'react'
import { COLOR } from '../../src/Type'
import { Stack } from 'expo-router'

export default function question() {
    return (
        <Box
            w={'full'}
            h={'full'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'fade'
                }}
            />
            <AntDesign
                name='question'
                size={100}
                color={COLOR.GRAY}
            />
        </Box>
    )
}
