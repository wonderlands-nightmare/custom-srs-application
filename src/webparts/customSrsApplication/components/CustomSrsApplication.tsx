import React from 'react';
import styles from './CustomSrsApplication.module.scss';
import { ICustomSrsApplicationProps } from './ICustomSrsApplicationProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class CustomSrsApplication extends React.Component<ICustomSrsApplicationProps, {}> {
  public render(): React.ReactElement<ICustomSrsApplicationProps> {
    return (
      <div className={ styles.customSrsApplication }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
