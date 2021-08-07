import React from 'react';
import jQuery from 'jquery';
import { Log } from '@microsoft/sp-core-library';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import styles from './CustomSrsApplication.module.scss';

import { IListItems } from './listOperations/IListItems';
import { getItemList, createItem } from './listOperations/ListOperations';
import ListItem from './listOperations/ListItem';

import { ICustomSrsApplicationProps } from './ICustomSrsApplicationProps';
import { ICustomSrsApplicationState } from './ICustomSrsApplicationState';
import SrsReviewSession from './srsReviewSession/SrsReviewSession';
import SrsLessonSession from './srsLessonSession/SrsLessonSession';

//////////////////////////////
// ANCHOR Interfaces
//////////////////////////////
interface ISrsStageArray {
  [key: number]: {
    srsStageName: string,
    srsStageReviewIncrement: number
  };
}

interface ICustomKeyValueArray {
  [keyName: string]: string;
}


//////////////////////////////
// ANCHOR Variables
//////////////////////////////
// Set SRS Stage details.
const srsStages: ISrsStageArray = {
  0: {
    srsStageName: "New",
    srsStageReviewIncrement: 0
  },
  1: {
    srsStageName: "Apprentice 1",
    srsStageReviewIncrement: 4
  },
  2: {
    srsStageName: "Apprentice 2",
    srsStageReviewIncrement: 8
  },
  3: {
    srsStageName: "Apprentice 3",
    srsStageReviewIncrement: 24
  },
  4: {
    srsStageName: "Apprentice 4",
    srsStageReviewIncrement: 48
  },
  5: {
    srsStageName: "Guru 1",
    srsStageReviewIncrement: 168
  },
  6: {
    srsStageName: "Guru 2",
    srsStageReviewIncrement: 336
  },
  7: {
    srsStageName: "Master",
    srsStageReviewIncrement: 730
  },
  8: {
    srsStageName: "Enlightened",
    srsStageReviewIncrement: 2920
  },
  9: {
    srsStageName: "Burned",
    srsStageReviewIncrement: 0
  }
};

// Dialog item names.
const dialogItems: ICustomKeyValueArray = {
  add: 'showAddItem',
  items: 'showItems',
  lesson: 'showLessonSession',
  review: 'showReviewSession'
};


//////////////////////////////
// ANCHOR Class - CustomSrsApplication
// Top level logic and layout for app functions.
//////////////////////////////
export default class CustomSrsApplication extends React.Component<ICustomSrsApplicationProps, ICustomSrsApplicationState> {
  public getItemsTimer: number;

  public constructor(props: ICustomSrsApplicationProps, state: ICustomSrsApplicationState) {
    super(props);

    this.state = {
      status: "Ready",
      allItems: [],
      lessonItems: [],
      reviewItems: [],
      addNewItemMessage: null,
      addNewItemName: null,
      addNewItemReadings: null,
      addNewItemMeanings: null,
      showDialog: false,
      showDialogName: ''
    };
  }


  public componentDidMount() {
    this.updateItemsInState();

    // Set timeout for the next hour from page load, then re-render at that interval.
    const nextHour = new Date().setHours(new Date().getHours() + 1, 0, 0, 50);
    let timeoutInterval = nextHour - new Date().getTime();
    
    this.getItemsTimer = setInterval(() => this.updateItemsInState(), timeoutInterval);
    
    console.log(`Next refresh will happen at ${ new Date(nextHour) }`);
  }

  public componentWillUnmount() {
    clearInterval(this.getItemsTimer);
  }


