import React from 'react';
import jQuery from 'jquery';

import styles from './SrsReviewSession.module.scss';

import { updateItem } from '../listOperations/ListOperations';

import { ISrsReviewSessionProps } from './ISrsReviewSessionProps';
import { ISrsReviewSessionState } from './ISrsReviewSessionState';

//////////////////////////////
// ANCHOR Class - SrsSession
// Primary logic and display for the review session.
//////////////////////////////
export default class SrsReviewSession extends React.Component<ISrsReviewSessionProps, ISrsReviewSessionState> {
  public constructor(props: ISrsReviewSessionProps, state: ISrsReviewSessionState) {
    super(props);

    this.state = {
      sessionReviewItems: this.props.sessionReviewItems.map((item) => {
        item.MeaningsCorrect = false;
        item.ReadingsCorrect = false;
        item.MeaningsCorrectCount = 0;
        item.ReadingsCorrectCount = 0;
        return item;
      }),
      sessionReviewType: '',
      reviewItemNumber: 0,
      reviewItemAnswered: false
    };
  }


  public render(): React.ReactElement<ISrsReviewSessionProps> {    
    const itemsToReview = this.state.sessionReviewItems.length > 0;
    let reviewItem;
    let itemSessionReviewType = "";
    let answerStateItem = "";
    let answerState = "";

    if (itemsToReview) {
      // Initialise variables.
      reviewItem = this.state.sessionReviewItems[this.state.reviewItemNumber];
      itemSessionReviewType = this.state.sessionReviewType;

      if (itemSessionReviewType == '' || !this.state.reviewItemAnswered) {
        if (!reviewItem.MeaningsCorrect && !reviewItem.ReadingsCorrect) {
          itemSessionReviewType = Math.random() < 0.5 ? 'Meanings' : 'Readings';
        }
        else if (reviewItem.MeaningsCorrect && !reviewItem.ReadingsCorrect) {
          itemSessionReviewType = 'Readings';
        }
        else if (!reviewItem.MeaningsCorrect && reviewItem.ReadingsCorrect) {
          itemSessionReviewType = 'Meanings';
        }
        else if (reviewItem.MeaningsCorrect && reviewItem.ReadingsCorrect) {
          itemSessionReviewType = 'Done';
        }
      }
      
      answerStateItem = `${ itemSessionReviewType }Correct`;

      answerState = answerStateItem == 'Done'
                      ? 'Done'
                      : reviewItem[answerStateItem]
                        ? 'Right!' : 'Wrong!';

    }

    // Display for the session.
    return (
        <section className={ styles.srsReviewSession }>
          { itemsToReview
            ? (
              <div className={ styles.container }>
                <div className={ styles.row }>
                  <span className={ styles.itemDescription }>{ reviewItem.Item }</span>
                  <span className={ styles.reviewTypeDescription }>{ itemSessionReviewType }</span>
                  <input id="answerBox" type="text" name={ answerStateItem } autoComplete="off" onKeyPress={ (event) => { 
                    if (event.key == 'Enter') {
                      this.checkAnswer(event, reviewItem, itemSessionReviewType);
                    }
                  } }/>
                </div>
              </div>
            )
            : (
              <div className={ styles.container }>Nothing to review!</div>
            )
          }
        </section>
    );
  }

