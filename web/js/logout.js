import { logout } from './api.js'

await logout()

localStorage.clear('isAdmin')

location = '/'
