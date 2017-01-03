declare interface ISpfxReactGridStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ColumnDefinitionFieldLabel:string;
  ColumnDefinitionsButtonSelect:string;
  ColumnDefinitionsButtonReset:string;
  ColumnDefinitionsTitle:string;
}

declare module 'spfxReactGridStrings' {
  const strings: ISpfxReactGridStrings;
  export = strings;
}
