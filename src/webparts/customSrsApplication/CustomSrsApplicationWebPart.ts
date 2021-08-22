import React from 'react';
import ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import strings from 'CustomSrsApplicationWebPartStrings';
import CustomSrsApplication from './components/CustomSrsApplication';
import { ICustomSrsApplicationProps } from './components/ICustomSrsApplicationProps';

export interface ICustomSrsApplicationWebPartProps {
  languageSelection: string;
  lessonLimit: number;
}

export default class CustomSrsApplicationWebPart extends BaseClientSideWebPart<ICustomSrsApplicationWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ICustomSrsApplicationProps> = React.createElement(
      CustomSrsApplication,
      {
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        itemsList: 'SRS Items',
        reviewsList: 'SRS Reviews',
        languageSelection: this.properties.languageSelection,
        lessonLimit: this.properties.lessonLimit
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('languageSelection', {
                  label: strings.LanguageSelectFieldLabel,
                  options: [
                    { key: 'japanese', text: 'Japanese' },
                    { key: 'thai', text: 'Thai' }
                  ]
                }),
                PropertyPaneTextField('lessonLimit', {
                  label: strings.LessonLimitFieldLabel,
                  onGetErrorMessage: this.validateNumberTextField.bind(this)
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private validateNumberTextField(value: string): string {
    let numberFromString: number = parseInt(escape(value));
    
    if (isNaN(numberFromString)) {
      return 'This is not a number. Please check for spaces or characters and input only numbers.';
    }

    return '';
  }
}
