import {
    ADD_LISTITEM,
    ADD_LISTITEMS,
    REMOVE_LISTITEM,
    GET_LISTITEMS,
    GOT_LISTITEMS,
    GET_LISTITEMSERROR,
    CLEAR_LISTITEMS,
    SAVE_LISTITEM,//save locally
    UNDO_LISTITEMCHANGES,
    UPDATE_LISTITEM,//save to sharepoint
    UPDATE_LISTITEM_ERROR,
    UPDATE_LISTITEM_SUCCESS

} from "../constants";
import "whatwg-fetch";
import { Promise } from "es6-promise";
import * as utils from "../utils/utils";

import { Web, TypedHash } from "sp-pnp-js";
import ListItem from "../model/ListItem";
import GridRowStatus from "../Model/GridRowStatus";

import ListDefinition from "../model/ListDefinition";
export function clearListItems() {
    return {
        type: CLEAR_LISTITEMS,
        payload: {
        }
    };
}
export function addListItem(listItem: ListItem) {
    return {
        type: ADD_LISTITEM,
        payload: {
            listItem: listItem
        }
    };
}
export function removeListItem(listItem: ListItem) {
    return {
        type: REMOVE_LISTITEM,
        payload: {
            listItem: listItem
        }
    };
}
export function addListItems(listItems: ListItem[]) {
    return {
        type: ADD_LISTITEMS,
        payload: {
            listItems: listItems
        }
    };
}
export function listDefinitionIsValid(listDefinition: ListDefinition): boolean {
    if (listDefinition.webLookup === null) {
        return false;
    }
    if (listDefinition.listLookup === null) {
        return false;
    }
    if (listDefinition.columnReferences === null) {
        return false;
    }

    return true;
}
/**
 * Action to update a listitem in sharepoint
 */
export function updateListItemAction(dispatch: any, listDefinition: ListDefinition, listItem: ListItem): any {
    const weburl = utils.ParseSPField(listDefinition.webLookup).id;
    const listid = utils.ParseSPField(listDefinition.listLookup).id;
    const web = new Web(weburl);
    let typedHash: TypedHash<string | number | boolean> = {};
    for (const columnRef of listDefinition.columnReferences) {
        let fieldName = utils.ParseSPField(columnRef.name).id;
        switch (columnRef.fieldDefinition.TypeAsString) {
            case "Lookup":
                if (listItem[fieldName]) {// field may not be set
                    typedHash[fieldName + "Id"] = listItem[fieldName].Id;
                }
                break;

            default:
                typedHash[fieldName] = listItem[fieldName];
        }
    }
    switch (listItem.__metadata__GridRowStatus) {
        case GridRowStatus.modified:
            const promise = web.lists.getById(listid).items.getById(listItem.ID).update(typedHash, listItem["odata.etag"])
                .then((response) => {
                    // shouwld have an option to rfresh here in cas of calculated columns

                    const gotListItems = updateListItemSuccessAction(listItem);
                    dispatch(gotListItems); // need to ewname this one to be digfferent from the omported ome
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(updateListItemErrorAction(error)); // need to ewname this one to be digfferent from the omported ome
                });
            const action = {
                type: UPDATE_LISTITEM,
                payload: {
                    promise: promise
                }
            };
            return action;
        case GridRowStatus.new:
            const mewpromise = web.lists.getById(listid).items.add(typedHash)
                .then((response) => {
                    debugger;

                    const gotListItems = updateListItemSuccessAction(listItem);
                    dispatch(gotListItems); // need to ewname this one to be digfferent from the omported ome
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(updateListItemErrorAction(error)); // need to ewname this one to be digfferent from the omported ome
                });
            return {
                type: UPDATE_LISTITEM,
                payload: {
                    promise: mewpromise
                }
            };
        default:
            return; // action called on item with ibalid state
    }
}
export function updateListItemErrorAction(error) {
    return {
        type: UPDATE_LISTITEM_ERROR,
        payload: {
            error: error
        }
    };
}
export function updateListItemSuccessAction(listItem) {

    return {
        type: UPDATE_LISTITEM_SUCCESS,
        payload: {
            listItem: listItem
        }
    };
}
export function getListItemsAction(dispatch: any, listDefinitions: Array<ListDefinition>): any {

    const promises: Array<Promise<any>> = new Array<Promise<any>>();
    for (const listDefinition of listDefinitions) {
        if (!listDefinitionIsValid(listDefinition)) {
            break;
        }
        let fieldnames = new Array<string>();
        let expands = new Array<string>();
        for (const columnreference of listDefinition.columnReferences) {
            if (columnreference.fieldDefinition.TypeAsString === "Lookup") {
                expands.push(columnreference.fieldDefinition.InternalName);
                fieldnames.push(columnreference.fieldDefinition.InternalName + "/" + columnreference.fieldDefinition.LookupField);
                fieldnames.push(columnreference.fieldDefinition.InternalName + "/Id");

            } else {
                const internalName = utils.ParseSPField(columnreference.name).id;
                fieldnames.push(internalName); // need to split
            }
        }
        const weburl = utils.ParseSPField(listDefinition.webLookup).id;
        const listid = utils.ParseSPField(listDefinition.listLookup).id;

        const web = new Web(weburl);

        const promise = web.lists.getById(listid).items.select(fieldnames.concat("GUID").concat("Id").join(",")).expand(expands.join(",")).get()
            .then((response) => {

                const data = _.map(response, (item: any) => {
                    item.__metadata__ListDefinitionId = listDefinition.guid; // save my listdef, so i can get the columnReferences later
                    return item;
                });
                console.log(data);
                const gotListItems = gotListItemsAction(data);
                dispatch(gotListItems); // need to ewname this one to be digfferent from the omported ome
            })
            .catch((error) => {
                console.log(error);
                dispatch(getListItemsErrorAction(error)); // need to ewname this one to be digfferent from the omported ome
            });
        promises.push(promise);


    }
    const action = {
        type: GET_LISTITEMS,
        payload: {
            promise: Promise.all(promises)
        }
    };
    return action;
}
export function getListItemsErrorAction(error) {
    return {
        type: GET_LISTITEMSERROR,
        payload: {
            error: error
        }
    };

}
export function gotListItemsAction(items) {
    return {
        type: GOT_LISTITEMS,
        payload: {
            items: items
        }
    };
}
export function saveListItemAction(listItem: ListItem) {
    const action = {
        type: SAVE_LISTITEM,
        payload: {
            listItem
        }
    };
    return action;
}
export function undoListItemChangesAction(listItem: ListItem) {
    const action = {
        type: UNDO_LISTITEMCHANGES,
        payload: {
            listItem
        }
    };
    return action;
}
