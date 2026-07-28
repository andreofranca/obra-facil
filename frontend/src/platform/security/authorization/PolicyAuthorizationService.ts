import { Action, IAuthorizationService, Principal, Resource } from "./IAuthorizationService";

export class PolicyAuthorizationService implements IAuthorizationService {
  canAccess(principal: Principal | null, action: Action, resource?: Resource): boolean {
    if (!principal) return false;
    
    // Admin bypass (Policy Genérica - se desejar externalizar isso, injetar Rules)
    if (this.hasRole(principal, "ADMIN")) return true;

    // Se a resource exige ownership
    if (resource && resource.ownerId) {
      if (principal.id === resource.ownerId) return true;
      
      // Fallback: Check if principal has any other ID that matches (e.g. professionalId vs clientId)
      // We check all string properties in principal just to be generic, 
      // or we rely on the domain mapping Principal to have `.id` resolved to the active role's id.
      const matchFound = Object.values(principal).some(val => val === resource.ownerId);
      if (matchFound) return true;
      
      return false;
    }

    // Se é baseado em Action (ABAC simplificado)
    if (this.hasPermission(principal, action.name)) return true;

    // Default policy
    return true; // Se não tem resource binding nem permission binding estrito, o fato de estar autenticado já passou.
  }

  hasRole(principal: Principal | null, role: string): boolean {
    if (!principal) return false;
    return principal.role === role || principal.role === "ADMIN";
  }

  hasPermission(principal: Principal | null, permission: string): boolean {
    if (!principal) return false;
    if (this.hasRole(principal, "ADMIN")) return true;
    
    return Boolean(principal.permissions?.includes(permission));
  }
}
