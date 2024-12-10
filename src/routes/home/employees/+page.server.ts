// import { VITE_BACKEND_PORT as PORT } from '$env/static/private'

/**
 * Fetches all employees, so the manager can view them in a list.
 * @param
 * @returns
 */
// export async function load({ cookies }) {
//   const token = cookies.get('jwt'),
//     month = new Date().getMonth()

// if (!token) throw redirect(307, '/')

// Todo: make department programmatic, not hard-coded.
// const response = await fetch(
//     `http://localhost:${PORT}/shifts/department?month=${month}`,
//     {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   ),
//   data = await response.json()

// console.log('data:', data)

// if (response.status !== 200) throw redirect(307, '/')

// @ts-ignore
// user.role = user.role === 'manager' ? Role.Manager : Role.Employee

// return { data }
// }
