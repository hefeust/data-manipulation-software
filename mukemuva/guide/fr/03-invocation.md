
# tableau

    const a = new Array(100)
    const b = []

    a[0] = '000'
    a[1] = '001'
    ..
    a[99] = '099'

    b.push(0)
    b.push(1)
    b.unshift(2)

    console.log(a.slice(0, 10)) --> ['000', '001'..., '009']
    console.log(b) --> [2, 0, 1]

# Maps

    const m = new Map()

    m.set('abc', 123)
    m.set('toto', 456)
    m.set('shadok', "ga-bu-zo-me")

# proposition de multimap

    const mm = create_multimap(['brand', 'model', 'size', 'color'])

    mm.set({
        brand! 'adidas', model: 'T-shirt', size: 'XL', color: 'blue'
    }, 55)

    mm.get({
        brand! 'adidas', model: 'T-shirt', size: 'XL', color: 'blue'
    }) --> 55

    mm.select({ brand: '*', model: 'T-shirt', size: '*', color: 'blue '})

        --> [
            bag: { brand! 'adidas', model: 'T-shirt', size: 'XL', color: 'blue'}, data: 55
        ]



