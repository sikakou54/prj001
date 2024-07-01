import { Box, FormControl, HStack, Icon, Input, Text, useColorModeValue } from 'native-base'
import { COLOR } from '../Type'
import { AntDesign } from '@expo/vector-icons'

interface Props {
    text: string,
    onChangeText?: (text: string) => void,
    label?: string,
    maxLength?: number,
    secureTextEntry?: boolean,
    bg?: string,
    rightIcon?: React.ReactNode,
    leftIcon?: React.ReactNode,
    isDisabled?: boolean,
    isReadOnly?: boolean,
    onSubmitEditing?: () => void
    errorMessage?: string
    roundedTop?: string | number | undefined
    roundedBottom?: string | number | undefined
}
export default function TextInput(props: Props) {
    return (
        <Box
            bg={props.bg}
            roundedTop={props.roundedTop}
            roundedBottom={props.roundedBottom}
            w={'full'}
            alignItems={'center'}
            pt={3}
            pb={3}
            pl={3}
        >
            {undefined !== props.label && (
                <HStack
                    w={'full'}
                    mb={1}
                    pr={1}
                    justifyContent={'space-between'}
                >
                    <Text
                        fontSize={'sm'}
                        color={COLOR.GRAY}
                    >{props.label}</Text>
                    {undefined !== props.maxLength && (
                        <Text
                            pr={2}
                            fontSize={'sm'}
                            color={COLOR.GRAY}
                        >{props.text.length}/{props.maxLength}</Text>
                    )}
                </HStack>
            )}
            {undefined !== props.maxLength ? (
                <FormControl
                    isInvalid={undefined !== props.errorMessage && '' !== props.errorMessage}
                    w={'full'}
                >
                    <Input
                        w={'full'}
                        maxLength={props.maxLength}
                        size={'md'}
                        variant={'unstyled'}
                        pl={0}
                        onChangeText={(text) => props.onChangeText && props.onChangeText(text)}
                        value={props.text}
                        secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
                        rightElement={props.rightIcon ? <Icon as={props.rightIcon} size={'lg'} mr={4} /> : <></>}
                        leftElement={props.leftIcon ? <Icon as={props.leftIcon} size={'lg'} /> : <></>}
                        isDisabled={props.isDisabled}
                        isReadOnly={props.isReadOnly}
                        color={props.isReadOnly && props.isReadOnly === true ? COLOR.GRAY : null}
                        onSubmitEditing={undefined !== props.onSubmitEditing ? props.onSubmitEditing : () => { }}
                        numberOfLines={2}
                        _input={{
                            selectionColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE),
                            cursorColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE)
                        }}
                    />
                    {undefined !== props.errorMessage && (
                        <FormControl.ErrorMessage
                            leftIcon={
                                <AntDesign
                                    name="exclamationcircle"
                                    size={14}
                                    color={COLOR.RED}
                                />
                            }
                        >{props.errorMessage}</FormControl.ErrorMessage>
                    )}
                </FormControl>
            ) : (
                <FormControl
                    isInvalid={undefined !== props.errorMessage && '' !== props.errorMessage}
                    w={'full'}
                >
                    <Input
                        w={'full'}
                        pl={0}
                        size={'md'}
                        variant={'unstyled'}
                        onChangeText={(text) => props.onChangeText && props.onChangeText(text)}
                        value={props.text}
                        secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
                        rightElement={props.rightIcon ? <Icon as={props.rightIcon} size={'lg'} mr={4} /> : <></>}
                        leftElement={props.leftIcon ? <Icon as={props.leftIcon} size={'lg'} /> : <></>}
                        isDisabled={props.isDisabled}
                        isReadOnly={props.isReadOnly}
                        color={props.isReadOnly && props.isReadOnly === true ? COLOR.GRAY : null}
                        numberOfLines={2}
                        onSubmitEditing={undefined !== props.onSubmitEditing ? props.onSubmitEditing : () => { }}
                        _input={{
                            selectionColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE),
                            cursorColor: useColorModeValue(COLOR.BLACK, COLOR.WHITE)
                        }}
                    />
                    {undefined !== props.errorMessage && (
                        <FormControl.ErrorMessage
                            leftIcon={
                                <AntDesign
                                    name="exclamationcircle"
                                    size={14}
                                    color={COLOR.RED}
                                />
                            }
                        >{props.errorMessage}</FormControl.ErrorMessage>
                    )}
                </FormControl>
            )}
        </Box>
    )
}
