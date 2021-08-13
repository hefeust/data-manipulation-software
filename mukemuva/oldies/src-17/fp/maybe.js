
export const Maybe = (() => {

    const Just = (val) => {
        return {
            map: (f) => Just(f(val)),

            ap: (f) => typeof val === 'function' 
                ? f.map(x => val(x)) : Nothing(),

            inspect: () => `Maybe::Just(${val})`,

            cata: (pattern) => pattern.Just(val),

            chain: (f) => Maybe(f(val)),

            isJust: () => true
        }
    }
    
    const Nothing = () => {
        return {
            map: (f) => Nothing(),

            inspect: () => `Maybe::Nothing()`,

            ap: (f) => typeof val === 'function' 
                ? f.map(x => val(x)) : Nothing(),

            cata: (pattern) => Nothing(),

            chain: (f) => Nothing(),

            isJust: () => false
        }
    }

    const _maybe = (val) => {
        console.log('Maybe')

        if(val === null) return Nothing()
        if(val === undefined) return Nothing()

        return Just(val)        
    }

    _maybe.Just = Just

    _maybe.Nothing = Nothing

    return _maybe
}) ()



