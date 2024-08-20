import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  useGetClinicQuery,
  useUpdateClinicMutation,
} from '../../services/clinicSlice';
import { useGetCompanyEmployeesQuery } from '../../services/employeeSlice';
import Select from 'react-select';
import UploadWidget from '../../components/UploadWidget';
import LoadingButton from '../../components/LoadingButton';
import { stationOptions, licenseOptions } from '../../constants/Data';
import { customStyles } from '../../constants/Styles';
import useToast from '../../hooks/useToast';

const ClinicUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const { data: clinicData, isLoading: clinicLoading } = useGetClinicQuery(id);
  const { data: employees, isLoading: employeesLoading } =
    useGetCompanyEmployeesQuery();
  const [updateClinic, { isLoading: updateLoading }] =
    useUpdateClinicMutation();
  const [formValues, setFormValues] = useState({
    clinicId: '',
    companyId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    station: '',
    licenseType: '',
    cnic: '',
    license: '',
    medicalCertificate: '',
    assignedEmployee: '',
    name: '',
  });

  useEffect(() => {
    if (clinicData) {
      setFormValues(clinicData);
    }
  }, [clinicData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption, name) => {
    setFormValues({
      ...formValues,
      [name]: selectedOption ? selectedOption.value : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClinic(formValues).unwrap();
      showSuccessToast('Clinic updated successfully!');
      navigate('/clinics');
    } catch (error) {
      showErrorToast('Error updating clinic. Please try again.');
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Update Clinic</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formValues.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formValues.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formValues.state}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formValues.zipCode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formValues.country}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Station
              </label>
              <Select
                options={stationOptions}
                value={stationOptions.find(
                  (option) => option.value === formValues.station,
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, 'station')
                }
                className="mt-1"
                styles={customStyles}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                License Type
              </label>
              <Select
                options={licenseOptions}
                value={licenseOptions.find(
                  (option) => option.value === formValues.licenseType,
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, 'licenseType')
                }
                className="mt-1"
                styles={customStyles}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assigned Employee
              </label>
              <Select
                options={employees?.map((employee) => ({
                  value: employee.id,
                  label: `${employee.name} (${employee.erpNumber})`,
                }))}
                value={employees?.find(
                  (employee) => employee.id === formValues.assignedEmployee,
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, 'assignedEmployee')
                }
                className="mt-1"
                styles={customStyles}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                License
              </label>
              <UploadWidget
                setImgUrl={(url) =>
                  setFormValues({ ...formValues, license: url })
                }
                imgUrl={formValues.license}
                name="license"
                label="Upload License"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <LoadingButton
              loading={updateLoading}
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Update Clinic
            </LoadingButton>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default ClinicUpdateForm;
