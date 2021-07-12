import { IListItems } from '../listOperations/IListItems';

export interface ISrsLessonSessionState {
  sessionReviewItems: IListItems[];
  sessionReviewType: string;
  reviewItemNumber: number;
  reviewItemAnswered: boolean;
}