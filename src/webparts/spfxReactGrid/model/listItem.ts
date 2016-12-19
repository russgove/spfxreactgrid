import GridRowStatus from "./GridRowStatus";
export default class ListItem {
    /** The listDefinition this item came from. Need this to get to columnMappings */
    public __metadata__ListDefinitionId;
        /** The Status of  this . Need this to get to columnMappings */
    public __metadata__GridRowStatus: GridRowStatus;
       /** The Original Values of this item . Need this to revert changes */
    public __metadata__OriginalValues: ListItem;

    public ID:number;
    public constructor(
        public GUID: string) {
        this.__metadata__GridRowStatus = GridRowStatus.new;
    }
}
