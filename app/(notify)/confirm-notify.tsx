import React, { useContext, useMemo } from 'react'
import {
    Stack,
    router,
    useLocalSearchParams,
} from 'expo-router'
import {
    Box,
    Button,
    Center,
    FormControl,
    HStack,
    ScrollView,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import { ApplicationState, ApplicationStatus, COLOR, SystemException, RootState } from '../../src/Type'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../src/Store'
import { add_notify } from '../../src/Store/Reducer'
import TextBox from '../../src/Compenent/TextBox'
import Card from '../../src/Compenent/Card'
import AvatarIcon from '../../src/Compenent/AvatorIcon'
import { GroupContent } from '../../src/Type'
import Number_1_10 from '../../src/Compenent/Number_1_10'
import { ToastContext } from '../../src/context'

function Page() {
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const isGlobalLoading: boolean = useSelector((state: RootState) => state.Condition.isGlobalLoading, shallowEqual)
    const contents: GroupContent[] = useSelector((state: RootState) => state.Group.contents, shallowEqual)
    const { group_id, title, choiceItems, isChecked, format } = useLocalSearchParams<{ group_id: string, title: string, choiceItems: string, isChecked: string, format: string }>()
    const is_anonym: boolean = isChecked === '1' ? true : false
    const choices = JSON.parse(choiceItems) as { idx: number, name: string, is_remarks: string }[]
    const dispatch: AppDispatch = useDispatch()
    const toast = useContext(ToastContext)
    const content = useMemo(() => { return contents.find((group) => group.group_id === group_id) }, [group_id])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
        >
            <Stack.Screen
                options={{
                    title: '確認',
                }}
            />
            <ScrollView
                w={'95%'}
                h={'90%'}
            >
                <VStack
                    w={'full'}
                    space={1}
                    mt={5}
                    mb={5}
                    alignItems={'center'}
                >
                    <Box w={'full'}>
                        <FormControl.Label
                            w={'full'}
                            fontWeight={'bold'}
                            fontSize={'md'}
                        >タイトル</FormControl.Label>
                    </Box>
                    <Box w={'full'}>
                        <TextBox
                            numberOfLines={2}
                            text={title}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                        />
                    </Box>
                    <Box w={'full'} m={2}>
                        <FormControl.Label
                            w={'full'}
                            fontWeight={'bold'}
                            fontSize={'md'}
                        >選択肢</FormControl.Label>
                    </Box>
                    {choices.length > 0 && (
                        <Card
                            bg={cardBg}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                        >
                            {choices.map((item, index) => (
                                <HStack key={index} h={20} alignItems={'center'}>
                                    <Center w={'15%'}>
                                        <Number_1_10
                                            num={item.idx + 1}
                                            size={25}
                                        />
                                    </Center>
                                    <VStack w={'85%'} space={1} justifyContent={'center'}>
                                        <Text w={'95%'} numberOfLines={2}>{item.name}</Text>
                                        {Number(item.is_remarks) === 1 && (
                                            <Text color={COLOR.GRAY} fontSize={'xs'}>テキスト入力</Text>
                                        )}
                                    </VStack>
                                </HStack>
                            ))}
                        </Card>
                    )}
                    <Box w={'full'} m={2}>
                        <FormControl.Label
                            w={'full'}
                            fontWeight={'bold'}
                            fontSize={'md'}
                            m={0}
                        >グループ</FormControl.Label>
                    </Box>
                    <TextBox
                        leftIcon={
                            <AvatarIcon img={content !== undefined ? content.img : null} defaultIcon={<Text color={COLOR.WHITE}>{content?.name.substring(0, 1)}</Text>} />
                        }
                        numberOfLines={2}
                        text={content !== undefined ? content.name : '?????'}
                        roundedTop={'md'}
                        roundedBottom={'md'}
                    />
                    <Box w={'full'} m={2}>
                        <FormControl.Label
                            w={'full'}
                            fontWeight={'bold'}
                            fontSize={'md'}
                            m={0}
                        >設定</FormControl.Label>
                    </Box>
                    <Box w={'full'}>
                        <Card
                            bg={cardBg}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                            p={5}
                        >
                            <HStack
                                w={'100%'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Text w={'80%'} fontSize={'sm'}>匿名回答にする</Text>
                                <Box
                                    w={'20%'}
                                    bg={is_anonym ? COLOR.GREEN : 'gray.300'}
                                    borderColor={is_anonym ? COLOR.GREEN : 'gray.300'}
                                    borderRadius={20}
                                    borderWidth={0.5}
                                    p={1}
                                >
                                    <Text
                                        fontSize={'sm'}
                                        w={'full'}
                                        textAlign={'center'}
                                        fontWeight={is_anonym ? 'bold' : 'normal'}
                                        color={is_anonym ? 'muted.50' : 'muted.800'}
                                    >
                                        {is_anonym ? 'オン' : 'オフ'}
                                    </Text>
                                </Box>
                            </HStack>
                        </Card>
                    </Box>
                </VStack>
            </ScrollView>
            <Button
                isDisabled={isGlobalLoading}
                w={'full'}
                h={'10%'}
                bg={COLOR.LIGHT_GREEN}
                borderRadius={0}
                onPress={() =>
                    dispatch(add_notify({
                        choices,
                        title,
                        group_id: group_id,
                        is_anonym: Number(is_anonym) ? 1 : 0,
                        format: Number(format)
                    })).then((item) => {
                        const { status, code }: ApplicationStatus = item.payload as ApplicationStatus
                        if (status === ApplicationState.Success) {
                            toast?.showToast({
                                title: '通知を送信しました',
                                bg: COLOR.LIGHT_GREEN,

                            })
                            router.push('/(tab)/notify')
                        } else if (code === SystemException.TransactionCanceledException) {
                            toast?.showToast({
                                title: 'チケットがありません',
                                disc: 'チケットを取得し再度お試しください',
                                bg: COLOR.GRAY,

                            })
                            router.push('/(tab)/notify')
                        }
                    })
                }
            >
                <Text
                    fontSize={'md'}
                    fontWeight={'bold'}
                    color={'muted.50'}
                >送信する</Text>
            </Button>
        </Box>
    )
}

export default Page
