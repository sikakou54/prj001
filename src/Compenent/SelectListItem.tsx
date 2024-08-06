import React, { useCallback, useEffect, useState } from 'react'
import { Box, Center, Checkbox, HStack, Select, Text, VStack } from 'native-base'
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

    const onChangeCheck = useCallback((checked: boolean) => {
        if (checked) {
            onChangeCheckBox({ idx, name, desc_type: 1 })
        } else {
            onChangeCheckBox({ idx, name, desc_type: 0 })
        }
    }, [onChangeCheckBox])

    const onChangeSelect = useCallback((_desc_type: number) => {
        onChangeCheckBox({ idx, name, desc_type: _desc_type })
    }, [onChangeCheckBox])

    return (
        <HStack
            h={20}
            alignItems={'center'}
        >
            <Center w={'15%'} h={'full'} >
                <Number_1_10
                    num={idx + 1}
                    size={25}
                />
            </Center>
            <VStack w={'70%'} h={'90%'} space={1} justifyContent={'center'}>
                <Box w={'95%'}>
                    <Text w={'full'} numberOfLines={2} fontSize={'sm'}>{name}</Text>
                </Box>
                <HStack w={'95%'} h={8} alignItems={'center'} space={3}>
                    <Checkbox
                        alignItems={'center'}
                        value='1'
                        isChecked={desc_type !== 0}
                        onChange={onChangeCheck}
                        _checked={{ backgroundColor: COLOR.LIGHT_GREEN, borderColor: COLOR.LIGHT_GREEN }}
                        _icon={{ color: COLOR.WHITE }}
                        size={'md'}
                    >
                        {desc_type === 0 ? (
                            <Text fontSize={'xs'}>記述形式</Text>
                        ) : (
                            <Select selectedValue={desc_type.toString()} size={'sm'} w={90} accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: COLOR.LIGHT_GREEN
                            }} mt={1} onValueChange={(value => onChangeSelect(Number(value)))}>
                                <Select.Item label={'必須'} value={'1'} />
                                <Select.Item label={'任意'} value={'2'} />
                            </Select>
                        )}
                    </Checkbox>
                </HStack>
            </VStack>
            <Center w={'15%'} h={'full'}>
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
