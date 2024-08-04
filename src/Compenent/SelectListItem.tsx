import React, { useCallback, useState } from 'react'
import { Center, Checkbox, HStack, Select, Text, VStack } from 'native-base'
import Number_1_10 from './Number_1_10'
import { COLOR } from '../Type'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

interface Props {
    idx: number
    name: string
    desc_type: number
    onChangeCheckBox: (item: { idx: number, name: string, desc_type: number }) => void
    onPressDeleteIcon: (index: number) => void
}
export default function SelectListItem({ idx, name, desc_type, onChangeCheckBox, onPressDeleteIcon }: Props) {

    const [type, setType] = useState<number>(1)
    const onChangeCheck = useCallback((checked: boolean) => {
        onChangeCheckBox({ idx, name, desc_type: checked ? 1 : 0 })
    }, [idx, name, desc_type, onChangeCheckBox, onPressDeleteIcon])

    const onChangeSelect = useCallback((desc_type: number) => {
        onChangeCheckBox({ idx, name, desc_type })
        setType(desc_type)
    }, [idx, name, desc_type, onChangeCheckBox, onPressDeleteIcon])

    return (
        <HStack
            h={20}
            alignItems={'center'}
        >
            <Center w={'15%'}>
                <Number_1_10
                    num={idx + 1}
                    size={25}
                />
            </Center>
            <VStack w={'70%'} space={1} justifyContent={'center'}>
                <Text w={'95%'} numberOfLines={2}>{name}</Text>
                <HStack w={'95%'} h={8} alignItems={'center'} space={3}>
                    <Checkbox
                        alignItems={'center'}
                        value='1'
                        isChecked={desc_type !== 0 ? true : false}
                        onChange={onChangeCheck}
                        _checked={{ backgroundColor: COLOR.LIGHT_GREEN, borderColor: COLOR.LIGHT_GREEN }}
                        _icon={{ color: COLOR.WHITE }}
                        size={'sm'}
                    >
                        {desc_type === 0 ? (
                            <Text fontSize={'xs'}>記述形式</Text>
                        ) : (
                            <Select selectedValue={type.toString()} size={'xs'} w={120} accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: COLOR.LIGHT_GREEN
                            }} mt={1} onValueChange={(value => onChangeSelect(Number(value)))}>
                                <Select.Item label={'必須入力'} value={'1'} />
                                <Select.Item label={'任意入力'} value={'2'} />
                            </Select>
                        )}
                    </Checkbox>
                </HStack>
            </VStack>
            <Center w={'15%'}>
                <TouchableOpacity onPress={() => onPressDeleteIcon(idx)}>
                    <AntDesign
                        name='delete'
                        size={24}
                        color={COLOR.RED}
                    />
                </TouchableOpacity>
            </Center>
        </HStack>
    )
}
