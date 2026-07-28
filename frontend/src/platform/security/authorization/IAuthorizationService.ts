export interface Principal {
  id: string;
  role: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface Resource {
  type: string;
  ownerId?: string;
  [key: string]: unknown;
}

export interface Action {
  name: string;
}

export interface IAuthorizationService {
  canAccess(principal: Principal | null, action: Action, resource?: Resource): boolean;
  hasRole(principal: Principal | null, role: string): boolean;
  hasPermission(principal: Principal | null, permission: string): boolean;
}
