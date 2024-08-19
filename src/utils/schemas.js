export const loginSchema = {
  email: '',
  password: '',
};

export const addCompanySchema = {
  email: '',
  name: '',
  address: '',
  logo: '',
  noOfUsers: '',
  subscriptionPlanId: '',
  isActive: true,
};
export let addCompanyAdminSchema = {
  email: '',
  phone: '',
  username: '',
  companyId: '',
};

export const addManagerSchema = {
  employeeId: '',
  name: '',
  joiningDate: '',
  companyId: '',
  cnic: '',
  isActive: true,
};

export const addRoleSchema = {
  roleName: '',
  companyId: '',
};

export const addCmsUserSchema = {
  email: '',
  employeeId: '',
  phone: '',
  username: '',
  roleId: '',
  companyId: '',
  clinicId: '',
  providerId: '',
  isActive: true,
  isCompanyAdmin: false,
};

export const addClinicSchema = {
  clinicId: '',
  companyId: '',
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
  contactName: '',
  contactCell: '',
  contactAddr: '',
  contactEmail: '',
  contactPager: '',
};

export const addProviderSchema = {
  prefix: '',
  firstname: '',
  middlename: '',
  lastname: '',
  speciality: '',
  secretary: '',
  isFax: false,
  addSign: false,
  cpl: '',
  rpl: '',
  contactName: '',
  contactPhone: '',
  contactCell: '',
  contactAddress: '',
  contactEmail: '',
  contactPager: '',
  companyId: '',
};

export const addManagerAssignmentSchema = {
  clinicId: '',
  managerId: '',
  companyId: '',
};

export const addFileSchema = {
  fileName: '',
  fileUrl: '',
  fileDuration: '',
  cmsUserId: '',
};

export const addFileAssignmentSchema = {
  clinicId: '',
  companyId: '',
  cmsUserId: '',
  fileId: '',
};

export const addFieldPermissionSchema = {
  fieldName: '',
  roleId: '',
};

export const addEmployeeSchema = {
  name: '',
  position: '',
  salary: '',
  companyId: '',
};

export const respondRequestSchema = {
  status: '',
};
