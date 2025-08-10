interface ProxyRoute {
  path: string;
  to: string;
}

interface SecuritySettings {
  rateLimitingEnabled: boolean;
  intervalInSeconds: number;
  maxRequestCount: number;
  graphqlEndpointPath?: string;
  graphqlEndpointIdentityProvider?: string | null;
}

interface ProxySettings {
  routesEnabled: boolean;
  routes: ProxyRoute[];
}

export interface Settings {
  appName: string;
  log: Log;
  security: Security;
  proxy: Proxy;
}

export interface Log {
  maxDays: number;
  consoleLoggingEnabled: boolean;
}

export interface Security {
  rateLimitingEnabled: boolean;
  maxRequestCount: number;
  intervalInSeconds: number;
  graphqlEndpointPath: string;
  graphqlEndpointIdentityProvider: string;
}

export interface Proxy {
  routesEnabled: boolean;
  routes: Route[];
}

export interface Route {
  path: string;
  to: string;
}
