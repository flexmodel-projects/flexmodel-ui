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