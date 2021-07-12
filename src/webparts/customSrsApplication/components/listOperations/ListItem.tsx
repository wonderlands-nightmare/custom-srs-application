import React from 'react';
import styles from '../CustomSrsApplication.module.scss';
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
        // console.log('listitemsprops', this.props);
        return  <div>
                    <span className={ styles.description }>{ this.props.item.ID }</span>
                    <span className={ styles.description }>{ this.props.item.Item }</span>
                    <span className={ styles.description }>{ this.props.item.Readings }</span>
                    <span className={ styles.description }>{ this.props.item.Meanings }</span>
                    <span className={ styles.description }>{ this.props.item.SRSStage }</span>
                    <span className={ styles.description }>{ this.props.item.NextReviewTime }</span>
                </div>;
    }
}