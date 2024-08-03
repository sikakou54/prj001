import React, { useCallback } from 'react'
import { Center, Checkbox, HStack, Text, VStack } from 'native-base'
import Number_1_10 from './Number_1_10'
import { COLOR } from '../Type'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

interface Props {
    idx: number
    name: string
    is_remarks: number
    onChangeCheckBox: (item: { idx: number, name: string, is_remarks: number }) => void
    onPressDeleteIcon: (index: number) => void
}
export default function SelectListItem({ idx, name, is_remarks, onChangeCheckBox, onPressDeleteIcon }: Props) {

    const onChange = useCallback((checked: boolean) => {
        console.log('onChange', { idx, name, is_remarks: checked ? 1 : 0 })
        onChangeCheckBox({ idx, name, is_remarks: checked ? 1 : 0 })
    }, [idx, name, is_remarks, onChangeCheckBox, onPressDeleteIcon])

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
                <Checkbox
                    value='1'
                    isChecked={is_remarks === 1 ? true : false}
                    onChange={onChange}
                    _checked={{ backgroundColor: COLOR.LIGHT_GREEN, borderColor: COLOR.LIGHT_GREEN }}
                    _icon={{ color: COLOR.WHITE }}
                    size={'sm'}
                >
                    <Text fontSize={'xs'}>テキスト入力</Text>
                </Checkbox>
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
