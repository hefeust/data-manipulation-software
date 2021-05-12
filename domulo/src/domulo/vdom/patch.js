
import { BlockSorts } from '@/src/domulo/vdom/data-blocks'

const insertNode = (root, infos) => {
  const newNode = document.createElement (infos.newlyBlock.name)
  
  root.appendChild (newNode)
}

const updateNode = (root, infos) => {
  const oldieNode = infos.oldieNode
  const newlyNode = document.createElement (infos.newlyBlock.name)
  
  root.replaceChild (newlyNode, oldieNode)
}

const deleteNode = (root, infos) => {
  console.log ('delete node')
  console.log (root)
  console.log (infos.oldieNode  )

  //const chidx = infos.oldieDelta [ infos.oldieDelta.length - 1 ]
  //const oldNode = root.childNodes [ chidx ]
  const oldieNode = infos.oldieNode
  
  root.removeChild (oldieNode)  
}

const insertText = (root, infos) => {
  const newNode = document.createTextNode (infos.newlyBlock.value)
  
  root.appendChild (newNode)
}

const updateText = (root, infos) => {
  const oldieNode = infos.oldieNode
  const newlyNode = document.createTextNode (infos.newlyBlock.value)
  
  root.replaceChild (newlyNode, oldieNode)  
}

const deleteText = (root, infos) => {
  console.log ('delete node')
  console.log (root)
  console.log (infos)

  //const chidx = infos.oldieDelta [ infos.oldieDelta.length - 1 ]
  //const oldNode = root.childNodes [ chidx ]
  const oldieNode = infos.oldieNode
  
  root.removeChild (oldieNode)  
}

const setAttr = (root, infos) => {
  const name = infos.newlyBlock.name
  const value = infos.newlyBlock.value

  if (name === 'className') {
    root.setAttribute ('class', value)
  } else {
    root.setAttribute (name, value)
  }
}

const deleteAttr  = (root, infos) => {
  
}

const discoverNodes = (root, infos) => {
  const { oldieDelta, newlyDelta } = infos  
  
  const iterate = (route, nav, shift) => {
    console.log ('iterate route:'  + route.join('/'))
    let children = null
    let level = shift
    
    if (shift === 1) {
      nav.oldieNode = nav.root
      nav.root = nav.root.parentNode
      
      return 
    }
    
    while (level + shift < route.length) {
      children = nav.root.childNodes
      
      if (route [level] < children.length) {
        nav.root = children [ route [level] ]
        nav.oldieNode = nav.root.childNodes [ route [level + 1 ] ]
      }
      
      level++
    }
  }
  
  let shift = 0
  let nav = { root, oldieNode: null }
  
  if (oldieDelta.length > 1) {
    iterate (oldieDelta, nav, shift)
    shift = 1
  } else {
    shift = 0
  }
  
  iterate (newlyDelta, nav, shift)

  console.log ('discoverNopdes results with (root, oldieNode)', nav.root, nav.oldieNode)

  return nav
}

const patchDOM = (root, infos, options) => {
  console.log ('### patch real DOM ###')
  
  const discovery = discoverNodes (root, infos)
 
  root = discovery.root
  infos.newlyNode = discovery.newlyNode
  infos.oldieNode = discovery.oldieNode
  
  switch (infos.ops) {
    case BlockSorts.PATCH_INSERT_NODE: 
      insertNode (root, infos)
    break

    case BlockSorts.PATCH_INSERT_TEXT: 
      insertText (root, infos)
    break

    case BlockSorts.PATCH_INSERT_ATTR: 
      setAttr (root, infos)
    break  

    case BlockSorts.PATCH_UPDATE_NODE: 
      updateNode (root, infos)
    break

    case BlockSorts.PATCH_UPDATE_TEXT: 
      updateText (root, infos)
    break

    case BlockSorts.PATCH_UPDATE_ATTR: 
      setAttr (root, infos)
    break  
  
    case BlockSorts.PATCH_DELETE_NODE: 
      deleteNode (root, infos)
    break

    case BlockSorts.PATCH_DELETE_TEXT: 
      deleteText (root, infos)
    break

    case BlockSorts.PATCH_DELETE_ATTR: 
      deleteAttr (root, infos)
    break  
  }
  
}

const collectDeltaInfos = (bmp, deltaRootBlock) => {
  let deltas = []
  let deltaBlockUid =  deltaRootBlock.next 
  let rank = 0
  

  while (deltaBlockUid !== '0') {
    const deltaBlock = bmp.getBlockByUid (deltaBlockUid)

    const parts = deltaBlock.route.split ('!')
    const oldieDelta = parts[0].split ('/').map(s => parseInt(s))
    const newlyDelta = parts[1].split ('/').map(s => parseInt(s))
    
    const infos = {
      ops: deltaBlock.sort,
      oldieDelta,
//      oldieRoute: [0],
      oldieBlock: deltaBlock.oldie && bmp.getBlockByUid (deltaBlock.oldie),
      newlyDelta,
//      newlyRoute: [0],
      newlyBlock: deltaBlock.newly &&   bmp.getBlockByUid (deltaBlock.newly),
//      level: 0,
//      chidx: 0,
      rank
    }

    
    deltas.push (infos)
    rank++
    deltaBlockUid = deltaBlock.next
  }  

  return deltas   
}

