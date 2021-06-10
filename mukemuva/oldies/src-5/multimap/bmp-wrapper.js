
export const create_bmp_wrapper = (bmp) => {
    
    const set_duck = (duck, breed ) => {
        const block = { breed }
        const uid = bmp.set_data(block)

        Object.defineProperty(block, 'duck', {
            get: () => duck
        })

        return uid
    }

    const get_duck = (duck, uid) => {
        const block = bmp.get_data(uid)
        let breed = null 

        if(block) {
            if(block.duck === duck) {
                breed = block.breed
            } else {
                console.log('bmp_duck_wrap#get_duck: no such duck for uid=' + uid)
            }
        } else {
           console.log('bmp_duck_wrap#get_duck: no such block for uid=' + uid)
        }   
                
        return breed
    }

    return { set_duck, get_duck }
}

