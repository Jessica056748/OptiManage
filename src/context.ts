import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { type User } from './types'

let userKey = Symbol('user')

export function setUserContext(user: User) {
  // TODO: decide on a reactive context or not. 
  // const contextStore = writable(user)
  // setContext(userKey, contextStore)
  setContext(userKey, user)
}

export function getUserContext(): User {
  return getContext(userKey) as User
}
