// ─── Role constants ─────────────────────────────────────────────────────────

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

// ─── Permission map ──────────────────────────────────────────────────────────

export const ROLE_PERMISSIONS = {
  USER: [
    'menu:read',
    'logging:read',
    'logging:write',
    'family:read',
    'insights:read',
  ],
  ADMIN: [
    'menu:read',
    'menu:write',
    'logging:read',
    'logging:write',
    'family:read',
    'family:write',
    'insights:read',
    'insights:write',
    'admin:all',
  ],
};

// ─── Route → allowed role map ────────────────────────────────────────────────
// Key: exact pathname prefix.  Value: array of roles allowed.

export const ROUTE_ROLE_MAP = {
  '/menu':     [ROLES.USER, ROLES.ADMIN],
  '/logging':  [ROLES.USER, ROLES.ADMIN],
  '/family':   [ROLES.USER, ROLES.ADMIN],
  '/insights': [ROLES.USER, ROLES.ADMIN],
  '/admin':    [ROLES.ADMIN],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns true when `userRole` is among the roles allowed for `pathname`.
 * Returns true for routes not listed in ROUTE_ROLE_MAP (not restricted).
 */
export function isAuthorized(userRole, pathname) {
  for (const [route, allowedRoles] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole);
    }
  }
  return true; // route not in map → unrestricted
}

/**
 * Returns true when `userRole` has the requested `permission` string.
 */
export function hasPermission(userRole, permission) {
  if (!userRole) return false;
  return (ROLE_PERMISSIONS[userRole] ?? []).includes(permission);
}
