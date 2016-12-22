﻿import * as utils from "../utils/utils";
import * as React from "react";

const connect = require("react-redux").connect;
import { addListItem, removeListItem, getListItemsAction, saveListItemAction, undoListItemChangesAction, updateListItemAction, } from "../actions/listItemActions";
import { getLookupOptionAction } from "../actions/lookupOptionsActions";
import ListItem from "../model/ListItem";
import ColumnDefinition from "../model/ColumnDefinition";
import { LookupOption, LookupOptions, LookupOptionStatus } from "../model/LookupOptions";

import GridRowStatus from "../model/GridRowStatus";
import ListDefinition from "../model/ListDefinition";
import { Button, ButtonType, TextField, IDropdownOption, Dropdown, Spinner, SpinnerType, ISpinnerProps, } from "office-ui-fabric-react";

import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { DatePicker, IDatePickerStrings } from "office-ui-fabric-react/lib/DatePicker";

import Container from "../components/container";
import { Log } from "@microsoft/sp-client-base";
import { SharePointLookupCellFormatter } from "../components/SharePointFormatters";
interface IListViewPageProps extends React.Props<any> {
  listItems: Array<ListItem>;
  lookupOptions: Array<LookupOptions>;
  columns: Array<ColumnDefinition>;
  listDefinitions: Array<ListDefinition>;
  addListItem: (ListItem) => void;
  removeListItem: (ListItem) => void;
  getListItems: (listDefinitions: Array<ListDefinition>) => void;
  updateListItem: (ListItem: ListItem, ListDef: ListDefinition) => void;
  getLookupOptionAction: (lookupSite, lookupWebId, lookupListId, lookupField) => void;
  undoItemChanges: (ListItem) => void;
  saveListItem: (ListItem) => void;
}
function mapStateToProps(state) {

  return {
    listItems: state.items,
    columns: state.columns,
    listDefinitions: state.lists,
    systemStatus: state.systemStatus,
    lookupOptions: state.lookupOptions
  };
}
export class GridColumn {
  constructor(
    public id: string,
    public name: string,
    public editable: boolean,
    public width: number,
    public formatter: string = "",
    public editor?: string) { }
}
function mapDispatchToProps(dispatch) {
  return {
    addListItem: (): void => {
      dispatch(addListItem(new ListItem("123-123123123-123123-123123")));
    },

    removeListItem: (): void => {
      dispatch(removeListItem(new ListItem("123-123123123-123123-123123")));
    },
    saveListItem: (listItem: ListItem): void => {
      dispatch(saveListItemAction(listItem));
    },
    undoItemChanges: (listItem: ListItem): void => {
      dispatch(undoListItemChangesAction(listItem));
    },
    updateListItem: (listItem: ListItem, listDef: ListDefinition): void => {
      const promise: Promise<any> = updateListItemAction(dispatch, listDef, listItem);
      dispatch(promise); // need to ewname this one to be digfferent from the omported ome

    },
    getListItems: (listDefinitions: Array<ListDefinition>): void => {
      const promise: Promise<any> = getListItemsAction(dispatch, listDefinitions);
      dispatch(promise); // need to ewname this one to be digfferent from the omported ome
    },
    getLookupOptionAction: (lookupSite, lookupWebId, lookupListId, lookupField): void => {

      const promise: Promise<any> = getLookupOptionAction(dispatch, lookupSite, lookupWebId, lookupListId, lookupField);
      dispatch(promise); // need to ewname this one to be digfferent from the omported ome

    },
  };
}
interface IGridState {
  editing: {
    entityid: string;
    columnid: string;
  };
}
class ListItemContainer extends React.Component<IListViewPageProps, IGridState> {
  public constructor() {
    super();
    this.CellContentsEditable = this.CellContentsEditable.bind(this);
    this.CellContents = this.CellContents.bind(this);
    this.TableDetail = this.TableDetail.bind(this);
    this.TableRow = this.TableRow.bind(this);
    this.TableRows = this.TableRows.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);

