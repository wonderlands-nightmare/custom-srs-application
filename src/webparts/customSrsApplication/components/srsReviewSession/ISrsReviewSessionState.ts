import { IListItems } from '../listOperations/IListItems';

export interface ISrsReviewSessionState {
  sessionReviewItems: IListItems[];
  sessionReviewType: string;
  readingSessionReviewType: string;
  reviewItemNumber: number;
  reviewItemAnswered: boolean;
}