import AsyncStorage from '@react-native-async-storage/async-storage'
import { SystemException } from '../../Type'
import * as ImagePicker from 'expo-image-picker'

export const checkMailFormat = (email: any) => {

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return emailPattern.test(email)
}

export function sleep(msec: number) {
  return new Promise(resolve => setTimeout(resolve, msec))
}

export function isNull(param: object) {
  return null === param
}

export function isEmpty(param: string) {
  return '' === param.trim()
}

export function strComp(str1: string, str2: string) {
  return str1 === str2
}

export function getUTCMilliseconds(): number {
  return new Date().getTime()
}

export function getTimeZoneString(time: number) {
  const localTime = new Date(time + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000)).toLocaleTimeString()
  const localDate = new Date(time + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000)).toLocaleDateString()
  return localDate + ' ' + localTime
}

export function textTrim(str: string, len: number) {
  if (str.length > len) {
    return str.substring(0, len) + '…'
  } else {
    return str
  }
}

export async function setStrage(key: string, value: object) {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.error('setStrage', e)
  }
}

export async function getStrage(key: string) {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.error('getStrage', e)
  }
}

export function getException(name: string) {
  switch (name) {
    case SystemException.UsernameExistsException: return new SystemException(SystemException.UsernameExistsException)
    default:
      break
  }
}

export function validatePassword(str: string) {

  // 大文字、小文字、数字がそれぞれ1文字以上含まれているかチェック
  const uppercaseRegex = /[A-Z]/
  const lowercaseRegex = /[a-z]/
  const numberRegex = /\d/

  const hasUppercase = uppercaseRegex.test(str)
  const hasLowercase = lowercaseRegex.test(str)
  const hasNumber = numberRegex.test(str)

  // 条件を満たしているか確認
  if (hasUppercase && hasLowercase && hasNumber && str.length >= 8) {
    return true
  } else {
    return false
  }
}

export function sendPushMessage(param: { token: string, title: string, body: string, data: object; }): Promise<void> {

  return new Promise(async (resolve) => {

    try {

      const { token, title, body, data } = param

      await fetch('https://prj001-push-message.vercel.app/api/message', {
        method: 'POST',
        body: JSON.stringify({ token, title, body, data })
      })

    } catch (e) {
      console.error('sendPushMessage', e)
    }

    resolve()
  })
}

export function getRandomRange(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export async function promiseSplitExec(promises: Promise<any>[], execNum: number, callback?: (total: number, progress: number) => void): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < promises.length; i += execNum) {
        const chunk = promises.slice(i, i + execNum)
        await Promise.all(chunk)
        if (undefined !== callback) {
          callback(promises.length, i + execNum)
        }
      }
      resolve()
    } catch (e: any) {
      reject(e)
    }
  })
}

export async function pickUpImage(): Promise<ImagePicker.ImagePickerAsset | null> {

  return new Promise(async (resolve, reject) => {
    try {

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        selectionLimit: 1
      })
      if (result.assets) {
        resolve(result.assets[0])
      } else {
        resolve(null)
      }

    } catch (e: any) {
      console.log('pickUpImage', e)
      resolve(null)
    }
  })

}

export function getFileNameFromUrl(url: string) {
  const path = new URL(url).pathname
  const fileName = path.substring(path.lastIndexOf('/') + 1)
  return fileName.split('?')[0]
}