    this.handleCellUpdated = this.handleCellUpdated.bind(this);
    this.handleCellUpdatedEvent = this.handleCellUpdatedEvent.bind(this);
    this.undoItemChanges = this.undoItemChanges.bind(this);
    this.updateListItem = this.updateListItem.bind(this);
    this.getLookupOptions = this.getLookupOptions.bind(this);

  }
  public componentWillMount() {
    this.props.getListItems(this.props.listDefinitions);
  }
  public getParent(node: Node, type: string): Node {
    while (node.nodeName !== "TD") {
      node = node.parentNode;
    }
    return node;
  }

  public toggleEditing(event) {
    Log.verbose("list-Page", "focus event fired editing  when entering cell");

    const target = this.getParent(event.target, "TD"); // walk up the Dom to the TD, thats where the IDs are stored
    const attributes: NamedNodeMap = target.attributes;
    const entityid = attributes.getNamedItem("data-entityid").value;
    const columnid = attributes.getNamedItem("data-columnid").value;
    this.setState({ "editing": { entityid: entityid, columnid: columnid } });
  }
  public undoItemChanges(event): void {

    let value;
    const target = event.target;
    value = target.value;
    const parentTD = this.getParent(event.target, "TD");
    const attributes: NamedNodeMap = parentTD.attributes;
    const entityitem = attributes.getNamedItem("data-entityid");
    const entityid = entityitem.value;
    const entity: ListItem = this.props.listItems.find((temp) => temp.GUID === entityid);

    this.props.undoItemChanges(entity);
  }
  public updateListItem(event): void {

    const parentTD = this.getParent(event.target, "TD");
    const attributes: NamedNodeMap = parentTD.attributes;
    // const entityitem = attributes.getNamedItem("data-entityid");
    // const entityid = entityitem.value;
    const entityid = attributes.getNamedItem("data-entityid").value;
    const entity: ListItem = this.props.listItems.find((temp) => temp.GUID === entityid);
    const listDef = this.getListDefinition(entity.__metadata__ListDefinitionId);

    this.props.updateListItem(entity, listDef);
  }
  private handleCellUpdatedEvent(event) { //native react uses a Synthetic event
    this.handleCellUpdated(event.target.value);
  }
  private handleCellUpdated(value) { // Office UI Fabric does not use events. It just calls this method with the new value

    let {entityid, columnid} = this.state.editing;
    const entity: ListItem = this.props.listItems.find((temp) => temp.GUID === entityid);
    const listDef = this.getListDefinition(entity.__metadata__ListDefinitionId);
    const columnReference = listDef.columnReferences.find(cr => cr.columnDefinitionId === columnid);
    const internalName = utils.ParseSPField(columnReference.name).id;
    if (!entity.__metadata__OriginalValues) { //SAVE  orgininal values so we can undo;
      entity.__metadata__OriginalValues = _.cloneDeep(entity); // need deep if we have lookup values
    }
    entity.__metadata__GridRowStatus = GridRowStatus.modified;
    switch (columnReference.fieldDefinition.TypeAsString) {
      case "DateTime":
        entity[internalName] = value.getFullYear() + value.getMonth() + 1 + value.getDate() + "T00:00:00Z";
        break;
      case "Lookup":
        if (!entity[internalName]) {// if  value was not previously set , then this is undefined//
          entity[internalName] = {};// set new value to an empty objecte
        }
        entity[internalName]["Id"] = value.key;//and then fill in the values
        entity[internalName][columnReference.fieldDefinition.LookupField] = value.text;
        break;
      default:
        entity[internalName] = value;
    }
    this.props.saveListItem(entity);
  }
  /** gets the options to display for a lookupField */
  public getLookupOptions(lookupSite: string, lookupWebId: string, lookupListId: string, lookupField: string): LookupOptions {
    // see if the options are in the store, if so, return them, otherwoise dispatch an action to get them
    let lookupoptions = this.props.lookupOptions.find(x => {
      return (x.lookupField === lookupField) &&
        (x.lookupListId === lookupListId) &&
        (x.lookupSite === lookupSite) &&
        (x.lookupWebId === lookupWebId)
    });
    if (lookupoptions === undefined) {
      this.props.getLookupOptionAction(lookupSite, lookupWebId, lookupListId, lookupField);
    }

    return lookupoptions;
  }

  public CellContentsEditable(props: { entity: ListItem, column: ColumnDefinition, cellUpdated: (newValue) => void, cellUpdatedEvent: (event: React.SyntheticEvent) => void; }): JSX.Element {

    const {entity, column, cellUpdated, cellUpdatedEvent} = props;
    const listDef = this.getListDefinition(entity.__metadata__ListDefinitionId);
    const colref = listDef.columnReferences.find(cr => cr.columnDefinitionId === column.guid);
    const internalName = utils.ParseSPField(colref.name).id;
    const columnValue = entity[internalName];
    switch (colref.fieldDefinition.TypeAsString) {
      case "Lookup":

        let lookupField = colref.fieldDefinition.LookupField;
        let lookupListId = colref.fieldDefinition.LookupList;
        let lookupWebId = colref.fieldDefinition.LookupWebId;
        /**
         * We are assuming here that the lookup listy is in the same web.
         *
         */
        lookupWebId = utils.ParseSPField(listDef.webLookup).id; // temp fix. Need to use graph to get the web by id in the site
        let lookupSite = listDef.siteUrl;
        let lookupOptions = this.getLookupOptions(lookupSite, lookupWebId, lookupListId, lookupField);
        debugger;

        if (lookupOptions) {
          switch (lookupOptions.status) {
            case LookupOptionStatus.fetched:
              let options: IDropdownOption[] = lookupOptions.lookupOption.map((opt, index, options) => {
                return { key: opt.id, text: opt.value };
              });
              return (
                <Dropdown label="" options={options} selectedKey={(columnValue ? columnValue.Id : null)} onChanged={(selection: IDropdownOption) => { debugger; cellUpdated(selection) } } >
                </Dropdown >
              );
            case LookupOptionStatus.fetching:
              return (
                <Spinner type={SpinnerType.normal} />
              );
            case LookupOptionStatus.error:
              return (
                <Spinner label="Error" type={SpinnerType.normal} />
              );
            default:
              return (
                <Spinner type={SpinnerType.normal} />
              );
          }
        } else {
          return (
            <Spinner type={SpinnerType.normal} />
          );
        }
      case "Choice":
        let choices = colref.fieldDefinition.Choices.map((c, i) => {
          let opt: IDropdownOption = {
            index: i,
            key: c,
            text: c,
            isSelected: (c === columnValue)
          };
          return opt;
        });
        return (
          <Dropdown label="" selectedKey={entity[columnValue]} options={choices} onChanged={(selection: IDropdownOption) => cellUpdated(selection)} >
          </Dropdown >
        );
      case "Text":
        return (
          <input autoFocus type="text"
            value={columnValue}
            onChange={cellUpdatedEvent} />);
      case "Note":
        return (
          <TextField autoFocus
            value={columnValue}
            onChanged={cellUpdated} />);

      case "DateTime":
        const datpickerStrings: IDatePickerStrings = {
          "months": [""],
          "shortMonths": [""],
          "days": [""],
          "shortDays": [""],
          goToToday: "yes"
        };
        return (
          <DatePicker strings={datpickerStrings} onSelectDate={cellUpdated}
            allowTextInput={true} isRequired={colref.fieldDefinition.Required}
            />);
      default:
        return (
          <input autoFocus type="text"
            value={columnValue}
            onChange={cellUpdatedEvent} />);
    }
  }
  /** Returns the ListDefinition for the given ListDefinionId */
  public getListDefinition(
    /** The id of the list definition to be retrieved */
    listdefid: string
  ): ListDefinition {
    return this.props.listDefinitions.find(ld => ld.guid === listdefid);
  }

  //   public getColumnReference(entity: ListItem, column: ColumnDefinition): ColumnReference {
  //     const listDef = this.getListDefinition(entity.__metadata__ListDefinitionId);
  //     const colref = listDef.columnReferences.find(cr => cr.columnDefinitionId === column.guid);
  // return colref;
  //   }

  public CellContents(props: { entity: ListItem, column: ColumnDefinition }): JSX.Element {

    const {entity, column} = props;
    const listDef = this.getListDefinition(entity.__metadata__ListDefinitionId);
    const colref = listDef.columnReferences.find(cr => cr.columnDefinitionId === column.guid);
    if (colref === undefined) { //Column has not been configured for this list
      return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >
        'Column Not Defined'
        </a>
      );
    }
    const internalName = utils.ParseSPField(colref.name).id;

    switch (colref.fieldDefinition.TypeAsString) {
      case "Lookup":

        if (entity[internalName] === undefined) { // value not set
          return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >

          </a>
          );
        } else {
          return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >
            {entity[internalName][colref.fieldDefinition.LookupField]}
          </a>
          );
        }
      case "Text":
        return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >
          {entity[internalName]}
        </a>
        );
      case "Note":
        let content = (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >
        </a>);
        return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} dangerouslySetInnerHTML={{ __html: entity[internalName] }} >
        </a>
        );

      case "DateTime":
        let value: string;
        if (entity[internalName] === null) {
          return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >

          </a>);
        }
        if (colref.fieldDefinition.EntityPropertyName === "DateOnly") {
          value = entity[internalName].split("T")[0];
        }
        else {
          value = entity[internalName];
        }
        return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >
          {value}
        </a>
        );
      default:
        return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >
          {entity[internalName]}
        </a>
        );
    }
  }

  public TableDetail(props: { entity: ListItem, column: ColumnDefinition, cellUpdated: (newValue) => void, cellUpdatedEvent: (event: React.SyntheticEvent) => void; }): JSX.Element {

    const {entity, column, cellUpdated, cellUpdatedEvent} = props;
    if (this.state && this.state.editing && this.state.editing.entityid === entity.GUID && this.state.editing.columnid === column.guid && column.editable) {
      return (<td data-entityid={entity.GUID} data-columnid={column.guid} style={{ border: "2px solid black", padding: "0px" }}>
        <this.CellContentsEditable entity={entity} column={column} cellUpdated={this.handleCellUpdated} cellUpdatedEvent={this.handleCellUpdatedEvent} />
      </td>
      );
    } else {
      return (<td data-entityid={entity.GUID} data-columnid={column.guid} style={{ border: "1px solid black", padding: "0px" }} onClick={this.toggleEditing} >
        <this.CellContents entity={entity} column={column} />
      </td>
      );
    }
  }
  public TableRow(props: { entity: ListItem, columns: Array<ColumnDefinition>, cellUpdated: (newValue) => void, cellUpdatedEvent: (event: React.SyntheticEvent) => void; }): JSX.Element {
    const {entity, columns, cellUpdated, cellUpdatedEvent} = props;
    return (
      <tr>
        {
          columns.map(function (column) {
            return (
              <this.TableDetail key={column.guid} entity={entity} column={column} cellUpdated={this.handleCellUpdated} cellUpdatedEvent={this.handleCellUpdatedEvent} />
            );
          }, this)
        }
        <td data-entityid={entity.GUID} data-columnid={""} width="200" onClick={this.toggleEditing} >
          <div>

            <Button width="20" style={{ padding: 0 }}
              onClick={this.updateListItem} alt="Save to Sharepoint"
              buttonType={ButtonType.icon}
              icon="Save" disabled={!(entity.__metadata__OriginalValues)} />
            <Button width="20" style={{ padding: 0 }}
              // onClick={this.deleteList}
              buttonType={ButtonType.icon}
              icon="Delete" />
            <Button width="20" style={{ padding: 0 }}
              // onClick={this.deleteList}
              buttonType={ButtonType.icon}
              disabled={!(entity.__metadata__OriginalValues)}
              onClick={this.undoItemChanges}
              icon="Undo" />
          </div>
        </td>
      </tr>);
  };
  public TableRows(props: { entities: Array<ListItem>, columns: Array<ColumnDefinition>, cellUpdated: (newValue) => void, cellUpdatedEvent: (event: React.SyntheticEvent) => void; }): JSX.Element {
    const {entities, columns, cellUpdated, cellUpdatedEvent} = props;
    return (
      <tbody>
        {
          entities.map(function (list) {
            return (
              <this.TableRow key={list.GUID} entity={list} columns={columns} cellUpdated={this.handleCellUpdated} cellUpdatedEvent={this.handleCellUpdatedEvent} />
            );
          }, this)
        }
      </tbody>
    );
  }
  public render() {
    const { listItems, addListItem, removeListItem, getListItems } = this.props;
    return (
      <Container testid="columns" size={2} center>
        <CommandBar items={[{
          key: "AddItem",
          name: "Add an Item",
          icon: "Add",

        },
        {
          key: "DleteAll",
          name: "DeleteAll",
          icon: "Delete"
        },
        {
          key: "Undo All changes",
          name: "UndoAll",
          icon: "Undo"
        },
        {
          key: "Save All  ",
          name: "Save To SharePoint",
          icon: "Save"

        }]} />

        <table border="1">
          <thead>
            <tr>
              {this.props.columns.map((column) => {
                return <th key={column.name}>{column.name}</th>;
              })}
            </tr>
          </thead>
          {
            <this.TableRows entities={listItems} columns={this.props.columns} cellUpdated={this.handleCellUpdated} cellUpdatedEvent={this.handleCellUpdatedEvent} />

          })}
        </table>
      </Container>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItemContainer);
