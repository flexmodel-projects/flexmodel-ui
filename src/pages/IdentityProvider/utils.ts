import type {IdentityProvider} from "@/types/identity-provider";

export interface IdentityProviderFlatForm {
  name: string;
  type?: string;
  issuer?: string;
  clientId?: string;
  clientSecret?: string;
  script?: string;
}

export function normalizeIdentityProvider(idp: IdentityProvider | null | undefined): IdentityProviderFlatForm {
  if (!idp) {
    return { name: "" };
  }
  const provider = idp.provider || {};
  return {
    name: idp.name,
    type: provider.type ?? (idp as any).type,
    issuer: provider.issuer ?? (idp as any).issuer,
    clientId: provider.clientId ?? (idp as any).clientId,
    clientSecret: provider.clientSecret ?? (idp as any).clientSecret,
    script: provider.script ?? (idp as any).script,
  };
}

export function mergeIdentityProvider(
  base: IdentityProvider,
  flat: IdentityProviderFlatForm
): IdentityProvider {
  return {
    ...base,
    name: base.name,
    provider: {
      ...base.provider,
      type: flat.type,
      issuer: flat.issuer,
      clientId: flat.clientId,
      clientSecret: flat.clientSecret,
      script: flat.script,
    },
  };
}

export function buildUpdatePayload(flat: IdentityProviderFlatForm) {
  return {
    name: flat.name,
    provider: {
      type: flat.type,
      issuer: flat.issuer,
      clientId: flat.clientId,
      clientSecret: flat.clientSecret,
      script: flat.script,
    },
    createdAt: "",
    updatedAt: "",
  };
}


