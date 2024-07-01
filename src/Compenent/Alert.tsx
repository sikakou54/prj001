import { AlertDialog, Box, Button, Center, Text, VStack } from 'native-base'
import React from 'react'
import { AlertResult, AlertType, COLOR } from '../Type'

interface Props {
    isOpen: boolean
    onClose: (result: AlertResult) => void
    title: string
    subText?: string
    type: AlertType
}
export default function Alert(props: Props) {
    const cancelRef = React.useRef(null)
    return (
        <Center>
            <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={props.isOpen}>
                {props.type === AlertType.OkCancel && (
                    <AlertDialog.Content
                        w={'80%'}
                        alignItems={'center'}
                    >
                        <AlertDialog.Body>
                            <VStack
                                p={2}
                                space={2}
                            >
                                <Text
                                    textAlign={'center'}
                                    fontSize={'sm'}
                                >{props.title}</Text>
                                {undefined !== props.subText && (
                                    <Text
                                        textAlign={'center'}
                                        fontSize={'sm'}
                                    >{props.subText}</Text>
                                )}
                            </VStack>
                        </AlertDialog.Body>
                        <AlertDialog.Footer >
                            <Button.Group
                                w={'full'}
                                h={10}
                                justifyContent={'center'}
                            >
                                <Button
                                    w={'50%'}
                                    bg={COLOR.GRAY}
                                    onPress={() => props.onClose(AlertResult.Cancel)}
                                    size={'sm'}
                                >キャンセル</Button>
                                <Button
                                    w={'50%'}
                                    bg={COLOR.LIGHT_GREEN}
                                    onPress={() => props.onClose(AlertResult.Ok)}
                                    ref={cancelRef}
                                    size={'sm'}
                                >OK</Button>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                )}
                {props.type === AlertType.YesNo && (
                    <AlertDialog.Content
                        w={'80%'}
                        alignItems={'center'}
                    >
                        <AlertDialog.Body>
                            <VStack
                                p={2}
                                space={2}
                            >
                                <Text
                                    textAlign={'center'}
                                    fontSize={'sm'}
                                >{props.title}</Text>
                                {undefined !== props.subText && (
                                    <Text
                                        textAlign={'center'}
                                        fontSize={'sm'}
                                    >{props.subText}</Text>
                                )}
                            </VStack>
                        </AlertDialog.Body>
                        <AlertDialog.Footer >
                            <Button.Group
                                w={'full'}
                                h={10}
                                justifyContent={'center'}
                            >
                                <Button
                                    w={'50%'}
                                    bg={COLOR.GRAY}
                                    onPress={() => props.onClose(AlertResult.No)}
                                    size={'sm'}
                                >いいえ</Button>
                                <Button
                                    w={'50%'}
                                    bg={COLOR.LIGHT_GREEN}
                                    onPress={() => props.onClose(AlertResult.Yes)} ref={cancelRef}
                                    size={'sm'}
                                >はい</Button>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                )}
                {props.type === AlertType.Ok && (
                    <AlertDialog.Content
                        w={'80%'}
                        alignItems={'center'}
                    >
                        <AlertDialog.Body>
                            <Box p={3}>
                                <Text fontSize={'sm'}>{props.title}</Text>
                                {undefined !== props.subText && (
                                    <Text fontSize={'sm'}>{props.subText}</Text>
                                )}
                            </Box>
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button.Group
                                w={'full'}
                                h={10}
                                justifyContent={'center'}
                            >
                                <Button
                                    w={'full'}
                                    bg={COLOR.LIGHT_GREEN}
                                    onPress={() => props.onClose(AlertResult.Ok)} ref={cancelRef}
                                    size={'sm'}
                                >OK</Button>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                )}
            </AlertDialog>
        </Center>
    )
}

