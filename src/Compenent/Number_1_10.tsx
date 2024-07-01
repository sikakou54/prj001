import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useColorModeValue } from 'native-base'
import { COLOR } from '../Type'

export default function Number_1_10({ num, size }: { num: number, size: number }) {

  const color = useColorModeValue(COLOR.BLACK, COLOR.WHITE)

  switch (num) {
    case 0: return <MaterialCommunityIcons color={color} size={size} name={'numeric-0'} />
    case 1: return <MaterialCommunityIcons color={color} size={size} name={'numeric-1'} />
    case 2: return <MaterialCommunityIcons color={color} size={size} name={'numeric-2'} />
    case 3: return <MaterialCommunityIcons color={color} size={size} name={'numeric-3'} />
    case 4: return <MaterialCommunityIcons color={color} size={size} name={'numeric-4'} />
    case 5: return <MaterialCommunityIcons color={color} size={size} name={'numeric-5'} />
    case 6: return <MaterialCommunityIcons color={color} size={size} name={'numeric-6'} />
    case 7: return <MaterialCommunityIcons color={color} size={size} name={'numeric-7'} />
    case 8: return <MaterialCommunityIcons color={color} size={size} name={'numeric-8'} />
    case 9: return <MaterialCommunityIcons color={color} size={size} name={'numeric-9'} />
    case 10: return <MaterialCommunityIcons color={color} size={size} name={'numeric-10'} />
    default: return <AntDesign color={color} size={size} name='questioncircleo' />
  }
}