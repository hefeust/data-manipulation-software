
# README

## Mukemuva... WTF ?

Mulemuva stands for "MUlti-KEys, MUltiple VAlues":  this is just a simple in-memory (in vivo) database  system system with basic filtering abilities.

## Installation

browser:

    <script src="dist/mukemuva.js"></script>

npm:

    npm i --save mukemuva

## Usage

    import { create_multistore} from 'dist/muekmuva'
    
    const roles = 'order,product,container'.split(',')
    const options = { pool: { size: 100 * 1000 }}

    const ms = create_multistore(roles_names, options)



