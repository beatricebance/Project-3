import { STATUS } from '../constants/status';

export interface StatusServiceInterface {
  updateStatus(userId: string, status: STATUS): void;

  setOffline(userId: string): void;
}
