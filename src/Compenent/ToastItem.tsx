import { Alert, Box, Center, CloseIcon, HStack, IconButton, Text, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { COLOR } from '../Type'

interface Props {
    bg?: string
    color?: string
    variant: string
    title: string
    description?: string
    w: string | number
    onClose?: () => void
}
export default function ToastItem({ description, bg, title, variant, color = COLOR.WHITE, onClose }: Props) {
    return (
        <TouchableOpacity
            onPress={undefined !== onClose ? onClose : undefined}
        >
            <Center
                w={'full'}
                alignItems={'center'}
            >
                <Alert
                    w={'99%'}
                    variant={variant}
                    bg={bg}
                >
                    <HStack
                        w={'full'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Alert.Icon
                            w={'10%'}
                            color={color}
                            size={'md'}
                        />
                        <VStack
                            w={'80%'}
                            alignItems={'center'}
                        >
                            <HStack
                                w={'full'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                            >
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'bold'}
                                    flexShrink={1}
                                    color={color}
                                >{title}</Text>
                            </HStack>
                            {description && (
                                <Box
                                    w={'full'}
                                    justifyContent={'center'}
                                >
                                    <Text
                                        w={'full'}
                                        fontSize={'xs'}
                                        color={color}
                                        ellipsizeMode={'tail'}
                                    >{description}</Text>
                                </Box>
                            )}
                        </VStack>
                        <Box
                            w={'10%'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            {onClose && (
                                <IconButton
                                    variant={'unstyled'}
                                    icon={<CloseIcon size="3" />}
                                    _icon={{ color }}
                                />
                            )}
                        </Box>
                    </HStack>
                </Alert>
            </Center>
        </TouchableOpacity>
    )
}
