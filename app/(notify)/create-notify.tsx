import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    HStack,
    ScrollView,
    Select,
    Switch,
    Text,
    VStack,
    useColorModeValue,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import TextInput from '../../src/Compenent/TextInput';
import Card from '../../src/Compenent/Card';
import { COLOR, MAX_CHOICE_NUM } from '../../src/Type';
import TitleHeader from '../../src/Compenent/TitleHeader';
import SelectListItem from '../../src/Compenent/SelectListItem';

function Page() {
    const [title, setTitle] = useState<string>('');
    const [inputSelection, setInputSelection] = useState<string>('');
    const [choiceItems, setChoiceItems] = useState<{ idx: number, name: string, desc_type: number }[]>([]);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isNext, setIsNext] = useState<boolean>(false);
    const [format, setFormat] = useState<number>(1);
    const bg = useColorModeValue(COLOR.LIGHT_GRAY, COLOR.DEEP_BLACK);
    const cardBg = useColorModeValue(COLOR.WHITE, COLOR.BLACK);

    useEffect(() => {
        console.log(choiceItems);
    }, [choiceItems]);

    const addSelection = useCallback((item: { name: string, desc_type: number }) => {
        setInputSelection('');
        setChoiceItems(prev => [...prev, { ...item, idx: prev.length }]);
    }, []);

    const updateSelection = useCallback((_item: { idx: number, name: string, desc_type: number }) => {
        setChoiceItems(prev => prev.map((item, idx) => idx === _item.idx ? { ..._item } : { ...item }));
    }, []);

    const delSelection = useCallback((_index: number) => {
        setChoiceItems(prev => prev.filter((_, index) => index !== _index).map((item, idx) => ({ ...item, idx })));
    }, []);

    useEffect(() => {
        setIsNext(title === '' || choiceItems.length === 0);
    }, [title, choiceItems]);

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
                    space={3}
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
                                        onPress={() => inputSelection !== '' && addSelection({ name: inputSelection, desc_type: 0 })}
                                    />
                                }
                                onSubmitEditing={() => inputSelection !== '' && addSelection({ name: inputSelection, desc_type: 0 })}
                            />
                        )}
                    </VStack>
                    <Card
                        bg={cardBg}
                        pt={choiceItems.length > 0 ? 2 : undefined}
                        pb={choiceItems.length > 0 ? 2 : undefined}
                        roundedTop={'md'}
                        roundedBottom={'md'}
                    >
                        {choiceItems.map((item, index) => (
                            <SelectListItem
                                key={item.idx.toString() + item.desc_type.toString() + item.name}
                                idx={item.idx}
                                name={item.name}
                                desc_type={item.desc_type}
                                onChangeCheckBox={updateSelection}
                                onPressDeleteIcon={delSelection}
                            />
                        ))}
                    </Card>
                    <FormControl.Label
                        w={'full'}
                        fontWeight={'bold'}
                        pl={1}
                    >設定</FormControl.Label>
                    <Box w={'full'}>
                        <Card
                            p={5}
                            bg={cardBg}
                            roundedTop={'md'}
                        >
                            <Box w={'full'}>
                                <HStack
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                >
                                    <Text fontSize={'sm'}>選択形式</Text>
                                    <Select selectedValue={format.toString()} w={120} accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                        bg: COLOR.LIGHT_GREEN
                                    }} mt={1} onValueChange={value => setFormat(Number(value))}>
                                        <Select.Item label="単選択" value="1" />
                                        <Select.Item label="複数選択" value="2" />
                                    </Select>
                                </HStack>
                            </Box>
                        </Card>
                        <Card
                            p={5}
                            bg={cardBg}
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
                    </Box>
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
                                choiceItems.map((item) => (item))
                            ),
                            isChecked: isChecked ? 1 : 0,
                            format
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

export default Page;
