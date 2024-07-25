import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit'
import * as Api from '../Api'
import {
  ApplicationState,
  ApplicationStatus,
  SystemException,
  RootState,
  UserInfo,
  ReceiveNotifyContent,
  SendNotifyChoice,
  SendNotifyContent,
  SendNotifyAsnwer,
  GroupMember,
  DeviceInfo,
  GroupContent,
  AppConfig,
  Choice,
  Ticket,
} from '../Type'
import * as ImagePicker from 'expo-image-picker'
import { getFileNameFromUrl } from '../Api/Common'

const initialState: RootState = {
  Config: {
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
  },
  Application: {
    Error: {
      status: ApplicationState.None,
      code: SystemException.None,
      data: null,
    },
    Success: {
      status: ApplicationState.None,
      code: SystemException.None,
      data: null,
    },
  },
  UserInfo: {
    id: '',
    name: '',
    mail: '',
    img: null,
    ticket_num: 0,
    receive_notify_num: 0,
    policy_version: 0,
    terms_version: 0
  },
  DeviceInfo: {
    device_id: '',
    token: ''
  },
  Condition: {
    isPagingLoading: false,
    isGlobalLoading: false,
    progress: 0
  },
  Group: {
    contents: [],
    member: []
  },
  Notify: {
    Tickets: [],
    Send: {
      contents: [],
      answer: [],
      choices: []
    },
    Receive: {
      choices: [],
      contents: []
    }
  },
}
const Slice = createSlice({
  name: 'Slice',
  initialState,
  reducers: {
    set_config: (state: RootState, action: PayloadAction<AppConfig>) => {
      state.Config = action.payload
    },
    reset: (state: RootState, action: PayloadAction<RootState>) => {
      state = action.payload
    },
    set_user_info: (state: RootState, action: PayloadAction<UserInfo>) => {
      state.UserInfo = action.payload
    },
    set_device_info: (state: RootState, action: PayloadAction<DeviceInfo>) => {
      state.DeviceInfo = action.payload
    },
    set_user_image: (state: RootState, action: PayloadAction<{ img: string | null }>) => {
      state.UserInfo.img = action.payload.img
    },
    set_notify_group_image: (state: RootState, action: PayloadAction<{ group_id: string, img: string | null }>) => {

      // 受信通知のグループアイコンを更新する
      for (let index = 0; index < state.Notify.Receive.contents.length; index++) {
        if (state.Notify.Receive.contents[index].group_id === action.payload.group_id) {
          state.Notify.Receive.contents[index].img = action.payload.img
        }
      }

      // 送信通知のグループアイコンを更新する
      for (let index = 0; index < state.Notify.Send.contents.length; index++) {
        if (state.Notify.Send.contents[index].group_id === action.payload.group_id) {
          state.Notify.Send.contents[index].img = action.payload.img
        }
      }
    },
    set_group_contents: (state: RootState, action: PayloadAction<{ contents: GroupContent[], is_offset: boolean }>) => {
      if (!action.payload.is_offset) {
        state.Group.contents = action.payload.contents
      } else {
        action.payload.contents.forEach((item) => {
          const content = state.Group.contents.find((content) => content.group_id === item.group_id)
          if (undefined === content) {
            state.Group.contents.push(item)
          } else {
            for (let index = 0; index < state.Group.contents.length; index++) {
              if (state.Group.contents[index].group_id === item.group_id) {
                state.Group.contents[index] = item
                break
              }
            }
          }
        })
      }
    },
    set_group_content: (state: RootState, action: PayloadAction<GroupContent>) => {
      for (let index = 0; index < state.Group.contents.length; index++) {
        if (state.Group.contents[index].group_id === action.payload.group_id) {
          state.Group.contents[index] = action.payload
          break
        }
      }
    },
    update_group_name: (state: RootState, action: PayloadAction<{ group_id: string, name: string }>) => {
      for (let index = 0; index < state.Group.contents.length; index++) {
        if (state.Group.contents[index].group_id === action.payload.group_id) {
          state.Group.contents[index].name = action.payload.name
          break
        }
      }
    },
    update_group_public: (state: RootState, action: PayloadAction<{ group_id: string, public: number }>) => {
      for (let index = 0; index < state.Group.contents.length; index++) {
        if (state.Group.contents[index].group_id === action.payload.group_id) {
          state.Group.contents[index].public = action.payload.public
          break
        }
      }
    },
    set_group_member: (state: RootState, action: PayloadAction<{ member: GroupMember[], is_offset: boolean }>) => {
      if (!action.payload.is_offset) {
        state.Group.member = action.payload.member
      } else {
        action.payload.member.forEach((item) => {
          const content = action.payload.member.find((user) => user.user_id === item.user_id)
          if (undefined === content) {
            state.Group.member.push(item)
          } else {
            for (let index = 0; index < state.Group.member.length; index++) {
              if (state.Group.member[index].user_id === item.user_id) {
                state.Group.member[index] = item
                break
              }
            }
          }
        })
      }
    },
    remove_group_member: (state: RootState, action: PayloadAction<{ user_id: string }>) => {
      state.Group.member = state.Group.member.filter((item) => item.user_id !== action.payload.user_id)
    },
    remove_group_contents: (state: RootState, action: PayloadAction<{ group_id: string }>) => {
      state.Group.contents = state.Group.contents.filter((item) => item.group_id !== action.payload.group_id)
      state.Notify.Receive.contents = state.Notify.Receive.contents.filter((item) => item.group_id !== action.payload.group_id)
      state.Notify.Send.contents = state.Notify.Send.contents.filter((item) => item.group_id !== action.payload.group_id)
    },
    add_group: (state: RootState, action: PayloadAction<GroupContent>) => {
      state.Group.contents.push(action.payload)
    },
    set_send_notifys: (state: RootState, action: PayloadAction<{ contents: SendNotifyContent[], isUpSert: boolean }>) => {
      if (!action.payload.isUpSert) {
        state.Notify.Send.contents = action.payload.contents
      } else {
        action.payload.contents.forEach((item) => {
          const content = state.Notify.Send.contents.find((content) => content.notify_id === item.notify_id)
          if (undefined === content) {
            state.Notify.Send.contents.push(item)
          } else {
            for (let index = 0; index < state.Notify.Send.contents.length; index++) {
              if (state.Notify.Send.contents[index].notify_id === item.notify_id) {
                state.Notify.Send.contents[index] = item
                break
              }
            }
          }
        })
      }
    },
    set_send_notify_answers: (state: RootState, action: PayloadAction<{ answers: SendNotifyAsnwer[], is_offset: boolean }>) => {
      if (!action.payload.is_offset) {
        state.Notify.Send.answer = action.payload.answers
      } else {
        action.payload.answers.forEach((item) => {
          const content = state.Notify.Send.answer.find((user) => user.user_id === item.user_id)
          if (undefined === content) {
            state.Notify.Send.answer.push(item)
          } else {
            for (let index = 0; index < state.Notify.Send.answer.length; index++) {
              if (state.Notify.Send.answer[index].user_id === item.user_id) {
                state.Notify.Send.answer[index] = item
                break
              }
            }
          }
        })
      }
    },
    reset_application_state: (state: RootState, action: PayloadAction<void>) => {
      state.Application.Success = { status: ApplicationState.None, code: SystemException.None, data: {} }
      state.Application.Error = { status: ApplicationState.None, code: SystemException.None, data: {} }
    },
    set_tickets: (state: RootState, action: PayloadAction<Ticket[]>) => {
      state.Notify.Tickets = action.payload
    },
    add_send_notify: (state: RootState, action: PayloadAction<SendNotifyContent>) => {
      state.Notify.Send.contents.unshift(action.payload)
    },
    set_send_notify_choice: (state: RootState, action: PayloadAction<SendNotifyChoice[]>) => {
      state.Notify.Send.choices = action.payload
    },
    set_receive_notifys: (state: RootState, action: PayloadAction<{ notifys: ReceiveNotifyContent[], isUpSert: boolean }>) => {
      if (!action.payload.isUpSert) {
        state.Notify.Receive.contents = action.payload.notifys
      } else {
        action.payload.notifys.forEach((item) => {
          const content = state.Notify.Receive.contents.find((content) => content.notify_id === item.notify_id)
          if (undefined === content) {
            state.Notify.Receive.contents.push(item)
          } else {
            for (let index = 0; index < state.Notify.Receive.contents.length; index++) {
              if (state.Notify.Receive.contents[index].notify_id === item.notify_id) {
                state.Notify.Receive.contents[index] = item
                break
              }
            }
          }
        })
      }
    },
    set_receive_notify_choice: (state: RootState, action: PayloadAction<Choice[]>) => {
      state.Notify.Receive.choices = action.payload
    },
    remove_receive_notify: (state: RootState, action: PayloadAction<{ notify_id: string }>) => {
      state.Notify.Receive.contents = state.Notify.Receive.contents.filter((item) => item.notify_id !== action.payload.notify_id)
    },
    set_username: (state: RootState, action: PayloadAction<{ name: string }>) => {
      state.UserInfo.name = action.payload.name
    },
    remove_send_notify: (state: RootState, action: PayloadAction<{ notify_id: string }>) => {
      state.Notify.Send.contents = state.Notify.Send.contents.filter((item) => !(item.notify_id === action.payload.notify_id))
    },
    set_progress: (state: RootState, action: PayloadAction<{ progress: number }>) => {
      state.Condition.progress = action.payload.progress
    }
  },
  extraReducers: (builder) => {
    builder.addCase(load.fulfilled, onLoadingFulfilled)
    builder.addCase(load.pending, onLoadingPending)
    builder.addCase(load.rejected, onLoadingRejected)

    builder.addCase(signIn.fulfilled, onFulfilled)
    builder.addCase(signIn.pending, onPending)
    builder.addCase(signIn.rejected, onRejected)

    builder.addCase(signUp.fulfilled, onFulfilled)
    builder.addCase(signUp.pending, onPending)
    builder.addCase(signUp.rejected, onRejected)

    builder.addCase(signOut.fulfilled, onFulfilled)
    builder.addCase(signOut.pending, onPending)
    builder.addCase(signOut.rejected, onRejected)

    builder.addCase(resend_signup.fulfilled, onFulfilled)
    builder.addCase(resend_signup.pending, onPending)
    builder.addCase(resend_signup.rejected, onRejected)

    builder.addCase(load_group.fulfilled, onFulfilled)
    builder.addCase(load_group.pending, onPending)
    builder.addCase(load_group.rejected, onRejected)

    builder.addCase(load_group_list.fulfilled, onFulfilled)
    builder.addCase(load_group_list.pending, onPending)
    builder.addCase(load_group_list.rejected, onRejected)

    builder.addCase(load_group_list_paging.fulfilled, onFulfilled_Paging)
    builder.addCase(load_group_list_paging.pending, onPending_Paging)
    builder.addCase(load_group_list_paging.rejected, onRejected_Paging)

    builder.addCase(load_send_notify.fulfilled, onFulfilled)
    builder.addCase(load_send_notify.pending, onPending)
    builder.addCase(load_send_notify.rejected, onRejected)

    builder.addCase(load_send_notify_paging.fulfilled, onFulfilled_Paging)
    builder.addCase(load_send_notify_paging.pending, onPending_Paging)
    builder.addCase(load_send_notify_paging.rejected, onRejected_Paging)

    builder.addCase(load_receive_notify_list.fulfilled, onFulfilled)
    builder.addCase(load_receive_notify_list.pending, onPending)
    builder.addCase(load_receive_notify_list.rejected, onRejected)

    builder.addCase(on_touch_push_new_notify.fulfilled, onFulfilled)
    builder.addCase(on_touch_push_new_notify.pending, onPending)
    builder.addCase(on_touch_push_new_notify.rejected, onRejected)

    builder.addCase(on_touch_push_comp_notify.fulfilled, onFulfilled)
    builder.addCase(on_touch_push_comp_notify.pending, onPending)
    builder.addCase(on_touch_push_comp_notify.rejected, onRejected)

    builder.addCase(load_receive_notify_list_paging.fulfilled, onFulfilled_Paging)
    builder.addCase(load_receive_notify_list_paging.pending, onPending_Paging)
    builder.addCase(load_receive_notify_list_paging.rejected, onRejected_Paging)

    builder.addCase(load_group_member.fulfilled, onFulfilled)
    builder.addCase(load_group_member.pending, onPending)
    builder.addCase(load_group_member.rejected, onRejected)

    builder.addCase(load_group_member_paging.fulfilled, onFulfilled_Paging)
    builder.addCase(load_group_member_paging.pending, onPending_Paging)
    builder.addCase(load_group_member_paging.rejected, onRejected_Paging)

    builder.addCase(add_group.fulfilled, onFulfilled)
    builder.addCase(add_group.pending, onPending)
    builder.addCase(add_group.rejected, onRejected)

    builder.addCase(search_group.fulfilled, onFulfilled)
    builder.addCase(search_group.pending, onPending)
    builder.addCase(search_group.rejected, onRejected)

    builder.addCase(add_member.fulfilled, onFulfilled)
    builder.addCase(add_member.pending, onPending)
    builder.addCase(add_member.rejected, onRejected)

    builder.addCase(update_group_public.fulfilled, onFulfilled)
    builder.addCase(update_group_public.pending, onPending)
    builder.addCase(update_group_public.rejected, onRejected)

    builder.addCase(update_group_name.fulfilled, onFulfilled)
    builder.addCase(update_group_name.pending, onPending)
    builder.addCase(update_group_name.rejected, onRejected)

    builder.addCase(load_send_notify_detail.fulfilled, onFulfilled)
    builder.addCase(load_send_notify_detail.pending, onPending)
    builder.addCase(load_send_notify_detail.rejected, onRejected)

    builder.addCase(add_notify.fulfilled, onFulfilled)
    builder.addCase(add_notify.pending, onPending)
    builder.addCase(add_notify.rejected, onRejected)

    builder.addCase(update_answer.fulfilled, onFulfilled)
    builder.addCase(update_answer.pending, onPending)
    builder.addCase(update_answer.rejected, onRejected)

    builder.addCase(delete_user.fulfilled, onFulfilled)
    builder.addCase(delete_user.pending, onPending)
    builder.addCase(delete_user.rejected, onRejected)

    builder.addCase(update_acount_name.fulfilled, onFulfilled)
    builder.addCase(update_acount_name.pending, onPending)
    builder.addCase(update_acount_name.rejected, onRejected)

    builder.addCase(reset_password.fulfilled, onFulfilled)
    builder.addCase(reset_password.pending, onPending)
    builder.addCase(reset_password.rejected, onRejected)

    builder.addCase(delete_group_member.fulfilled, onFulfilled)
    builder.addCase(delete_group_member.pending, onPending)
    builder.addCase(delete_group_member.rejected, onRejected)

    builder.addCase(update_notify_close.fulfilled, onFulfilled)
    builder.addCase(update_notify_close.pending, onPending)
    builder.addCase(update_notify_close.rejected, onRejected)

    builder.addCase(upload_user_avator.fulfilled, onFulfilled)
    builder.addCase(upload_user_avator.pending, onPending)
    builder.addCase(upload_user_avator.rejected, onRejected)

    builder.addCase(upload_group_avator.fulfilled, onFulfilled)
    builder.addCase(upload_group_avator.pending, onPending)
    builder.addCase(upload_group_avator.rejected, onRejected)

    builder.addCase(delete_group_avator.fulfilled, onFulfilled)
    builder.addCase(delete_group_avator.pending, onPending)
    builder.addCase(delete_group_avator.rejected, onRejected)

    builder.addCase(delete_user_avator.fulfilled, onFulfilled)
    builder.addCase(delete_user_avator.pending, onPending)
    builder.addCase(delete_user_avator.rejected, onRejected)

    builder.addCase(update_ticket.fulfilled, onFulfilled)
    builder.addCase(update_ticket.pending, onPending)
    builder.addCase(update_ticket.rejected, onRejected)

    builder.addCase(load_ticket.fulfilled, onFulfilled)
    builder.addCase(load_ticket.pending, onPending)
    builder.addCase(load_ticket.rejected, onRejected)

    builder.addCase(add_ticket.fulfilled, onFulfilled)
    builder.addCase(add_ticket.pending, onPending)
    builder.addCase(add_ticket.rejected, onRejected)

    builder.addCase(load_send_notify_answer_list.fulfilled, onFulfilled)
    builder.addCase(load_send_notify_answer_list.pending, onPending)
    builder.addCase(load_send_notify_answer_list.rejected, onRejected)

    builder.addCase(load_send_notify_answer_list_paging.fulfilled, onFulfilled_Paging)
    builder.addCase(load_send_notify_answer_list_paging.pending, onPending_Paging)
    builder.addCase(load_send_notify_answer_list_paging.rejected, onRejected_Paging)

    builder.addCase(update_password.fulfilled, onFulfilled)
    builder.addCase(update_password.pending, onPending)
    builder.addCase(update_password.rejected, onRejected)

    builder.addCase(load_receive_notify_choice.fulfilled, onFulfilled)
    builder.addCase(load_receive_notify_choice.pending, onPending)
    builder.addCase(load_receive_notify_choice.rejected, onRejected)

    builder.addCase(update_terms_policy.fulfilled, onFulfilled)
    builder.addCase(update_terms_policy.pending, onPending)
    builder.addCase(update_terms_policy.rejected, onRejected)

    builder.addCase(change_ground_state.fulfilled, onFulfilled)
    builder.addCase(change_ground_state.pending, onPending)
    builder.addCase(change_ground_state.rejected, onRejected)
  }
})
const actions = Slice.actions
export const { reset_application_state } = Slice.actions

