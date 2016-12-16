// for eac of the columns to be displayed, which field in this list should we use
import { Guid } from '@microsoft/sp-client-base';
export class ColumnReference {
    public constructor(
        /** Tghe ID of this ColmnReference */
        public columnDefinitionId: string,
        /** The field in the Sharepoint list. Stored as 'internalname#;displayname')*/
        public name: string,
        /** The FULL field Definistion from sharepoint.... need to shave tos donw abit */
         public fieldDefinition:any

    ) { }

}
export default class ListDefinition {
    /** The columns in the Sharepoint list we ewant to edit*/
    public columnReferences: Array<ColumnReference>;
    /** The Guid of this list Definition. The id field is the id of the list in sharepoint. The guid is the ID of this listdefinition */
    public guid: string;
    public constructor(
        /** the id of the list we are pointing to in Sharepoint. Stored as id#;name  */
        public id: string,
        /** the web the list is contained in. Stored as webUrl#;Title */
        public webLookup: string,
        /** the list to be disoplayed. Stored as listid#;Title */
        public listLookup: string,
        /** the url of the site holding the list. (only used during setup) */
        public siteUrl: string,
        /** the url of the list. (not used. to be deleted) */
        public url: string) {
        this.columnReferences = new Array<ColumnReference>();
        this.guid = Guid.newGuid().toString();

    }


}
