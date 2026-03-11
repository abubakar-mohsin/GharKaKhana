// src/lib/rbac.js
// ─────────────────────────────────────────────────────────────────────────────
// Role-based access control for GharKaKhana.
// Defines what each role can do and which routes they can access.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Role Constants ───────────────────────────────────────────────────────────
// Must match the UserRole enum in schema.prisma exactly
export const ROLES = {
  MEMBER: 'MEMBER',
  SUPER_ADMIN: 'SUPER_ADMIN',
}

// ─── Permission Map ───────────────────────────────────────────────────────────
// Defines what each role is allowed to do in the app
export const ROLE_PERMISSIONS = {
  MEMBER: [
    'menu:read',
    'logging:read',
    'logging:write',
    'family:read',
    'family:write',
    'insights:read',
  ],
  SUPER_ADMIN: [
    'menu:read',
    'menu:write',       // can add and edit dishes
    'logging:read',
    'logging:write',
    'family:read',
    'family:write',
    'insights:read',
    'insights:write',
    'admin:all',        // access to admin panel
  ],
}

// ─── Route → Allowed Roles Map ────────────────────────────────────────────────
// Controls which roles can access which URL paths
// Middleware checks this on every request
export const ROUTE_ROLE_MAP = {
  '/menu':     [ROLES.MEMBER, ROLES.SUPER_ADMIN],
  '/logging':  [ROLES.MEMBER, ROLES.SUPER_ADMIN],
  '/family':   [ROLES.MEMBER, ROLES.SUPER_ADMIN],
  '/insights': [ROLES.MEMBER, ROLES.SUPER_ADMIN],
  '/admin':    [ROLES.SUPER_ADMIN],               // only super admin
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the userRole is allowed to access the given pathname.
 * Returns true for routes not listed in ROUTE_ROLE_MAP (unrestricted).
 */
export function isAuthorized(userRole, pathname) {
  for (const [route, allowedRoles] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole)
    }
  }
  return true // route not in map → no restriction
}

/**
 * Returns true if the userRole has the requested permission string.
 */
export function hasPermission(userRole, permission) {
  if (!userRole) return false
  return (ROLE_PERMISSIONS[userRole] ?? []).includes(permission)
}