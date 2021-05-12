
import { BlockSorts} from '@/src/domulo/vdom/data-blocks'
import { collectList } from '@/src/domulo/vdom/collect-list'

/**
 * the patch types 
 * @type ENUM
 */
const DIFF_TYPES = {
  TAG_TO_TAG:    BlockSorts.ELEMENT + '=>' + BlockSorts.ELEMENT,
  TAG_TO_TEXT:   BlockSorts.ELEMENT + '=>' + BlockSorts.TEXT,
  TEXT_TO_TAG:   BlockSorts.TEXT + '=>' + BlockSorts.ELEMENT,
  TEXT_TO_TEXT:  BlockSorts.TEXT + '=>' + BlockSorts.TEXT,
  EMPTY_TO_TEXT: BlockSorts.EMPTY + '=>' + BlockSorts.TEXT,
  TEXT_TO_EMPTY: BlockSorts.TEXT + '=>' + BlockSorts.EMPTY,
  TAG_TO_EMPTY: BlockSorts.ELEMENT + '=>' + BlockSorts.EMPTY,
  EMPTY_TO_TAG: BlockSorts.EMPTY + '=>' + BlockSorts.ELEMENT,
  EMPTY_TO_EMPTY: BlockSorts.EMPTY + '=>' + BlockSorts.EMPTY
 }

/**
 * get patch types from 2 trees
 
 * @param {object} oldTreeBlock
 * @param {object} newTreeBlock
 * @returns {String}
 */
const blocksDiffSort = (oldTreeBlock, newTreeBlock) => {
  const lhs = oldTreeBlock.sort 
  const rhs = newTreeBlock.sort
 
  return lhs + '=>' + rhs
}

/**
 * create a new patch block
 * append it to patches listr
 * 
 * @param {object} bmp
 * @param {object} patch
 * @param {object} params
 * @returns {undefined}
 */
const createPatchBlock = (bmp, patch, params) => {
  const newPatchBlock = bmp.getEmptyBlock()
  
  // console.log('######### createPatchBlock')
  // console.log (params)
  
  newPatchBlock.sort = params.sort || '#void!'
  // newPatchBlock.rel = params.rel || '#/a!'

  // patching route
  // newPatchBlock.route = params.route && params.route.oldie.join('/') + '!' + params.route.newly.join('/')

  newPatchBlock.route = params.route && [params.route.oldie.join('/'), params.route.newly.join('/')].join('!')

  newPatchBlock.oldie = params.oldie
  newPatchBlock.newly = params.newly

  if (newPatchBlock.sort === '#void!') {
    console.log (params)
    // console.log('oldie', oldie)
    //console.log('newly', newly)
    throw new Error ()
  }

  patch.patchBlock.next = newPatchBlock.uid
  patch.patchBlock = newPatchBlock
}

/**
 * diff two tags blocks
 * 
 * big switching algorithm to determine with patch to apply
 * 
 * @param {type} bmp
 * @param {type} oldTagBlock
 * @param {type} newTagBlock
 * @param {type} patch
 * @returns {undefined}
 */
const diffTagsBlocks = (bmp, oldTagBlock, newTagBlock, route, patch) => {
  const bds = blocksDiffSort (oldTagBlock, newTagBlock)
  // let sort = BlockSorts.EMPTY

  // console.log('    diff tag blocks: ' + bds)
  // console.log ( oldTagBlock.name + ' ' + newTagBlock.name)
  try {
  switch (bds) {
    
    case DIFF_TYPES.TAG_TO_TAG:
      if (oldTagBlock.name === newTagBlock.name) return 
      
//      sort = BlockSorts.PATCH_UPDATE_NODE,
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_UPDATE_NODE,
        oldie: oldTagBlock.uid,
        newly: newTagBlock.uid,
        route
      })
    break
    
    case DIFF_TYPES.TAG_TO_TEXT:   
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_DELETE_NODE,
        oldie: oldTagBlock.uid,
        newly: null,
        route
      })
      
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_INSERT_TEXT,
        oldie: null,
        newly: newTagBlock.uid,
        route
      })
    break 
    
    case DIFF_TYPES.TEXT_TO_TAG:   
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_DELETE_TEXT,
        oldie: oldTagBlock.uid,
        newly: null,
        route
      })
      
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_INSERT_NODE,
        oldie: null,
        newly: newTagBlock.uid,
        route
      })
    
    break
    
    case DIFF_TYPES.TEXT_TO_TEXT:  
      if (oldTagBlock.value === newTagBlock.value) return 
      
      createPatchBlock (bmp, patch, {
        sort:  BlockSorts.PATCH_UPDATE_TEXT,
        oldie: oldTagBlock.uid,
        newly: newTagBlock.uid,
        route
      })
    break 
    
    case DIFF_TYPES.EMPTY_TO_TEXT: 
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_INSERT_TEXT,
        oldie: null,
        newly: newTagBlock.uid,
        route
      })
    break 
    
    case DIFF_TYPES.TEXT_TO_EMPTY: 
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_DELETE_TEXT,
        oldie: oldTagBlock.uid,
        newly: null,
        route
      })
    break 
    
    case DIFF_TYPES.TAG_TO_EMPTY: 
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_DELETE_NODE,
        oldie: oldTagBlock.uid,
        newly: null,
        route
      })    
    break 
    
    case DIFF_TYPES.EMPTY_TO_TAG: 
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_INSERT_NODE,
        oldie: null,
        newly: newTagBlock.uid,
        route
      })    
    break 
    
    case DIFF_TYPES.EMPTY_TO_EMPTY: 
      // do nothing ...
    break 
  }
  
  } catch (error)  {
    console.log (bds)
    console.log ('oldTagBlock', oldTagBlock)
    console.log ('newTagBlock', newTagBlock)
    throw error
  }
}

