
import { List } from '../../src/fp/list.js'

describe('List monad test', () => {
    it('should print something', () => {

        List([0, 1, 2, 3, null])
            .map((x) => x + 2)
            .map((x) => x * x)
            .just()

    })
})

