export type ApiVersion = 'v1' | 'v2';
export const API_VERSION: ApiVersion =
  (process.env.NEXT_PUBLIC_API_VERSION as ApiVersion) || 'v1';

export const apiPath = (p: `/${string}`) => `/api/${API_VERSION}${p}`;
