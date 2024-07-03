import React, { useCallback, useEffect, useState } from 'react'
import {
    Box,
    Button,
    FormControl,
    HStack,
    Icon,
    ScrollView,
    Switch,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base'
import {
    AntDesign
} from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import TextInput from '../../src/Compenent/TextInput'
import Card from '../../src/Compenent/Card'
import TextBox from '../../src/Compenent/TextBox'
import { COLOR, MAX_CHOICE_NUM } from '../../src/Type'
import Number_1_10 from '../../src/Compenent/Number_1_10'
import TitleHeader from '../../src/Compenent/TitleHeader'

function Page() {
    const [title, setTitle] = useState<string>('')
    const [inputSelection, setInputSelection] = useState<string>('')
    const [choiceItems, setChoiceItems] = useState<string[]>([])
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [isNext, setIsNext] = useState<boolean>(false)
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK)
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK)

    const addSelection = useCallback((item: string) => {
        setInputSelection('')
        setChoiceItems(choiceItems.concat(item))
    }, [choiceItems])
    const delSelection = useCallback((_index: number) => {
        setChoiceItems(choiceItems.filter((_, index) => index !== _index))
    }, [choiceItems])

    useEffect(() => {
        setIsNext(title === '' || choiceItems.length === 0)
    }, [title, choiceItems])

    return (
        <Box
            w={'full'}
            h={'full'}
            bg={bg}
            alignItems={'center'}
            safeAreaTop
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    gestureEnabled: true,
                    gestureDirection: 'vertical'
                }}
            />
            <TitleHeader title={'通知を作成する'} />
            <ScrollView w={'95%'} h={'82%'} >
                <VStack
                    w={'full'}
                    space={2}
                    mt={5}
                    mb={5}
                    alignItems={'center'}
                >
                    <VStack
                        w={'full'}
                        space={3}
                    >
                        <TextInput
                            bg={cardBg}
                            roundedTop={'md'}
                            roundedBottom={'md'}
                            label='タイトル'
                            maxLength={30}
                            onChangeText={setTitle}
                            text={title}
                        />
                        {choiceItems.length < MAX_CHOICE_NUM && (
                            <TextInput
                                bg={cardBg}
                                roundedTop={'md'}
                                roundedBottom={'md'}
                                label='選択肢'
                                maxLength={30}
                                onChangeText={(text) => setInputSelection(text)}
                                text={inputSelection}
                                isDisabled={choiceItems.length >= MAX_CHOICE_NUM}
                                isReadOnly={choiceItems.length >= MAX_CHOICE_NUM}
                                rightIcon={
                                    <AntDesign name='plussquareo'
                                        color={useColorModeValue(COLOR.BLACK, COLOR.WHITE)}
                                        onPress={() => inputSelection !== '' && addSelection(inputSelection)}
                                    />
                                }
                                onSubmitEditing={() => inputSelection !== '' && addSelection(inputSelection)}
                            />
                        )}
                    </VStack>
                    <VStack
                        w={'full'}
                    >
                        {choiceItems.length > 0 && (
                            <>
                                {choiceItems.map((item, index) => (
                                    <TextBox
                                        numberOfLines={2}
                                        key={index}
                                        leftIcon={<Icon
                                            as={<Number_1_10 num={index + 1} size={25} />}
                                            size={'2xl'}
                                            w={'20%'}
                                        />}
                                        rightIcon={
                                            <AntDesign
                                                name='delete'
                                                size={24}
                                                color={COLOR.RED}
                                                onPress={() => delSelection(index)}
                                            />
                                        }
                                        text={item}
                                        roundedTop={index === 0 ? 'md' : undefined}
                                        roundedBottom={index === choiceItems.length - 1 ? 'md' : undefined}
                                    />
                                ))}
                            </>
                        )}
                    </VStack>
                    <FormControl.Label
                        w={'full'}
                        fontWeight={'bold'}
                        pl={1}
                    >設定</FormControl.Label>
                    <Card
                        p={5}
                        bg={cardBg}
                        roundedTop={'md'}
                        roundedBottom={'md'}
                    >
                        <Box w={'full'}>
                            <HStack
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Text fontSize={'sm'}>匿名回答にする</Text>
                                <Switch
                                    size={'md'}
                                    onToggle={(isChecked) =>
                                        setIsChecked(isChecked)
                                    }
                                    value={isChecked}
                                />
                            </HStack>
                        </Box>
                    </Card>
                </VStack>
            </ScrollView>
            <Button
                w={'full'}
                h={'10%'}
                bg={COLOR.LIGHT_GREEN}
                color={'muted.50'}
                borderRadius={0}
                onPress={() => {
                    router.push({
                        pathname: '/select-group',
                        params: {
                            title,
                            choiceItems: JSON.stringify(
                                choiceItems.map((item) => {
                                    return {
                                        item,
                                    }
                                })
                            ),
                            isChecked: isChecked ? 1 : 0,
                        },
                    })
                }}
                isDisabled={isNext}
            >
                <Text
                    fontSize={'md'}
                    fontWeight={'bold'}
                    color={'muted.50'}
                >次へ</Text>
            </Button>
        </Box>
    )
}

export default Page
