export interface IdentityProvider {
  name: string;
  provider?: {
    type?: string;
    issuer?: string;
    clientId?: string;
    clientSecret?: string;
    [key: string]: any;
  };
  type?: string;
  children?: IdentityProvider[];
  [key: string]: any;
}

export interface IdentityProviderSchema {
  name: string;
  provider: Record<string, any>; // 如 { type: string; clientId?: string; clientSecret?: string; }
  createdAt: string;
  updatedAt: string;
} 