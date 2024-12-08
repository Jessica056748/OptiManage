import { Role } from './role'

// TODO: remember to set this back to none initially.
export const globalState = $state({
  role: Role.Manager,
})
