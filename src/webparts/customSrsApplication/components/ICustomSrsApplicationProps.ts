import { SPHttpClient, HttpClient } from '@microsoft/sp-http';

export interface ICustomSrsApplicationProps {
  httpDetails: {
    spHttpClient: SPHttpClient,
    httpClient: HttpClient
  };
  siteUrl: string;
  itemsList: string;
  reviewsList: string;
  languageSelection: string;
  lessonLimit: number;
  wanikaniDetails: {
    usingWanikani: boolean,
    wanikaniApiKey: string
  };
}