  public render(): React.ReactElement<ICustomSrsApplicationProps> {
    // Get list items HTML.
    let listItems = this.state.allItems.map(
      (item) => {
        return <ListItem item={ item }/>;
      }
    );

    // Randomise lesson and review items.
    const lessonItems = this.state.lessonItems.sort(() => Math.random() - 0.5);
    const reviewItems = this.state.reviewItems.sort(() => Math.random() - 0.5);

    const lessonButtonClass = lessonItems.length > 0 ? styles.lessonButton : styles.inactiveButton;
    const reviewButtonClass = reviewItems.length > 0 ? styles.reviewButton : styles.inactiveButton;

    return (
      <div className={ styles.customSrsApplication }>
        <div className={ styles.container }>
          <div className={ `${ styles.row } ${ styles.flexRow }` }>
            <a href="#" className={ `${ styles.button } ${ styles.itemsButton }` } onClick={ () => this.toggleDialog(dialogItems.items, true) }>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>Show items</span>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>{ this.state.allItems.length }</span>
            </a>
            <a href="#" className={ `${ styles.button } ${ reviewButtonClass }` } onClick={ () => this.toggleDialog(dialogItems.review, true) }>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>Review items</span>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>{ reviewItems.length }</span>
            </a>
            <a href="#" className={ `${ styles.button } ${ lessonButtonClass }` } onClick={ () => this.toggleDialog(dialogItems.lesson, true) }>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>Learn items</span>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>{ lessonItems.length }</span>
            </a>
          </div>

          { (this.state.showDialog && this.state.showDialogName == dialogItems.items ) &&
            <div className={ `${ styles.row } ${ styles.itemsRow }` }>
              <div className={ styles.title }>Items currently in the list!</div>
              
              { listItems }
              
              <div className={ `${ styles.buttonRow } ${ styles.flexRow }` }>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.add, true) }>
                  <span className={ styles.label }>Add an item</span>
                </a>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.items, false, true) }>
                  <span className={ styles.label }>Close items</span>
                </a>
              </div>
            </div>
          }

          { (this.state.showDialog && this.state.showDialogName == dialogItems.add ) &&
            <div className={ `${ styles.row } ${ styles.itemsRow }` }>
              <span className={ styles.title }>{ this.state.addNewItemMessage }</span>
              
              <div className={ styles.addItemRow }>
                <span className={ styles.label }>Item name</span>
                <input type="text" name="addNewItemName" autoComplete="off" onChange={ (event) => this.handleInputChange(event) }/>
              </div>
              <div className={ styles.addItemRow }>
                <span className={ styles.label }>Readings</span>
                <input type="text" name="addNewItemReadings" autoComplete="off" onChange={ (event) => this.handleInputChange(event) }/>
              </div>
              <div className={ styles.addItemRow }>
                <span className={ styles.label }>Meanings</span>
                <input type="text" name="addNewItemMeanings" autoComplete="off" onChange={ (event) => this.handleInputChange(event) }/>
              </div>
              <div className={ `${ styles.buttonRow } ${ styles.flexRow }` }>
                <a href="#" className={ styles.button } onClick={ () => this.addNewItem() }>
                  <span className={ styles.label }>Add</span>
                </a>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.add, false, true) }>
                  <span className={ styles.label }>Close</span>
                </a>
              </div>
            </div>
          }

          { (this.state.showDialog && this.state.showDialogName == dialogItems.review ) &&
              <div className={ `${ styles.row } ${ styles.reviewRow }` }>
                <SrsReviewSession sessionReviewItems={ reviewItems } globalProps={ this.props } srsStages={ srsStages }/>
                <div className={ `${ styles.buttonRow } ${ styles.flexRow }` }>
                  <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.review, false, true) }>
                    <span className={ styles.label }>Close reviews</span>
                  </a>
                </div>
              </div>
          }
          
          { (this.state.showDialog && this.state.showDialogName == dialogItems.lesson ) &&
              <div className={ `${ styles.row } ${ styles.lessonRow }` }>
                <SrsLessonSession sessionLessonItems={ lessonItems } globalProps={ this.props } srsStages={ srsStages }/>
                <div className={ `${ styles.buttonRow } ${ styles.flexRow }` }>
                  <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.lesson, false, true) }>
                    <span className={ styles.label }>Close lessons</span>
                  </a>
                </div>
              </div>
          }

        </div>
      </div>
    );
  }

  //////////////////////////////
  // ANCHOR Function - toggleDialog
  // Toggle display of dialog using state change.
  //////////////////////////////
  private toggleDialog(toggleItem, toggleValue, refresh = false) {
    this.setState({
      ...this.state,
      showDialog: toggleValue,
      showDialogName: toggleItem
    });

    if (refresh) {
      this.updateItemsInState();
    }
  }

  //////////////////////////////
  // ANCHOR Function - addNewItem
  // Checks all fields have been filled out, then creates new item.
  //////////////////////////////
  private addNewItem() {
    { this.state.addNewItemName && this.state.addNewItemReadings && this.state.addNewItemMeanings
      ? createItem(this.props, this.state)
        .then(async () => {
          this.setState({
            ...this.state,
            addNewItemMessage: "Successfully added new item.",
            allItems: await getItemList(this.props.itemsList, this.props)
          });

          this.updateItemsInState();

          jQuery('.addItemWrapper > input').val('');
        })
      : this.setState({ addNewItemMessage: "You need to fill out all fields."});
    }
  }

  //////////////////////////////
  // ANCHOR Function - handleInputChange
  // Event handler for text input field to set value to state for further processing.
  //////////////////////////////
  private handleInputChange(event) {
    const value = event.target.value;

    this.setState({
      ...this.state,
      [event.target.name]: value
    });
  }

  //////////////////////////////
  // ANCHOR Function - updateItemsInState
  // Refresh items in state.
  //////////////////////////////
  private async updateItemsInState() {
    // Get all of the items for display/review/lessons.
    const itemsFromList = await getItemList(this.props.itemsList, this.props);
    const itemsForLesson = itemsFromList.filter(item => item.SRSStage == 0);
    const itemsForReview = itemsFromList.filter(item => item.SRSStage > 0 && item.SRSStage < 9 && (new Date() > new Date(item.Nextreviewtime)));
    
    // Wait for items to be retrieved from Items List and add to state.
    this.setState({
      allItems: itemsFromList,
      lessonItems: itemsForLesson,
      reviewItems: itemsForReview
    });
  }
}
