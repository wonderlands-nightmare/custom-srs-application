import { IListItems } from '../listOperations/IListItems';

export interface ISrsReviewSessionState {
  sessionReviewItems: IListItems[];
  sessionReviewType: string;
  reviewItemNumber: number;
  reviewItemAnswered: boolean;
}