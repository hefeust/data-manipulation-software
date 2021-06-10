
const CHARACTERS  = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')

const char2num = (k) => {
    const idx = CHARACTERS.indexOf(k)

    return idx
}

const num2char = (num) => {
//    num  = Math.floor(num)

//    if(0 <= num && num < CHARACTERS.length) {
        return CHARACTERS[num]
//    } else {
  //      return '#' + num  + '#'
//    }
}

export const keys36 = (values) => {
    let text = ''

//    console.log(values)

    values.map((value) => {
        text += num2char(value)
    })

    return  text
}


