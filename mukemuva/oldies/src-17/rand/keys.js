    
//const CHARACTERS  = '0123456789abcdefghijklmnopqrstuvwxyz_'.split('')
const C26  = 'abcdefghijklmnopqrstuvwxyz'.split('')
const C37  = '0123456789_abcdefghijklmnopqrstuvwxyz'.split('')

const char2num = (k, charset) => {
    const idx = charset.indexOf(k)

    return idx
}

const num2char = (num, charset) => {
    num  = Math.floor(num)

    if(0 <= num && num < charset.length) {
        return charset[num]
    } else {
      return '#' + num  + '#'
    }
}

export const keys = (values) => {
    const charset = C37
    let text = ''

//    console.log(values)

    values.map((value) => {
        text += num2char(value, charset)
    })

    return  text
}


