import { createContext } from 'react'
import { AlertResult, AlertType, AppConfig } from '../Type'

interface ToastContextType {
    showToast: (param: { title: string, disc?: string, bg?: string, onClose?: () => void }) => void
}
export const ToastContext = createContext<ToastContextType | null>(null)

interface AlertContextType {
    setAlert: ({ title, disc, type, callback }: { title: string, type: AlertType, callback?: (result: AlertResult) => void, disc?: string }) => void
}
export const AlertContext = createContext<AlertContextType | null>(null)
export const AppConfigContext = createContext<AppConfig>({
    debug: true,
    maintenance: false,
    admob: {
        banner: {
            android: undefined,
            ios: undefined
        },
        reword: {
            android: undefined,
            ios: undefined
        }
    },
    policy: {
        url: undefined,
        version: 0
    },
    terms: {
        url: undefined,
        version: 0
    }
})