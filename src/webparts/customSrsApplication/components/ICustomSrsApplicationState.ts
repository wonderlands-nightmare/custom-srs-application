import { IListItems } from './listOperations/IListItems';

export interface ICustomSrsApplicationState {
  status: string;
  allItems: IListItems[];
  lessonItems: IListItems[];
  reviewItems: IListItems[];
  addNewItemMessage: string;
  addNewItemName: string;
  addNewItemReadings: string;
  addNewItemMeanings: string;
  showDialog: boolean;
  showDialogName: string;
}