  //////////////////////////////
  // ANCHOR Function - checkAnswer
  // Logic for checking if the review answer is correct or not, and handling updates on completion.
  //////////////////////////////
  private checkAnswer(event, reviewItem, sessionReviewType) {
    const itemReviewCorrect = reviewItem.MeaningsCorrect && reviewItem.ReadingsCorrect;

    if (!this.state.reviewItemAnswered) {
      const givenAnswerValue = event.target.value.toLocaleLowerCase();
      const correctAnswerValue = reviewItem[sessionReviewType].toLocaleLowerCase().split(", ");
      const answerType = event.target.name;
      const answerTypeCount = `${ answerType }Count`;

      // Check if answer is correct or not and handle state for answer.
      const correct = correctAnswerValue.includes(givenAnswerValue);

      // Update review item object with appropriate values.
      reviewItem[answerType] = correct;
      reviewItem[answerTypeCount] = correct ? reviewItem[answerTypeCount] : reviewItem[answerTypeCount] + 1;

      // Doesn't use itemReviewCorrect because the full meaning/reading correct update happens in this part of if/else.
      reviewItem.SRSStage = (reviewItem.MeaningsCorrect && reviewItem.ReadingsCorrect)
                          ? this.newSrsStage(reviewItem)
                          : reviewItem.SRSStage;

      let newNextReviewTime = new Date();
      newNextReviewTime.setHours(newNextReviewTime.getHours() + this.props.srsStages[reviewItem.SRSStage].srsStageReviewIncrement, 0, 0, 50);
      let newNextReviewTimeISO = newNextReviewTime.toISOString();
      reviewItem.Nextreviewtime = newNextReviewTimeISO;

      this.setState((prevState) => ({
        ...this.state,
        reviewItemAnswered: true,
        sessionReviewType: sessionReviewType,
        sessionReviewItems: prevState.sessionReviewItems
          .map((sessionItem) => {
            if (sessionItem.ID == reviewItem.ID) {
              sessionItem = reviewItem;
            }

            return sessionItem;
          })
      }));

      jQuery('#answerBox').addClass(correct ? styles.correct : styles.incorrect);
    }
    // If the item was answered after enter key is pressed.
    else if (this.state.reviewItemAnswered) {
      // If the review item readings and meanings have been answered right then remove them from the session review list.
      const newSessionReviewItems = itemReviewCorrect
                          ? this.state.sessionReviewItems.filter((sessionItem) => sessionItem.ID != reviewItem.ID)
                          : this.state.sessionReviewItems;

      // If there are still items left to review.
      if (newSessionReviewItems.length >= 0) {  
        this.setState({
          ...this.state,
          reviewItemAnswered: false,
          reviewItemNumber: Math.floor(Math.random() * newSessionReviewItems.length),
          sessionReviewItems: newSessionReviewItems
        });

        jQuery('#answerBox').val('').removeClass();
      }
    }

    // Update item in list if both answers are correct.
    if (itemReviewCorrect) {
      updateItem(this.props.globalProps.itemsList, reviewItem, this.props.globalProps);
    }
  }

  //////////////////////////////
  // ANCHOR Function - newSrsStage
  // Separate logic to calculate the new SRS stage value.
  //////////////////////////////
  private newSrsStage(reviewItem) {
    // Get the number of wrong answers overall, divide by 4 and round up to get the number of SRS stages to reduce by.
    let srsNegativeCount = Math.ceil((reviewItem.MeaningsCorrectCount + reviewItem.ReadingsCorrectCount) / 4);
    // Harsher penalty for Master (7) and Enlightened (8) SRS stages, double the reduction number.
    srsNegativeCount = (reviewItem.SRSStage > 6) ? srsNegativeCount * 2 : srsNegativeCount;

    return  (srsNegativeCount > 0)
            // If SRS stage already at the start or the reduction takes it lower than Apprentice 1 (1)...
            ? ((reviewItem.SRSStage <= 1) || (reviewItem.SRSStage - srsNegativeCount <= 1))
              // Return Apprentice 1 (1).
              ? 1
              // Otherwise reduce SRS stage by negative count (e.g. currently at 5, failed 5 times, reduce by 2).
              : reviewItem.SRSStage - srsNegativeCount
            // Increase SRS stage by one if no wrong answers given.
            : reviewItem.SRSStage + 1;
  }


  //////////////////////////////
  // ANCHOR Function - updateSessionItem
  // Separate logic to handle the data to pass to the update list API.
  //////////////////////////////
  private updateSessionItem() {
    //
  }
}