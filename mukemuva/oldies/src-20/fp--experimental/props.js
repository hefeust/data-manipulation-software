
const Props = (() => {

    const lisr = (obj) => {
        return Object.keys(obj).map((prop) => {
            return { name: prop, value: obj[prop] }            
        })
    }

    const filter = (obj) => (fns) => {
        
    }

    return { list, filter}
}) ()
