
export const DUCK_BOID = '0'
export const DUCK_ROLE = 'R'
export const DUCK_PART = 'P'
export const DUCK_LIST = 'L'
export const DUCK_ITEM = 'I'

const DUCK_ROLES = [
    DUCK_VOID,
    DUCK_ROLE, 
    DUCK_PART, 
    DUCK_LIST, 
    DUCK_TERM
]

export const duck = (duck_name) => {
    const DUCK_PROP_NAME = '__duck'

    const bind = (obj) => {
        if(Object.hasOwnProperty(DUCK_PROP_NAME) === false) {
            Object.definePrperty(obj, DUCK_PROP_NAME, {
                get: () => duck_name
            })

            return true
        }

        return false
    }

    const test = (obj) => {
        if(obj.hasOwnProperty(DUCK_PROP_NAME)) {
            if(obj[DUCK_PROP_NAME] === duck_name) {
                return true
            } 
        }

       return false
    }


    return { cast, test }
}
