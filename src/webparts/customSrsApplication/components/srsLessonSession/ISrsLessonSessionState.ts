import { IListItems } from '../listOperations/IListItems';

export interface ISrsLessonSessionState {
  sessionLessonItems: IListItems[];
  lessonItemNumber: number;
  lessonItemCount: number;
  isReview: boolean;
}