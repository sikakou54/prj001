import { Box, Button, Checkbox, Heading, Modal, Text, useColorModeValue, VStack } from 'native-base'
import { WebView } from 'react-native-webview'
import { COLOR } from '../Type'
import { useState } from 'react'
import TextInput from './TextInput'

interface Props {
    isOpen: boolean
    idx: number
    onClose: (idx: number, text: string) => void
    isRequired?: boolean
}
const AnswerRemarksModal = (props: Props) => {
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)
    const [text, setText] = useState<string>('')

    return (
        <Modal
            animationPreset={'fade'}
            isOpen={props.isOpen}
            w={'full'}
            h={'full'}
        >
            <Modal.Content
                w={'full'}
                bg={COLOR.DEEP_BLACK}
            >
                {!props.isRequired && (
                    <Modal.CloseButton
                        onPress={() => props.onClose(props.idx, text)}
                    />
                )}
                <Modal.Header
                    alignItems={'center'}
                    justifyContent={'center'}
                >コメントを入力する</Modal.Header>
                <Modal.Body
                    w={'full'}
                    alignItems={'center'}
                    bg={cardBg}
                >
                    <VStack
                        w={'99%'}
                        alignItems={'center'}
                    >
                        <TextInput
                            label='コメント'
                            maxLength={50}
                            onChangeText={setText}
                            text={text}
                        />
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onPress={() => props.onClose(props.idx, text)}
                        w={'full'}
                        bg={COLOR.LIGHT_GREEN}
                    >
                        <Text fontSize={'md'} color={'white'}>登録する</Text>
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}

export default AnswerRemarksModal
