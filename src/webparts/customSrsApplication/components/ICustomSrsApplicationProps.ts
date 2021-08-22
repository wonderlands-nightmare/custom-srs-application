import { SPHttpClient } from '@microsoft/sp-http';

export interface ICustomSrsApplicationProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
  itemsList: string;
  reviewsList: string;
  languageSelection: string;
}
