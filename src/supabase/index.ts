import { createClient } from '@supabase/supabase-js'
import { SystemException } from '../Type'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY
const service_role = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE

export const supabase = createClient(supabaseUrl as string, supabaseKey as string, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
})

export const supabaseAdmin = createClient(supabaseUrl as string, service_role as string, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
})

export async function SupaBaseRpcApi(name: string, params?: any): Promise<{ data: any[], count: number | null, error: any, status: any }> {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, error, status, count } = await supabase.rpc(name, params)
            if (error) {
                throw { error, status };
            }
            resolve({
                data,
                count,
                error,
                status
            })
        } catch ({ error, status }: any) {
            console.log('SupaBaseRpcApi', error, status)
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                return reject(new SystemException(SystemException.NetworkingError))
            } else if (status === 0) {
                return reject(new SystemException(SystemException.NetworkingError))
            } else if (status >= 500 && error.message.includes('invalid transaction termination')) {
                return reject(new SystemException(SystemException.TransactionCanceledException))
            }
            return reject(new SystemException(SystemException.SystemError))
        }
    })
}

export async function SupaBaseRpcSingleApi(name: string, params?: any): Promise<{ data: any, count: number | null, error: any, status: any }> {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, error, status, count } = await supabase.rpc(name, params).maybeSingle()
            if (error) {
                throw { error, status };
            }
            resolve({
                data,
                count,
                error,
                status
            })
        } catch ({ error, status }: any) {
            console.log('SupaBaseRpcSingleApi', error, status)
            if (error.message.includes('Failed to fetch')) {
                return reject(new SystemException(SystemException.NetworkingError))
            } else if (status === 0) {
                return reject(new SystemException(SystemException.NetworkingError))
            } else if (status >= 500 && error.message.includes('invalid transaction termination')) {
                return reject(new SystemException(SystemException.TransactionCanceledException))
            }
            return reject(new SystemException(SystemException.SystemError))
        }
    })
}