/**
 * attributes blocks diffing
 * 
 * @param {type} bmp
 * @param {type} oldTagBlock
 * @param {type} newTagBlock
 * @param {type} patch
 * @returns {undefined}
 */
const diffAttrsBlocks = (bmp, oldieTagBlock, newlyTagBlock, route, patch) => {
  const oldieAttrsList = collectList (bmp, oldieTagBlock.attrs)
  const newlyAttrsList = collectList (bmp, newlyTagBlock.attrs)
  const collected = new Set()
  
  oldieAttrsList.map ((oldie, oidx) => {
    newlyAttrsList.map ((newly, nidx) => {
      if (oldie.name === newly.name) {
        collected.add (oldie.name)
        
        createPatchBlock (bmp, patch, {
          sort: BlockSorts.PATCH_UPDATE_ATTR,
          oldie: oldie.uid,
          newly: newly.uid,
          route
        })
      }
    })    
  })

  oldieAttrsList.map((oldie, oidx) => {
    if (false === collected.has(oldie.name)) {
      createPatchBlock (bmp, patch, {
        sort: BlockSorts.PATCH_DELETE_ATTR,
        oldie: oldie.uid,
        newly: newly.uid,
        route
      })      
    }
  })
  
}


/*/*
 * zip two arrays
 * 
 * @param {Array} arr0
 * @param {Array} arr1
 * @returns {Array}
 */
const zip = (arr0, arr1) => {
  if(arr0.length >= arr1.length) {
    return arr0.map ((x0, idx0) => [x0, arr1[idx0]])
  } else {
    return arr1.map ((x1, idx1) => [arr0[idx1], x1])
  }
}


const diffNodesBlocks = (bmp, oldieTagBlock, newlyTagBlock, route, patch) => {
  const oldieNodesList = collectList (bmp, oldieTagBlock.nodes)
  const newlyNodesList = collectList (bmp, newlyTagBlock.nodes)
  const olen = oldieNodesList.length
  const nlen = newlyNodesList.length
  
  zip (oldieNodesList, newlyNodesList).map((zipped, idx) => {
     const oldie = route.oldie.slice (0)
     const newly = route.newly.slice (0)
     const nodeRoute = { oldie, newly }
    
     if (olen > nlen) {
       if (idx < nlen) {
         newly.push (idx)
       } else {
         oldie.push (idx - nlen)
       }
     } else {
       if (idx < olen) {
         oldie.push (idx)
       } else {
         newly.push (idx - olen)
       }       
     }
    
    diffTrees (bmp, zipped[0], zipped[1], nodeRoute, patch)
  })
}

const diffTrees = (bmp, oldTree, newTree, route, patch) => {
  let oldTreeBlock
  let newTreeBlock

  console.log ('===== diffTrees =====')
  console.log (oldTree)
  console.log (newTree)

  if (oldTree && oldTree.uid !== '0') {
    oldTreeBlock = bmp.getBlockByUid (oldTree.uid)    
  } else {
    oldTreeBlock = bmp.getEmptyBlock ()
  }

  if (newTree && newTree.uid !== '0') {
    newTreeBlock = bmp.getBlockByUid (newTree.uid)    
  } else {
    newTreeBlock = bmp.getEmptyBlock ()
  }

  diffTagsBlocks (bmp, oldTreeBlock, newTreeBlock, route, patch)
  diffAttrsBlocks (bmp, oldTreeBlock, newTreeBlock, route, patch)
  diffNodesBlocks (bmp, oldTreeBlock, newTreeBlock, route, patch)
}

export const diff = (bmp, oldTree, newTree) => {
  const patchBlock = bmp.getEmptyBlock()
  const route = { oldie: [0], newly: [0] }
  const patch = {
    patchBlock,
  }
  
  patchBlock.sort = BlockSorts.PATCH
  newTree.container = oldTree.container
  
  //diffTrees (bmp, oldTree, newTree, route, patch)
  diffTrees (bmp, oldTree, newTree, route, patch)

  return { 
    name: 'PATCH',
    uid: patchBlock.uid,
    oldie: oldTree && oldTree.uid,
    newly: newTree && newTree.uid,
    container: oldTree.container
  }
}
