import { Role } from './role'
type User = {
  name?: String
  shifts?: Array<any>
}

const initialState: { role: Role; user: User } = {
  role: Role.None,
  user: {},
}

export const globalState = $state(initialState)
