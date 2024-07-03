import { Avatar } from 'native-base'
import { COLOR } from '../Type'

interface Props {
    img: string | null
    defaultIcon: React.ReactNode
    size?: number
}
export default function AvatarIcon(props: Props) {
    if (props.img !== null && props.img !== '') {
        return (
            <Avatar borderColor={COLOR.GRAY} borderWidth={0.5} bg="gray.400" source={{ uri: props.img }} size={undefined !== props.size ? props.size : 45} />
        )
    } else {
        return (
            <Avatar borderColor={COLOR.GRAY} borderWidth={0.5} bg="gray.400" source={undefined} size={undefined !== props.size ? props.size : 45}>
                {props.defaultIcon}
            </Avatar>
        )
    }
}