const INS_OPS = [
    BlockSorts.PATCH_INSERT_NODE,
    BlockSorts.PATCH_INSERT_TEXT
    // BlockSorts.PATCH_INSERT_ATTR,
]


const DEL_OPS = [
    BlockSorts.PATCH_DELETE_NODE,
    BlockSorts.PATCH_DELETE_TEXT
    // BlockSorts.PATCH_DELETE_ATTR
]

const sortDeltaBlocksList = (dbl) => {
  
  dbl.sort ((a, b) => {
    const a_is_insert = INS_OPS.indexOf(a.ops) > -1
    const b_is_insert = INS_OPS.indexOf(b.ops) > -1    
    const a_is_delete = DEL_OPS.indexOf(a.ops) > -1
    const b_is_delete = DEL_OPS.indexOf(b.ops) > -1
    
    if (a_is_delete && b_is_delete) {
      // both deletions: revert sorting order
      if (a.rank < b.rank) {
        return 1
      } else if(a.rank > b.rank) {
        return -1
      } else {
        return 0
      }
      
    } 
/*    
    else if (a_is_insert) {
      // only a deletes ? a is smaller
      return -1
    } else if (b_is_insert) {
      // only b deletes ? b is lsmaller
      return 1      
  
    } else if (a_is_delete) {
      // only a deletes ? a is smaller
      return -1
    }
    else if (b_is_delete) {
      // only b deletes ? b is lsmaller
      return 1      
    }
    */
      else {
      // NO DLETIONS AT ALL ? preserve order
      if (a.rank < b.rank) {
        return -1
      } else if(a.rank > b.rank) {
        return 1
      } else {
        return 0
      }
    }
  })
}

const rebaseDeltasList = (dbl) => {
  
  console.log ('### rebase deltas list ###')
  
  const alter = (src ,tgt, arrayName, amount) => {
    const position = tgt[arrayName].length - 1
    let i = 0
    
    if(src[arrayName].length !== tgt[arrayName].length) return
        
    while (src[arrayName][i] ===  tgt[arrayName][i]) {
      if (i === position && tgt[arrayName][i] > 0) 
        tgt[arrayName][i] += amount
      
      if (i > src[arrayName].length) break
      
      i++ 
    }
  }
  
  for (let s = 0; s < dbl.length; s++) {
    const src = dbl [s]
    const ops_is_delete = DEL_OPS.indexOf(src.ops) > -1
    const ops_is_insert = INS_OPS.indexOf(src.ops) > -1
    const route = src.oldieDelta.join('/') + '!' + src.newlyDelta.join('/')


 //   console.log (src.ops, route)
    
    for (let t = s + 1; t < dbl.length; t++) {
      const tgt = dbl [t]
      
      if (ops_is_delete) {
        alter (src, tgt, 'oldieDelta', -1)
      }
      
      if (ops_is_insert) {
        alter (src, tgt, 'newlyDelta', 1)
      }
    }
  }
}

const showDeltaBlocksList = (dbl) => {
  const results = []
  
  dbl.map(di => {
    const oldie = di.oldieBlock && di.oldieBlock.name
    const newly = di.newlyBlock && di.newlyBlock.name
    const route = di.oldieDelta.join('/') + '!' + di.newlyDelta.join('/')
    
    results.push(`${di.rank} ${di.ops} oldie: ${oldie} newly: ${newly} ${route}`)
  })
  
  return results.join ('\n')
}


/**
 * the patching algorithm
 * 
 * given a list of deltas, patches the real DOM
 * 
 * @param {Object} bmp
 * @param {Object} deltas
 * @param {Object} options
 * @returns {undefined}
 */
export const patch = (bmp, deltas, options) => {
  const root = deltas.container
  const deltasInfosList = collectDeltaInfos (bmp, bmp.getBlockByUid (deltas.uid))
  let rank = 0
  
  console.log ('===== patching real DOM... =====')
  console.log ('root element patched is:' , root)

  console.log ('BEFORE SORTING AND REBASING')
  console.log (showDeltaBlocksList (deltasInfosList) )

  sortDeltaBlocksList (deltasInfosList)

  console.log ('AFTER sorting, BEFORE rebasing')
  console.log (showDeltaBlocksList (deltasInfosList) )
  
  rebaseDeltasList (deltasInfosList)

  console.log ('AFTER SORTING AND REBASING')
  console.log (showDeltaBlocksList (deltasInfosList) )
  
  deltasInfosList.map ((infos, rank) => {
    patchDOM (root, infos, options)
  })
}