import { MaterialIcons } from '@expo/vector-icons'
import { Box, Icon } from 'native-base'
import TextInput from './TextInput'

interface Props {
    p?: string | number,
    m?: string | number,
    mt?: string | number,
    mb?: string | number,
    bg?: string,
    onChangeText: (text: string) => void,
    value: string,
}
export default function SearchBar(props: Props) {
    return (
        <Box
            w={'100%'}
            bg={props.bg}
            mb={0.5}
            mt={0.5}
            roundedTop={'md'}
            roundedBottom={'md'}
        >
            <TextInput
                text={props.value}
                onChangeText={props.onChangeText}
                leftIcon={
                    <Icon
                        m='2'
                        ml='3'
                        size='6'
                        color='gray.400'
                        as={<MaterialIcons name='search' />}
                    />
                }
            />
        </Box>
    )
}
