
const roles_list = 'brand,model,size,fits,enclosings,color,logo'.split(',')
const articles = []


module.exports   = [
    { name: 'brands', values:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') },
    { name: 'models', values: 'T-shirt,trousers,sweats,dress,skirt,hat'.split(',') },
    { name: 'sizes',  values: 'S,M,L,XL,XXL'.split(',') },
    { name: 'colors', values: 'red,green,blue,puprle,black,white,pink'.split(',') },
    { name: 'logos',  values:  '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F'.split(',') },
    { name: 'fits',   values: 'slim,regular,large'.split(',') },
    { name: 'closings', values: 'none,buttons,zip,elastic'.split(',') }
]

