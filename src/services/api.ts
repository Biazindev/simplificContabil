import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://simplifica-contabil.onrender.com'
  }),
  endpoints: (builder) => ({
    getFeatureProduto: builder.query<ProdutoProps, void>({
      query: () => '/produtos'
    })
  })
})

export const { useGetFeatureProdutoQuery } = api
export default api
