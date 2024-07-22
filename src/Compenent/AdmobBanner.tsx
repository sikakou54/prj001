import { Box, useColorModeValue } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from 'react-native-google-mobile-ads'
import { COLOR } from '../Type'
import analytics from '@react-native-firebase/analytics'

interface Props {
    debug: boolean
    ios: string | undefined
    android: string | undefined
    size: BannerAdSize
}
export default function AdmobBanner({ size, debug, android, ios }: Props) {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const [unitId, setUnitId] = useState<string>(TestIds.BANNER)

    useEffect(() => {
        if (!debug && undefined !== android && undefined !== ios) {
            const id = Platform.select({ ios, android })
            if (undefined !== id) {
                setUnitId(id)
            }
        }
    }, [debug, android, ios])

    return (
        <Box w={'full'} bg={bg} alignItems={'center'}>
            <BannerAd
                onPaid={(event) => analytics().logEvent('show_banner', event).finally(() => console.log('show_banner', event))}
                onAdFailedToLoad={(error) => analytics().logEvent('show_banner_error', error).finally(() => console.log('show_banner', error))}
                size={size}
                unitId={unitId}
            />
        </Box>
    )
}