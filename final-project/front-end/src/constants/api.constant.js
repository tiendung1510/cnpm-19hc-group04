import secret from '../config/secret';

export const API = {
  User: {
    login: `${secret.API_URL}/users/login`,
    changePassword: `${secret.API_URL}/users/change-password`
  },
  Cashier: {
    Checkout: {
      getCheckoutSessions: `${secret.API_URL}/checkout-sessions`,
      createCheckoutSession: `${secret.API_URL}/checkout-sessions`,
      cancelCheckoutSession: `${secret.API_URL}/checkout-sessions/{checkoutSessionID}`,
      submitCheckoutSession: `${secret.API_URL}/checkout-sessions/{checkoutSessionID}`,

      createImportingRequest: `${secret.API_URL}/importing-requests`,
      getImportingRequests: `${secret.API_URL}/users/importing-requests`
    }
  },
  Manager: {
    Reporting: {
      getProducts: `${secret.API_URL}/products?page={page}&limit={limit}&soldStartDate={soldStartDate}&soldEndDate={soldEndDate}`
    },
    ImportingRequestManagement: {
      getImportingRequest: `${secret.API_URL}/importing-requests`,
      acceptImportingRequests: `${secret.API_URL}/importing-requests`,
      cancelImportingRequest: `${secret.API_URL}/importing-requests/{importingRequestID}`,

      getImporterAssignments: `${secret.API_URL}/importer-assignments`,
    },
    StaffManagement: {
      getListStaffs: `${secret.API_URL}/users`,
      addStaff: `${secret.API_URL}/users`,
      updateStaffProfile: `${secret.API_URL}/users/{updatedUserID}`,
      removeStaff: `${secret.API_URL}/users/{deletedUserID}`
    },
    SupplierManagment: {
      getSuppliers: `${secret.API_URL}/suppliers`,
      addSupplier: `${secret.API_URL}/suppliers`,
      removeSupplier: `${secret.API_URL}/suppliers/{supplierID}`,
      updateSupplier: `${secret.API_URL}/suppliers/{supplierID}`
    },
    WorkSchedule: {
      getWorkSchedules: `${secret.API_URL}/work-schedules`,
      addWorkSchedule: `${secret.API_URL}/work-schedules`,
      removeWorkSchedule: `${secret.API_URL}/work-schedules/{workScheduleID}`
    },
    WorkShift: {
      addWorkShift: `${secret.API_URL}/work-shifts`,
      removeWorkShift: `${secret.API_URL}/work-shifts/{workShiftID}`
    },
    WorkAssignment: {
      addWorkAssignments: `${secret.API_URL}/work-assignments`,
      removeWorkAssignment: `${secret.API_URL}/work-assignments/{workAssignmentID}`
    }
  },
  Importer: {
    ProductManagement: {
      addCategory: `${secret.API_URL}/categories`,
      getCategories: `${secret.API_URL}/categories`,
      getCategoryProducts: `${secret.API_URL}/categories/{categoryID}/products`,
      updateCategory: `${secret.API_URL}/categories/{categoryID}`,
      removeCategory: `${secret.API_URL}/categories/{categoryID}`,

      getSuppliers: `${secret.API_URL}/suppliers`,
      addSupplier: `${secret.API_URL}/suppliers`,
      removeSupplier: `${secret.API_URL}/suppliers/{supplierID}`,
      updateSupplier: `${secret.API_URL}/suppliers/{supplierID}`,

      addProduct: `${secret.API_URL}/products`,
      updateProduct: `${secret.API_URL}/products/{productID}`,
      removeProduct: `${secret.API_URL}/products/{productID}`,

      getProductActionLogs: `${secret.API_URL}/product-action-logs`
    },
    ImporterAssignmentManagement: {
      getImporterAssignments: `${secret.API_URL}/users/importer-assignments`
    }
  }
}