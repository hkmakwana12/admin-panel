export interface User {
  id: number
  name: string
  email: string
  role: string        // e.g. "admin", "user"
  status: string      // e.g. "active", "inactive", "blocked"
  avatar: string | null
  last_login: string | null
  created_at: string
  orders_count: number
}
