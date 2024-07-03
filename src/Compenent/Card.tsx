import { Box } from 'native-base'
import { TouchableOpacity } from 'react-native'

interface Props {
    children: React.ReactNode
    onPress?: () => void
    bg?: string | null
    m?: number | string
    mt?: number | string
    mb?: number | string
    p?: number | string
    pt?: number | string
    pb?: number | string
    rounded?: string
    roundedTop?: string
    roundedBottom?: string
}
export default function Card(props: Props) {
    if (undefined !== props.onPress) {
        return (
            <TouchableOpacity
                onPress={props.onPress}
            >
                <Box
                    w={'full'}
                    rounded={undefined !== props.rounded ? props.rounded : 'none'}
                    p={props.p}
                    bg={props.bg ? props.bg : null}
                    m={props.m ? props.m : null}
                    mt={props.mt ? props.mt : null}
                    mb={props.mb ? props.mb : null}
                    roundedBottom={props.roundedBottom ? props.roundedBottom : null}
                    roundedTop={props.roundedTop ? props.roundedTop : null}
                >{props.children}</Box>
            </TouchableOpacity>
        )
    } else {
        return (
            <Box
                w={'full'}
                alignItems={'center'}
                rounded={undefined !== props.rounded ? props.rounded : 'none'}
                p={props.p}
                bg={props.bg ? props.bg : null}
                m={props.m ? props.m : null}
                mt={props.mt ? props.mt : null}
                mb={props.mb ? props.mb : null}
                roundedBottom={props.roundedBottom ? props.roundedBottom : null}
                roundedTop={props.roundedTop ? props.roundedTop : null}
            >{props.children}</Box>
        )
    }
}