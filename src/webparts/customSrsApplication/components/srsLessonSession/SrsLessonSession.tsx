import React from 'react';
import jQuery from 'jquery';

import styles from './SrsLessonSession.module.scss';

import { ISrsLessonSessionProps } from './ISrsLessonSessionProps';
import { ISrsLessonSessionState } from './ISrsLessonSessionState';

//////////////////////////////
// ANCHOR Class - SrsSession
// Primary logic and display for the review session.
//////////////////////////////
export default class SrsLessonSession extends React.Component<ISrsLessonSessionProps, ISrsLessonSessionState> {
  public constructor(props: ISrsLessonSessionProps, state: ISrsLessonSessionState) {
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
      reviewItemNumber: 1,
      reviewItemAnswered: false
    };
  }


  public render(): React.ReactElement<ISrsLessonSessionProps> {    
    // Initialise variables.
    let reviewItem = this.state.sessionReviewItems[this.state.reviewItemNumber];
    let itemSessionReviewType = this.state.sessionReviewType;

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
    
    let answerStateItem = `${ itemSessionReviewType }Correct`;

    let answerState = answerStateItem == 'Done'
                    ? 'Done'
                    : reviewItem[answerStateItem]
                      ? 'Right!' : 'Wrong!';

    console.log('Booleans (mcorrect, rcorrect, answered): ', reviewItem.MeaningsCorrect, reviewItem.ReadingsCorrect, this.state.reviewItemAnswered);
    console.log('session variables: ', reviewItem, itemSessionReviewType, answerStateItem, answerState, reviewItem[answerStateItem]);

    // Display for the session.
    return (
        <section>
          <div>{ reviewItem.Item }</div>
          <div>{ reviewItem.Readings }</div>
          <div>{ reviewItem.Meanings }</div>
          <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.review, true) }>
            <span className={ styles.label }>Next</span>
          </a>
        </section>
    );
  }

  //////////////////////////////
  // ANCHOR Function - checkAnswer
  // Logic for checking if the review answer is correct or not, and handling updates on completion.
  //////////////////////////////
  private checkAnswer(event, reviewItem, sessionReviewType) {
    if (!this.state.reviewItemAnswered) {
      const value = event.target.value;
      const answerType = event.target.name;
      const answerTypeCount = `${ answerType }Count`;

      // Check if answer is correct or not and handle state for answer.
      const correct = value == reviewItem[sessionReviewType] ? true : false;



      // Update review item object with appropriate values.
      reviewItem[answerType] = correct;
      reviewItem[answerTypeCount] = correct ? reviewItem[answerTypeCount] : reviewItem[answerTypeCount] + 1;
      reviewItem.SRSStage = (reviewItem.MeaningsCorrect && reviewItem.ReadingsCorrect)
                          ? () => {
                            // Get the number of wrong answers overall, divide by 4 and round up to get the number of SRS stages to reduce by.
                            let srsNegativeCount = Math.ceil((reviewItem.MeaningsCorrectCount + reviewItem.ReadingsCorrectCount) / 4);
                            // Harsher penalty for Master (7) and Enlightened (8) SRS stages, double the reduction number.
                            srsNegativeCount = (reviewItem.SRSStage > 6) ? srsNegativeCount * 2 : srsNegativeCount;

                            return  (srsNegativeCount > 0)
                                    // If SRS stage already at the start or the reduction takes it lower than Apprentice 1 (1)...
                                    ? ((reviewItem.SRSStage == 1) || (reviewItem.SRSStage - srsNegativeCount <= 1))
                                      // Return Apprentice 1 (1).
                                      ? 1
                                      // Otherwise reduce SRS stage by negative count (e.g. currently at 5, failed 5 times, reduce by 2).
                                      : reviewItem.SRSStage - srsNegativeCount
                                    // Increase SRS stage by one if no wrong answers given.
                                    : reviewItem.SRSStage + 1;
                          }
                          : reviewItem.SRSStage;
      const newNextReviewTimeValue = '';
      console.log('new review time: ', newNextReviewTimeValue);
      // reviewItem.NextReviewTime = '';




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

      console.log('session items: ', this.state.sessionReviewItems);
      console.log('review item: ', reviewItem);
      console.log('blegh:', value, correct, reviewItem[sessionReviewType]);
      console.log('updated correct:', [event.target.name], this.state.sessionReviewItems[this.state.reviewItemNumber], reviewItem[this.state.sessionReviewType]);
    }
    // If the item was answered after enter key is pressed.
    else if (this.state.reviewItemAnswered) {
      // If there are still items left to review.
      if (this.state.sessionReviewItems.length > 0) {
        console.log('reviewitemnumber and sessionReviewItems length', this.state.reviewItemNumber, this.state.sessionReviewItems.length);

        // If the review item readings and meanings have been answered right then remove them from the session review list.
        const newSessionReviewItems = (reviewItem.MeaningsCorrect && reviewItem.ReadingsCorrect)
                            ? this.state.sessionReviewItems.filter((sessionItem) => sessionItem.ID != reviewItem.ID)
                            : this.state.sessionReviewItems;

        this.setState({
          ...this.state,
          reviewItemAnswered: false,
          reviewItemNumber: Math.floor(Math.random() * this.state.sessionReviewItems.length),
          sessionReviewItems: newSessionReviewItems
        });

        jQuery('#answerBox').val('');
      }
    }

    console.log('checking', this.state);
  }

  //////////////////////////////
  // ANCHOR Function - updateSessionItem
  // Separate logic to handle the data to pass to the update list API.
  //////////////////////////////
  private updateSessionItem() {
    //
  }
}