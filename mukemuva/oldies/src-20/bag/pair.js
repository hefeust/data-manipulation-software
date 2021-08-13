
export const make_pair = (bag) => {

        let payload

        const test = (other_bag) => {
            const kns = Object.keys(bag)

            return kns.map((kn) => {
                return other_bag[kn] === bag[kn]
            }).reduce((acc, val) => acc && val, true)
        }

        const set_data = (with_data) => { 
            payload = with_data

            return api
        }
        
        const api = {
            test, set_data
        }

        Object.defineProperty(api, 'bag', {
            get: () => bag
        }) 

        Object.defineProperty(api, 'payload', {
            get: () => payload
        }) 

        return api
    }
