import secret from '../config/secret';

export const API = {
  User: {
    login: `${secret.API_URL}/users/login`
  },
  Manager: {
    getWorkSchedules: `${secret.API_URL}/work-schedules`
  }
}