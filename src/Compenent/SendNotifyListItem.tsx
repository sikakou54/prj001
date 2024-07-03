import React from 'react'
import {
    COLOR,
} from '../Type'
import {
    Box,
    HStack,
    Progress,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import Card from './Card'
import AvatarIcon from './AvatorIcon'

interface Props {
    onPress: (notify_id: string) => void,
    notify_id: string,
    group_name: string,
    img: string | null
    name: string,
    percent: number,
    is_anonym: number
}
export default function SendNotifyListItem(props: Props) {
    return (
        <Card
            onPress={() => props.onPress(props.notify_id)}
            bg={useColorModeValue(COLOR.WHITE, COLOR.BLACK)}
        >
            <VStack
                w={'full'}
                space={3}
                h={110}
                pl={3}
                justifyContent={'center'}
            >
                <HStack
                    w={'full'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <HStack
                        w={'85%'}
                        alignItems={'center'}
                        space={3}
                    >
                        <Box
                            w={'10%'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <AvatarIcon
                                img={props.img}
                                defaultIcon={<Text color={COLOR.WHITE}>{props.group_name.substring(0, 1)}</Text>}
                                size={45}
                            />
                        </Box>
                        <Box
                            w={'85%'}
                        >
                            <Text
                                w={'full'}
                                fontSize={'sm'}
                                fontWeight={'bold'}
                                numberOfLines={2}
                                ellipsizeMode={'tail'}
                            >{props.name}</Text>
                        </Box>
                    </HStack>
                    {props.is_anonym === 1 && (
                        <Box
                            alignItems={'center'}
                            justifyContent={'center'}
                            w={'15%'}
                        >
                            <Box
                                bg={COLOR.RED}
                                borderRadius={30}
                                w={12}
                                p={1}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <Text
                                    fontSize={'sm'}
                                    color={COLOR.WHITE}
                                >匿名</Text>
                            </Box>
                        </Box>
                    )}
                </HStack>
                <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Progress
                        w={'85%'}
                        bg={COLOR.GRAY}
                        size={'2xl'}
                        _filledTrack={{
                            bg: COLOR.LIGHT_GREEN
                        }}
                        value={Math.floor(props.percent)}
                    />
                    <Box
                        w={'15%'}
                        h={8}
                        alignItems={'center'}
                        justifyContent={'center'}
                        pl={1}
                    >
                        <Text fontSize={'sm'}>{Math.floor(props.percent)}%</Text>
                    </Box>
                </HStack>
            </VStack>
        </Card>
    )
}
