import { IListItems } from '../listOperations/IListItems';
import { ICustomSrsApplicationProps } from '../ICustomSrsApplicationProps';

export interface ISrsLessonSessionProps {
    globalProps: ICustomSrsApplicationProps;
    sessionItemsTotalCount: number;
    sessionLessonItems: IListItems[];
    srsStages: {};
}