/****************************************************************************************************
 * load
 ****************************************************************************************************/
export const load = createAsyncThunk('load', async (_, api) => {

  try {

    const config = await Api.get_app_config()
    api.dispatch(actions.set_config(config))
    if (config.maintenance) {
      api.dispatch(actions.reset(initialState))
      return api.fulfillWithValue({
        status: ApplicationState.Failed,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)
    }
    //const result = await Api.checkForUpdate()
    const userInfo = await Api.get_userInfo()
    const deviceInfo = await Api.get_deviceInfo(userInfo.id)
    const contents = await Api.get_group_contents(userInfo.id)
    const notifyContents = await Api.get_send_notify_contents(userInfo.id)
    const joinNotifys = await Api.get_receive_notifys(userInfo.id)
    const tickets = await Api.get_tickets(userInfo.id);

    api.dispatch(actions.set_user_info(userInfo))
    api.dispatch(actions.set_device_info(deviceInfo))
    api.dispatch(actions.set_group_contents({ contents, is_offset: false }))
    api.dispatch(actions.set_send_notifys({ contents: notifyContents, isUpSert: false }))
    api.dispatch(actions.set_receive_notifys({ notifys: joinNotifys, isUpSert: false }))
    api.dispatch(actions.set_tickets(tickets))

    return api.fulfillWithValue({
      status: ApplicationState.Success,
      code: SystemException.None,
      data: {}
    } as ApplicationStatus)

  } catch (e) {
    console.log('load', e)
    if (e instanceof SystemException) {
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: e.code,
        data: {},
        error: e
      } as ApplicationStatus)
    }
    return api.rejectWithValue({
      status: ApplicationState.Failed,
      code: SystemException.SystemError,
      data: {},
      error: e
    } as ApplicationStatus)
  }
})

