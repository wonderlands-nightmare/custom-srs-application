import { IListItems } from '../listOperations/IListItems';
import { ICustomSrsApplicationProps } from '../ICustomSrsApplicationProps';

export interface ISrsLessonSessionProps {
    sessionLessonItems: IListItems[];
    globalProps: ICustomSrsApplicationProps;
    srsStages: {};
}