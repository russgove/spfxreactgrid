import * as utils from "../utils/utils";
import * as React from "react";

const connect = require("react-redux").connect;
import { addListItem, removeListItem, getListItemsAction, saveListItemAction, undoListItemChangesAction, updateListItemAction } from "../actions/listItemActions";
import ListItem from "../model/ListItem";
import ColumnDefinition from "../model/ColumnDefinition";

import GridRowStatus from "../model/GridRowStatus";
import ListDefinition from "../model/ListDefinition";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";

import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { DatePicker, IDatePickerStrings } from "office-ui-fabric-react/lib/DatePicker";

import Container from "../components/container";
import { Log } from "@microsoft/sp-client-base";
import { SharePointLookupCellFormatter } from "../components/SharePointFormatters";
interface IListViewPageProps extends React.Props<any> {
  listItems: Array<ListItem>;
  columns: Array<ColumnDefinition>;
  listDefinitions: Array<ListDefinition>;
  addListItem: (ListItem) => void;
  removeListItem: (ListItem) => void;
  getListItems: (listDefinitions: Array<ListDefinition>) => void;
  updateListItem: (ListItem:ListItem, ListDef:ListDefinition) => void;
  undoItemChanges: (ListItem) => void;
  saveListItem: (ListItem) => void;
}
function mapStateToProps(state) {
debugger;
  return {
    listItems: state.items,
    columns: state.columns,
    listDefinitions: state.lists,
    systemStatus:state.systemStatus
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
    getListItems: (listDefinitions: Array<ListDefinition>): void => {
      const promise: Promise<any> = getListItemsAction(dispatch, listDefinitions);
      dispatch(promise); // need to ewname this one to be digfferent from the omported ome
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
    updateListItem: (listItem: ListItem, listDef:ListDefinition): void => {
       const promise: Promise<any> = updateListItemAction(dispatch, listDef,listItem);
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
    this.handleRowUpdated = this.handleRowUpdated.bind(this);
    this.undoItemChanges = this.undoItemChanges.bind(this);
    this.updateListItem = this.updateListItem.bind(this);

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
    const entityid= attributes.getNamedItem("data-entityid").value;
    const entity: ListItem = this.props.listItems.find((temp) => temp.GUID === entityid);
    const listDef=this.getListDefinition(entity.__metadata__ListDefinitionId);
    debugger;
    this.props.updateListItem(entity,listDef);
  }
  public handleRowUpdated(event): void {

    //let xx = new SyntheticEvent();
    //if (event instanceof  SyntheticEvent) Not working
    let value;
    let entityid, columnid: string;
    if (event.target) { // can get instanceof working. Assum,e if it has a target, then its an event
      const target = event.target;
      value = target.value;
      const parentTD = this.getParent(event.target, "TD");
      const attributes: NamedNodeMap = parentTD.attributes;
      const entityitem = attributes.getNamedItem("data-entityid");
      entityid = entityitem.value;
      columnid = attributes.getNamedItem("data-columnid").value;

    }
    else {
      value = event;
      entityid = this.state.editing.entityid;
      columnid = this.state.editing.columnid;
    }
    let entity: ListItem = this.props.listItems.find((temp) => temp.GUID === entityid);
    const listDef = this.getListDefinition(entity.__metadata__ListDefinitionId);
    const columnReference = listDef.columnReferences.find(cr => cr.columnDefinitionId === columnid);
    const internalName = utils.ParseSPField(columnReference.name).id;
    if (!entity.__metadata__OriginalValues) { //SAVE  orgininal values so we can undo;
      entity.__metadata__OriginalValues = _.clone(entity);
    }
    entity.__metadata__GridRowStatus = GridRowStatus.modified;
    switch (columnReference.fieldDefinition.TypeAsString) {
      case "DateTime":
        entity[internalName] = value.getFullYear() + value.getMonth() + 1 + value.getDate() + "T00:00:00Z";
        break;
      default:
        entity[internalName] = value;
    }

    // now what;

    this.props.saveListItem(entity);

  }
  public CellContentsEditable(props: { entity: ListItem, column: ColumnDefinition, valueChanged: (event) => void; }): JSX.Element {

    const {entity, column, valueChanged} = props;
    const listDef = this.getListDefinition(entity.__metadata__ListDefinitionId);
    const colref = listDef.columnReferences.find(cr => cr.columnDefinitionId === column.guid);
    const internalName = utils.ParseSPField(colref.name).id;
    const columnValue = entity[internalName];
    switch (colref.fieldDefinition.TypeAsString) {
      case "Text":
        return (
          <input autoFocus type="text"
            value={columnValue}
            onChange={valueChanged} onBlur={valueChanged} />);

      case "DateTime":
        const datpickerStrings: IDatePickerStrings = {
          "months": [""],
          "shortMonths": [""],
          "days": [""],
          "shortDays": [""],
          goToToday: "yes"
        };
        return (
          <DatePicker strings={datpickerStrings} onSelectDate={valueChanged}
            allowTextInput={true} isRequired={colref.fieldDefinition.Required}
            />);
      default:
        return (
          <input autoFocus type="text"
            value={columnValue}
            onChange={valueChanged} onBlur={valueChanged} />);
    }
  }

  public getListDefinition(listdefid): ListDefinition {
    return this.props.listDefinitions.find(ld => ld.guid === listdefid);
  }

  //   public getColumnReference(entity: ListItem, column: ColumnDefinition): ColumnReference {
  //     const listDef = this.getListDefinition(entity.__metadata__ListDefinitionId);
  //     const colref = listDef.columnReferences.find(cr => cr.columnDefinitionId === column.guid);
  // return colref;
  //   }

  public CellContents(props: { entity: ListItem, column: ColumnDefinition, rowChanged: (event) => void; }): JSX.Element {

    const {entity, column, rowChanged} = props;
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
      case "Text":
        return (<a href="#" onFocus={this.toggleEditing} style={{ textDecoration: "none" }} >
          {entity[internalName]}
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

  public TableDetail(props: { entity: ListItem, column: ColumnDefinition, rowChanged: (event) => void; }): JSX.Element {

    const {entity, column, rowChanged} = props;
    if (this.state && this.state.editing && this.state.editing.entityid === entity.GUID && this.state.editing.columnid === column.guid) {
      return (<td data-entityid={entity.GUID} data-columnid={column.guid} style={{ border: "2px solid black", padding: "0px" }}>
        <this.CellContentsEditable entity={entity} column={column} valueChanged={rowChanged} />
      </td>
      );
    } else {
      return (<td data-entityid={entity.GUID} data-columnid={column.guid} style={{ border: "1px solid black", padding: "0px" }} onClick={this.toggleEditing} >
        <this.CellContents entity={entity} column={column} rowChanged={rowChanged} />
      </td>
      );
    }
  }
  public TableRow(props: { entity: ListItem, columns: Array<ColumnDefinition>, rowChanged: (event) => void; }): JSX.Element {
    const {entity, columns, rowChanged} = props;
    return (
      <tr>
        {
          columns.map(function (column) {
            return (
              <this.TableDetail key={column.guid} entity={entity} column={column} rowChanged={rowChanged} />
            );
          }, this)
        }
        <td data-entityid={entity.GUID} >
          <div>

            <Button width="20"
               onClick={this.updateListItem}
              buttonType={ButtonType.hero}
              icon="Save"  disabled={!(entity.__metadata__OriginalValues)} />
            <Button width="20"
              // onClick={this.deleteList}
              buttonType={ButtonType.hero}
              icon="Delete" />
            <Button width="20"
              // onClick={this.deleteList}
              buttonType={ButtonType.hero}
              disabled={!(entity.__metadata__OriginalValues)}
              onClick={this.undoItemChanges}
              icon="Undo" />
          </div>
        </td>
      </tr>);
  };
  public TableRows(props: { entities: Array<ListItem>, columns: Array<ColumnDefinition>, rowChanged: (event) => void; }): JSX.Element {
    const {entities, columns, rowChanged} = props;
    return (
      <tbody>
        {
          entities.map(function (list) {
            return (
              <this.TableRow key={list.GUID} entity={list} columns={columns} rowChanged={rowChanged} />
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
            <this.TableRows entities={listItems} columns={this.props.columns} rowChanged={this.handleRowUpdated} />

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
