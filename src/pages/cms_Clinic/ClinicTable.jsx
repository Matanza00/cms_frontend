import React, { useRef, useState, useEffect } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllClinicsQuery,
  useDeleteClinicMutation,
} from '../../services/clinicSlice';
import DeleteModal from '../../components/DeleteModal';
import Loader from '../../common/Loader';
import PaginationComponent from '../../components/Pagination/Pagination';

const ClinicTable = ({ searchTerm, setSortedDataIndex }) => {
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [DeleteClinic] = useDeleteClinicMutation();
  const [deleteId, setDeleteId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const tableRef = useRef(null);

  const {
    data,
    isError,
    error,
    isLoading: isClinicLoading,
    refetch,
  } = useGetAllClinicsQuery({
    companyId: user?.companyId,
    page,
    limit,
    searchTerm,
    sortBy,
    sortOrder,
    station: user?.station,
  });

  useEffect(() => {
    setPage(1);
    refetch();
  }, [searchTerm, sortBy, sortOrder, user?.companyId]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  let [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    let d = data?.data.slice().sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] < b[sortBy] ? -1 : 1;
      } else {
        return a[sortBy] > b[sortBy] ? -1 : 1;
      }
    });

    setSortedData(d);
    setSortedDataIndex(d);
  }, [data, sortBy, sortOrder]);

  if (isClinicLoading) return <Loader />;
  if (isError) return <div>Error occurred while fetching Clinics.</div>;
  if (!sortedData?.length)
    return (
      <div>
        <center>
          <h4 className="font-semibold">No Clinics Found!</h4>
        </center>
      </div>
    );

  return (
    <>
      <div
        id="table-container"
        className="h-[570px] rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <div className="max-w-full overflow-x-auto h-[530px] overflow-y-auto">
          <table ref={tableRef} className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('clinicId')}
                >
                  <span className="flex items-center">
                    Clinic ID{' '}
                    <span className="ml-1">
                      {sortBy === 'clinicId' ? (
                        sortOrder === 'asc' ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </span>
                  </span>
                </th>
                <th
                  className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('address')}
                >
                  <span className="flex items-center">
                    Address{' '}
                    <span className="ml-1">
                      {sortBy === 'address' ? (
                        sortOrder === 'asc' ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </span>
                  </span>
                </th>
                <th
                  className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('phone')}
                >
                  <span className="flex items-center">
                    Phone{' '}
                    <span className="ml-1">
                      {sortBy === 'phone' ? (
                        sortOrder === 'asc' ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </span>
                  </span>
                </th>
                <th
                  className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('assignedEmployee')}
                >
                  <span className="flex items-center">
                    Assigned Employee{' '}
                    <span className="ml-1">
                      {sortBy === 'assignedEmployee' ? (
                        sortOrder === 'asc' ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </span>
                  </span>
                </th>
                <th
                  className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <span className="flex items-center">
                    Created At{' '}
                    <span className="ml-1">
                      {sortBy === 'createdAt' ? (
                        sortOrder === 'asc' ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </span>
                  </span>
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-center text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((e, i) => (
                <tr key={i}>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.id}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.address}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.phone}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.assignedEmployee}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {new Date(e?.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                      <button
                        onClick={() => navigate(`view/${e?.id}`)}
                        className="hover:text-primary"
                      >
                        View
                      </button>
                      {/* Other action buttons */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationComponent
        isLoading={isClinicLoading}
        isError={isError}
        data={data}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};

export default ClinicTable;
