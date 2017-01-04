import ColumnDefinition from "../model/ColumnDefinition";
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneField,
  IPropertyPaneFieldType,
  IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import PropertyFieldColumnDefinitionsHost, { IPropertyFieldColumnDefinitionsHostProps } from './PropertyFieldColumnDefinitionsHost';
import { IWebPartContext } from '@microsoft/sp-webpart-base';

/**
 * @interface
 * Public properties of the PropertyFieldColumnDefinitions custom field
 *
 */
export interface IPropertyFieldColumnDefinitionsProps {

  label: string;
  initialValue?: Array<ColumnDefinition>;
  context: IWebPartContext;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  properties: any;
  store:any
}

/**
 * @interface
 * Private properties of the PropertyFieldColumnDefinitions custom field.
 * We separate public & private properties to include onRender & onDispose method waited
 * by the PropertyFieldCustom, witout asking to the developer to add it when he's using
 * the PropertyFieldColumnDefinitions.
 *
 */
export interface IPropertyFieldColumnDefinitionsPropsInternal extends IPropertyPaneCustomFieldProps {
  label: string;
  initialValue?:  Array<ColumnDefinition>;
  targetProperty: string;
  context: IWebPartContext;
  onRender(elem: HTMLElement): void;
  onDispose(elem: HTMLElement): void;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  properties: any;
  store:any;
}

/**
 * @interface
 * Represents a PropertyFieldColumnDefinitions object
 *
 */
class PropertyFieldColumnDefinitionsBuilder implements IPropertyPaneField<IPropertyFieldColumnDefinitionsPropsInternal> {

  //Properties defined by IPropertyPaneField
  public type: IPropertyPaneFieldType = 1;//IPropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyFieldColumnDefinitionsPropsInternal;

  //Custom properties
  private label: string;
  private initialValue: string;
  private context: IWebPartContext;
  private onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;
  private customProperties: any;

  /**
   * @function
   * Ctor
   */
  public constructor(_targetProperty: string, _properties: IPropertyFieldColumnDefinitionsPropsInternal) {
    debugger;
    this.render = this.render.bind(this);
 //   this.targetProperty = _properties.targetProperty;
    this.properties = _properties;
    this.label = _properties.label;
  //  this.initialValue = _properties.initialValue;
    this.context = _properties.context;
    this.properties.onDispose = this.dispose;
    this.properties.onRender = this.render;
    this.onPropertyChange = _properties.onPropertyChange;
    this.customProperties = _properties.properties;
  }

  /**
   * @function
   * Renders the ColorPicker field content
   */
  private render(elem: HTMLElement): void {
    debugger;
    //Construct the JSX properties
    const element: React.ReactElement<IPropertyFieldColumnDefinitionsHostProps> = React.createElement(PropertyFieldColumnDefinitionsHost, {
      label: this.label,
     // initialValue: this.initialValue,
      context: this.context,
    //  targetProperty: this.targetProperty,
    //  onDispose: this.dispose,
     // onRender: this.render,
     onPropertyChange: this.onPropertyChange,
     properties: this.customProperties,
     store:this.properties.store
    });
    //Calls the REACT content generator
    ReactDom.render(element, elem);
  }

  /**
   * @function
   * Disposes the current object
   */
  private dispose(elem: HTMLElement): void {

  }

}

/**
 * @function
 * Helper method to create a Color Picker on the PropertyPane.
 * @param targetProperty - Target property the Color picker is associated to.
 * @param properties - Strongly typed Color Picker properties.
 */
export function PropertyFieldColumnDefinitions(targetProperty: string, properties: IPropertyFieldColumnDefinitionsProps): IPropertyPaneField<IPropertyFieldColumnDefinitionsPropsInternal> {

    //Create an internal properties object from the given properties
    var newProperties: IPropertyFieldColumnDefinitionsPropsInternal = {
      label: properties.label,
      targetProperty: targetProperty,
      initialValue: properties.initialValue,
      onPropertyChange: properties.onPropertyChange,
      properties: properties.properties,
      context: properties.context,
      onDispose: null,
      onRender: null,
      store:properties.store

    };
    //Calles the PropertyFieldColumnDefinitions builder object
    //This object will simulate a PropertyFieldCustom to manage his rendering process
    return new PropertyFieldColumnDefinitionsBuilder(targetProperty, newProperties);
}


