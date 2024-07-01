import { useDispatch } from 'react-redux'
import { AppDispatch } from '../src/Store'
import { load } from '../src/Store/Reducer'
import { useCallback, useEffect } from 'react'
import {
    ApplicationStatus,
    ApplicationState,
} from '../src/Type'
import {
    Stack,
    router,
    useNavigation
} from 'expo-router'
import { Image } from 'native-base'
import { useFonts } from 'expo-font'
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency'
import { MobileAds } from 'react-native-google-mobile-ads'
import * as SplashScreen from 'expo-splash-screen';

export default function Page() {
    const navigation = useNavigation()
    const dispatch: AppDispatch = useDispatch()
    const [fontsLoaded, fontError] = useFonts({
        'NotoSansJP': require('../assets/fonts/NotoSansJP-Medium.ttf')
    })
    /*
        async function init(): Promise<void> {
            return new Promise(async (resolve) => {
                const choice = ['選択肢1', '選択肢2', '選択肢3', '選択肢4', '選択肢5', '選択肢6', '選択肢7', '選択肢8', '選択肢9', '選択肢10']
                for (let index = 0; index < 50; index++) {
                    await dispatch(add_notify({
                        choice,
                        title: `テスト通知${index + 1}`,
                        user_id: 'c31d0bd1-1c5b-4097-a0b8-e77e24c4a6de',
                        group_id: 'e88f1e0d-cf7d-4d75-82ea-8473f6ca5640',
                        is_anonym: 0
                    }))
                }
                resolve()
            })
        }
    */
    const loading = useCallback(async () => {
        try {
            await requestTrackingPermissionsAsync()
            await MobileAds().initialize()
            //await init()
            const { payload } = await dispatch(load())
            const { status } = (payload as ApplicationStatus)
            if (status === ApplicationState.Success) {
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: '(tab)' as never
                    }]
                })
            }
            await SplashScreen.hideAsync();
        } catch (error) {
            router.replace('/(error)/system-error')
        }
    }, [])

    const showSplash = useCallback(async () => {
        await SplashScreen.preventAutoHideAsync();
    }, []);

    useEffect(() => {
        showSplash();
    }, []);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            loading()
        }
    }, [fontsLoaded, fontError])

    return (
        <>
            <Stack.Screen
                options={{
                    animation: 'fade',
                    headerShown: false,
                }}
            />
            <Image
                source={require('./../assets/images/splash.png')}
                resizeMode="contain"
                alt='splash'
                w={'100%'}
                h={'100%'}
            />
        </>
    )
}
