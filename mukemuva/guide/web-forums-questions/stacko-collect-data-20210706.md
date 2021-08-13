
Hi there !

I have an algorithm coding issue in ES2017 with an async generator. I have to extract some data from a list of randomly-distributed maps.

My initial goal is to code a multi-keys, multiple values (a project I called mukemuva) data structure, with the ability of compacting the overlapping information.

(this is a long post, with some code reviews needed to answers it, so please take a while to answer...)

The problem I attempt to solve is the following:

* in a regular ES2015 Map, keys should be scalar values (0, 1, 2, 3, 'avc', true, ...) but not litteral property bags objects (such as 3D points { x:1, y:2, z: 3 } of functions; because JS  Maps use some internal hash of the JS engine, not the shape of the property bag itself.

For example, in the node REPL type

    m = new Map()
    m.set({ x: 1, y: 2, z: 3 } , 123)
    m.set({ x: 1, y: 2, z: 3 } , 456)
    m.set({ x: 1, y: 2, z: 3 } , 789)

... and you'll get a 3 pairs (key/value) resulting Map.

In a SQL RDBMS, doing the same will probably result in a  1 row table with just the ending value (789) and it is this behaviour that I expect.


# NAIVE IMPLEMENTATION

a fast, but memoty conuming implemetnation is the maintain an internal list of pairs:

    const pairs = [
        { bag: { x: 0, y: 0, z: 0 }, with_data: { r: 'ba', g: 'da', b: '55' } },
        { bag: { x: 1, y: 2, z: 3 }, with_data: 123 }
    ]

and loop the whole list to determine how to fill the array:

* if a bag is present inside the list, replace its "with_data" value (UPDATE)
* if not, create a new entriy in the pairs list, with appropriate "bag" and "with_data" fileds (INSERT/CREATE)

This is super fast but can be troubled or messed up while the size of the entry list increases, especially for high numbers of entries (typically 500K to 1000K)


# ADVANCED IMPLEMENTATION

First I have conceptualized and named things :

    m.set({ x: 1 y: 2, z: 3 }, 'c0ffee' )

* 'x', ''y  and z: 'z' are so called "roles"
* 1, 2, and 3 are called "role partitions" or "parts"
* the 'coffee' string is the stored "item"

## duck blocks

For the storage I have developped a blocks memoty pool allocator that stores data under pseudo random keys generated with a MWC (Multiply-With-Carry) genertor, such as :

    pool.set(data) --> uid, a key 5 digits of 37 values each (0-9, _ and A-Z) 
    pool.get(uid) --> arbitrary data, brought back to user

Using the pool, I can store duck blocks with this shape:

    type DuckBlock = [
        uid: KEY37(5),
        ducktype: ROLE | PART | ITEM,
        counter: 0,      # refs counter
        related: array of KEY37(5),  # related block UIDs
        fellow: KEY37(5)  # "parent" block UID, for PART roles
        data: <any>    # user arbitrary data object
    }
        
Using lookup Maps to store:

* roles: <role_name> => UID,
* parts: <part_value> => [UID] (lsit of parts)
* items

## querting ststem: 

    const generator = await multimap.select({ 
        x: 0,       // single value search
        y: '*'      // wikdcard search,
        z: (val) => -5 < val && val < 5  // fiter function search
    })

Brief Algorithm:

* for each role, find the correponding partitions that martches filters
* for each part duck block, get the items UIDs
* carteian product parts_for_role_X * parts_for_role_Y * parts_for_role_Z
* get the item_uids list for each entry
* intersect the list s of items to get selecteed items
* grab the items by their UID

## insert / set up values

For the setting up of the value :

    multimap.set({ x: 0, y:0, z: 0}, { rgb: 'bada55'})

... I compute the selection generator, with the values of the key as filters of ther select method, then :

* if empty: set anew value
* if not empty, overwrite the existing value

# THE QUESTION

the naive code is surprisingly fast (3s for 1M pointsrecorded) but I suspect dlete oprations to be costful (imagine an array.splice of a such array) 

The advanced version could make a save of up to 25% space (tested) but it is sadly slow (almost 30 min for 1 M records)

I suspect the mechansim of collecting uids to have a too big algorithmic complexity...

But where is really the bootleneck and how could I proceed to fix it ?

(will have its own repo sooner...)
https://github.com/hefeust/data-manipulation-software/mukemuva

Thanks for replies.



