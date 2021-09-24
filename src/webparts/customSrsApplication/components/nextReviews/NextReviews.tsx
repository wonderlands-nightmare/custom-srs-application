import React from 'react';
import jQuery from 'jquery';

import styles from './NextReviews.module.scss';

import { IListItems } from '../listOperations/IListItems';

import { INextReviewsProps } from './INextReviewsProps';
import { INextReviewsState } from './INextReviewsState';


//////////////////////////////
// ANCHOR Class - SrsSession
// Primary logic and display for the review session.
//////////////////////////////
export default class NextReviews extends React.Component<INextReviewsProps, INextReviewsState> {
  public constructor(props: INextReviewsProps, state: INextReviewsState) {
    super(props);

    this.state = {
      nextReviewsItems: []
    };
  }


  public render(): React.ReactElement<INextReviewsProps> {
    // Initialise variables.
    const groupedNextReviewsItems = this.arrayGroupBy(this.props.nextReviewsItems, 'Nextreviewtime');

    jQuery.each(Object.keys(groupedNextReviewsItems), (index, itemKey) => {
      groupedNextReviewsItems[itemKey].dateStamp = itemKey;
    });

    let plusTwentyFourHours = new Date();
    plusTwentyFourHours.setHours(plusTwentyFourHours.getHours() + 24);

    let upcomingReviewsItems = [];
    jQuery.each(groupedNextReviewsItems, (index, item) => {
      if ((new Date(item.dateStamp) > new Date()) && (new Date(item.dateStamp) < new Date(plusTwentyFourHours.toISOString()))) {
        upcomingReviewsItems.push(item);
      }
    });
    upcomingReviewsItems = upcomingReviewsItems.sort((a, b) => new Date(a.dateStamp).valueOf() - new Date(b.dateStamp).valueOf());
    
    const upcomingReviewsList = upcomingReviewsItems.map((item) => {
      return <div className={ styles.itemBox }>
        <span className={ styles.itemTime }>{ new Date(item.dateStamp).toLocaleTimeString([], { hour: '2-digit' }) }hrs</span>
        <span className={ styles.itemCount }>{ item.length }</span>
      </div>;
    });

    // Display for the session.
    return (
      <div className={ styles.nextReviews }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <span className={ styles.mainHeader }>Upcoming items in the next 24hrs</span>
            <div className={ styles.itemsRow }>
              { upcomingReviewsList }
            </div>
          </div>
        </div>
      </div>
    );
  }


  //////////////////////////////
  // ANCHOR Function - arrayGroupBy
  // Create a grouped array using a provided object key.
  //////////////////////////////
  private arrayGroupBy(array, key) {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  }
}