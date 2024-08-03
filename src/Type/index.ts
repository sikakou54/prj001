export interface Choice {
    choice: number
    is_remarks: number
    text: string
}

export interface Ticket {
    ticket_id: string
    count: number
    comment: string
    update_at: Date
}

export interface UserInfo {
    id: string
    name: string
    mail: string
    img: string | null
    ticket_num: number
    receive_notify_num: number
    terms_version: number
    policy_version: number
}

export interface DeviceInfo {
    token: string
    device_id: string
}

export interface ApplicationStatus {
    status: number
    code: string
    data: any
    error?: any
}

export interface Application {
    Success: ApplicationStatus
    Error: ApplicationStatus
}

export type GroupContent = {
    count: number
    group_id: string
    name: string
    public: number
    img: string | null
    code: string
}

export interface GroupMember {
    user_id: string
    name: string
    img: string | null
}

export interface SendNotifyContent {
    notify_id: string
    name: string
    group_name: string
    group_id: string
    img: string | null
    percent: number
    is_anonym: number
    format: number
    create_at: Date
}

export interface SendNotifyChoice {
    choice: number
    text: string
    count: number
}

export interface SendNotifyAsnwer {
    user_id: string
    name: string
    img: string | null
    remarks: string | null
    update_at: Date
}

export interface SendNotify {
    contents: SendNotifyContent[]
    choices: SendNotifyChoice[]
    answer: SendNotifyAsnwer[]
}

export interface ReceiveNotifyContent {
    group_id: string
    notify_id: string
    name: string
    group_name: string
    user_name: string
    img: string | null
    img_user: string | null
    is_anonym: number
    format: number
    create_at: Date
}

export interface NotificationMessage {
    id: string,
    item: object
}

export interface NotificationMessageItem {
    notify_id: string
    user_id: string
}

export interface AppConfig {
    debug: boolean,
    maintenance: boolean,
    admob: {
        banner: {
            android: string | undefined,
            ios: string | undefined
        },
        reword: {
            android: string | undefined,
            ios: string | undefined
        }
    },
    terms: {
        url: string | undefined,
        version: number
    },
    policy: {
        url: string | undefined,
        version: number
    }
}

export interface RootState {
    Application: Application
    Condition: {
        isPagingLoading: boolean
        isGlobalLoading: boolean
        progress: number
    }
    Config: AppConfig
    UserInfo: UserInfo
    DeviceInfo: {
        token: string
        device_id: string
    }
    Group: {
        contents: GroupContent[]
        member: GroupMember[]
    }
    Notify: {
        Tickets: Ticket[]
        Send: {
            contents: SendNotifyContent[]
            choices: SendNotifyChoice[]
            answer: SendNotifyAsnwer[]
        }
        Receive: {
            contents: ReceiveNotifyContent[]
            choices: Choice[]
        }
    }
}

export type answer_choice_type = {
    choice: number
    remarks: string | null
}

export type notify_choice_type = {
    name: string
    is_remarks: string
}

export enum ApplicationState {
    None = 0,
    Success,
    Failed
}

export class SystemException {

    static None = 'None'
    static SystemError = 'SystemError'
    static NetworkingError = 'NetworkingError'
    static NotFoundUser = 'NotFoundUser'
    static NotifyExistClosed = 'NotifyExistClosed'
    static device_idLodingFailed = 'device_idLodingFailed'
    static UserNotFoundException = 'UserNotFoundException'
    static NotAuthorizedException = 'NotAuthorizedException'
    static UsernameExistsException = 'UsernameExistsException'
    static CodeMismatchException = 'CodeMismatchException'
    static LimitExceededException = 'LimitExceededException'
    static TransactionCanceledException = 'TransactionCanceledException'
    static ConditionalCheckFailedException = 'ConditionalCheckFailedException'
    static UserUnAuthenticatedException = 'UserUnAuthenticatedException'
    static InvalidEmailException = 'InvalidEmailException'
    static TimeoutError = 'TimeoutError'

    code: string
    tag?: any
    constructor(name: string, tag?: any) {
        this.code = name
        this.tag = tag
    }
}

export const MAX_CHOICE_NUM = 10

export enum ERROR_CODE {
    NONE = 0,
    USERNAME_EMPTY_ERROR,
    MAIL_EMPTY_ERROR,
    PASSWORD_EMPTY_ERROR,
    CONFIRM_EMPTY_ERROR,
    CONFIRMCODE_EMPTY_ERROR,
    PASSWORD_COMP_ERROR,
    MAIL_FORMAT_ERROR,
    MAIL_EXIST_ERROR,
    NOT_LOGIN_ERROR,
    CONFIRM_MISMATCH_ERROR,
    CONFIRM_RESEND_LIMIT_ERROR,
    PASSWORD_ERROR,
    MAIL_ERROR,
    MAIL_NOT_RESIST_ERROR,
    PASSWORD_LIMIT_ERROR,
    PASSWORD_VALIDATE_ERROR
}

export const ERROR_MESSAGE = {
    MAIL_FORMAT_ERROR: '有効なメールアドレスを入力してください',
    USERNAME_EMPTY_ERROR: 'ユーザー名を入力してください',
    PASSWORD_EMPTY_ERROR: 'パスワードを入力してください',
    CONFIRM_EMPTY_ERROR: '確認パスワードを入力してください',
    CONFIRMCODE_EMPTY_ERROR: '確認コードを入力してください',
    PASSWORD_COMP_ERROR: 'パスワードが一致していません',
    MAIL_EXIST_ERROR: 'このメールアドレスは既に使用されています',
    MAIL_NOT_RESIST_ERROR: 'このメールアドレスの登録はありません',
    NOT_LOGIN_ERROR: 'メールアドレスまたはパスワードが正しくありません',
    CONFIRM_MISMATCH_ERROR: '確認コードが正しくありません',
    CONFIRM_RESEND_LIMIT_ERROR: '再送回数の制限に達しました。\nしばらく待って再度お試しください',
    PASSWORD_LIMIT_ERROR: 'パスワード設定回数の制限に達しました。\nしばらく待って再度お試しください',
    PASSWORD_ERROR: 'パスワードに誤りがあります。',
    MAIL_ERROR: 'メールアドレスに誤りがあります。',
    PASSWORD_VALIDATE_ERROR: '8文字以上で大文字・小文字・数字を含む必要があります。'
}

export const COLOR = {
    WHITE: '#f0f4f5',
    RED: '#FF4530',
    GREEN: '#00A45D',
    LIGHT_GREEN: '#8eb2b6',
    DEEP_GREEN: '#2e3645',
    BLUE: '#3366FF',
    SKYBLUE: '#8eb2b6',
    GRAY: '#a1a1aa',
    LIGHT_GRAY: '#e5e5e5',
    BLACK: '#262626',
    DEEP_BLACK: '#141414',
}

export enum AlertType {
    None = 0,
    YesNo,
    OkCancel,
    Ok,
}

export enum AlertResult {
    Yes = 0,
    No,
    Ok,
    Cancel
}