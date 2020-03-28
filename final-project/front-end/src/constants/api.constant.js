import secret from '../config/secret';

export const API = {
  User: {
    login: `${secret.API_URL}/users/login`,
    changePassword: `${secret.API_URL}/users/change-password`
  },
  Manager: {
    StaffManagement: {
      getListStaffs: `${secret.API_URL}/users`,
      addStaff:`${secret.API_URL}/users`,
      updateStaffProfile: `${secret.API_URL}/users/{updatedUserID}`,
      removeStaff: `${secret.API_URL}/users/{deletedUserID}`
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
  }
}