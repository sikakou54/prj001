import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'ITEM'

export interface STRAGE {
    id: string,
    country: number,
    plan: number
}

export function setStrage(param: STRAGE): Promise<void> {
    return new Promise(async (resolve) => {
        try {
            const json = JSON.stringify(param)
            await AsyncStorage.setItem(KEY, json)
            resolve()
        } catch (e) {
            // saving error
            console.error('setStrage', e)
            resolve()
        }
    })
}

export function getStrage(): Promise<STRAGE | null> {
    return new Promise(async (resolve) => {
        try {
            const value = await AsyncStorage.getItem(KEY)
            resolve(value != null ? JSON.parse(value) : null)
        } catch (e) {
            console.error('getStrage', e)
            resolve(null)
        }
    })
}

export function resetStrage(): Promise<void> {
    return new Promise(async () => {
        try {
            await AsyncStorage.setItem(KEY, '')
        } catch (e) {
            console.error('resetStrage', e)
        }
    })
}


