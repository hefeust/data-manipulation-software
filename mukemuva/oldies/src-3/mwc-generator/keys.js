    
//const CHARACTERS  = '0123456789abcdefghijklmnopqrstuvwxyz_'.split('')
const CHARACTERS  = 'abcdefghijklmnopqrstuvwxyz'.split('')

const char2num = (k) => {
    const idx = CHARACTERS.indexOf(k)

    return idx
}

const num2char = (num) => {
    num  = Math.floor(num)

    if(0 <= num && num < CHARACTERS.length) {
        return CHARACTERS[num]
    } else {
      return '#' + num  + '#'
    }
}

export const keys = (values) => {
    let text = ''

//    console.log(values)

    values.map((value) => {
        text += num2char(value)
    })

    return  text
}


