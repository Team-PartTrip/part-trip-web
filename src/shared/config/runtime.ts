export const runtimeConfig = {
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
} as const
