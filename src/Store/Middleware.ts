import { Middleware } from 'redux'
import { RootState } from '../Type'
import analytics from '@react-native-firebase/analytics'

export const middleware: Middleware = store => next => action => {
    //console.log('middleware', (store.getState() as RootState))
    const type = ((action as any).type as string);
    const payload = (action as any).payload;
    if (type.indexOf('/fulfilled') || type.indexOf('/rejected')) {
        analytics().logEvent(type.split('/')[0], { payload }).catch((e) => console.log('logEvent', e))
    }
    next(action)
    //console.log('middleware', (store.getState() as RootState))
}