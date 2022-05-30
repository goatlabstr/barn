import * as accountActions from './account'
import * as governanceActions from './governance'
import * as stakeActions from './stake'

const allActions = {
    ...accountActions,
    ...governanceActions,
    ...stakeActions
}

export default allActions