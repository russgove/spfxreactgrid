import {
    ADD_LISTITEM,
    ADD_LISTITEMS,
    REMOVE_LISTITEM,
    GET_LISTITEMS,
    GOT_LISTITEMS,
    GET_LISTITEMSERROR,
    CLEAR_LISTITEMS

} from "../constants";
import "whatwg-fetch";
import { Promise } from "es6-promise";
import * as utils from "../utils/utils";

import { Web } from "sp-pnp-js";
import ListItem from "../model/ListItem";
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
export function getListItemsAction(dispatch: any, listDefinitions: Array<ListDefinition>): any {

    const promises: Array<Promise<any>> = new Array<Promise<any>>();
    for (const listDefinition of listDefinitions) {
        if (!listDefinitionIsValid(listDefinition)) {
            break;
        }
        let fieldnames = new Array<string>();
        for (const columnreference of listDefinition.columnReferences) {
            const internalName = utils.ParseSPField(columnreference.name).id;
            fieldnames.push(internalName); // need to split
        }
        const weburl = utils.ParseSPField(listDefinition.webLookup).id;
        const listid = utils.ParseSPField(listDefinition.listLookup).id;

        const web = new Web(weburl);

        const promise = web.lists.getById(listid).items.select(fieldnames.join(",")).get()
            .then((response) => {
                debugger;
                const data = _.map(response, (item: any) => {
                    return new ListItem(item.GUID);
                });
                console.log(data);
                const gotListItems = gotListItemsAction(response);
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
