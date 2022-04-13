import jQuery from 'jquery';

import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { getItemList, updateItem } from '../listOperations/ListOperations';


export function getWanikaniData(globalProps, apiEndpoint, previousResponse = []) {
  const apiUrl = apiEndpoint.includes("https://api.wanikani.com/v2/")
               ? apiEndpoint
               : `https://api.wanikani.com/v2/${ apiEndpoint }`;

  return globalProps.httpDetails.httpClient.get(
    apiUrl,
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
    if (previousResponse.length > 0) {
      responseBody.data = responseBody.data.concat(previousResponse);
    }

    if (responseBody.hasOwnProperty('pages')) {
      if (responseBody.pages.hasOwnProperty('next_url')) {
        if (responseBody.pages.next_url) {
          return getWanikaniData(globalProps, responseBody.pages.next_url, responseBody.data);
        }
      }
    }
    
    return responseBody;
  });
}


export async function wanikaniDataComparison(globalProps) {
  const currentWanikaniLevel = (await getWanikaniData(globalProps, 'user')).data.level;
  const wanikaniLevelCap = currentWanikaniLevel + Number(globalProps.wanikaniDetails.wanikaniApiLevelCap);
  const wanikaniSubjectsData = (await getWanikaniData(globalProps, 'subjects?types=vocabulary')).data;
  const itemsFromList = await getItemList(globalProps.itemsList, globalProps);

  let srsItemsFilter = itemsFromList.map( item => item.Item );
  let wanikaniFilteredData = wanikaniSubjectsData.filter(item => srsItemsFilter.includes(item.data.characters));

  let wanikaniFilteredDataFilter = wanikaniFilteredData.map( item => item.data.characters );
  let srsFilteredData = itemsFromList.filter(item => wanikaniFilteredDataFilter.includes(item.Item));

  const now = new Date().toISOString();

  const columns = [
    "WaniKani",
    "WaniKanichecked",
    "WaniKanilastcheck",
    "SRSStage"
  ];

  let returnResult = {
    success: 0,
    failure: 0
  };

  jQuery.each(srsFilteredData, (index, srsItem) => {
    if (!srsItem.WaniKanichecked) {
      const wanikaniItemCheck = wanikaniFilteredData.find(wanikaniItem => wanikaniItem.data.characters == srsItem.Item);
      srsItem.WaniKani = wanikaniItemCheck.data.level;
      srsItem.WaniKanichecked = wanikaniItemCheck.data.level <= wanikaniLevelCap;
      srsItem.WaniKanilastcheck = now;
      srsItem.SRSStage = wanikaniItemCheck.data.level <= wanikaniLevelCap ? 10 : srsItem.SRSStage;

      updateItem(globalProps.itemsList, srsItem, columns, globalProps) ? returnResult.success++ : returnResult.failure++;
    }
  });

  return returnResult;
}