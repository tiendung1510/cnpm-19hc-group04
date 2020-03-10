import { APP_LOADING } from './types';

export const isAppLoading = (isLoading) => ({ type: APP_LOADING, isLoading });