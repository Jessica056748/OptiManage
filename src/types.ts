// Each enum in Role corresponds to an integer on the console:
enum Role {
  None, // 0
  Employee, // 1
  Manager, // 2
}
// TODO: define the Shift schema.
type Shift = {}
type User = {
  name: String
  sin: String
  email: String
  shifts: Array<Shift>
  role: Role
  iat: number
  exp: number
}
type PopUpData = {
  day: number
  month: number
}

export { Role, type Shift, type User, type PopUpData }
