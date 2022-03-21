import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';


export function getWanikaniData(globalProps, apiEndpoint, apiFilter = "") {
  const apiEndPath = apiFilter == "" ? apiEndpoint : `${ apiEndpoint }?${ apiFilter }`;

  return globalProps.httpDetails.httpClient.get(
    `https://api.wanikani.com/v2/${ apiEndPath }`,
    HttpClient.configurations.v1,
    {
      headers: {
        'Authorization': `Bearer ${ globalProps.wanikaniDetails.wanikaniApiKey }`,
      }
    }
  )
  .then((response: HttpClientResponse) => {
    return response.json();
  })
  .then((responseBody) => {
    console.log(`http response body for ${ apiEndpoint }`, responseBody);
    return responseBody;
  });
}


export async function testFunction(globalProps) {
  const itemsData = {
    subjects: await getWanikaniData(globalProps, 'subjects'),
    assignments: await getWanikaniData(globalProps, 'assignments', "subject_types=vocabulary"),
    reviewStatistics: await getWanikaniData(globalProps, 'review_statistics', "subject_type=vocabulary"),
    studyMaterials: await getWanikaniData(globalProps, 'study_materials', "subject_type=vocabulary")
  };

  console.log('itemsData', itemsData);
}


//////////////////////////////
// ANCHOR Function - getItemList
// Gets the items from the provided list name using API.
//////////////////////////////
export function getItemList(listName, globalProps) {
  return globalProps.httpDetails.httpClient.get(
    `${ globalProps.siteUrl }/_api/web/lists/getbytitle('${ listName }')/items?$top=100000`,
    HttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'odata-version': ''
      }
    }
  )
  .then((response: HttpClientResponse) => {
    return response.json();
  })
  .then((returnedItems) => {
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
  
  return globalProps.httpDetails.httpClient.post(
    `${ globalProps.siteUrl }/_api/web/lists/getbytitle('${ listName }')/items`,
    HttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-type': 'application/json;odata=nometadata',
        'odata-version': ''
      },
      body: body
    }
  )
  .then((response: HttpClientResponse) => {
    return response.json();
  })
  .then((createdItem) => {
    return `${ createdItem.Item } has been created!`;
  },
  (error: any) => {
    return "There was an error creating items, see console for details.";
  });
}


//////////////////////////////
// ANCHOR Function - updateItem
// Update an item in the Items List using API.
//////////////////////////////
export function updateItem(listName, itemToUpdate, globalProps) {
  const itemId = itemToUpdate.ID;

  const body: string = JSON.stringify({
    "SRSStage": itemToUpdate.SRSStage,
    "Nextreviewtime": itemToUpdate.Nextreviewtime
  });
  
  return globalProps.httpDetails.httpClient.post(
    `${ globalProps.siteUrl }/_api/web/lists/getbytitle('${ listName }')/items(${itemId})`,
    HttpClient.configurations.v1,
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
  .then((response: HttpClientResponse) => {
    return `${ itemId } has been created!`;
  },
  (error: any) => {
    return "There was an error updating the item, see console for details.";
  });
}