/****************************************************************************************************
 * load_group
 ****************************************************************************************************/
export const load_group = createAsyncThunk(
  'load_group',
  async ({ group_id }: { group_id: string }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const content = await Api.get_group_content(userInfo.id, group_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== content) {
        api.dispatch(actions.set_group_content(content))
      } else {
        api.dispatch(actions.remove_group_contents({ group_id }))
      }

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_group', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)


/****************************************************************************************************
 * load_group_list
 ****************************************************************************************************/
export const load_group_list = createAsyncThunk(
  'load_group_list',
  async (_, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const contents = await Api.get_group_contents(userInfo.id)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_group_contents({ contents, is_offset: false }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_group_list', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)


/****************************************************************************************************
 * load_group_list_paging
 ****************************************************************************************************/
export const load_group_list_paging = createAsyncThunk(
  'load_group_list_paging',
  async ({ user_id, offset }: { user_id: string, offset: number }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const contents = await Api.get_group_contents(user_id, offset)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_group_contents({ contents, is_offset: true }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_group_list_paging', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * load_group_member
 ****************************************************************************************************/
export const load_group_member = createAsyncThunk(
  'load_group_member',
  async (params: { group_id: string }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const content = await Api.get_group_content(userInfo.id, params.group_id)
      const member = await Api.get_group_member(params.group_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== content) {
        api.dispatch(actions.set_group_content(content))
        api.dispatch(actions.set_group_member({ member, is_offset: false }))
      } else {
        api.dispatch(actions.set_group_member({ member: [], is_offset: false }))
        api.dispatch(actions.remove_group_contents({ group_id: params.group_id }))
      }

      const appState: ApplicationStatus = {
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      }
      return api.fulfillWithValue(appState)

    } catch (e) {
      console.log('load_group_member', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * load_group_member_paging
 ****************************************************************************************************/
export const load_group_member_paging = createAsyncThunk(
  'load_group_member_paging',
  async (params: { group_id: string, offset: number }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const member = await Api.get_group_member(params.group_id, params.offset)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_group_member({ member, is_offset: true }))

      const appState: ApplicationStatus = {
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      }
      return api.fulfillWithValue(appState)

    } catch (e) {
      console.log('load_group_member_paging', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * load_send_notify
 ****************************************************************************************************/
export const load_send_notify = createAsyncThunk(
  'load_send_notify',
  async (_, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const contents = await Api.get_send_notify_contents(userInfo.id)
      const tickets = await Api.get_tickets(userInfo.id);

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_tickets(tickets))
      api.dispatch(actions.set_send_notifys({ contents, isUpSert: false }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_send_notify', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)


/****************************************************************************************************
 * load_send_notify_paging
 ****************************************************************************************************/
export const load_send_notify_paging = createAsyncThunk(
  'load_send_notify_paging',
  async (params: { offset: number }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const contents = await Api.get_send_notify_contents(userInfo.id, params.offset)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_send_notifys({ contents, isUpSert: true }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_send_notify_paging', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)


/****************************************************************************************************
 * load_send_notify_answer_list
 ****************************************************************************************************/
export const load_send_notify_answer_list = createAsyncThunk(
  'load_send_notify_answer_list',
  async (params: { notify_id: string, choice: number }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const contens = await Api.get_send_notify(userInfo.id, params.notify_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== contens) {
        const choices = await Api.get_send_notify_choice(params.notify_id)
        const answers = await Api.get_send_notify_asnwer(params.notify_id, params.choice)
        api.dispatch(actions.set_send_notifys({ contents: [contens], isUpSert: true }))
        api.dispatch(actions.set_send_notify_answers({ answers, is_offset: false }))
        api.dispatch(actions.set_send_notify_choice(choices))
      } else {
        api.dispatch(actions.remove_send_notify({ notify_id: params.notify_id }))
        api.dispatch(actions.set_send_notify_answers({ answers: [], is_offset: false }))
        api.dispatch(actions.set_send_notify_choice([]))
      }

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_send_notify_answer_list', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * load_send_notify_answer_list_paging
 ****************************************************************************************************/
export const load_send_notify_answer_list_paging = createAsyncThunk(
  'load_send_notify_answer_list_paging',
  async (params: { notify_id: string, choice: number, offset: number }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const answers = await Api.get_send_notify_asnwer(params.notify_id, params.choice, params.offset)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_send_notify_answers({ answers, is_offset: true }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_send_notify_answer_list_paging', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * load_receive_notify_list
 ****************************************************************************************************/
export const load_receive_notify_list = createAsyncThunk(
  'load_receive_notify_list',
  async (_, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const notifys = await Api.get_receive_notifys(userInfo.id)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_receive_notifys({ notifys, isUpSert: false }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_receive_notify_list', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)


/****************************************************************************************************
 * on_touch_push_new_notify
 ****************************************************************************************************/
export const on_touch_push_new_notify = createAsyncThunk(
  'on_touch_push_new_notify',
  async ({ notify_id }: { notify_id: string }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const notify = await Api.get_receive_notify(userInfo.id, notify_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== notify) {
        const choice = await Api.get_receive_notify_choice(notify_id)
        api.dispatch(actions.set_receive_notifys({ notifys: [notify], isUpSert: true }))
        api.dispatch(actions.set_receive_notify_choice(choice))
      } else {
        api.dispatch(actions.remove_receive_notify({ notify_id }))
      }


      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('on_touch_push_new_notify', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * on_touch_push_comp_notify
 ****************************************************************************************************/
export const on_touch_push_comp_notify = createAsyncThunk(
  'on_touch_push_comp_notify',
  async ({ notify_id }: { notify_id: string }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const content = await Api.get_send_notify(userInfo.id, notify_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== content) {
        api.dispatch(actions.set_send_notifys({ contents: [content], isUpSert: true }))
      }

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('on_touch_push_comp_notify', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * load_receive_notify_list_paging
 ****************************************************************************************************/
export const load_receive_notify_list_paging = createAsyncThunk(
  'load_receive_notify_list_paging',
  async ({ offset }: { offset: number }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const notifys = await Api.get_receive_notifys(userInfo.id, offset)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_receive_notifys({ notifys, isUpSert: true }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('load_receive_notify_list_paging', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * load_send_notify_detail
 ****************************************************************************************************/
export const load_send_notify_detail = createAsyncThunk(
  'load_send_notify_detail',
  async (params: { notify_id: string }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const contens = await Api.get_send_notify(userInfo.id, params.notify_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== contens) {
        const item = await Api.get_send_notify_choice(params.notify_id)
        api.dispatch(actions.set_send_notifys({ contents: [contens], isUpSert: true }))
        api.dispatch(actions.set_send_notify_choice(item))
        return api.fulfillWithValue({
          status: ApplicationState.Success,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      } else {
        api.dispatch(actions.remove_send_notify({ notify_id: params.notify_id }))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }

    } catch (e) {
      console.log('load_send_notify_detail', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * signIn
 ****************************************************************************************************/
export const signIn = createAsyncThunk(
  'signIn',
  async (param: {
    mail: string
    password: string
  }, api) => {
    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const user_id = await Api.signIn(param.mail, param.password)

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: { user_id },
      } as ApplicationStatus)

    } catch (e) {
      console.log('signIn', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * signUp
 ****************************************************************************************************/
export const signUp = createAsyncThunk(
  'signUp',
  async (param: {
    mail: string,
    password: string,
    name: string,
    terms_ver: number,
    policy_ver: number
  }, api) => {
    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const user_id = await Api.signUp(param.mail, param.password, param.name, param.terms_ver, param.policy_ver)

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: { user_id },
      } as ApplicationStatus)

    } catch (e) {
      console.log('signUp', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)


/****************************************************************************************************
 * update_password
 ****************************************************************************************************/
export const update_password = createAsyncThunk(
  'update_password',
  async (param: { password: string }, api) => {
    try {
      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      await Api.update_password(param.password)

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {}
      } as ApplicationStatus)

    } catch (e) {
      console.log('update_password', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * resend_signup
 ****************************************************************************************************/
export const resend_signup = createAsyncThunk(
  'resend_signup',
  async (param: { mail: string }, api) => {
    try {
      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      await Api.resend_signup(param.mail)

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('resend_signup', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * signOut
 ****************************************************************************************************/
export const signOut = createAsyncThunk(
  'signOut',
  async ({ device_id }: { device_id: string }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.delete_device_token(userInfo.id, device_id)

      api.dispatch(actions.reset(initialState))
      Api.signOut()

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('signOut', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  })

/****************************************************************************************************
 * reset_password
 ****************************************************************************************************/
export const reset_password = createAsyncThunk(
  'reset_password',
  async (params: { mail: string }, api) => {
    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      await Api.reset_password(params.mail)

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('reset_password', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * add_group
 ****************************************************************************************************/
export const add_group = createAsyncThunk(
  'add_group',
  async ({ code, group_name }: {
    group_name: string,
    code: string,
  }, api) => {

    try {
      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.add_group(userInfo.id, code, group_name)
      const contents = await Api.get_group_contents(userInfo.id)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_group_contents({ contents, is_offset: false }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('add_group', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * search_group
 ****************************************************************************************************/
export const search_group = createAsyncThunk(
  'search_group',
  async (params: {
    code: string
  }, api) => {
    try {
      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const resutl = await Api.get_group_by_code(params.code)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== resutl) {
        const isExist = await Api.is_group_member(userInfo.id, resutl.group_id)
        return api.fulfillWithValue({
          status: ApplicationState.Success,
          code: SystemException.None,
          data: {
            isExist,
            group_id: resutl.group_id,
            name: resutl.name,
            img: resutl.img,
          },
        } as ApplicationStatus)

      } else {
        throw new SystemException(SystemException.None)
      }

    } catch (e) {
      console.log('search_group', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * add_member
 ****************************************************************************************************/
export const add_member = createAsyncThunk(
  'add_member',
  async ({ group_id }: {
    group_id: string
  }, api) => {

    try {
      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.add_member({
        user_id: userInfo.id,
        group_id,
      })
      const contents = await Api.get_group_contents(userInfo.id)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.set_group_contents({ contents, is_offset: false }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('add_member', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * update_group_public
 ****************************************************************************************************/
export const update_group_public = createAsyncThunk(
  'update_group_public',
  async (params: { group_id: string, public: number, }, api) => {
    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.update_group_public(params.group_id, params.public)
      const content = await Api.get_group_content(userInfo.id, params.group_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== content) {
        api.dispatch(actions.set_group_content(content))
      } else {
        api.dispatch(actions.remove_group_contents({ group_id: params.group_id }))
      }

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('update_group_public', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * update_group_name
 ****************************************************************************************************/
export const update_group_name = createAsyncThunk(
  'update_group_name',
  async (params: {
    group_id: string,
    group_name: string,
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.update_group_name(params.group_id, params.group_name)
      const content = await Api.get_group_content(userInfo.id, params.group_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== content) {
        api.dispatch(actions.set_group_content(content))
      } else {
        api.dispatch(actions.remove_group_contents({ group_id: params.group_id }))
      }

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('update_group_name', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * add_notify
 ****************************************************************************************************/
export const add_notify = createAsyncThunk(
  'add_notify',
  async (params: {
    title: string,
    choice: string[],
    group_id: string,
    is_anonym: number,
  }, api) => {

    try {
      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const notify = await Api.add_notify(
        userInfo.id,
        params.title,
        params.choice,
        params.group_id,
        params.is_anonym
      )

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.add_send_notify(notify))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('add_notify', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * update_answer
 ****************************************************************************************************/
export const update_answer = createAsyncThunk(
  'update_answer',
  async (params: { group_id: string, notify_id: string, choice: number }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.update_answer({
        user_id: userInfo.id,
        group_id: params.group_id,
        notify_id: params.notify_id,
        choice: params.choice
      })
      const userInfo2 = await Api.get_userInfo()

      api.dispatch(actions.set_user_info(userInfo2))
      api.dispatch(actions.remove_receive_notify({ notify_id: params.notify_id }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('update_answer', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * delete_user
 ****************************************************************************************************/
export const delete_user = createAsyncThunk(
  'delete_user',
  async (_, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.delete_user(userInfo.id)

      api.dispatch(actions.reset(initialState))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('delete_user', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * set_username
 ****************************************************************************************************/
export const update_acount_name = createAsyncThunk(
  'update_acount_name',
  async (params: {
    name: string
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.update_acount_name(userInfo.id, params.name)
      const userInfo2 = await Api.get_userInfo()

      api.dispatch(actions.set_user_info(userInfo2))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('update_acount_name', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }

      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * delete_group_member
 ****************************************************************************************************/
export const delete_group_member = createAsyncThunk(
  'delete_group_member',
  async ({ group_id, user_id }: {
    group_id: string,
    user_id?: string
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      if (undefined !== user_id) {
        await Api.delete_group_member(group_id, user_id)
      } else {
        await Api.delete_group_member(group_id, userInfo.id)
      }
      const content = await Api.get_group_content(userInfo.id, group_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== content) {
        if (undefined !== user_id) {
          api.dispatch(actions.remove_group_member({ user_id }))
        } else {
          api.dispatch(actions.remove_group_contents({ group_id }))
        }
      } else {
        api.dispatch(actions.remove_group_contents({ group_id }))
        api.dispatch(actions.set_group_member({ member: [], is_offset: false }))
      }

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('delete_group_member', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }

      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * update_notify_close
 ****************************************************************************************************/
export const update_notify_close = createAsyncThunk(
  'update_notify_close',
  async (params: {
    notify_id: string,
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.update_notify_close(params.notify_id)

      api.dispatch(actions.set_user_info(userInfo))
      api.dispatch(actions.remove_send_notify({ notify_id: params.notify_id }))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('update_notify_close', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }

      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * upload_user_avator
 ****************************************************************************************************/
export const upload_user_avator = createAsyncThunk(
  'upload_user_avator',
  async ({ asset }: {
    asset: ImagePicker.ImagePickerAsset
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const { url } = await Api.uploadFile(userInfo.id, asset)
      await Api.set_user_image_url(userInfo.id, url)
      const userInfo2 = await Api.get_userInfo()

      api.dispatch(actions.set_user_info(userInfo2))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {
          url
        },
      } as ApplicationStatus)

    } catch (e) {
      console.log('upload_user_avator', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)


/****************************************************************************************************
 * delete_user_avator
 ****************************************************************************************************/
export const delete_user_avator = createAsyncThunk(
  'delete_user_avator',
  async ({ path }: {
    path: string
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const fileName = getFileNameFromUrl(path)
      await Api.deleteFile(fileName)
      await Api.set_user_image_url(userInfo.id, null)
      const userInfo2 = await Api.get_userInfo()

      api.dispatch(actions.set_user_info(userInfo2))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('delete_user_avator', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * upload_group_avator
 ****************************************************************************************************/
export const upload_group_avator = createAsyncThunk(
  'upload_group_avator',
  async ({ asset, group_id }: {
    group_id: string,
    asset: ImagePicker.ImagePickerAsset
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const { url } = await Api.uploadFile(group_id, asset)
      await Api.update_group_image_url(group_id, url)
      const content = await Api.get_group_content(userInfo.id, group_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== content) {
        api.dispatch(actions.set_group_content(content))
        api.dispatch(actions.set_notify_group_image({ group_id, img: content.img }))
      } else {
        api.dispatch(actions.remove_group_contents({ group_id }))
      }

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {
          url
        },
      } as ApplicationStatus)

    } catch (e) {
      console.log('upload_group_avator', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * delete_group_avator
 ****************************************************************************************************/
export const delete_group_avator = createAsyncThunk(
  'delete_group_avator',
  async ({ group_id, path }: {
    group_id: string,
    path: string,
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      const fileName = getFileNameFromUrl(path)
      await Api.deleteFile(fileName)
      await Api.update_group_image_url(group_id, null)
      const content = await Api.get_group_content(userInfo.id, group_id)

      api.dispatch(actions.set_user_info(userInfo))
      if (null !== content) {
        api.dispatch(actions.set_group_content(content))
        api.dispatch(actions.set_notify_group_image({ group_id, img: content.img }))
      } else {
        api.dispatch(actions.remove_group_contents({ group_id }))
      }

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('delete_group_avator', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * upload_user_avator
 ****************************************************************************************************/
export const update_ticket = createAsyncThunk(
  'update_ticket',
  async (params: {
    ticket_id: string
  }, api) => {

    try {

      const config = await Api.get_app_config()
      api.dispatch(actions.set_config(config))
      if (config.maintenance) {
        api.dispatch(actions.reset(initialState))
        return api.fulfillWithValue({
          status: ApplicationState.Failed,
          code: SystemException.None,
          data: {},
        } as ApplicationStatus)
      }
      const userInfo = await Api.get_userInfo()
      await Api.update_ticket(userInfo.id, params.ticket_id)
      const userInfo2 = await Api.get_userInfo()
      const tickets = await Api.get_tickets(userInfo.id);

      api.dispatch(actions.set_tickets(tickets))
      api.dispatch(actions.set_user_info(userInfo2))

      return api.fulfillWithValue({
        status: ApplicationState.Success,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)

    } catch (e) {
      console.log('update_ticket', e)
      if (e instanceof SystemException) {
        return api.rejectWithValue({
          status: ApplicationState.Failed,
          code: e.code,
          data: {},
          error: e
        } as ApplicationStatus)
      }
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: SystemException.SystemError,
        data: {},
        error: e
      } as ApplicationStatus)
    }
  }
)

/****************************************************************************************************
 * load_ticket
 ****************************************************************************************************/
export const load_ticket = createAsyncThunk('load_ticket', async (_, api) => {

  try {

    const config = await Api.get_app_config()
    api.dispatch(actions.set_config(config))
    if (config.maintenance) {
      api.dispatch(actions.reset(initialState))
      return api.fulfillWithValue({
        status: ApplicationState.Failed,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)
    }
    const userInfo = await Api.get_userInfo()
    const tickets = await Api.get_tickets(userInfo.id);

    api.dispatch(actions.set_user_info(userInfo))
    api.dispatch(actions.set_tickets(tickets))

    return api.fulfillWithValue({
      status: ApplicationState.Success,
      code: SystemException.None,
      data: {},
    } as ApplicationStatus)

  } catch (e) {
    console.log('load_ticket', e)
    if (e instanceof SystemException) {
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: e.code,
        data: {},
        error: e
      } as ApplicationStatus)
    }
    return api.rejectWithValue({
      status: ApplicationState.Failed,
      code: SystemException.SystemError,
      data: {},
      error: e
    } as ApplicationStatus)
  }
})

/****************************************************************************************************
 * add_ticket
 ****************************************************************************************************/
export const add_ticket = createAsyncThunk('add_ticket', async (params: { count: number }, api) => {

  try {

    const config = await Api.get_app_config()
    api.dispatch(actions.set_config(config))
    if (config.maintenance) {
      api.dispatch(actions.reset(initialState))
      return api.fulfillWithValue({
        status: ApplicationState.Failed,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)
    }
    const userInfo = await Api.get_userInfo()
    await Api.add_ticket(userInfo.id, params.count)
    const userInfo2 = await Api.get_userInfo()
    const tickets = await Api.get_tickets(userInfo.id);

    api.dispatch(actions.set_user_info(userInfo2))
    api.dispatch(actions.set_tickets(tickets))

    return api.fulfillWithValue({
      status: ApplicationState.Success,
      code: SystemException.None,
      data: {},
    } as ApplicationStatus)

  } catch (e) {
    console.log('add_ticket', e)
    if (e instanceof SystemException) {
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: e.code,
        data: {},
        error: e
      } as ApplicationStatus)
    }
    return api.rejectWithValue({
      status: ApplicationState.Failed,
      code: SystemException.SystemError,
      data: {},
      error: e
    } as ApplicationStatus)
  }
})


/****************************************************************************************************
 * load_receive_notify_choice
 ****************************************************************************************************/
export const load_receive_notify_choice = createAsyncThunk('load_receive_notify_choice', async (params: { notify_id: string }, api) => {

  try {

    const config = await Api.get_app_config()
    api.dispatch(actions.set_config(config))
    if (config.maintenance) {
      api.dispatch(actions.reset(initialState))
      return api.fulfillWithValue({
        status: ApplicationState.Failed,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)
    }
    const userInfo = await Api.get_userInfo()
    const content = await Api.get_receive_notify(userInfo.id, params.notify_id)

    api.dispatch(actions.set_user_info(userInfo))
    if (null !== content) {
      const choice = await Api.get_receive_notify_choice(params.notify_id)
      api.dispatch(actions.set_receive_notifys({ notifys: [content], isUpSert: true }))
      api.dispatch(actions.set_receive_notify_choice(choice))
    } else {
      api.dispatch(actions.remove_receive_notify({ notify_id: params.notify_id }))
    }

    return api.fulfillWithValue({
      status: ApplicationState.Success,
      code: SystemException.None,
      data: {},
    } as ApplicationStatus)

  } catch (e) {
    console.log('load_receive_notify_choice', e)
    if (e instanceof SystemException) {
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: e.code,
        data: {},
        error: e
      } as ApplicationStatus)
    }
    return api.rejectWithValue({
      status: ApplicationState.Failed,
      code: SystemException.SystemError,
      data: {},
      error: e
    } as ApplicationStatus)
  }
})


/****************************************************************************************************
 * update_terms_policy
 ****************************************************************************************************/
export const update_terms_policy = createAsyncThunk('update_terms_policy', async (params: { terms_version: number, policy_version: number }, api) => {

  try {

    const config = await Api.get_app_config()
    api.dispatch(actions.set_config(config))
    if (config.maintenance) {
      api.dispatch(actions.reset(initialState))
      return api.fulfillWithValue({
        status: ApplicationState.Failed,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)
    }
    const userInfo = await Api.get_userInfo()
    await Api.set_terms_policy(userInfo.id, params.terms_version, params.policy_version)
    const userInfo2 = await Api.get_userInfo()

    api.dispatch(actions.set_user_info(userInfo2))

    return api.fulfillWithValue({
      status: ApplicationState.Success,
      code: SystemException.None,
      data: {},
    } as ApplicationStatus)

  } catch (e) {
    console.log('update_terms_policy', e)
    if (e instanceof SystemException) {
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: e.code,
        data: {},
        error: e
      } as ApplicationStatus)
    }
    return api.rejectWithValue({
      status: ApplicationState.Failed,
      code: SystemException.SystemError,
      data: {},
      error: e
    } as ApplicationStatus)
  }
})

/****************************************************************************************************
 * change_ground_state
 ****************************************************************************************************/
export const change_ground_state = createAsyncThunk('change_ground_state', async (_, api) => {

  try {

    const config = await Api.get_app_config()
    api.dispatch(actions.set_config(config))
    if (config.maintenance) {
      api.dispatch(actions.reset(initialState))
      return api.fulfillWithValue({
        status: ApplicationState.Failed,
        code: SystemException.None,
        data: {},
      } as ApplicationStatus)
    }
    const userInfo = await Api.get_userInfo()

    api.dispatch(actions.set_user_info(userInfo))

    return api.fulfillWithValue({
      status: ApplicationState.Success,
      code: SystemException.None,
      data: {},
    } as ApplicationStatus)

  } catch (e) {
    console.log('upload_usechange_background_for_forgroundr_avator', e)
    if (e instanceof SystemException) {
      return api.rejectWithValue({
        status: ApplicationState.Failed,
        code: e.code,
        data: {},
        error: e
      } as ApplicationStatus)
    }
    return api.rejectWithValue({
      status: ApplicationState.Failed,
      code: SystemException.SystemError,
      data: {},
      error: e
    } as ApplicationStatus)
  }
})


/****************************************************************************************************
 * common
 ****************************************************************************************************/
function onLoadingFulfilled(state: RootState, action: AnyAction) {
  state.Application.Success = action.payload
}

function onLoadingPending(state: RootState, action: AnyAction) {
  state.Application.Error = { code: SystemException.None, data: {}, status: ApplicationState.None, error: {} }
}

function onLoadingRejected(state: RootState, action: AnyAction) {
  state.Application.Error = action.payload
}

function onFulfilled(state: RootState, action: AnyAction) {
  state.Application.Success = action.payload
  state.Condition.isGlobalLoading = false
  state.Condition.progress = 0
}

function onPending(state: RootState, action: AnyAction) {
  state.Application.Error = { code: SystemException.None, data: {}, status: ApplicationState.None, error: {} }
  state.Condition.isGlobalLoading = true
}

function onRejected(state: RootState, action: AnyAction) {
  state.Application.Error = action.payload
  state.Condition.isGlobalLoading = false
  state.Condition.progress = 0
}

function onFulfilled_Paging(state: RootState, action: AnyAction) {
  state.Application.Error = action.payload
  state.Condition.isPagingLoading = false
  state.Condition.progress = 0
}

function onPending_Paging(state: RootState, action: AnyAction) {
  state.Application.Error = { code: SystemException.None, data: {}, status: ApplicationState.None, error: {} }
  state.Condition.isPagingLoading = true
}

function onRejected_Paging(state: RootState, action: AnyAction) {
  state.Application.Error = action.payload
  state.Condition.isPagingLoading = false
  state.Condition.progress = 0
}

export default Slice.reducer
