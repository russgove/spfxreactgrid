/**
 * @file PropertyFieldColumnDefinitionsHost.tsx
 * Renders the controls for PropertyFieldColumnDefinitions component
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
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

/**
 * @interface
 * PropertyFieldColumnDefinitionsHost properties interface
 *
 */
// export interface IPropertyFieldColumnDefinitionsHostProps extends IPropertyFieldColumnDefinitionsPropsInternal {
// }
export interface IPropertyFieldColumnDefinitionsHostProps {

  /**
   * @var
   * Property field label displayed on top
   */
  label: string;
  /**
   * @var
   * Initial value
   */
  initialValue?: Array<ColumnDefinition>;
  /**
   * @var
   * Parent web part context
   */
  context: IWebPartContext;
  /**
   * @function
//    * Defines a onPropertyChange function to raise when the selected Color changed.
   * Normally this function must be always defined with the 'this.onPropertyChange'
   * method of the web part object.
   */
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  /**
 * @var
 * Parent Web Part properties
 */
  properties: any;
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
    this.onImageRender = this.onImageRender.bind(this);
    this.onClickRecent = this.onClickRecent.bind(this);
    this.onClickSite = this.onClickSite.bind(this);
    this.onClickUpload = this.onClickUpload.bind(this);
    this.mouseEnterImage = this.mouseEnterImage.bind(this);
    this.mouseLeaveImage = this.mouseLeaveImage.bind(this);
     this.moveColumnUp = this.moveColumnUp.bind(this);

    // this.handleIframeData = this.handleIframeData.bind(this);
    this.onEraseButton = this.onEraseButton.bind(this);

    //Inits the state
    this.state = {
      columnDefinitions: this.props.initialValue,
      openPanel: false,
      openRecent: false,
      openSite: true,
      openUpload: false
    };

    //Load recent images
    this.LoadRecentImages();
  }
  private addColumn(): void {
    const id = Guid.newGuid();
    const col: ColumnDefinition = new ColumnDefinition(id.toString(), "", 80, true);
    debugger;
    // dispatch(addColumn(col));
  }
  saveColumn(updatedRowData): void {
    debugger;
    //  dispatch(saveColumn(updatedRowData));
  }
  removeColumn(column): void {
    debugger;
    //  dispatch(removeColumn(column));
  }
  removeAllColumns(): void {
    debugger;
    // dispatch(removeAllColumns());
  }
  moveColumnUp(column): void {
    debugger;
    ColumnReducers.moveColumnUp(this.props.properties.columns,column);
    // dispatch(moveCulumnUp(column));
  }
  moveColumnDown(column): void {
    debugger;
    // dispatch(moveCulumnDown(column));
  }

  /**
   * @function
   * Save the image value
   *
   */
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
  * Intercepts the iframe onedrive messages
  *
  */
  // private handleIframeData(element?: any) {
  //   if (this.state.openSite != true || this.state.openPanel != true)
  //     return;
  //   var data: string = element.data;
  //   var indexOfPicker = data.indexOf("[OneDrive-FromPicker]");
  //   if (indexOfPicker != -1) {
  //     var message = data.replace("[OneDrive-FromPicker]", "");
  //     var messageObject = JSON.parse(message);
  //     if (messageObject.type == "cancel") {
  //       this.onClosePanel();
  //     } else if (messageObject.type == "success") {
  //       var imageUrl = messageObject.items[0].sharePoint.url;
  //       if (imageUrl.indexOf(".doc") > -1 || imageUrl.indexOf(".docx") > -1 || imageUrl.indexOf(".ppt") > -1 ||
  //        imageUrl.indexOf(".pptx") > -1 || imageUrl.indexOf(".xls") > -1 || imageUrl.indexOf(".xlsx") > -1 ||
  //        imageUrl.indexOf(".pdf") > -1  || imageUrl.indexOf(".txt") > -1) {
  //         this.state.selectedImage = imageUrl;
  //         this.setState(this.state);
  //         this.saveImageProperty(imageUrl);
  //         this.onClosePanel();
  //        }
  //     }
  //   }
  // }

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

  private LoadRecentImages(): void {
    //var folderService: SPFolderPickerService = new SPFolderPickerService(this.props.context);
    //folderService.getFolders(this.state.currentSPFolder, this.currentPage, this.pageItemCount).then((response: ISPFolders) => {
    //Binds the results
    //this.state.childrenFolders = response;
    //this.setState({ openRecent: this.state.openRecent,openSite: this.state.openSite, openUpload: this.state.openUpload, loading: false, selectedFolder: this.state.selectedFolder, currentSPFolder: this.state.currentSPFolder, childrenFolders: this.state.childrenFolders });
    //});
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
              columns={this.props.properties.columns}
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


  private mouseEnterImage(element?: any): void {
    element.currentTarget.style.backgroundColor = 'grey';
    element.currentTarget.children[0].children[0].style.visibility = 'visible';
  }

  private mouseLeaveImage(element?: any): void {
    element.currentTarget.style.backgroundColor = 'white';
    element.currentTarget.children[0].children[0].style.visibility = 'hidden';
  }

  private onImageRender(item?: any, index?: number): React.ReactNode {
    return (
      <div style={{ padding: '2px', width: '191px', height: '191px', display: 'inline-block' }} onMouseEnter={this.mouseEnterImage} onMouseLeave={this.mouseLeaveImage}>
        <div style={{
          cursor: 'pointer', width: '187px', height: '187px',
          backgroundImage: "url('https://ocarpenmsdn.sharepoint.com/sites/devcenter/Pictures/09.jpg')",
          backgroundSize: 'cover',
          marginRight: '0px', marginBottom: '0px', paddingTop: '0px', paddingLeft: '0'
        }}>
        </div>
      </div>
    );
  }

}


