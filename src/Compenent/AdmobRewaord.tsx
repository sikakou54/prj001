import { Box, useColorModeValue } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { TestIds, useRewardedAd } from 'react-native-google-mobile-ads'
import { COLOR } from '../Type'
import analytics from '@react-native-firebase/analytics'

interface Props {
    debug: boolean
    onClose: (result: boolean) => void,
    ios: string | undefined,
    android: string | undefined
}
export default function AdmobRewardTest({ onClose, debug, ios, android }: Props) {
    const [result, setResult] = useState<boolean>(false)
    const [unitId, setUnitId] = useState<string>(TestIds.INTERSTITIAL)
    const { isLoaded, isClosed, load, show, reward, isEarnedReward, revenue, error } = useRewardedAd(unitId)
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)

    useEffect(() => {
        if (!debug && undefined !== android && undefined !== ios) {
            const adUnitID = Platform.select({ ios, android })
            setUnitId(undefined !== adUnitID ? adUnitID : TestIds.REWARDED)
        } else {
            setUnitId(TestIds.REWARDED)
        }
    }, [debug])

    useEffect(() => {
        if (load) {
            load()
        }
    }, [load])

    useEffect(() => {
        if (isClosed) {
            onClose(result)
        }
    }, [isClosed])

    useEffect(() => {
        if (isEarnedReward && reward) {
            setResult(true)
        }
    }, [isEarnedReward])

    useEffect(() => {
        if (isLoaded) {
            show();
        }
    }, [isLoaded])

    useEffect(() => {
        if (undefined !== revenue) {
            analytics().logEvent('show_rewarde', revenue).finally(() => console.log('show_rewarde', revenue))
        }
    }, [revenue])

    useEffect(() => {
        if (undefined !== error) {
            analytics().logEvent('show_rewarde_error', error).finally(() => console.log('show_rewarde_error', error))
        }
    }, [error])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
            justifyContent={'center'}
        />
    )
}
