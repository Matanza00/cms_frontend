import { apiSlice } from './apiSlice';

const managerSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get managers by CompanyId with pagination and search
    GetManagerByCompanyId: builder.query({
      query: ({ companyId, page, limit, searchTerm }) => {
        let queryString = `/managers/company/${companyId}?page=${page}&limit=${limit}`;
        if (searchTerm) {
          queryString += `&search=${searchTerm}`;
        }
        return queryString;
      },
      providesTags: ['Manager'],
    }),

    // Get All Managers
    GetManagerAll: builder.query({
      query: () => `/managers/`,
      providesTags: ['Manager'],
    }),

    // Get All Managers Without Pagination
    GetManagerAllWithoutPagination: builder.query({
      query: ({ companyId }) => `/managers/company/${companyId}`,
      providesTags: ['Manager'],
    }),

    // Get One Manager
    GetManager: builder.query({
      query: (id) => `/managers/${id}`,
      providesTags: ['Manager'],
    }),

    // Add Manager
    AddManager: builder.mutation({
      query: (formData) => ({
        url: '/managers',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Manager'],
    }),

    // Update Manager
    UpdateManager: builder.mutation({
      query: ({ managerId, data }) => ({
        url: `/managers/${managerId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Manager'],
    }),

    // Delete Manager
    DeleteManager: builder.mutation({
      query: (id) => ({
        url: `/managers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Manager'],
    }),
  }),
});

export const {
  useGetManagerByCompanyIdQuery,
  useGetManagerAllQuery,
  useGetManagerAllWithoutPaginationQuery,
  useGetManagerQuery,
  useAddManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
} = managerSlice;

export default managerSlice; // Add this default export
