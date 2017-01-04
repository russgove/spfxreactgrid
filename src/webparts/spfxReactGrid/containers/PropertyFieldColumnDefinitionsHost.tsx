import { addColumn, removeColumn, saveColumn, removeAllColumns, moveCulumnUp, moveCulumnDown } from "../actions/columnActions";
import * as ColumnReducers from "../reducers/Columnreducer";
import { Guid, Log } from "@microsoft/sp-client-base";
import { ColumnDefinitionContainerNative } from "./ColumnDefinitionContainer";
import ColumnDefinition from "../model/ColumnDefinition"
import * as React from 'react';
import { EnvironmentType } from '@microsoft/sp-client-base';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
// import { IPropertyFieldColumnDefinitions } from './PropertyFieldColumnDefinitions';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Button, ButtonType } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

import * as strings from "spfxReactGridStrings";

export interface IPropertyFieldColumnDefinitionsHostProps {
  label: string;
  initialValue?: Array<ColumnDefinition>;
  context: IWebPartContext;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  properties: any;
  store: any
}

export interface IPropertyFieldColumnDefinitionsHostState {
  openPanel?: boolean;
  openRecent?: boolean;
  openSite?: boolean;
  openUpload?: boolean;

  columnDefinitions: Array<ColumnDefinition>;
}

/**
 * @class
 * Renders the controls for PropertyFieldColumnDefinitions component
 */
export default class PropertyFieldColumnDefinitionsHost extends React.Component<IPropertyFieldColumnDefinitionsHostProps, IPropertyFieldColumnDefinitionsHostState> {

  /**
   * @function
   * Contructor
   */
  constructor(props: IPropertyFieldColumnDefinitionsHostProps) {
    super(props);
    //Bind the current object to the external called onSelectDate method
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);

    this.onClickRecent = this.onClickRecent.bind(this);
    this.onClickSite = this.onClickSite.bind(this);
    this.onClickUpload = this.onClickUpload.bind(this);

    this.addColumn = this.addColumn.bind(this);
    this.moveColumnDown = this.moveColumnDown.bind(this);
    this.moveColumnUp = this.moveColumnUp.bind(this);
    this.onEraseButton = this.onEraseButton.bind(this);
    this.state = {
      columnDefinitions: this.props.initialValue,
      openPanel: false,
      openRecent: false,
      openSite: true,
      openUpload: false
    };
  }
  private addColumn(): void {
    const id = Guid.newGuid();
    const col: ColumnDefinition = new ColumnDefinition(id.toString(), "", 80, true);
    debugger;
    this.props.store.dispatch(addColumn(col));
  }
  saveColumn(updatedRowData): void {
    debugger;
    this.props.store.dispatch(saveColumn(updatedRowData));
  }
  removeColumn(column): void {
    debugger;
    this.props.store.dispatch(removeColumn(column));
  }
  removeAllColumns(): void {
    debugger;
    this.props.store.dispatch(removeAllColumns());
  }
  moveColumnUp(column: ColumnDefinition): void {
    debugger;
    let temp = _.clone(this.state.columnDefinitions);
    const index = _.findIndex(this.state.columnDefinitions, (cd) => cd.guid === column.guid);
    temp[index] = temp.splice(index - 1, 1, temp[index])[0];
    this.setState({columnDefinitions:temp});
  }
  moveColumnDown(column): void {
    debugger;
    this.props.store.dispatch(moveCulumnDown(column));
  }
  private saveImageProperty(imageUrl: string): void {
    if (this.props.onPropertyChange) {
      debugger;
      // this.props.properties[this.props.targetProperty] = imageUrl;
      // this.props.onPropertyChange(this.props.targetProperty, this.props.initialValue, imageUrl);
    }
  }

  /**
  * @function
  * Click on erase button
  *
  */
  private onEraseButton(): void {
    debugger;
    //  this.state.selectedImage = '';
    this.setState(this.state);
    this.saveImageProperty('');
  }

  /**
  * @function
  * Open the panel
  *
  */
  private onOpenPanel(element?: any): void {
    this.state.openPanel = true;
    this.setState(this.state);
  }

  /**
  * @function
  * Close the panel
  *
  */
  private onClosePanel(element?: any): void {
    this.state.openPanel = false;
    this.setState(this.state);
  }

  private onClickRecent(element?: any): void {
    //this.state.openRecent = true;
    //this.state.openSite = false;
    //this.state.openUpload = false;
    //this.setState(this.state);
  }


  /**
  * @function
  * When component is mount, attach the iframe event watcher
  *
  */
  public componentDidMount() {
    //   window.addEventListener('message', this.handleIframeData, false);
  }

  /**
  * @function
  * Releases the watcher
  *
  */
  public componentWillUnmount() {
    debugger;
    //  window.removeEventListener('message', this.handleIframeData, false);
  }

  private onClickSite(element?: any): void {
    this.state.openRecent = false;
    this.state.openSite = true;
    this.state.openUpload = false;
    this.setState(this.state);
  }

  private onClickUpload(element?: any): void {
    this.state.openRecent = false;
    this.state.openSite = false;
    this.state.openUpload = true;
    this.setState(this.state);
  }



  /**
   * @function
   * Renders the datepicker controls with Office UI  Fabric
   */
  public render(): JSX.Element {


    debugger;

    //Renders content
    return (
      <div style={{ marginBottom: '8px' }}>
        <Label>{this.props.label}</Label>
        <Button onClick={this.onOpenPanel}>{strings.ColumnDefinitionsButtonSelect}</Button>
        <Button onClick={this.onEraseButton} disabled={this.state.columnDefinitions != null && this.state.columnDefinitions.length != 0 ? false : true}>
          {strings.ColumnDefinitionsButtonReset}</Button>
        {this.state.openPanel === true ?
          <Panel
            isOpen={this.state.openPanel} hasCloseButton={true} onDismiss={this.onClosePanel}
            isLightDismiss={true} type={PanelType.large}
            headerText={strings.ColumnDefinitionsTitle}>
            <ColumnDefinitionContainerNative
              columns={this.state.columnDefinitions}
              addColumn={this.addColumn}
              moveColumnDown={this.moveColumnDown}
              moveColumnUp={this.moveColumnUp}
              removeAllColumns={this.removeAllColumns}
              removeColumn={this.removeColumn}
              saveColumn={this.saveColumn}



              />

          </Panel>
          : ''}

      </div>
    );
  }
}



