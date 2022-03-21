import React from 'react';
import jQuery from 'jquery';

import styles from './CustomSrsApplication.module.scss';

import { getItemList, createItem } from './listOperations/ListOperations';
import ListItem from './listOperations/ListItem';

import { ICustomSrsApplicationProps } from './ICustomSrsApplicationProps';
import { ICustomSrsApplicationState } from './ICustomSrsApplicationState';
import SrsReviewSession from './srsReviewSession/SrsReviewSession';
import SrsLessonSession from './srsLessonSession/SrsLessonSession';
import NextReviews from './nextReviews/NextReviews';

import { testFunction } from './wanikaniIntegration/WanikaniIntegration';

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
  name: 'showDialog',
  add: 'showAddItem',
  items: 'showItems',
  lesson: 'showLessonSession',
  review: 'showReviewSession'
};

// List item pane names.
const itemPanes: ICustomKeyValueArray = {
  name: 'showItemsPane',
  unlearned: 'showUnlearnedItems',
  apprentice: 'showApprenticeItems',
  guru: 'showGuruItems',
  master: 'showMasterItems',
  enlightened: 'showEnlightenedItems',
  burned: 'showBurnedItems',
  wanikani: 'showWanikaniItems'
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
      validItems: [],
      addNewItemMessage: null,
      addNewItemName: null,
      addNewItemReadings: null,
      addNewItemMeanings: null,
      showDialog: false,
      showDialogName: '',
      showItemsPane: false,
      showItemsPaneName: ''
    };
  }


  public componentDidMount() {
    this.updateItemsInState();
  }


  public render(): React.ReactElement<ICustomSrsApplicationProps> {
    // TODO TESTING
    // testFunction(this.props);

    // Randomise lesson and review items.
    const lessonItems = this.state.lessonItems.sort(() => Math.random() - 0.5);
    const reviewItems = this.state.reviewItems.sort(() => Math.random() - 0.5);

    // Get list items HTML.
    const unlearnedItems = this.state.allItems.filter(item => item.SRSStage == 0)
      .map(item => <ListItem item={ item }/> );
    const apprenticeItems = this.state.allItems.filter(item => item.SRSStage >= 1 && item.SRSStage <= 4)
      .map(item => <ListItem item={ item }/> );
    const guruItems = this.state.allItems.filter(item => item.SRSStage == 5 || item.SRSStage == 6)
      .map(item => <ListItem item={ item }/> );
    const masterItems = this.state.allItems.filter(item => item.SRSStage == 7)
      .map(item => <ListItem item={ item }/> );
    const enlightenedItems = this.state.allItems.filter(item => item.SRSStage == 8)
      .map(item => <ListItem item={ item }/> );
    const burnedItems = this.state.allItems.filter(item => item.SRSStage == 9)
      .map(item => <ListItem item={ item }/> );
    const wanikaniItems = this.state.allItems.filter(item => item.SRSStage == 10)
      .map(item => <ListItem item={ item }/> );

    const lessonButtonClass = lessonItems.length > 0 ? styles.lessonButton : styles.inactiveButton;
    const reviewButtonClass = reviewItems.length > 0 ? styles.reviewButton : styles.inactiveButton;

    return (
      <div className={ styles.customSrsApplication }>
        {/* NOTE Next reviews */}
        <NextReviews nextReviewsItems={ this.state.validItems } globalProps={ this.props }/>
        
        <div className={ styles.container }>
          {/* NOTE Main buttons */}
          <div className={ `${ styles.row } ${ styles.flexRow }` }>
            <a href="#" className={ `${ styles.button } ${ styles.refreshButton }` } onClick={ () => this.updateItemsInState() }>
              <span className={ styles.label }>Refresh items</span>
            </a>
          </div>
          <div className={ `${ styles.row } ${ styles.flexRow }` }>
            <a href="#" className={ `${ styles.button } ${ styles.itemsButton }` } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.items, true) }>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>Show items</span>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>{ this.state.validItems.length }</span>
            </a>
            <a href="#" className={ `${ styles.button } ${ reviewButtonClass }` } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.review, true) }>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>Review items</span>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>{ reviewItems.length }</span>
            </a>
            <a href="#" className={ `${ styles.button } ${ lessonButtonClass }` } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.lesson, true) }>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>Learn items</span>
              <span className={ `${ styles.label } ${ styles.largeLabel }` }>{ lessonItems.length }</span>
            </a>
          </div>

          {/* NOTE Show Items */}
          { (this.state.showDialog && this.state.showDialogName == dialogItems.items ) &&
            <div className={ `${ styles.row } ${ styles.itemsRow }` }>
              <div className={ `${ styles.buttonRow } ${ styles.flexRow } ${ styles.topRow }` }>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.add, true) }>
                  <span className={ styles.label }>Add an item</span>
                </a>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.items, false, true) }>
                  <span className={ styles.label }>Close items</span>
                </a>
              </div>

              <div className={ styles.showItemsRow }>
                <a href="#" className={ styles.title } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.unlearned, true) }>
                  <span>Unlearned Items ({ unlearnedItems.length })</span>
                </a>
                <a href="#" className={ `${ styles.button } ${ styles.titleClose }` } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.unlearned, false) }>
                  <span className={ styles.label }>Close</span>
                </a>
                { (this.state.showItemsPane && this.state.showItemsPaneName == itemPanes.unlearned ) && 
                  unlearnedItems
                }
              </div>

              <div className={ styles.showItemsRow }>
                <a href="#" className={ styles.title } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.apprentice, true) }>
                  <span>Apprentice Items ({ apprenticeItems.length })</span>
                </a>
                <a href="#" className={ `${ styles.button } ${ styles.titleClose }` } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.apprentice, false) }>
                  <span className={ styles.label }>Close</span>
                </a>
                { (this.state.showItemsPane && this.state.showItemsPaneName == itemPanes.apprentice ) &&
                  apprenticeItems
                }
              </div>

              <div className={ styles.showItemsRow }>
                <a href="#" className={ styles.title } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.guru, true) }>
                  <span>Guru Items ({ guruItems.length })</span>
                </a>
                <a href="#" className={ `${ styles.button } ${ styles.titleClose }` } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.guru, false) }>
                  <span className={ styles.label }>Close</span>
                </a>
                { (this.state.showItemsPane && this.state.showItemsPaneName == itemPanes.guru ) &&
                  guruItems
                }
              </div>

              <div className={ styles.showItemsRow }>
                <a href="#" className={ styles.title } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.master, true) }>
                  <span>Master Items ({ masterItems.length })</span>
                </a>
                <a href="#" className={ `${ styles.button } ${ styles.titleClose }` } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.master, false) }>
                  <span className={ styles.label }>Close</span>
                </a>
                { (this.state.showItemsPane && this.state.showItemsPaneName == itemPanes.master ) &&
                  masterItems
                }
              </div>

              <div className={ styles.showItemsRow }>
                <a href="#" className={ styles.title } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.enlightened, true) }>
                  <span>Enlightened Items ({ enlightenedItems.length })</span>
                </a>
                <a href="#" className={ `${ styles.button } ${ styles.titleClose }` } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.enlightened, false) }>
                  <span className={ styles.label }>Close</span>
                </a>
                { (this.state.showItemsPane && this.state.showItemsPaneName == itemPanes.enlightened ) &&
                  enlightenedItems
                }
              </div>

              <div className={ styles.showItemsRow }>
                <a href="#" className={ styles.title } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.burned, true) }>
                  <span>Burned Items ({ burnedItems.length })</span>
                </a>
                <a href="#" className={ `${ styles.button } ${ styles.titleClose }` } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.burned, false) }>
                  <span className={ styles.label }>Close</span>
                </a>
                { (this.state.showItemsPane && this.state.showItemsPaneName == itemPanes.burned ) &&
                  burnedItems
                }
              </div>

              <div className={ styles.showItemsRow }>
                <a href="#" className={ styles.title } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.wanikani, true) }>
                  <span>Learning in WaniKani ({ wanikaniItems.length })</span>
                </a>
                <a href="#" className={ `${ styles.button } ${ styles.titleClose }` } onClick={ () => this.toggleDialog(itemPanes.name, itemPanes.wanikani, false) }>
                  <span className={ styles.label }>Close</span>
                </a>
                { (this.state.showItemsPane && this.state.showItemsPaneName == itemPanes.wanikani ) &&
                  wanikaniItems
                }
              </div>

              <div className={ `${ styles.buttonRow } ${ styles.flexRow } ${ styles.bottomRow }` }>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.add, true) }>
                  <span className={ styles.label }>Add an item</span>
                </a>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.items, false, true) }>
                  <span className={ styles.label }>Close items</span>
                </a>
              </div>
            </div>
          }

          {/* NOTE Add Items */}
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
              <div className={ `${ styles.buttonRow } ${ styles.flexRow } ${ styles.bottomRow }` }>
                <a href="#" className={ styles.button } onClick={ () => this.addNewItem() }>
                  <span className={ styles.label }>Add</span>
                </a>
                <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.add, false, true) }>
                  <span className={ styles.label }>Close</span>
                </a>
              </div>
            </div>
          }

          {/* NOTE Review Items */}
          { (this.state.showDialog && this.state.showDialogName == dialogItems.review ) &&
              <div className={ `${ styles.row } ${ styles.reviewRow }` }>
                <SrsReviewSession globalProps={ this.props } sessionItemsTotalCount={ reviewItems.length } sessionReviewItems={ reviewItems } srsStages={ srsStages }/>
                <div className={ `${ styles.buttonRow } ${ styles.flexRow } ${ styles.bottomRow }` }>
                  <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.review, false, true) }>
                    <span className={ styles.label }>Close reviews</span>
                  </a>
                </div>
              </div>
          }
          
          {/* NOTE Lesson Items */}
          { (this.state.showDialog && this.state.showDialogName == dialogItems.lesson ) &&
              <div className={ `${ styles.row } ${ styles.lessonRow }` }>
                <SrsLessonSession globalProps={ this.props } sessionItemsTotalCount={ lessonItems.length } sessionLessonItems={ lessonItems } srsStages={ srsStages }/>
                <div className={ `${ styles.buttonRow } ${ styles.flexRow } ${ styles.bottomRow }` }>
                  <a href="#" className={ styles.button } onClick={ () => this.toggleDialog(dialogItems.name, dialogItems.lesson, false, true) }>
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
  private toggleDialog(stateItem, toggleItem, toggleValue, refresh = false) {
    const stateItemName = `${ stateItem }Name`;
    
    this.setState({
      ...this.state,
      [stateItem]: toggleValue,
      [stateItemName]: toggleItem
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
    const itemsForAll = itemsFromList.filter(item => item.SRSStage > 0 && item.SRSStage < 9);
    
    // Wait for items to be retrieved from Items List and add to state.
    this.setState({
      allItems: itemsFromList,
      lessonItems: itemsForLesson,
      reviewItems: itemsForReview,
      validItems: itemsForAll
    });
  }
}
