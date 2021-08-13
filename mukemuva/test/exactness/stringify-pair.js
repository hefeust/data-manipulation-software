

export const stringify_pair = (pair) => {
        const bs = JSON.stringify(pair.bag)
        const ps = JSON.stringify(pair.with_data)
        let str =  'bag: ' + bs + ' ' + 'payload:' + ps

        str = str.split('"').join('')
        str = str.split(':').join(': ')
        str = str.split(',').join(', ')

        return str
    }
