
# README

![logo](./guide/schemas/logo.svg)

## Mukemuva... WTF ?

Mulemuva stands for "MUlti-KEys, MUltiple VAlues":  this is just a simple in-memory (in vivo) database  system system with basic filtering abilities.

## Installation

browser:

    <script src="dist/mukemuva.js"></script>

npm:

    npm i --save mukemuva

## Usage

    import { create_multistore} from 'dist/muekmuva'
    
    const roles = ['x', 'y', 'z']
    const options = { pool: { size: 10 * 1000 }}

    const ms = create_multistore(roles_names, options)

    // ms.set(prop-bag-key, with-user-data)
    
    // coffee and icetea color examples points
    ms.set({ x: 0, y: 0, z: 0 }, { r: 'c0', g: 'ff', b: 'ee'})
    ms.set({ x: 1, 2: 0, z: 3 }, { r: '1c', g: 'e7', b: 'ea'})

    // really badass ???
    ms.set({
        // key: a 3D point
        x: 100, y: 200, z: 300
    }, {
       // data: '#bada55' RGB color
       r: 'ba', g: 'da', b: '55'
    })


## Principles

This library has a 3 abstrraction layers architecture:

* at top level: it exposes a multistore, key/data storage API, using the shape of the key (not the object key itself) to store arbitrary user data, usually objects ;

* in the middle layer, a Block s Memory Pool data allocator, stores arbitrary data at the very beegining  of an array of pre-allocated cells, and returns an UID as a KEY37(5) string key

* at the boottom level, there a Multiply With Carry pseudo random number generator which produces keys like: 'abcde' or 'x1y2z', keys of 5 characters long; each digit has 37 possible values (0-9, _, and a-z); these keys are valid JS objects prop identifier, and can be easily typed with a mobile device keyboard

![lib-compounding](./guide/schemas/lib-compounding.svg)

Internally, the multistore uses a ducked block data structure, all blocks have the same signature, they just consist of various feilds!

* UID
* data
* related: array of UID of 'descendant blocks)
* counter: a reference counter'

Bloccks are ducked, they are 3 ttypes of ducks:

* ROLE: the 'x', or 'y , or 'z' parts of the 3D points-shaped key example
* PART: the valuation (example x: 100) of the key role part
* ITEM: the stored user data

![ducks-blocks](./guide/schemas/duck-blocks-structure.svg)

