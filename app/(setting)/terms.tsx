import { Stack } from 'expo-router'
import { Box, useColorModeValue } from 'native-base'
import { AppConfig, COLOR, RootState } from '../../src/Type'
import { shallowEqual, useSelector } from 'react-redux'
import TitleHeader from '../../src/Compenent/TitleHeader'
import WebView from 'react-native-webview'

function Page() {
    const Config: AppConfig = useSelector((state: RootState) => state.Config, shallowEqual)
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const randomParam = `?${Math.random().toString(36).substring(7)}`

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
            <TitleHeader title={'利用規約'} />
            <Box w={'full'} h={'92%'}>
                <WebView
                    source={{ uri: `${Config.terms.url}${randomParam}` }}
                    style={{ backgroundColor: COLOR.LIGHT_GRAY }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
            </Box>
        </Box >
    )
}

export default Page
