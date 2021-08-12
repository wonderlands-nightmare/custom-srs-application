import { IListItems } from '../listOperations/IListItems';
import { ICustomSrsApplicationProps } from '../ICustomSrsApplicationProps';

export interface ISrsReviewSessionProps {
    globalProps: ICustomSrsApplicationProps;
    sessionItemsTotalCount: number;
    sessionReviewItems: IListItems[];
    srsStages: {};
}