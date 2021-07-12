import { IListItems } from '../listOperations/IListItems';
import { ICustomSrsApplicationProps } from '../ICustomSrsApplicationProps';

export interface ISrsLessonSessionProps {
    sessionReviewItems: IListItems[];
    globalProps: ICustomSrsApplicationProps;
    srsStages: {};
}