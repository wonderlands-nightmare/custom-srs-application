import React from 'react';
import jQuery from 'jquery';
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
  review: 'showReviewSession',
  lesson: 'showLessonSession'
};


//////////////////////////////
// ANCHOR Class - CustomSrsApplication
// Top level logic and layout for app functions.
//////////////////////////////
export default class CustomSrsApplication extends React.Component<ICustomSrsApplicationProps, ICustomSrsApplicationState> {
  public constructor(props: ICustomSrsApplicationProps, state: ICustomSrsApplicationState) {
    super(props);

    this.state = {
      status: "Ready",
      items: [],
      addNewItemMessage: null,
      addNewItemName: null,
      addNewItemReadings: null,
      addNewItemMeanings: null,
      showDialog: false,
      showDialogName: ''
    };
  }


  public async componentDidMount(){
    // Wait for items to be retrieved from Items List and add to state.
    this.setState({
      items: await getItemList(this.props.itemsList, this.props)
    });
  }


  public render(): React.ReactElement<ICustomSrsApplicationProps> {
    // Get review items.
    let reviewItems: IListItems[] = this.state.items.filter(item => item.SRSStage != 0 && item.SRSStage != 9);
    reviewItems = reviewItems.sort(() => Math.random() - 0.5);
    console.log('reviewItems', reviewItems);
    // Get lesson items.
    let lessonItems: IListItems[] = this.state.items.filter(item => item.SRSStage == 0);
    lessonItems = lessonItems.sort(() => Math.random() - 0.5);
    console.log('lessonItems', lessonItems);

    console.log('csrsa state: ', this.state);

    return (
      <div className={ styles.customSrsApplication }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Items currently in the list!</span>
              
              {/* { console.log('items at render:', this.state.items) } */}
              { this.state.items.map(
                  (item) => {
                    // console.log('item is:', item);
                    return <ListItem item={ item }/>;
                  }
                ) 
              }
              
              <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.add, true) }>
                <span className={ styles.label }>Add an item</span>
              </a>
              <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.review, true) }>
                <span className={ styles.label }>Review items</span>
              </a>
              <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.lesson, true) }>
                <span className={ styles.label }>Learn items</span>
              </a>
            </div>
          </div>

          { (this.state.showDialog && this.state.showDialogName == dialogItems.add ) &&
            <div className={ styles.row }>
              { this.state.addNewItemMessage }
              <div className={ styles.addItemWrapper }>
                <span className={ styles.label }>Item name</span>
                <input type="text" name="addNewItemName" onChange={ (event) => this.handleInputChange(event) }/>
              </div>
              <div className={ styles.addItemWrapper }>
                <span className={ styles.label }>Readings</span>
                <input type="text" name="addNewItemReadings" onChange={ (event) => this.handleInputChange(event) }/>
              </div>
              <div className={ styles.addItemWrapper }>
                <span className={ styles.label }>Meanings</span>
                <input type="text" name="addNewItemMeanings" onChange={ (event) => this.handleInputChange(event) }/>
              </div>
              <a href="#" className={ styles.button } onClick={ () => this.addNewItem() }>
                <span className={ styles.label }>Add</span>
              </a>
              <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.add, false) }>
                <span className={ styles.label }>Close</span>
              </a>
            </div>
          }

          { (this.state.showDialog && this.state.showDialogName == dialogItems.review ) &&
            (reviewItems.length > 0
            ? (
              <div>
                <SrsReviewSession sessionReviewItems={ reviewItems } globalProps={ this.props } srsStages={ srsStages }/>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.review, false) }>
                  <span className={ styles.label }>Close reviews</span>
                </a>
              </div>
            )
            : (
              <div>Nothing to review!</div>
            ))
          }
          
          { (this.state.showDialog && this.state.showDialogName == dialogItems.lesson ) &&
            (lessonItems.length > 0
            ? (
              <div>
                <SrsLessonSession sessionReviewItems={ lessonItems } globalProps={ this.props } srsStages={ srsStages }/>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.lesson, false) }>
                  <span className={ styles.label }>Close lessons</span>
                </a>
              </div>
            )  
            : (
              <div>Nothing to learn!</div>
            ))
          }

        </div>
      </div>
    );
  }

  //////////////////////////////
  // ANCHOR Function - toggleDialog
  // Toggle display of dialog using state change.
  //////////////////////////////
  private toggleDialog(toggleItem, toggleValue) {
    this.setState({
      ...this.state,
      showDialog: toggleValue,
      showDialogName: toggleItem
    });
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
            items: await getItemList(this.props.itemsList, this.props)
          });

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
}
