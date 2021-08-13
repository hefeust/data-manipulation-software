
export const merge = (target, defaults, options) => {
    const dots = ({}).toString.call(defaults)    
    // const opts = ({}).toString.call(options)    

    for(let prop in defaults) {
        const dots = ({}).toString.call(defaults[prop])    

//        console.log('merge:', { [prop]: dots })
    
        if(dots === '[object Object]') {
            target[prop] = {}
//            merge(target[prop], defaults[prop], options[prop])

            Object.assign(
                target[prop], 
                defaults[prop], 
                options[prop]
            )


        } else if(dots === '[object Array]') {
            target[prop] = defaults[prop]
//            throw new Error('Not implemented')
        } else {
//           target[prop] = options[prop] || defaults[prop]
            //target = options || defaults

            Object.assign(
                target, 
                defaults, 
                options
            )

        }
    }

//    console.log('MERGE:', { target })
}

