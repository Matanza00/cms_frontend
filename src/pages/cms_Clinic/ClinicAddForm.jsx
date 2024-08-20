import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import Select from 'react-select';
import UploadWidget from '../../components/UploadWidget';
import {
  useAddClinicMutation,
  useGetAllClinicsWithoutPaginationQuery,
} from '../../services/clinicSlice';
import { useGetAllUsersInfoQuery } from '../../services/usersSlice'; // Import the query hook
import { customStyles } from '../../constants/Styles';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';
// import { addClinicSchema } from '../../utils/schemas';

const ClinicAddForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { showErrorToast, showSuccessToast } = useToast();
  const [formValues, setFormValues] = useState({
    cms_UsersId: '',
    name: '',
    companyId: user?.companyId || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    cell: '',
    faxNo: '',
    email: '',
    url: '',
    assignedEmployee: '',
  });

  const { data: responseData, isLoading: usersLoading } =
    useGetAllUsersInfoQuery(); // Fetch all users
  const { data: clinics } = useGetAllClinicsWithoutPaginationQuery({
    companyId: user?.companyId,
  });

  const [AddClinic, { isLoading, isError, error }] = useAddClinicMutation();
  const [clinicLicenceUrl, setClinicLicenceUrl] = useState('');

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      companyId: user?.companyId,
      cms_UsersId: user?.id || '',
    }));
  }, [user]);

  // useEffect(() => {
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     license: clinicLicenceUrl,
  //   }));
  // }, [clinicLicenceUrl]);

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setFormValues({
        ...formValues,
        assignedEmployee: selectedOption.value,
        name: selectedOption.label,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AddClinic(formValues).unwrap();
      console.log('API Response:', result);
      showSuccessToast('Clinic Added Successfully!');
      navigate(-1);
    } catch (err) {
      console.error('Error:', err);
      let errorMessage = 'An error has occurred while adding Clinic';
      if (err?.data?.error?.details?.length > 0) {
        errorMessage = err.data.error.details
          .map((detail) => detail.message)
          .join(', ');
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      }
      showErrorToast(errorMessage);
    }
  };

  // Access the 'data' property from responseData
  const users = responseData?.data || [];

  // Ensure that `users` is an array
  const userOptions = Array.isArray(users)
    ? users.map((user) => ({
        value: user.id, // Assuming 'id' is the unique identifier for each user
        label: user.username, // Displaying username in the dropdown
      }))
    : [];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl p-6">
        <BreadcrumbNav
          pageName="Add Clinic"
          pageNameprev="Clinics"
          pagePrevPath="/clinics"
        />
        <div className="gap-8">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-md text-black dark:text-white">
                Clinic Information
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                <section className="mb-8">
                  <h4 className="font-semibold text-lg text-black dark:text-white mb-4">
                    Clinic Information
                  </h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Clinic ID
                      </label>
                      <input
                        type="text"
                        value={formValues.clinicId || 'N/A'}
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        User ID
                      </label>
                      <input
                        type="text"
                        value={formValues.cms_UsersId || ''}
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formValues.name || ''}
                        onChange={(e) =>
                          setFormValues({ ...formValues, name: e.target.value })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                  </div>
                </section>
                <section className="mb-8">
                  <h4 className="font-semibold text-lg text-black dark:text-white mb-4">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formValues.address || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            address: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formValues.city || ''}
                        onChange={(e) =>
                          setFormValues({ ...formValues, city: e.target.value })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={formValues.state || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            state: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        value={formValues.zipCode || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formValues.country || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            country: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={formValues.phone || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            phone: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Cell
                      </label>
                      <input
                        type="text"
                        value={formValues.cell || ''}
                        onChange={(e) =>
                          setFormValues({ ...formValues, cell: e.target.value })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Fax No
                      </label>
                      <input
                        type="text"
                        value={formValues.faxNo || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            faxNo: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Email
                      </label>
                      <input
                        type="text"
                        value={formValues.email || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            email: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        URL
                      </label>
                      <input
                        type="text"
                        value={formValues.url || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            url: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                      />
                    </div>
                  </div>
                </section>
                <section className="mb-8">
                  <h4 className="font-semibold text-lg text-black dark:text-white mb-4">
                    Documents
                  </h4>
                  <div className="mb-4">
                    <label className="block text-md font-medium text-black dark:text-white mb-2">
                      Clinic License
                    </label>
                    <UploadWidget setFileUrl={setClinicLicenceUrl} />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload the clinic's license here.
                    </p>
                  </div>
                </section>
                <section className="mb-8">
                  <h4 className="font-semibold text-lg text-black dark:text-white mb-4">
                    Assign Employee
                  </h4>
                  <Select
                    options={userOptions}
                    onChange={handleSelectChange}
                    styles={customStyles}
                    isLoading={usersLoading}
                    placeholder="Select Employee"
                    value={
                      userOptions.find(
                        (option) =>
                          option.value === formValues.assignedEmployee,
                      ) || null
                    }
                  />
                </section>
                <div className="flex justify-end">
                  <LoadingButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Saving..."
                    color="primary"
                  >
                    Save Clinic
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClinicAddForm;
