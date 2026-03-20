export function getRoleFromSession(session, profile) {
  return profile?.role || session?.user?.user_metadata?.role || "guest";
}

export function canAccessAdmin(session, profile) {
  return getRoleFromSession(session, profile) === "admin";
}

export function canManageListings(session, profile) {
  const role = getRoleFromSession(session, profile);
  return role === "admin" || role === "realtor" || role === "owner";
}

export function canManageSales(session, profile) {
  const role = getRoleFromSession(session, profile);
  return role === "admin" || role === "realtor";
}

export function canViewOwnerStatements(session, profile) {
  const role = getRoleFromSession(session, profile);
  return role === "admin" || role === "owner";
}
