import { Role } from './role'
type User = {
  name?: String
  shifts?: Array<any>
}

const initialState: { role: Role; user: User } = {
  // TODO: remember to set this back to none initially.
  role: Role.Manager,
  user: {},
}

export const globalState = $state(initialState)
