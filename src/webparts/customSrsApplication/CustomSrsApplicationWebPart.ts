import React from 'react';
import ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import strings from 'CustomSrsApplicationWebPartStrings';
import CustomSrsApplication from './components/CustomSrsApplication';
import { ICustomSrsApplicationProps } from './components/ICustomSrsApplicationProps';

export interface ICustomSrsApplicationWebPartProps {
  description: string;
}

export default class CustomSrsApplicationWebPart extends BaseClientSideWebPart<ICustomSrsApplicationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICustomSrsApplicationProps> = React.createElement(
      CustomSrsApplication,
      {
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        itemsList: 'SRS Items',
        reviewsList: 'SRS Reviews'
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  //   return {
  //     pages: [
  //       {
  //         header: {
  //           description: strings.PropertyPaneDescription
  //         },
  //         groups: [
  //           {
  //             groupName: strings.BasicGroupName,
  //             groupFields: [
  //               PropertyPaneTextField('description', {
  //                 label: strings.DescriptionFieldLabel
  //               })
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   };
  // }
}
