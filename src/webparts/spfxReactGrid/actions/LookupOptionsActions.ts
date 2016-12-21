import {
    GET_LOOKUPOPTIONS,
    GET_LOOKUPOPTIONS_SUCCESS,
    GET_LOOKUPOPTIONS_ERROR,
} from "../constants";
import "whatwg-fetch";
import { Promise } from "es6-promise";
import * as utils from "../utils/utils";

import { Site } from "sp-pnp-js";
import ListItem from "../model/ListItem";
import ListDefinition from "../model/ListDefinition";

export function getLookupOptionAction(dispatch: any, lookupSite: string, lookupWebId: string, lookupListId: string, lookupField: string): any {
    debugger;
    // let fieldnames = new Array<string>();
    // let expands = new Array<string>();
    // for (const columnreference of listDefinition.columnReferences) {
    //     if (columnreference.fieldDefinition.TypeAsString === "Lookup") {
    //         expands.push(columnreference.fieldDefinition.InternalName);
    //         fieldnames.push(columnreference.fieldDefinition.InternalName + "/" + columnreference.fieldDefinition.LookupField);

    //     } else {
    //         const internalName = utils.ParseSPField(columnreference.name).id;
    //         fieldnames.push(internalName); // need to split
    //     }
    // }
    // const weburl = utils.ParseSPField(listDefinition.webLookup).id;
    // const listid = utils.ParseSPField(listDefinition.listLookup).id;

    const site = new Site(lookupSite);

    const promise = site.web.lists.getById(listid).items.select(fieldnames.concat("GUID").concat("Id").join(",")).expand(expands.join(",")).get()
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



    const action = {
        type: GET_LOOKUPOPTIONS,
        payload: {
            promise: Promise.all(promises)
        }
    };
    return action;
}
export function ggetLookupOptionErrorAction(error) {
    return {
        type: GET_LOOKUPOPTIONS_ERROR,
        payload: {
            error: error
        }
    };

}
export function gotListItemsAction(items) {
    return {
        type: GET_LOOKUPOPTIONS_SUCCESS,
        payload: {
            items: items
        }
    };
}
