import * as React from "react";
import * as utils from "../utils/utils";
import {WebListField} from "../model/Site";
export interface KeyValue {
  value: any;
  displayName: string;
}
export interface IListEditorProps extends React.Props<any> {
  selectedValue?: string;
  onChange(event): void;
  fields: Array<WebListField>;
}
export default class FieldEditor extends React.Component<IListEditorProps, void> {
  constructor() {

    super();
    this.handleChange = this.handleChange.bind(this);
  }
  private handleChange(event) {
    this.props.onChange(event);
  }
  public render() {

    return (
      <select value={this.props.selectedValue} onChange={this.handleChange} >
        {this.props.fields.map((field) => {
          return (
            <option key={field.name} value={field.name}  >{utils.ParseSPField(field.name).value}</option>
          );
        }, this)
        }
      </select >
    );
  };
}
