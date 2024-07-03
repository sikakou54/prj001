import React, { useCallback, useContext, useMemo } from 'react'
import { Box, Button, Text, VStack, useColorModeValue } from 'native-base'
import { AppDispatch } from '../../src/Store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { add_member } from '../../src/Store/Reducer'
import {
    ApplicationState,
    ApplicationStatus,
    COLOR,
    SystemException,
    RootState,
    UserInfo,
} from '../../src/Type'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import TextBox from '../../src/Compenent/TextBox'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import { ToastContext } from '../../src/context'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const { group_id, name, img, isExist } = useLocalSearchParams()
    const userInfo: UserInfo = useSelector((state: RootState) => state.UserInfo, shallowEqual)
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)
    const isDisabled = useMemo(() => { return 'true' === isExist }, [isExist])

    const join = useCallback(() => {
        dispatch(add_member({ group_id: group_id as string })).then((item) => {
            const status: ApplicationStatus = item.payload as ApplicationStatus
            if (status.status === ApplicationState.Success) {
                toast?.showToast({
                    title: `${name}に参加しました`,
                    bg: COLOR.LIGHT_GREEN,

                })
            } else if (status.code === SystemException.LimitExceededException) {
                toast?.showToast({
                    title: `参加上限に達しているため参加できません`,
                    bg: COLOR.GRAY,

                })
            }
            router.back()
            router.back()
        })
    }, [group_id, userInfo])

    return (
        <Box
            h={'full'}
            w={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    title: '検索結果',
                }}
            />
            <VStack w={'95%'} pt={5} alignItems={'center'} space={5}>
                <TextBox
                    leftIcon={
                        <AvatarIcon
                            img={img !== undefined ? img as string : null}
                            defaultIcon={<Text color={COLOR.WHITE}>{(name as string).substring(0, 1)}</Text>}
                        />
                    }
                    text={name as string}
                    roundedTop={'md'}
                    roundedBottom={'md'}
                />
                <Button
                    isDisabled={isDisabled}
                    w={'full'}
                    h={12}
                    textAlign={'center'}
                    onPress={join}
                    bg={COLOR.LIGHT_GREEN}
                    borderRadius={10}
                    rounded={'md'}
                >{isDisabled ? '参加済み' : '参加する'}</Button>
            </VStack>
        </Box>
    )
}

export default Page
