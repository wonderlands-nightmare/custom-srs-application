import { IListItems } from '../listOperations/IListItems';
import { ICustomSrsApplicationProps } from '../ICustomSrsApplicationProps';

export interface INextReviewsProps {
    globalProps: ICustomSrsApplicationProps;
    nextReviewsItems: IListItems[];
}