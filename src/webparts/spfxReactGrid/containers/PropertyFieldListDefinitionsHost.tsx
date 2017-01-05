
import { ListDefinitionContainerNative } from "./ListDefinitionContainer";
import ListDefinition from "../model/ListDefinition";
import ColumnDefinition from "../model/ColumnDefinition";
import { Site, Web, WebList, WebListField } from "../model/Site";
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Button } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as strings from "spfxReactGridStrings";
import * as utils from "../utils/utils";
import { Web as SPWeb } from "sp-pnp-js";
import { Site as SPSite } from "sp-pnp-js";
import { Guid, Log, PageContext } from "@microsoft/sp-client-base";

export interface IPropertyFieldListDefinitionsHostProps {
  label: string;
  initialValue?: Array<ListDefinition>;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  ListDefinitions: Array<ListDefinition>;
  ColumnDefinitions: Array<ColumnDefinition>;
  PageContext: PageContext;
}
export interface IPropertyFieldListDefinitionsHostState {
  openPanel?: boolean;
  ListDefinitions: Array<ListDefinition>;
  Sites: Array<Site>;
}
export default class PropertyFieldListDefinitionsHost extends React.Component<IPropertyFieldListDefinitionsHostProps, IPropertyFieldListDefinitionsHostState> {

  constructor(props: IPropertyFieldListDefinitionsHostProps) {
    debugger;
    super(props);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);
    this.removeList = this.removeList.bind(this);
    this.addList = this.addList.bind(this);
    this.moveListUp = this.moveListUp.bind(this);
    this.moveListDown = this.moveListDown.bind(this);
    this.getWebs = this.getWebs.bind(this);
    this.getListsForWeb = this.getListsForWeb.bind(this);
    this.getFieldsForList = this.getFieldsForList.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.state = {
      ListDefinitions: this.props.ListDefinitions,
      openPanel: false,
      Sites: []
    };
  }
  getWebs(siteUrl: string): any {
    debugger;
    const site: SPSite = new SPSite(siteUrl);
    const promise = site.rootWeb.webs.orderBy("Title").get()
      .then((response) => {
        const data = _.map(response, (item: any) => {
          const web: Web = new Web(item.Id, item.Title, item.Url);
          return web;
        });
        console.log(data);
        let site: Site = new Site(siteUrl);
        site.webs = data;
        this.state.Sites.push(site);
        this.setState(this.state);
      })
      .catch((error) => {
        console.log(error);
      });
    return promise;
  }

  getListsForWeb(webUrl: string): any {
    debugger;
    const web = new SPWeb(webUrl);
    const promise = web.lists.orderBy("Title").get()
      .then((response) => {
        const data = _.map(response, (item: any) => {
          return new WebList(item.Id, item.Title, item.Url, );
        });
        for (const site of this.state.Sites) {
          for (const web of site.webs) {
            if (web.url === webUrl) {
              web.lists = data;
              web.listsFetched = true;
            }
          }
        }
        this.setState(this.state);

      })
      .catch((error) => {
        console.log(error);
      });
    return promise;
  }

  getFieldsForList(webUrl: string, listId: string): any {
    debugger;
    const web = new SPWeb(webUrl);
    const promise = web.lists.getById(listId).fields.filter("Hidden eq false").orderBy("Title").get()
      .then((response) => {
        const data = _.map(response, (item: any) => {
          return new WebListField(item.id, new utils.ParsedSPField(item.InternalName, item.Title).toString(), item);
        });
        for (const site of this.state.Sites) {
          for (const web of site.webs) {
            if (web.url === webUrl) {
              for (const list of web.lists) {
                if (list.id === listId) {
                  list.fields = data;
                  list.fieldsFetched = true;
                }
              }
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return promise;
  }
  private addList(siteUrl): void {
    const id = Guid.newGuid();
    const list: ListDefinition = new ListDefinition(id.toString(), null, null, siteUrl, null, null);

    this.state.ListDefinitions.push(list);
    this.setState(this.state);
  }
  private removeList(list: ListDefinition): void {

    this.state.ListDefinitions = _.filter(this.state.ListDefinitions, (o) => { return o.guid !== list.guid; });
    this.setState(this.state);
  }
  private removeAllLists(): void {

    this.state.ListDefinitions = [];
    this.setState(this.state);
  }
  private moveListUp(list: ListDefinition): void {

    const index = _.findIndex(this.state.ListDefinitions, (cd) => cd.guid === list.guid);
    this.state.ListDefinitions[index] = this.state.ListDefinitions.splice(index - 1, 1, this.state.ListDefinitions[index])[0];
    this.setState(this.state);
  }
  private moveListDown(list: ListDefinition): void {

    const index = _.findIndex(this.state.ListDefinitions, (cd) => cd.guid === list.guid);
    this.state.ListDefinitions[index] = this.state.ListDefinitions.splice(index + 1, 1, this.state.ListDefinitions[index])[0];
    this.setState(this.state);

  }
  private saveChanges(): void {
    if (this.props.onPropertyChange) {

      //this.props.properties.ListDefinitions = this.state.ListDefinitions;
      this.props.onPropertyChange("ListDefinitions", this.props.initialValue, this.state.ListDefinitions);
    }
  }
  private onOpenPanel(element?: any): void {

    this.state.openPanel = true;
    this.setState(this.state);
  }
  private onClosePanel(element?: any): void {
    this.state.openPanel = false;
    this.setState(this.state);
  }
  public render(): JSX.Element {

    //Renders content
    return (
      <div style={{ marginBottom: '8px' }}>
        <Label>{this.props.label}</Label>
        <Button onClick={this.onOpenPanel}>{strings.ListDefinitionsButtonSelect}</Button>
        {this.state.openPanel === true ?
          <Panel
            isOpen={this.state.openPanel} hasCloseButton={true} onDismiss={this.onClosePanel}
            isLightDismiss={true} type={PanelType.large}
            headerText={strings.ListDefinitionsTitle}>
            <ListDefinitionContainerNative
              columnRefs={this.props.ColumnDefinitions}
              lists={this.state.ListDefinitions}
              addList={this.addList}
              getFieldsForList={this.getFieldsForList}
              getListsForWeb={this.getListsForWeb}
              getWebs={this.getWebs}
              removeAllLists={this.removeAllLists}
              removeList={this.removeList}
              sites={this.state.Sites}
              saveList={this.saveChanges}
              save={this.saveChanges}
              pageContext={this.props.PageContext}
              />

          </Panel>
          : ''}

      </div>
    );
  }
}



