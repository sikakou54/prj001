import { Box, Button, Checkbox, Heading, Modal, Text, VStack, useColorModeValue } from 'native-base'
import { WebView } from 'react-native-webview'
import { COLOR } from '../Type'
import { useState } from 'react'

interface Props {
    terms: string | undefined
    policy: string | undefined
    isOpen: boolean
    onClose: (result: boolean) => void
    isRequired: boolean
}
const TermsPolicyModel = (props: Props) => {
    const [terms, setTerms] = useState<boolean>(undefined === props.terms ? true : false)
    const [policy, setPolicy] = useState<boolean>(undefined === props.policy ? true : false)
    const [isClose, setIsClose] = useState<boolean>(false)
    const randomParam = `?${Math.random().toString(36).substring(7)}`;

    return (
        <Modal
            animationPreset={'slide'}
            isOpen={props.isOpen && !isClose}
            w={'full'}
            h={'full'}
        >
            <Modal.Content
                w={'95%'}
            >
                {!props.isRequired && (
                    <Modal.CloseButton
                        onPress={() => {
                            setIsClose(true)
                            props.onClose(false)
                        }}
                    />
                )}
                <Modal.Header
                    alignItems={'center'}
                    justifyContent={'center'}
                >Opiniのご利用に関する同意事項</Modal.Header>
                <Modal.Body
                    w={'full'}
                    h={'full'}
                    alignItems={'center'}
                >
                    <VStack
                        w={'full'}
                        h={'full'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        space={3}
                    >
                        {undefined !== props.terms && (
                            <>
                                <Heading
                                    color={COLOR.GRAY}
                                    fontSize={'sm'}
                                >利用規約</Heading>
                                <Box w={'full'} h={150} rounded={'md'}>
                                    <WebView
                                        source={{ uri: `${props.terms}${randomParam}` }}
                                        style={{ backgroundColor: COLOR.LIGHT_GRAY }}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                    />
                                </Box>
                            </>
                        )}
                        {undefined !== props.policy && (
                            <>
                                <Heading
                                    color={COLOR.GRAY}
                                    fontSize={'sm'}
                                >プライバシーポリシー</Heading>
                                <Box w={'full'} h={150} rounded={'md'}>
                                    <WebView
                                        source={{ uri: `${props.policy}${randomParam}` }}
                                        style={{ backgroundColor: COLOR.LIGHT_GRAY }}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                    />
                                </Box>
                            </>
                        )}
                        <VStack
                            w={'full'}
                            space={2}
                        >
                            {undefined !== props.terms && (
                                <Checkbox
                                    value='1'
                                    onChange={(value) => setTerms(value)}
                                    _checked={{ backgroundColor: COLOR.LIGHT_GREEN, borderColor: COLOR.LIGHT_GREEN }}
                                    _icon={{ color: COLOR.WHITE }}
                                    size={'md'}
                                >
                                    <Text fontSize={'md'}>利用規約に同意する</Text>
                                </Checkbox>
                            )}
                            {undefined !== props.policy && (
                                <Checkbox
                                    value='2'
                                    onChange={(value) => setPolicy(value)}
                                    _checked={{ backgroundColor: COLOR.LIGHT_GREEN, borderColor: COLOR.LIGHT_GREEN }}
                                    _icon={{ color: COLOR.WHITE }}
                                    size={'md'}
                                >
                                    <Text fontSize={'md'}>プライバシーポリシーに同意する</Text>
                                </Checkbox>
                            )}
                        </VStack>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onPress={() => {
                            setIsClose(true)
                            props.onClose(true)
                        }}
                        w={'full'}
                        isDisabled={!terms || !policy}
                        bg={COLOR.LIGHT_GREEN}
                    >
                        <Text fontSize={'md'} color={'white'}>はじめる</Text>
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}

export default TermsPolicyModel
