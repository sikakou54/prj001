import {
  SendNotifyAsnwer,
  SendNotifyChoice,
  SendNotifyContent,
  DeviceInfo,
  GroupContent,
  GroupMember,
  ReceiveNotifyContent,
  SystemException,
  Ticket,
  UserInfo,
  AppConfig,
  Choice,
  answer_choice_type,
  notify_choice_type,
} from '../Type'
import messaging from "@react-native-firebase/messaging"
import * as ImagePicker from 'expo-image-picker'
import { SupaBaseRpcApi, SupaBaseRpcSingleApi, supabase, supabaseAdmin } from '../supabase'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import Constants from 'expo-constants'
import * as Application from 'expo-application'
import * as Updates from 'expo-updates'
import * as Linking from "expo-linking"

export function delete_device_token(user_id: string, device_id: string): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { error } = await supabase
        .from('tt_token')
        .delete()
        .eq('user_id', user_id)
        .eq('device_id', device_id)

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("delete_device_token", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function signOut(): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { error } = await supabase.auth.signOut()
      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      const { data } = await supabase.auth.getSession()
      if (undefined !== data.session?.access_token && undefined !== data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token
        })
      }
      resolve()

    } catch (e: any) {
      console.log("signOut", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function signIn(email: string, password: string): Promise<string> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        } else if (error.message === 'Invalid login credentials') {
          throw new SystemException(SystemException.UserNotFoundException)
        } else if (error.message === 'Email not confirmed') {
          throw new SystemException(SystemException.UserUnAuthenticatedException)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (undefined !== data.session?.access_token && undefined !== data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token
        })
      }
      return resolve(data.session.user.id)

    } catch (e: any) {
      console.log("signIn", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function signUp(email: string, password: string, name: string, terms_version: number, policy_version: number): Promise<string> {

  console.log('signUp', name)
  return new Promise(async (resolve, reject) => {
    try {

      const { data, error } = await supabase.auth.signUp({
        email,
        options: {
          emailRedirectTo: 'https://prj001-nextjs.vercel.app/success',
          data: {
            username: name,
            terms_version,
            policy_version
          }
        },
        password
      })

      if (data.user?.identities?.length === 0) {
        throw new SystemException(SystemException.UsernameExistsException)
      }
      if (error) {
        console.log('signUp', error)
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (data.user?.id) {
        return resolve(data.user.id)
      } else {
        throw new SystemException(SystemException.SystemError)
      }

    } catch (e: any) {
      console.log("signUp", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function update_password(password: string): Promise<void> {

  return new Promise(async (resolve, reject) => {
    try {

      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("update_password", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function resend_signup(email: string): Promise<void> {

  return new Promise(async (resolve, reject) => {
    try {

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: 'https://prj001-nextjs.vercel.app/success'
        }
      })

      if (error) {
        if ('over_email_send_rate_limit' === error.code) {
          throw new SystemException(SystemException.LimitExceededException)
        } else if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("resend_signup", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function reset_password(mail: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {

      const { error } = await supabase.auth.resetPasswordForEmail(mail, {
        redirectTo: 'https://prj001-nextjs.vercel.app/change-password'
      })
      if (error) {
        if ('over_email_send_rate_limit' === error.code) {
          return reject(new SystemException(SystemException.LimitExceededException))
        } else if ('validation_failed' === error.code) {
          return reject(new SystemException(SystemException.InvalidEmailException))
        } else if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("reset_password", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function delete_user(user_id: string): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id)
      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      const { data } = await supabase.auth.getSession()
      if (undefined !== data.session?.access_token && undefined !== data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token
        })
      }
      resolve()

    } catch (e: any) {
      console.log("delete_user", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function add_token(user_id: string, device_id: string, token: string): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { error } = await supabase.from('tt_token').upsert([{
        user_id: user_id,
        device_id: device_id,
        token: token
      }])

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("add_token", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export function add_member(params: { user_id: string, group_id: string }): Promise<void> {

  const { user_id, group_id } = params

  return new Promise(async (resolve, reject) => {
    try {

      const { error } = await supabase
        .from('tt_member')
        .insert({
          user_id: user_id,
          group_id: group_id
        })

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("add_member", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

//p_notify_id uuid, p_group_id uuid, p_user_id uuid, p_choice public.answer_choice_type[]
export function update_answer(params: { user_id: string, group_id: string, notify_id: string, choices: answer_choice_type[], }): Promise<void> {

  const { user_id, group_id, notify_id, choices } = params

  return new Promise(async (resolve, reject) => {

    try {

      await SupaBaseRpcApi('add_answer', { p_notify_id: notify_id, p_group_id: group_id, p_user_id: user_id, p_choice: choices })
      resolve()

    } catch (e: any) {
      console.log("update_answer", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function add_group(user_id: string, code: string, name: string): Promise<string> {

  return new Promise(async (resolve, reject) => {

    try {

      const group_id = await generate_uuid()
      await SupaBaseRpcApi('add_group', {
        code,
        group_id,
        name,
        user_id,
        public: '1'
      })
      resolve(group_id)

    } catch (e: any) {
      console.log("add_group", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
    }
    return reject(new SystemException(SystemException.SystemError))
  })
}

export function get_group_by_code(code: string): Promise<{ group_id: string, name: string, img: string | null } | null> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await SupaBaseRpcSingleApi('get_group_by_code', { code })

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== data) {
        resolve({
          group_id: data.group_id,
          name: data.name,
          img: null !== data.img ? data.img : null
        })
      } else {
        resolve(null)
      }

    } catch (e: any) {
      console.log("get_group_by_code", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function is_group_member(user_id: string, group_id: string): Promise<boolean> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('tt_member')
        .select('*')
        .eq('group_id', group_id)
        .eq('user_id', user_id)
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== data) {
        resolve(true)
      } else {
        resolve(false)
      }

    } catch (e: any) {
      console.log("is_group_member", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}


export async function requestUserPermission(): Promise<string> {

  return new Promise(async (resolve, _) => {
    let token: string = ''

    try {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      if (enabled) {
        token = await messaging().getToken()
      }
    } catch (e: any) {
      console.log("requestUserPermission", e)
      //return reject(new SystemException(SystemException.SystemError))
    }
    resolve(token)
  })
}

export function update_group_public(group_id: string, isApply: number): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('mt_group')
        .update({ public: isApply.toString(), update_at: new Date().toISOString() })
        .eq('group_id', group_id)
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      if (null === data) {
        throw new SystemException(SystemException.ConditionalCheckFailedException)
      }
      resolve()

    } catch (e: any) {
      console.log("update_group_public", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function update_group_name(group_id: string, name: string): Promise<void> {

  return new Promise(async (resolve, reject) => {
    try {

      const { data, error } = await supabase
        .from('mt_group')
        .update({ name, update_at: new Date().toISOString() })
        .eq('group_id', group_id)
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      if (null === data) {
        throw new SystemException(SystemException.ConditionalCheckFailedException)
      }
      resolve()

    } catch (e: any) {
      console.log("update_group_name", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export async function add_notify(
  user_id: string,
  title: string,
  choices: notify_choice_type[],
  group_id: string,
  is_anonym: number,
  format: number
): Promise<SendNotifyContent> {

  console.log(choices)

  return new Promise(async (resolve, reject) => {

    try {

      const notify_id = await generate_uuid()
      await SupaBaseRpcApi('add_notify', {
        p_user_id: user_id,
        p_notify_id: notify_id,
        p_group_id: group_id,
        p_choice: choices,
        p_name: title,
        p_is_anonym: is_anonym,
        p_format: format
      })

      const unique_id = await generate_uuid()
      await SupaBaseRpcApi('insert_send_push_notification_by_create_notify', {
        p_unique_id: unique_id,
        p_notify_id: notify_id,
        p_title: '新しい通知が届きました'
      })

      const content = await get_send_notify(user_id, notify_id)
      if (null !== content) {
        const { percent, is_anonym, name, create_at, img, group_name } = content
        resolve({
          notify_id,
          name,
          group_name,
          group_id,
          img,
          is_anonym: is_anonym,
          percent,
          format,
          create_at: new Date(create_at)
        })
      } else {
        throw new SystemException(SystemException.SystemError)
      }

    } catch (e: any) {
      console.log("add_notify", e.name)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function update_acount_name(user_id: string, name: string): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('mt_user')
        .update({ name: name, update_at: new Date().toISOString() })
        .eq('user_id', user_id)
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      if (null === data) {
        throw new SystemException(SystemException.ConditionalCheckFailedException)
      }
      resolve()

    } catch (e: any) {
      console.log("set_username", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function delete_group_member(group_id: string, user_id: string): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('tt_member')
        .delete()
        .eq('group_id', group_id)
        .eq('user_id', user_id)
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      if (null === data) {
        throw new SystemException(SystemException.ConditionalCheckFailedException)
      }
      resolve()

    } catch (e: any) {
      console.log("delete_group_member", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function update_notify_close(notify_id: string): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('tt_notify')
        .update({ is_closed: '1', update_at: new Date().toISOString() })
        .eq('notify_id', notify_id)
        .eq('is_closed', '0')
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      if (null === data) {
        throw new SystemException(SystemException.ConditionalCheckFailedException)
      }
      resolve()

    } catch (e: any) {
      console.log("update_notify_close", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function get_send_notify_asnwer(notify_id: string, choice: number, offset?: number): Promise<SendNotifyAsnwer[]> {

  return new Promise(async (resolve, reject) => {

    try {

      const answer = await SupaBaseRpcApi('get_create_notify_answer_list', { p_notify_id: notify_id, p_choice: choice, p_offset: undefined !== offset ? offset : 0 })
      let items: SendNotifyAsnwer[] = []

      if (answer.data) {
        answer.data.forEach((data: any) => items.push({
          user_id: data.user_id,
          name: data.name,
          img: data.img !== null ? data.img : null,
          remarks: data.remarks,
          update_at: new Date(data.update_at)
        }))
      }

      resolve(items)

    } catch (e: any) {
      console.log("get_send_notify_asnwer", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function get_group_member(group_id: string, offset?: number): Promise<GroupMember[]> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data } = await SupaBaseRpcApi('get_group_member_list', { p_group_id: group_id, p_offset: undefined !== offset ? offset : 0 })

      if (data) {
        resolve(data.map((item: any) => {
          return {
            user_id: item.user_id,
            name: item.name,
            img: item.img !== null ? item.img : null,
          } as GroupMember
        }))
      } else {
        resolve([])
      }

    } catch (e: any) {
      console.log("get_group_member", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function get_send_notify_contents(user_id: string, offset?: number): Promise<SendNotifyContent[]> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data } = await SupaBaseRpcApi('get_create_notify_list', { p_user_id: user_id, p_offset: undefined !== offset ? offset : 0 })
      let items: SendNotifyContent[] = []

      for (let index = 0; index < data.length; index++) {
        const { percent, is_anonym, name, group_id, notify_id, create_at, img, group_name, format } = data[index] as SendNotifyContent
        items.push({
          percent,
          is_anonym: Number(is_anonym),
          name,
          group_name,
          group_id: group_id,
          notify_id: notify_id,
          img: img !== null ? img : null,
          format,
          create_at
        })
      }
      resolve(items)

    } catch (e: any) {
      console.log("get_send_notify_contents", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function get_notify_choice(notify_id: string): Promise<SendNotifyChoice[]> {

  return new Promise(async (resolve, reject) => {

    try {

      let choiceItems: SendNotifyChoice[] = []
      const { data } = await SupaBaseRpcApi('get_notify_choice', { p_notify_id: notify_id })

      if (data) {
        data.forEach((item: any) => {
          choiceItems.push({
            choice: item.choice,
            desc_type: Number(item.desc_type),
            count: item.count,
            text: item.name
          })
        })
        resolve(choiceItems)
      } else {
        resolve([])
      }

    } catch (e: any) {
      console.log("get_notify_choice", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export function get_receive_notifys(user_id: string, offset?: number): Promise<ReceiveNotifyContent[]> {

  return new Promise(async (resolve, reject) => {

    try {

      let items: ReceiveNotifyContent[] = []
      const { data } = await SupaBaseRpcApi('get_receive_notify_list', { p_user_id: user_id, p_offset: undefined !== offset ? offset : 0 })

      for (let i = 0; i < data.length; i++) {
        const { group_id, group_name, is_anonym, notify_name, user_name, notify_id, img_group, img_user, format, create_at } = data[i]
        items.push({
          group_id,
          group_name,
          is_anonym: Number(is_anonym),
          name: notify_name,
          user_name,
          notify_id,
          img: null !== img_group ? img_group : null,
          img_user: null !== img_user ? img_user : null,
          format,
          create_at: new Date(create_at)
        })
      }
      resolve(items)

    } catch (e: any) {
      console.log("get_receive_notifys", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}


export function get_receive_notify(user_id: string, notify_id: string): Promise<ReceiveNotifyContent | null> {

  return new Promise(async (resolve, reject) => {

    try {

      const receive_notify = await SupaBaseRpcSingleApi('get_receive_notify', { p_user_id: user_id, p_notify_id: notify_id })

      if (receive_notify.error) {
        if (receive_notify.error.message === 'Failed to fetch' || receive_notify.error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== receive_notify.data) {

        const { group_id, group_name, is_anonym, notify_name, user_name, img_group, img_user, format, create_at } = receive_notify.data
        resolve({
          group_id,
          group_name,
          is_anonym: Number(is_anonym),
          name: notify_name,
          user_name,
          notify_id,
          img: null !== img_group ? img_group : null,
          img_user: null !== img_user ? img_user : null,
          format,
          create_at: new Date(create_at)
        })

      } else {
        throw new SystemException(SystemException.SystemError)
      }

    } catch (e: any) {
      console.log("get_receive_notify", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}



export function get_send_notify(user_id: string, notify_id: string): Promise<SendNotifyContent | null> {

  return new Promise(async (resolve, reject) => {

    try {

      const notify = await SupaBaseRpcSingleApi('get_create_notify', {
        p_user_id: user_id,
        p_notify_id: notify_id
      })

      if (notify.error) {
        if (notify.error.message === 'Failed to fetch' || notify.error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== notify.data) {
        const { percent, is_anonym, name, group_id, create_at, img, group_name, format } = notify.data as SendNotifyContent
        resolve({
          notify_id,
          name,
          group_name,
          group_id,
          img,
          is_anonym: Number(is_anonym),
          percent,
          format,
          create_at: new Date(create_at)
        })
      } else {
        resolve(null)
      }

    } catch (e: any) {
      console.log("get_send_notify", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }
  })
}

export async function update_ticket(user_id: string, ticket_id: string): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('tt_ticket')
        .update({ valid: '0', update_at: new Date().toISOString() })
        .eq('ticket_id', ticket_id)
        .eq('user_id', user_id)
        .eq('valid', '1')
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      if (null === data) {
        throw new SystemException(SystemException.ConditionalCheckFailedException)
      }
      resolve()

    } catch (e: any) {
      console.log("update_ticket", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function add_ticket(user_id: string, count: number): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const ticket_id = await generate_uuid()
      const { error } = await supabase.from('tt_ticket').insert({
        user_id: user_id,
        ticket_id: ticket_id,
        count: count,
        comment: '動画視聴分'
      })

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("add_ticket", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_image_url(path: string): Promise<string | null> {

  return new Promise(async (resolve, reject) => {

    try {
      resolve(supabase.storage.from('image').getPublicUrl(path).data.publicUrl)
    } catch (e: any) {
      console.log("get_image_url", e)
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function uploadFile(key: string, asset: ImagePicker.ImagePickerAsset): Promise<{ url: string }> {

  return new Promise(async (resolve, reject) => {

    try {

      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' })
      const filePath = `${key}.${asset.type === 'image' ? 'png' : 'mp4'}`
      const contentType = asset.type === 'image' ? 'image/png' : 'video/mp4'
      const { error } = await supabase.storage.from('image').upload(filePath, decode(base64), { contentType, upsert: true })
      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      const url = await get_image_url(filePath)

      if (null !== url) {
        resolve({ url })
      } else {
        throw new SystemException(SystemException.SystemError)
      }

    } catch (e: any) {
      console.log("uploadFile", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function deleteFile(fileName: string): Promise<void> {

  console.log('deleteFile', fileName)
  return new Promise(async (resolve, reject) => {

    try {
      const { error } = await supabase.storage.from('image').remove([fileName])
      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("deleteFile", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function removeFile(path: string): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {
      const { error } = await supabase.storage.from('image').remove([path])
      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve()

    } catch (e: any) {
      console.log("removeFile", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function update_group_image_url(gruopid: string, _img: string | null): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {
      const update_at = new Date().toISOString()
      const img = null !== _img ? `${_img}?timestamp=${update_at}` : null

      const { data, error } = await supabase.from('mt_group')
        .update({ img, update_at })
        .eq('group_id', gruopid)
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      if (null === data) {
        throw new SystemException(SystemException.ConditionalCheckFailedException)
      }
      resolve()

    } catch (e: any) {
      console.log("update_group_image_url", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function set_user_image_url(user_id: string, _img: string | null): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {
      const update_at = new Date().toISOString()
      const img = null !== _img ? `${_img}?timestamp=${update_at}` : null
      const { data, error } = await supabase.from('mt_user')
        .update({ img, update_at })
        .eq('user_id', user_id)
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      if (null === data) {
        throw new SystemException(SystemException.ConditionalCheckFailedException)
      }
      resolve()

    } catch (e: any) {
      console.log("update_group_image_url", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_receive_notify_num(user_id: string): Promise<number> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await SupaBaseRpcSingleApi('get_user_receive_notify_num', { p_user_id: user_id })

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== data) {
        resolve(Number(data.count))
      } else {
        resolve(0)
      }

    } catch (e: any) {
      console.log("get_receive_notify_num", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_mt_user(user_id: string): Promise<{
  user_id: string,
  name: string,
  img: string,
  ticket_num: number,
  policy_version: number,
  terms_version: number
} | null> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('mt_user')
        .select("*")
        .eq('user_id', user_id)
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== data) {
        resolve({
          user_id: data.user_id,
          img: data.img,
          name: data.name,
          policy_version: data.policy_version,
          terms_version: data.terms_version,
          ticket_num: data.ticket_num
        })
      } else {
        resolve(null)
      }

    } catch (e: any) {
      console.log("get_mt_user", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_userInfo(): Promise<UserInfo> {

  return new Promise(async (resolve, reject) => {

    try {

      const user = await supabase.auth.getUser()
      if (null !== user.data.user && undefined !== user.data.user.email) {
        const record = await get_mt_user(user.data.user.id)
        if (null !== record) {
          const receive_notify_num = await get_receive_notify_num(user.data.user.id)
          resolve({
            id: record.user_id,
            name: record.name,
            mail: user.data.user.email,
            img: record.img,
            receive_notify_num,
            ticket_num: record.ticket_num,
            policy_version: record.policy_version,
            terms_version: record.terms_version
          })
        } else {
          throw new SystemException(SystemException.NotFoundUser)
        }
      } else {
        throw new SystemException(SystemException.NotFoundUser)
      }

    } catch (e: any) {
      console.log("get_userInfo", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_deviceInfo(user_id: string): Promise<DeviceInfo> {

  return new Promise(async (resolve, reject) => {

    try {

      const token = await requestUserPermission()
      const device_id: string = await get_device_id()
      const isExist = await is_exist_token(user_id, device_id, token)
      if (!isExist) {
        await add_token(user_id, device_id, token)
      }
      resolve({
        token,
        device_id
      })

    } catch (e: any) {
      console.log("get_deviceInfo", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function is_exist_token(user_id: string, device_id: string, token: string): Promise<boolean> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('tt_token')
        .select("*")
        .eq('user_id', user_id)
        .eq('device_id', device_id)
        .eq('token', token)
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== data) {
        resolve(true)
      } else {
        resolve(false)
      }

    } catch (e: any) {
      console.log("is_exist_token", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_tickets(user_id: string): Promise<Ticket[]> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase.from('tt_ticket')
        .select("*")
        .eq('user_id', user_id)
        .eq('valid', '1')

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      resolve(data.map((item) => ({
        ticket_id: item.ticket_id,
        comment: item.comment,
        count: item.count,
        update_at: item.update_at
      })))

    } catch (e: any) {
      console.log("get_tickets", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_device_id(): Promise<string> {

  return new Promise(async (resolve, reject) => {

    try {

      let device_id: string | null = null

      if (Constants.platform?.android) {
        device_id = Application.androidId
      } else {
        device_id = await Application.getIosIdForVendorAsync()
      }

      if (null !== device_id) {
        resolve(device_id)
      } else {
        throw new SystemException(SystemException.SystemError)
      }

    } catch (e: any) {
      console.log("is_exist_token", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_group_contents(user_id: string, offset?: number): Promise<GroupContent[]> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data } = await SupaBaseRpcApi('get_user_member_group_list', { p_user_id: user_id, p_offset: undefined !== offset ? offset : 0 })
      resolve(data.map((item) => ({
        group_id: item.group_id,
        count: Number(item.count),
        name: item.name,
        public: Number(item.public),
        img: item.img,
        code: item.code
      } as GroupContent)))

    } catch (e: any) {
      console.log("get_group_contents", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_group_content(user_id: string, group_id: string): Promise<GroupContent | null> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await SupaBaseRpcSingleApi('get_user_member_group', { p_user_id: user_id, p_group_id: group_id })
      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== data) {
        resolve({
          group_id: data.group_id,
          count: Number(data.count),
          name: data.name,
          public: Number(data.public),
          img: data.img,
          code: data.code
        } as GroupContent)
      } else {
        resolve(null)
      }

    } catch (e: any) {
      console.log("get_group_content", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function generate_uuid(): Promise<string> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase.rpc('generate_uuid')

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }
      resolve(data)

    } catch (e: any) {
      console.log("generate_uuid", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_app_config(): Promise<AppConfig> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('mt_config')
        .select("*")

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null === data) {
        throw new SystemException(SystemException.SystemError)
      } else {
        const maintenance = data.find((item) => item.name === 'maintenance')
        const admob = data.find((item) => item.name === 'admob')
        const mode = data.find((item) => item.name === 'mode')
        const terms = data.find((item) => item.name === 'terms')
        const policy = data.find((item) => item.name === 'policy')
        if (undefined === maintenance ||
          undefined === admob ||
          undefined === mode ||
          undefined === terms ||
          undefined === policy) {
          throw new SystemException(SystemException.SystemError)
        }
        resolve({
          debug: mode.value === 'debug',
          maintenance: maintenance.value,
          admob: {
            banner: {
              ios: admob.value.banner.ios,
              android: admob.value.banner.android
            },
            reword: {
              ios: admob.value.reword.ios,
              android: admob.value.reword.android
            }
          },
          policy: {
            url: policy.value.url,
            version: policy.value.version,
          },
          terms: {
            url: terms.value.url,
            version: terms.value.version,
          }
        })
      }

    } catch (e: any) {
      console.log("get_app_config", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function get_receive_notify_choice(notify_id: string): Promise<Choice[]> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('tt_choice')
        .select('choice,name,desc_type')
        .eq('notify_id', notify_id)
        .neq('choice', 0)
      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      console.log('get_receive_notify_choice', data)
      if (data.length > 0) {
        resolve(data.map((item: any) => ({
          choice: item.choice,
          text: item.name,
          desc_type: Number(item.desc_type)
        })))
      } else {
        resolve([])
      }

    } catch (e: any) {
      console.log("get_receive_notify_choice", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function set_terms_policy(user_id: string, terms_version: number, policy_version: number): Promise<void> {

  return new Promise(async (resolve, reject) => {

    try {

      const { data, error } = await supabase
        .from('mt_user')
        .update({ terms_version, policy_version, update_at: new Date().toISOString() })
        .eq('user_id', user_id)
        .select()
        .maybeSingle()

      if (error) {
        if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
          throw new SystemException(SystemException.NetworkingError)
        }
        throw new SystemException(SystemException.SystemError)
      }

      if (null !== data) {
        resolve()
      } else {
        throw new SystemException(SystemException.SystemError)
      }

    } catch (e: any) {
      console.log("set_terms_policy", e)
      if (e instanceof SystemException) {
        return reject(e)
      }
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}

export async function checkForUpdate(): Promise<boolean> {

  return new Promise(async (resolve, reject) => {

    try {

      if (null !== Updates.updateId) {
        const update = await Updates.checkForUpdateAsync()
        if (update.isAvailable) {
          return resolve(true)
        }
      }
      return resolve(false)

    } catch (e: any) {
      console.log("checkForUpdate", e)
      return reject(new SystemException(SystemException.SystemError))
    }

  })
}
