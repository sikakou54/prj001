import { Stack, router } from 'expo-router'
import AdmobRewaord from '../../src/Compenent/AdmobRewaord'
import { useCallback, useContext } from 'react'
import { AppDispatch } from '../../src/Store'
import { useDispatch } from 'react-redux'
import { add_ticket } from '../../src/Store/Reducer'
import { ApplicationState, ApplicationStatus, COLOR } from '../../src/Type'
import { AppConfigContext, ToastContext } from '../../src/context'

export default function Page() {
    const toast = useContext(ToastContext)
    const dispatch: AppDispatch = useDispatch()
    const config = useContext(AppConfigContext)

    const onClose = useCallback((result: boolean) => {
        if (result) {
            dispatch(add_ticket({
                count: 1
            })).then((item) => {
                const { status }: ApplicationStatus = item.payload as ApplicationStatus
                if (status === ApplicationState.Success) {
                    toast?.showToast({
                        title: 'チケットを取得しました',
                        bg: COLOR.LIGHT_GREEN,

                    })
                }
                router.back()
            })
        } else {
            router.back()
        }
    }, [])

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    gestureEnabled: true,
                    gestureDirection: 'vertical'
                }}
            />
            <AdmobRewaord
                debug={config.debug}
                ios={config.admob.reword.ios}
                android={config.admob.reword.android}
                onClose={onClose}
            />
        </>

    )
}