import { apiSlice } from './apiSlice';

const managerSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getManagersByCompanyId: builder.query({
      query: ({ companyId, page, limit, searchTerm }) => {
        let queryString = `/c-managers/company/${companyId}?page=${page}&limit=${limit}`;
        if (searchTerm) {
          queryString += `&search=${searchTerm}`;
        }
        return queryString;
      },
      providesTags: (result, error, { companyId }) => [
        { type: 'Manager', id: companyId },
      ],
    }),

    getAllManagers: builder.query({
      query: () => `/c-managers/`,
      providesTags: ['Manager'],
    }),

    getAllManagersWithoutPagination: builder.query({
      query: ({ companyId }) => `/c-managers/company/${companyId}`,
      providesTags: (result, error, { companyId }) => [
        { type: 'Manager', id: companyId },
      ],
    }),

    getManager: builder.query({
      query: (id) => `/c-managers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Manager', id }],
    }),

    addManager: builder.mutation({
      query: (formData) => ({
        url: '/c-managers',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Manager'],
    }),

    updateManager: builder.mutation({
      query: ({ managerId, data }) => ({
        url: `/c-managers/${managerId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { managerId }) => [
        { type: 'Manager', id: managerId },
      ],
    }),

    deleteManager: builder.mutation({
      query: (id) => ({
        url: `/c-managers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Manager', id }],
    }),
  }),
});

export const {
  useGetManagersByCompanyIdQuery,
  useGetAllManagersQuery,
  useGetAllManagersWithoutPaginationQuery,
  useGetManagerQuery,
  useAddManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
} = managerSlice;

export default managerSlice;
