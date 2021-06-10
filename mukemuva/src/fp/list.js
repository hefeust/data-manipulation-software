
import { Maybe } from './maybe.js'

export const List = (() => {

    const List = (values) => {
        const _list = (values.length > 0 ? values : [values])
            .map((val) => Maybe(val))

//        console.log(_list)

        return {
            map: (f) => _list.map((val) => val.map(f)),
            just: () => _list.filter(val => val.isJust())
        }
    }

    return List
})()



