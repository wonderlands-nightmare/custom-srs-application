import React from 'react';
import ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneGroup,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import strings from 'CustomSrsApplicationWebPartStrings';
import CustomSrsApplication from './components/CustomSrsApplication';
import { ICustomSrsApplicationProps } from './components/ICustomSrsApplicationProps';

export interface ICustomSrsApplicationWebPartProps {
  languageSelection: string;
  lessonLimit: number;
  useWanikani: boolean;
  wanikaniApiKey: string;
}

export default class CustomSrsApplicationWebPart extends BaseClientSideWebPart<ICustomSrsApplicationWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ICustomSrsApplicationProps> = React.createElement(
      CustomSrsApplication,
      {
        httpDetails: {
          spHttpClient: this.context.spHttpClient,
          httpClient: this.context.httpClient
        },
        siteUrl: this.context.pageContext.web.absoluteUrl,
        itemsList: 'SRS Items',
        reviewsList: 'SRS Reviews',
        languageSelection: this.properties.languageSelection,
        lessonLimit: this.properties.lessonLimit,
        wanikaniDetails: {
          usingWanikani: this.properties.useWanikani,
          wanikaniApiKey: this.properties.wanikaniApiKey
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const conditionalGroupFields: IPropertyPaneGroup["groupFields"] = [
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
      }),
      PropertyPaneToggle("useWanikani", {
        key: 'useWanikani',
        label: '',
        checked: false,
        onText: "Using WaniKani",
        offText: "Not Using WaniKani"
      }),
    ];

    // show Field2, only if Field1 is true
    if (this.properties.useWanikani) {
      conditionalGroupFields.push(
        PropertyPaneTextField('wanikaniApiKey', {
          label: strings.WanikaniApiKeyLabel
        }),
      );
    }
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: conditionalGroupFields
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