/**
 * @interface
 * Defines a collection of SharePoint folders
 */
export interface ISPFolders {
  value: ISPFolder[];
}

/**
 * @interface
 * Defines a SharePoint folder
 */
export interface ISPFolder {
  Name: string;
  ServerRelativeUrl: string;
}

/**
 * @class
 * Service implementation to get folders from current SharePoint site
 */
class SPFolderPickerService {

  private context: IWebPartContext;

  /**
   * @function
   * Service constructor
   */
  constructor(pageContext: IWebPartContext) {
    this.context = pageContext;
  }

  /**
   * @function
   * Gets the collection of sub folders of the given folder
   */
  public getFolders(parentFolderServerRelativeUrl?: string, currentPage?: number, pageItemCount?: number): Promise<ISPFolders> {
    if (this.context.environment.type === EnvironmentType.Local) {
      //If the running environment is local, load the data from the mock
      return this.getFoldersMock(parentFolderServerRelativeUrl);
    }
    else {
      //If the running environment is SharePoint, request the folders REST service
      var queryUrl: string = this.context.pageContext.web.absoluteUrl;
      var skipNumber = currentPage * pageItemCount;
      if (parentFolderServerRelativeUrl == null || parentFolderServerRelativeUrl == '' || parentFolderServerRelativeUrl == '/') {
        //The folder is the web root site
        queryUrl += "/_api/web/folders?$select=Name,ServerRelativeUrl&$orderBy=Name&$top=";
        queryUrl += pageItemCount;
        queryUrl += "&$skip=";
        queryUrl += skipNumber;
      }
      else {
        //Loads sub folders
        queryUrl += "/_api/web/GetFolderByServerRelativeUrl('";
        queryUrl += parentFolderServerRelativeUrl;
        queryUrl += "')/folders?$select=Name,ServerRelativeUrl&$orderBy=Name&$top=";
        queryUrl += pageItemCount;
        queryUrl += "&$skip=";
        queryUrl += skipNumber;
      }
      return this.context.httpClient.get(queryUrl).then((response: Response) => {
        return response.json();
      });
    }
  }

  /**
   * @function
   * Returns 3 fake SharePoint folders for the Mock mode
   */
  private getFoldersMock(parentFolderServerRelativeUrl?: string): Promise<ISPFolders> {
    return SPFolderPickerMockHttpClient.getFolders(this.context.pageContext.web.absoluteUrl).then(() => {
      const listData: ISPFolders = {
        value:
        [
          { Name: 'Mock Folder One', ServerRelativeUrl: '/mockfolderone' },
          { Name: 'Mock Folder Two', ServerRelativeUrl: '/mockfoldertwo' },
          { Name: 'Mock Folder Three', ServerRelativeUrl: '/mockfolderthree' }
        ]
      };
      return listData;
    }) as Promise<ISPFolders>;
  }

}


/**
 * @class
 * Defines a http client to request mock data to use the web part with the local workbench
 */
class SPFolderPickerMockHttpClient {

  /**
   * @var
   * Mock SharePoint result sample
   */
  private static _results: ISPFolders = { value: [] };

  /**
   * @function
   * Mock get folders method
   */
  public static getFolders(restUrl: string, options?: any): Promise<ISPFolders> {
    return new Promise<ISPFolders>((resolve) => {
      resolve(SPFolderPickerMockHttpClient._results);
    });
  }

}
