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
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  properties: any;
}
export interface IPropertyFieldColumnDefinitionsHostState {
  openPanel?: boolean;
  columnDefinitions: Array<ColumnDefinition>;
}
export default class PropertyFieldColumnDefinitionsHost extends React.Component<IPropertyFieldColumnDefinitionsHostProps, IPropertyFieldColumnDefinitionsHostState> {

  constructor(props: IPropertyFieldColumnDefinitionsHostProps) {
    debugger;
    super(props);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);

    this.addColumn = this.addColumn.bind(this);
    this.moveColumnDown = this.moveColumnDown.bind(this);
    this.moveColumnUp = this.moveColumnUp.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.state = {
      columnDefinitions: this.props.properties.columns,
      openPanel: false
    };
  }
  private addColumn(): void {
    const id = Guid.newGuid();
    const col: ColumnDefinition = new ColumnDefinition(id.toString(), "", 80, true);
    debugger;
    this.state.columnDefinitions.push(col);
    this.setState(this.state);
  }
  removeColumn(column): void {
    debugger;
    this.state.columnDefinitions = _.filter(this.state.columnDefinitions, (o) => { return o.guid !== column.guid; });
    this.setState(this.state);
  }
  removeAllColumns(): void {
    debugger;
    this.state.columnDefinitions = [];
    this.setState(this.state);

  }
  moveColumnUp(column: ColumnDefinition): void {
    debugger;
    const index = _.findIndex(this.state.columnDefinitions, (cd) => cd.guid === column.guid);
    this.state.columnDefinitions[index] = this.state.columnDefinitions.splice(index - 1, 1, this.state.columnDefinitions[index])[0];
    this.setState(this.state);

  }
  moveColumnDown(column): void {
    debugger;
    const index = _.findIndex(this.state.columnDefinitions, (cd) => cd.guid === column.guid);
    this.state.columnDefinitions[index] = this.state.columnDefinitions.splice(index + 1, 1, this.state.columnDefinitions[index])[0];
    this.setState(this.state);

  }
  private saveChanges(): void {
    if (this.props.onPropertyChange) {
      debugger;
      this.props.properties.ColumnDefinitions = this.state.columnDefinitions;
      this.props.onPropertyChange("ColumnDefinitions", this.props.initialValue, this.state.columnDefinitions);
    }
  }
  private onOpenPanel(element?: any): void {
    debugger;
    this.state.openPanel = true;
    this.setState(this.state);
  }
  private onClosePanel(element?: any): void {
    this.state.openPanel = false;
    this.setState(this.state);
  }

  public render(): JSX.Element {
    debugger;
    //Renders content
    return (
      <div style={{ marginBottom: '8px' }}>
        <Label>{this.props.label}</Label>
        <Button onClick={this.onOpenPanel}>{strings.ColumnDefinitionsButtonSelect}</Button>
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
              save={this.saveChanges}
              />

          </Panel>
          : ''}

      </div>
    );
  }
}



