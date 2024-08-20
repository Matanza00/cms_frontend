import { apiSlice } from './apiSlice';

const clinicSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClinicsByCompanyId: builder.query({
      query: ({ companyId, page, limit, searchTerm }) => {
        let queryString = `/c-clinics/company/${companyId}?page=${page}&limit=${limit}`;
        if (searchTerm) {
          queryString += `&search=${searchTerm}`;
        }
        return queryString;
      },
      providesTags: (result, error, { companyId }) => [
        { type: 'Clinic', id: companyId },
      ],
    }),

    getAllClinics: builder.query({
      query: () => `/c-clinics/`,
      providesTags: ['Clinic'],
    }),

    getAllClinicsWithoutPagination: builder.query({
      query: ({ companyId }) => `/c-clinics/company/${companyId}`,
      providesTags: (result, error, { companyId }) => [
        { type: 'Clinic', id: companyId },
      ],
    }),

    getClinic: builder.query({
      query: (id) => `/c-clinics/${id}`,
      providesTags: (result, error, id) => [{ type: 'Clinic', id }],
    }),

    addClinic: builder.mutation({
      query: (formData) => ({
        url: '/c-clinics',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Clinic'],
    }),

    updateClinic: builder.mutation({
      query: ({ clinicId, data }) => ({
        url: `/c-clinics/${clinicId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { clinicId }) => [
        { type: 'Clinic', id: clinicId },
      ],
    }),

    deleteClinic: builder.mutation({
      query: (id) => ({
        url: `/c-clinics/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Clinic', id }],
    }),
  }),
});

export const {
  useGetClinicsByCompanyIdQuery,
  useGetAllClinicsQuery,
  useGetAllClinicsWithoutPaginationQuery,
  useGetClinicQuery,
  useAddClinicMutation,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
} = clinicSlice;

export default clinicSlice;
