import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import { addClinicSchema } from '../../utils/schemas';
import Select from 'react-select';
import UploadWidget from '../../components/UploadWidget';
import {
  useAddClinicMutation,
  useGetAllClinicsWithoutPaginationQuery,
} from '../../services/clinicSlice';
import { useGetCompanyEmployeesQuery } from '../../services/employeeSlice';
import AsyncSelect from 'react-select/async';
import { stationOptions, licenseOptions } from '../../constants/Data';
import { customStyles } from '../../constants/Styles';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const ClinicAddForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { showErrorToast, showSuccessToast } = useToast();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formValues, setFormValues] = useState({ ...addClinicSchema });
  const { data: employees, isLoading: employeeLoading } =
    useGetCompanyEmployeesQuery(user?.companyId);
  const { data: clinics } = useGetAllClinicsWithoutPaginationQuery({
    companyId: user?.companyId,
    station: formValues?.station,
  });

  const [AddClinic, { isLoading, isError, error }] = useAddClinicMutation();

  const [clinicCnicUrl, setClinicCnicUrl] = useState('');
  const [clinicLicenceUrl, setClinicLicenceUrl] = useState('');
  const [clinicMedicalCertificateUrl, setClinicMedicalCertificateUrl] =
    useState('');

  useEffect(() => {
    setFormValues({
      ...formValues,
      cnic: clinicCnicUrl,
      license: clinicLicenceUrl,
      medicalCertificate: clinicMedicalCertificateUrl,
    });
  }, [clinicCnicUrl, clinicLicenceUrl, clinicMedicalCertificateUrl]);

  useEffect(() => {
    setFormValues({ ...formValues, companyId: user?.companyId });
  }, [user]);

  const loadOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    if (employees && employees.data) {
      const filteredOptions = employees.data
        .filter((employee) =>
          employee.name.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .map((employee) => ({
          value: employee.id,
          label: `${employee.erpNumber}-${employee.name}`,
        }));
      callback(filteredOptions);
    }
  };

  const handleChange = (selectedOption, name) => {
    setFormValues({
      ...formValues,
      [name]: selectedOption.value, // Update with the selected value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...formValues,
    };
    try {
      await AddClinic(formData).unwrap();
      showSuccessToast('Clinic Added Successfully!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      let errorMessage = 'An error has occurred while adding Clinic';
      if (err?.data?.error?.details.length > 0) {
        errorMessage = err?.data?.error?.details
          .map((detail) => detail.message)
          .join(', ');
      } else if (!!err?.data?.message) {
        errorMessage = err?.data?.message;
      }
      console.log('!!!', errorMessage);

      showErrorToast(errorMessage);
    }
  };

  const handleSelectChange = (selectedOption) => {
    console.log(selectedOption.label);
    if (selectedOption) {
      console.log('Selected option label:', selectedOption.label);
      setFormValues({
        ...formValues,
        name: selectedOption.label,
        employeeId: selectedOption.label?.split('-')[0],
      });
    } else {
      console.log('No option selected');
    }
  };

  console.log('object', formValues);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl p-6">
        <BreadcrumbNav
          pageName="Add Clinic"
          pageNameprev="Clinics"
          pagePrevPath="Clinics"
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
                    Account Information
                  </h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        System ID
                      </label>
                      <input
                        type="text"
                        value="101021" // Hardcoded value for System ID
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Account ID
                      </label>
                      <input
                        type="text"
                        value={formValues.accountId || ''}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            accountId: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 dark:border-strokedark dark:bg-meta-4"
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
                        Phone Number
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
                  </div>
                </section>

                <section className="mb-8">
                  <h4 className="font-semibold text-lg text-black dark:text-white mb-4">
                    Clinic Documents
                  </h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Clinic License
                      </label>
                      <UploadWidget
                        setImage={setClinicLicenceUrl}
                        image={clinicLicenceUrl}
                      />
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h4 className="font-semibold text-lg text-black dark:text-white mb-4">
                    Clinic Details
                  </h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Station
                      </label>
                      <Select
                        options={stationOptions}
                        styles={customStyles}
                        onChange={(e) =>
                          setFormValues({ ...formValues, station: e.value })
                        }
                        value={stationOptions.find(
                          (option) => option.value === formValues.station,
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        License Type
                      </label>
                      <Select
                        options={licenseOptions}
                        styles={customStyles}
                        onChange={(e) =>
                          setFormValues({ ...formValues, licenseType: e.value })
                        }
                        value={licenseOptions.find(
                          (option) => option.value === formValues.licenseType,
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-md font-medium text-black dark:text-white mb-2">
                        Assigned Employee
                      </label>
                      <AsyncSelect
                        cacheOptions
                        loadOptions={loadOptions}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption)
                        }
                        placeholder="Select an Employee"
                      />
                    </div>
                  </div>
                </section>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border rounded bg-gray-300 text-gray-800"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    isLoading={isLoading}
                    type="submit"
                    className="px-4 py-2 border rounded bg-blue-500 text-white"
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
