
const mikmap = require('../../dist')

const roles = 'brand,model,size'.split(',')

const mm = mikmap.create_multimap(roles)

mm.set({
        brand: 'A',  model: 'X',  size: 'XL'    
}, 1)

mm.set({
    brand: 'A', model: 'Y', size: 'XL'    
}, 2)

mm.set({
    brand: 'A', model: 'Z', size: 'L'    
}, 3)

mm.set({
    brand: 'B', model: 'X', size: 'L'    
}, 4)
                
mm.set({
    brand: 'B', model: 'Y', size: 'XXL'    
}, 5)

console.log("*** results ***")

mm.select({ 
     brand: '*', model: '*', size: '*'
}, (bag) => console.log(bag))

console.log(mm.get_stats())
/*
console.log(mm.get({
    brand: 'B', model: 'Y', size: 'XXL'    
}))
*/  
// console.log(mm.get_debug())

