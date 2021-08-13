
export const make_pair = (bag) => {

    let __bag__ = bag
    let payload = null

    const test = (other_bag) => {
        const kns = Object.keys(bag)

        return kns.map((kn) => {
            return other_bag[kn] === bag[kn]
        }).reduce((acc, val) => acc && val, true)
    }

    const toString = () => {
        const bs = JSON.stringify(__bag__)
        const ps = JSON.stringify(payload)
        let str =  'bag: ' + bs + ' ' + 'payload:' + ps

        str = str.split('"').join('')
        str = str.split(':').join(': ')
        str = str.split(',').join(', ')

        return str
    }

    const set_data = (with_data) => { 
        payload = with_data
    }
        
    const api = {
        test, set_data, toString
    }

    Object.defineProperty(api, 'bag', {
        get: () => __bag__
    }) 

    Object.defineProperty(api, 'payload', {
        get: () => payload
    }) 

   return api
}
