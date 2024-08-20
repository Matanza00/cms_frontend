import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetClinicQuery } from '../../services/clinicSlice'; // Adjust the path as needed
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useGetAllUsersInfoQuery } from '../../services/usersSlice'; // Import the query hook

const ClinicView = () => {
  const { id } = useParams();
  const { data, error } = useGetClinicQuery(id);
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersInfoQuery(); // Fetch all users

  if (error) return <div>Error fetching clinic data: {error.message}</div>;
  if (usersError)
    return <div>Error fetching users data: {usersError.message}</div>;
  if (!data) return <div>Loading clinic data...</div>;
  if (usersLoading) return <div>Loading users data...</div>;

  // Debugging output
  console.log('Clinic Data:', data);
  console.log('Users Data:', usersData);

  // Create userMap from usersData
  const userMap = new Map(
    Array.isArray(usersData?.data)
      ? usersData.data.map((user) => [user.id, user.username])
      : [],
  );

  // Debugging output
  console.log('User Map:', userMap);

  // Get the username for the assigned employee
  const assignedEmployeeId = data?.data?.assignedEmployee;
  const assignedEmployeeUsername =
    assignedEmployeeId !== undefined
      ? userMap.get(assignedEmployeeId) || 'Not Assigned'
      : 'Not Assigned';

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <Breadcrumb
          pageName="View Clinic"
          pageNameprev="Clinics" // Show the name on top heading
          pagePrevPath="clinics" // Add the previous path to the navigation
        />
        <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <div className="flex justify-between items-end p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Clinic Details</h2>
          </div>
          <div className="flex justify-between">
            <div className="ml-3 w-[70%] justify-start p-5 bg-brand-primary">
              <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <p className="text-md font-semibold">Clinic ID:</p>
                    <p className="text-md mb-5 font-normal">{data?.data?.id}</p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Clinic Name:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Address:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">City:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">State:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Country:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Assigned Employee:</p>
                    <p className="text-md mb-5 font-normal">
                      {assignedEmployeeUsername}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">License:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.license}
                      <button
                        className="mb-5 w-13 cursor-pointer bg-slate-300 text-white rounded-md hover:bg-slate-400 focus:outline-none"
                        onClick={() =>
                          document.getElementById('license_modal').showModal()
                        }
                      >
                        View
                      </button>
                      <dialog
                        id="license_modal"
                        className="modal justify-center"
                      >
                        <div className="modal-box max-h-[900px] max-w-[700px]">
                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                          <div className="overflow-x-auto scroll-auto">
                            <img
                              src={data?.data?.license} // Update with actual license image URL
                              alt="License"
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </dialog>
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">
                      Medical Certificate:
                    </p>
                    <p className="text-md mb-5 font-normal">
                      <button
                        className="mb-5 w-13 cursor-pointer bg-slate-300 text-white rounded-md hover:bg-slate-400 focus:outline-none"
                        onClick={() =>
                          document
                            .getElementById('medical_certificate_modal')
                            .showModal()
                        }
                      >
                        View
                      </button>
                      <dialog
                        id="medical_certificate_modal"
                        className="modal justify-center"
                      >
                        <div className="modal-box max-h-[900px] max-w-[700px]">
                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                          <div className="overflow-x-auto scroll-auto">
                            <img
                              src={data?.data?.medicalCertificate} // Update with actual medical certificate image URL
                              alt="Medical Certificate"
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </dialog>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[30%] justify-end hidden md:block">
              <div className="mt-7 ml-10 mr-15 w-80 h-45 border rounded-lg border-gray-300 justify-end">
                <img
                  src={data?.data?.license} // Update with actual license image URL
                  alt="License"
                  className="mb-5"
                  style={{ maxWidth: '100%', maxHeight: '80vh' }}
                />
              </div>
              <div className="ml-10 mr-15 mt-5 w-80 h-45 border rounded-lg border-gray-300 justify-end">
                <img
                  src={data?.data?.medicalCertificate} // Update with actual medical certificate image URL
                  alt="Medical Certificate"
                  className="mb-5"
                  style={{ maxWidth: '100%', maxHeight: '80vh' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClinicView;
