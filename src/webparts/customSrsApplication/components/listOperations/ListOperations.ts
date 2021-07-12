import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

//////////////////////////////
// ANCHOR Function - getItemList
// Gets the items from the provided list name using API.
//////////////////////////////
export function getItemList(listName, globalProps) {
  return globalProps.spHttpClient.get(
    `${ globalProps.siteUrl }/_api/web/lists/getbytitle('${ listName }')/items`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'odata-version': ''
      }
    }
  )
  .then((response: SPHttpClientResponse) => {
    return response.json();
  })
  .then((returnedItems) => {
    // console.log('returneditems', returnedItems);
    return returnedItems.value;
  });
}


//////////////////////////////
// ANCHOR Function - createItem
// Create an item in the Items List using API.
//////////////////////////////
export function createItem(globalProps, state) {
  const listName = globalProps.itemsList;
  const body: string = JSON.stringify({
    "Item": state.addNewItemName,
    "Readings": state.addNewItemReadings,
    "Meanings": state.addNewItemMeanings,
  });
  
  return globalProps.spHttpClient.post(
    `${ globalProps.siteUrl }/_api/web/lists/getbytitle('${ listName }')/items`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-type': 'application/json;odata=nometadata',
        'odata-version': ''
      },
      body: body
    }
  )
  .then((response: SPHttpClientResponse) => {
    return response.json();
  })
  .then((createdItem) => {
    // console.log('Item created', createdItem);
    return `${ createdItem.Item } has been created!`;
  },
  (error: any) => {
    // console.log('Error creating item', error);
    return "There was an error creating items, see console for details.";
  });
}


//////////////////////////////
// ANCHOR Function - updateItem
// Update an item in the Items List using API.
//////////////////////////////
export function updateItem(listName, itemId, newSrsStage, nextReviewTime, globalProps) {
  // private updateItem(itemId) {
  const body: string = JSON.stringify({
    "SRS Stage": newSrsStage,
    "Next review time": nextReviewTime
  });
  
  return globalProps.spHttpClient.post(`${ globalProps.siteUrl }/_api/web/lists/getbytitle('${ listName }')/items(${itemId})`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-type': 'application/json;odata=nometadata',
        'odata-version': '',
        'IF-MATCH': '*',
        'X-HTTP-Method': 'MERGE'
      },
      body: body
    }
  )
  .then((response: SPHttpClientResponse) => {
    // console.log('Item updated');
    return `${ itemId } has been created!`;
  },
  (error: any) => {
    // console.log('Error updating item', error);
    return "There was an error updating the item, see console for details.";
  });
}
