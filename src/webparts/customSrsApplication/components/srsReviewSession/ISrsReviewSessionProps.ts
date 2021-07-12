import { IListItems } from '../listOperations/IListItems';
import { ICustomSrsApplicationProps } from '../ICustomSrsApplicationProps';

export interface ISrsReviewSessionProps {
    sessionReviewItems: IListItems[];
    globalProps: ICustomSrsApplicationProps;
    srsStages: {};
}