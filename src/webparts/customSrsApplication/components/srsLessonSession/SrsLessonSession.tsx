import React from 'react';
import jQuery from 'jquery';

import styles from './SrsLessonSession.module.scss';

import { IListItems } from '../listOperations/IListItems';

import { ISrsLessonSessionProps } from './ISrsLessonSessionProps';
import { ISrsLessonSessionState } from './ISrsLessonSessionState';

import SrsReviewSession from '../srsReviewSession/SrsReviewSession';


//////////////////////////////
// ANCHOR Class - SrsSession
// Primary logic and display for the review session.
//////////////////////////////
export default class SrsLessonSession extends React.Component<ISrsLessonSessionProps, ISrsLessonSessionState> {
  public constructor(props: ISrsLessonSessionProps, state: ISrsLessonSessionState) {
    super(props);

    this.state = {
      sessionLessonItems: this.props.sessionLessonItems.slice(0, this.props.globalProps.lessonLimit),
      lessonItemNumber: 0,
      lessonItemCount: 1,
      isReview: false
    };
  }


  public render(): React.ReactElement<ISrsLessonSessionProps> {
    // Initialise variables.
    const lessonReviewItems = this.state.sessionLessonItems;
    const itemsToLearn = this.state.sessionLessonItems.length > 0;
    const nextIsReview = (this.state.lessonItemCount == this.props.globalProps.lessonLimit) || (this.state.lessonItemCount == this.state.sessionLessonItems.length);

    // Display for the session.
    return (
      <section>
          { this.state.isReview
          ? (
            <SrsReviewSession  globalProps={ this.props.globalProps }sessionItemsTotalCount={ lessonReviewItems.length } sessionReviewItems={ lessonReviewItems } srsStages={ this.props.srsStages }/>
          )
          : (
            <section className={ styles.srsLessonSession }>
              { itemsToLearn
                ? (
                    <div className={ styles.container }>
                      <div className={ styles.row }>
                        <span className={ styles.itemDescription }>{ this.state.sessionLessonItems[this.state.lessonItemNumber].Item }</span>
                        <span className={ styles.readingDescription }>{ this.state.sessionLessonItems[this.state.lessonItemNumber].Readings }</span>
                        <span className={ styles.meaningDescription }>{ this.state.sessionLessonItems[this.state.lessonItemNumber].Meanings }</span>
                        { nextIsReview ? (
                            <a href="#" className={ `${ styles.button } ${ styles.startReviewButton }` } onClick={ () => this.setState({ isReview: true }) }>
                              <span className={ styles.label }>Start review</span>
                            </a>
                          )
                          : (
                            <a href="#" className={ `${ styles.button } ${ styles.nextButton }` } onClick={ () => this.goToNextLessonItem() }>
                              <span className={ styles.label }>Next</span>
                            </a>
                          )
                        }
                      </div>
                    </div>
                )
                : (
                  <div className={ styles.container }>Nothing to Learn!</div>
                )
              }
            </section>
          )
          }
        </section>
    );
  }


  //////////////////////////////
  // ANCHOR Function - goToNextLessonItem
  // Updates lesson item counts.
  //////////////////////////////
  private goToNextLessonItem() {
    this.setState((prevState) => ({
      ...this.state,
      lessonItemNumber: prevState.lessonItemNumber + 1,
      lessonItemCount: prevState.lessonItemCount + 1
    }));
  }
}