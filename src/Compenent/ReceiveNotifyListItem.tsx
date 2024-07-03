import React from 'react'
import {
    COLOR
} from '../Type'
import {
    Box,
    HStack,
    Text,
    ZStack,
    useColorModeValue,
} from 'native-base'
import Card from './Card'
import AvatarIcon from './AvatorIcon'

interface Props {
    onPress: () => void,
    name: string,
    notify_id: string,
    group_name: string,
    img: string | null,
    img_user: string | null
    is_anonym: number
}
export default function ReceiveNotifyListItem(props: Props) {
    return (
        <Card
            bg={useColorModeValue(COLOR.WHITE, COLOR.BLACK)}
            onPress={props.onPress}
        >
            <HStack
                w={'full'}
                h={70}
                alignItems={'center'}
            >
                <ZStack
                    w={'15%'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <AvatarIcon
                        img={props.img}
                        defaultIcon={<Text color={COLOR.WHITE}>{props.group_name.substring(0, 1)}</Text>}
                        size={45}
                    />
                    <Box
                        top={-8}
                        right={1}
                    >
                        <AvatarIcon
                            img={props.img_user}
                            defaultIcon={<Text color={COLOR.WHITE}>{props.group_name.substring(0, 1)}</Text>}
                            size={38}
                        />
                    </Box>
                </ZStack>
                <Box
                    w={props.is_anonym === 0 ? '85%' : '70%'}
                    pl={2}
                    pr={1}
                >
                    <Text
                        w={'full'}
                        fontSize={'sm'}
                        fontWeight={'bold'}
                        numberOfLines={2}
                        ellipsizeMode={'tail'}
                    >{props.name}</Text>
                </Box>
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
        </Card >
    )
}
