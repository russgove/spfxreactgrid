declare interface ISpfxReactGridStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  ColumnDefinitionFieldLabel:string;
    /**The Label on the reset CD Button */
  ColumnDefinitionsButtonSelect:string;
   /**The Label on the reset Button */
  ColumnDefinitionsButtonReset:string;
  /**The Title on the popupPage */
  ColumnDefinitionsTitle:string;
}

declare module 'spfxReactGridStrings' {
  const strings: ISpfxReactGridStrings;
  export = strings;
}
