let gas = ''

const Ghosts = (() => { 
    return gas 
})({ gas })

const Spies = (() => { 
    return gas
})({ gas })

const GAS = ((gas) => {
    switch(gas) {
        case 'ghosts':
            return Ghosts(position)
        break
        case 'spies':
            return Spies(position)
        break
   }

   return (gas) => {
        console.log('GAS: ' + gas)
        return gas
   }
})(gas)

GAS()
GAS('Ghosts')
GAS('Spies')

