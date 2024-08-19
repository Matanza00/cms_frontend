import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import { addMaintenanceTeamSchema } from '../../utils/schemas';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useGetUserByRoleIdQuery } from '../../services/usersSlice';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import {
  useGetOneMaintenanceTeamQuery,
  useUpdateMaintenanceTeamMutation,
} from '../../services/maintenanceTeamSlice';
import { stationOptions } from '../../constants/Data';
import { customStyles } from '../../constants/Styles';
import Loader from '../../common/Loader';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const EditTeam = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const [formValues, setFormValues] = useState({ ...addMaintenanceTeamSchema });

  const [selectedVehiclesCount, setSelectedVehiclesCount] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const [updateMaintenanceTeam, { isLoading }] =
    useUpdateMaintenanceTeamMutation();
  const [isStationSelected, setIsStationSelected] = useState(false);

  const { data: teamData, isLoading: isTeamLoading } =
    useGetOneMaintenanceTeamQuery(teamId);

  useEffect(() => {
    if (teamData) {
      const team = teamData.data;
      setFormValues({
        station: team.station,
        mto: team.mto.id,
        serviceManager: team.serviceManager.id,
        vehicleId: team.teamVehicles.map((vehicle) => vehicle.vehicleId),
        companyId: team.companyId,
      });
      setSelectedVehiclesCount(team.teamVehicles.length);
      setIsStationSelected(true);
    }
  }, [teamData]);

  const { data: serviceManager, isLoading: serviceManagerLoading } =
    useGetUserByRoleIdQuery({
      station: formValues?.station,
      roleId: 70,
    });

  const managerLoadOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    if (serviceManager) {
      const filteredOptions = serviceManager.data
        .filter((serviceManager) =>
          serviceManager.username
            .toLowerCase()
            .includes(inputValue.toLowerCase()),
        )
        .map((serviceManager) => ({
          value: serviceManager.id,
          label: `${serviceManager.employeeId}-${serviceManager.username}`,
        }));
      callback(filteredOptions);
    }
  };

  const { data: mto, isLoading: mtoLoading } = useGetUserByRoleIdQuery({
    roleId: 71,
    station: formValues.station,
  });

  const mtoLoadOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    if (mto) {
      const filteredOptions = mto.data
        .filter((mto) =>
          mto.username.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .map((mto) => ({
          value: mto.id,
          label: `${mto.employeeId}-${mto.username}`,
        }));
      callback(filteredOptions);
    }
  };

  const { data: vehicles, isLoading: vehicleLoading } =
    useGetVehicleByCompanyIdQuery({
      companyId: user?.companyId,
      station: formValues?.station,
    });

  const handleChange = (selectedOption, name) => {
    if (name === 'station') {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: selectedOption.value,
        serviceManager: null,
        mto: null,
        vehicleId: [],
      }));
      setSelectedVehiclesCount(0);
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: selectedOption.value,
      }));
    }
  };

  const handleSelectChange = (fieldName, selectedOption) => {
    setFormValues((prevState) => ({
      ...prevState,
      [fieldName]: selectedOption?.value,
    }));
  };

  const handleVehicleCheckboxChange = (e, vehicleId) => {
    const checked = e.target.checked;

    setFormValues((prevState) => {
      const updatedVehicleIds = checked
        ? [...(prevState.vehicleId || []), vehicleId]
        : prevState.vehicleId.filter((id) => id !== vehicleId);

      setSelectedVehiclesCount(updatedVehicleIds.length);

      return {
        ...prevState,
        vehicleId: updatedVehicleIds,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...formValues,
      companyId: parseInt(user?.companyId),
    };

    try {
      await updateMaintenanceTeam({ teamId, ...formData }).unwrap();
      showSuccessToast('Service Manager and MTO updated successfully!');
      navigate(-1);
    } catch (err) {
      let errorMessage = 'An error has occurred while updating the team';
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

  if (isTeamLoading || isLoading) return <Loader />;
  if (!teamData) return <div>Error loading team data.</div>;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Edit Team Details"
          pageNameprev="Maintenance Teams" //show the name on top heading
          pagePrevPath="daily-maintenance/maintenance-team" // add the previous path to the navigation
        />
        <div className="gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-md text-black dark:text-white">
                  Edit Service Manager and MTO for the team
                </h3>
              </div>
              <div className="p-7">
                <form action="#" onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="station"
                      >
                        Station
                      </label>
                      <div className="relative">
                        <Select
                          styles={customStyles}
                          options={stationOptions}
                          className="mb-3 w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          name="station"
                          id="station"
                          onChange={(selectedOption) =>
                            handleChange(selectedOption, 'station')
                          }
                          value={
                            formValues.station
                              ? {
                                  value: formValues.station,
                                  label: formValues.station,
                                }
                              : null
                          }
                          placeholder="Select Station"
                        />
                      </div>
                    </div>
                  </div>

                  {isStationSelected && (
                    <>
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-md font-medium text-black dark:text-white"
                            htmlFor=""
                          >
                            Select Service Manager
                          </label>
                          <div className="relative">
                            <AsyncSelect
                              styles={customStyles}
                              loadOptions={managerLoadOptions}
                              className="mb-3 w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              value={
                                serviceManager && formValues.serviceManager
                                  ? {
                                      value: formValues.serviceManager,
                                      label:
                                        serviceManager.data.find(
                                          (serviceManager) =>
                                            serviceManager.id ===
                                            formValues.serviceManager,
                                        )?.username || '',
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleSelectChange(
                                  'serviceManager',
                                  selectedOption,
                                )
                              }
                              isLoading={serviceManagerLoading}
                              isDisabled={
                                !isStationSelected || serviceManagerLoading
                              }
                              placeholder="Select a Service Manager..."
                              isClearable
                              onFocus={() => {
                                if (!isStationSelected) {
                                  alert('Please select a station first.');
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-md font-medium text-black dark:text-white"
                            htmlFor=""
                          >
                            Select MTO
                          </label>
                          <div className="relative">
                            <AsyncSelect
                              styles={customStyles}
                              loadOptions={mtoLoadOptions}
                              className="mb-3 w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              value={
                                mto && formValues.mto
                                  ? {
                                      value: formValues.mto,
                                      label:
                                        mto.data.find(
                                          (mto) => mto.id === formValues.mto,
                                        )?.username || '',
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleSelectChange('mto', selectedOption)
                              }
                              isLoading={mtoLoading}
                              isDisabled={!isStationSelected || mtoLoading}
                              placeholder="Select an MTO..."
                              isClearable
                              onFocus={() => {
                                if (!isStationSelected) {
                                  alert('Please select a station first.');
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-5.5">
                        <label className="mb-3 block text-md font-medium text-black dark:text-white">
                          Select Vehicles (Selected {selectedVehiclesCount} out
                          of {vehicles?.data?.length})
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {vehicles?.data?.map((vehicle) => (
                            <label
                              key={vehicle.id}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4"
                                value={vehicle.registrationNo}
                                onChange={(e) =>
                                  handleVehicleCheckboxChange(
                                    e,
                                    vehicle.registrationNo,
                                  )
                                }
                                checked={
                                  formValues.vehicleId?.includes(
                                    vehicle.registrationNo,
                                  ) || false
                                }
                              />
                              <span className="text-black dark:text-white">
                                {vehicle.registrationNo}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mr-5">
                    <div className="flex justify-end gap-4.5">
                      <button
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white"
                        type="button"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                      {isLoading ? (
                        <LoadingButton
                          btnText="Updating..."
                          isLoading={isLoading}
                        />
                      ) : (
                        <button
                          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditTeam;
