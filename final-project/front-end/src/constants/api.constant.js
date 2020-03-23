import secret from '../config/secret';

export const API = {
  User: {
    login: `${secret.API_URL}/users/login`
  },
  Manager: {
    StaffManagement: {
      getListStaffs: `${secret.API_URL}/users`
    },
    WorkSchedule: {
      getWorkSchedules: `${secret.API_URL}/work-schedules`,
      addWorkSchedule: `${secret.API_URL}/work-schedules`
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