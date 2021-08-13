export const Result = (() => {
    const Ok = (val) => {
        return {
            inspect: () => `Result::Ok(${val})`,
            map: (f) => {
                try {
                    return OK(f(val))
                } catch(err) {
                    return Err(err)
                }
            },
            cata: (obj) => obj.Ok(val),
            isOk: () => true,
            isErr: () => false
        }        
    }

    const Err = (val) => {
        return {
            inspect: () => `Result::Err(${val})`,
            cata: (obj) => obj.Err(val),
            isOk: () => false,
            isErr: () => true
        }
    }

    const _result = (val) => {
        try {
            return Ok(val())
        } catch(err) {
            return Err(err)
        }
    }

    Result.Ok = Ok

    Result.Err = Err

    return _result
})()

