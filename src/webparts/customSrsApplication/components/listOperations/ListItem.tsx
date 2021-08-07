import React from 'react';
import styles from './ListItems.module.scss';
import { IListItemProps } from './IListItemProps';

//////////////////////////////
// ANCHOR Class - ListItem
// Display for the individual list items.
//////////////////////////////
export default class ListItem extends React.Component<IListItemProps> {
    public constructor (props: IListItemProps) {
        super(props);
    }

    public render(): React.ReactElement<IListItemProps> {
        return  <div className={ styles.itemRow }>
                    <span className={ styles.itemDescription }>{ this.props.item.Item }</span>
                    <span className={ styles.readingDescription }>{ this.props.item.Readings }</span>
                    <span className={ styles.meaningDescription }>{ this.props.item.Meanings }</span>
                </div>;
    }
}