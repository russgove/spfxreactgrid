import ListDefinition from "../model/ListDefinition";
import ColumnDefinition from "../model/ColumnDefinition";
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneField,
  IPropertyPaneFieldType,
  IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import PropertyFieldListDefinitionsHost, { IPropertyFieldListDefinitionsHostProps } from './PropertyFieldListDefinitionsHost';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { Guid, Log, PageContext } from "@microsoft/sp-client-base";
export interface IPropertyFieldListDefinitionsProps {
  label: string;
  initialValue?: Array<ListDefinition>;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  ListDefinitions: Array<ListDefinition>;
  ColumnDefinitions: Array<ColumnDefinition>;
  PageContext: PageContext
}
export interface IPropertyFieldListDefinitionsPropsInternal extends IPropertyPaneCustomFieldProps {
  label: string;
  initialValue?: Array<ListDefinition>;
  targetProperty: string;
  onRender(elem: HTMLElement): void;
  onDispose(elem: HTMLElement): void;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  ListDefinitions: Array<ListDefinition>;
  ColumnDefinitions: Array<ColumnDefinition>;
    PageContext: PageContext;
}
class PropertyFieldListDefinitionsBuilder implements IPropertyPaneField<IPropertyFieldListDefinitionsPropsInternal> {

  //Properties defined by IPropertyPaneField
  public type: IPropertyPaneFieldType = 1;//IPropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyFieldListDefinitionsPropsInternal;

  //Custom properties
  private label: string;
  private initialValue: string;
  private context: IWebPartContext;
  private onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;
  private customProperties: any;
  public constructor(_targetProperty: string, _properties: IPropertyFieldListDefinitionsPropsInternal) {
    debugger;
    this.render = this.render.bind(this);
    this.properties = _properties;
    this.label = _properties.label;
    this.properties.onDispose = this.dispose;
    this.properties.onRender = this.render;
    this.onPropertyChange = _properties.onPropertyChange;
    this.customProperties = _properties.ListDefinitions;
  }
  private render(elem: HTMLElement): void {
    debugger;
    const ldProps: IPropertyFieldListDefinitionsHostProps = {
      label: this.label,
      ColumnDefinitions: this.properties.ColumnDefinitions,
      onPropertyChange: this.onPropertyChange,
      ListDefinitions: this.customProperties,
      PageContext: this.properties.PageContext

    };

    const element: React.ReactElement<IPropertyFieldListDefinitionsHostProps> = React.createElement(PropertyFieldListDefinitionsHost, ldProps);
    ReactDom.render(element, elem);
  }
  private dispose(elem: HTMLElement): void {
  }
}
export function PropertyFieldListDefinitions(targetProperty: string, properties: IPropertyFieldListDefinitionsProps): IPropertyPaneField<IPropertyFieldListDefinitionsPropsInternal> {

  //Create an internal properties object from the given properties
  var newProperties: IPropertyFieldListDefinitionsPropsInternal = {
    label: properties.label,
    targetProperty: targetProperty,
    initialValue: properties.initialValue,
    onPropertyChange: properties.onPropertyChange,
    ListDefinitions: properties.ListDefinitions,
    ColumnDefinitions: properties.ColumnDefinitions,
    PageContext:properties.PageContext,
    onDispose: null,
    onRender: null,
  };
  //Calles the PropertyFieldListDefinitions builder object
  //This object will simulate a PropertyFieldCustom to manage his rendering process
  return new PropertyFieldListDefinitionsBuilder(targetProperty, newProperties);
}


