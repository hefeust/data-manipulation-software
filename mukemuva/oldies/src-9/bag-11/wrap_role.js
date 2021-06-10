
export const wrap_role = (ctx) => {

    const { pool } = ctx

    return {
        wrap: (block) => {
            const set_part = (part_value) => {
                const part = parts.select(part_value) 
                    || parts.create({ part_value, related: [] })

                block.payload.related.push(part.uid)
            }

            const get_part = (uid) => {

                const part = parts.get(uid)

                return part
            }

            const select_parts = (filter) => {
                const results = block.payload.related.map((uid) => {
                    const part = parts.select(uid)

                    return filter(part)
                })

                return results
            }

            return {
                set_part, get_part, select_parts
            }
        }
    }
}
