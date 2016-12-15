import {
    GOT_WEBS,
    GET_WEBS,
    GET_WEBSERROR,
    GET_LISTSFORWEB,
    GET_LISTSFORWEB_SUCCESS,
    GET_LISTSFORWEB_ERROR,
    GET_FIELDSFORLIST,
    GET_FIELDSFORLIST_SUCCESS,
    GET_FIELDSFORLIST_ERROR
} from "../constants";
import "whatwg-fetch";
import pnp from "sp-pnp-js";
import * as utils from "../utils/utils";
import { Web as SPWeb } from "sp-pnp-js";
import { Web, WebList, WebListField } from "../model/Site";
// export function getWebsAction(dispatch: any, siteUrl: string): any {
//     // need allwebs

//     // const payload = pnp.sp.site.rootWeb.webs.expand("lists,lists/fields").orderBy("Web/Title, List/Title, Field/Title", false).get()
//     const payload = pnp.sp.site.rootWeb.webs.expand("lists,lists/fields").get()
//         .then((response) => {

//             const data = _.map(response, (item: any) => {
//                 const web: Web = new Web(item.Id, item.Title, item.Url);
//                 for (const list of item.Lists) {
//                     const webList: WebList = new WebList(list.Id, list.Title, list.Url);
//                     for (const field of list.Fields) {
//                         debugger;
//                         webList.fields.push(new WebListField(field.Id, field.Title, field.InternalName, field.TypeDisplayName));
//                     }
//                     web.lists.push(webList);
//                 }
//                 return web;
//             });
//             console.log(data);
//             const gotWebs = gotWebsAction(siteUrl, data);
//             dispatch(gotWebs); // need to ewname this one to be digfferent from the omported ome
//         })
//         .catch((error) => {
//             console.log(error);
//             dispatch(getWebsErrorAction(error)); // need to ewname this one to be digfferent from the omported ome
//         });
//     const action = {
//         type: GET_WEBS,
//         payload: {
//             promise: payload
//         }
//     };
//     return action;
// }
export function getWebsAction(dispatch: any, siteUrl: string): any {
    // need allwebs

    // const payload = pnp.sp.site.rootWeb.webs.expand("lists,lists/fields").orderBy("Web/Title, List/Title, Field/Title", false).get()
    const payload = pnp.sp.site.rootWeb.webs.get()
        .then((response) => {
            const data = _.map(response, (item: any) => {
                const web: Web = new Web(item.Id, item.Title, item.Url);
                return web;
            });
            console.log(data);
            const gotWebs = gotWebsAction(siteUrl, data);
            dispatch(gotWebs); // need to ewname this one to be digfferent from the omported ome
        })
        .catch((error) => {
            console.log(error);
            dispatch(getWebsErrorAction(error)); // need to ewname this one to be digfferent from the omported ome
        });
    const action = {
        type: GET_WEBS,
        payload: {
            promise: payload
        }
    };
    return action;
}
export function gotWebsAction(siteUrl, items) {
    return {
        type: GOT_WEBS,
        payload: {
            siteUrl: siteUrl,
            webs: items
        }
    };
}
export function getWebsErrorAction(error) {
    return {
        type: GET_WEBSERROR,
        payload: {
            error: error
        }
    };
}

export function getListsForWebAction(dispatch: any, webUrl: string): any {
    const web = new SPWeb(webUrl);

    const payload = web.lists.get()
        .then((response) => {
            debugger;
            //for (const list of item.Lists) {
            //                     const webList: WebList = new WebList(list.Id, list.Title, list.Url);
            //                     for (const field of list.Fields) {
            //                         debugger;
            //                         webList.fields.push(new WebListField(field.Id, field.Title, field.InternalName, field.TypeDisplayName));
            //                     }
            //                     web.lists.push(webList);
            //                 }
            const data = _.map(response, (item: any) => {
                return new WebList(item.Id, item.Title, item.Url, );
            });

            const gotListsForWeb = gotListsForWebAction(webUrl, data);
            dispatch(gotListsForWeb); // need to ewname this one to be digfferent from the omported ome
        })
        .catch((error) => {
            console.log(error);
            dispatch(getListsForWebActionError(error)); // need to ewname this one to be digfferent from the omported ome
        });
    const action = {
        type: GET_WEBS,
        payload: {
            promise: payload
        }
    };
    return action;
}
export function gotListsForWebAction(webUrl, lists) {
    return {
        type: GET_LISTSFORWEB_SUCCESS,
        payload: {
            webUrl: webUrl,
            lists: lists
        }
    };
}
export function getListsForWebActionError(error) {
    return {
        type: GET_LISTSFORWEB_ERROR,
        payload: {
            error: error
        }
    };
}

export function getFieldsForListAction(dispatch: any, webUrl: string, listId: string): any {
    const web = new SPWeb(webUrl);

    const payload = web.lists.getById(listId).fields.get()
        .then((response) => {
            debugger;
            const data = _.map(response, (item: any) => {
                return new WebListField(item.id, new utils.ParsedSPField(item.InternalName, item.Title).toString(), item.InternalName, item.type);
            });
            console.log(data);
            const gotWebs = gotFieldsForListAction(webUrl, listId, data);
            dispatch(gotWebs); // need to ewname this one to be digfferent from the omported ome
        })
        .catch((error) => {
            console.log(error);
            dispatch(getFieldsForListActionError(error, webUrl, listId)); // need to ewname this one to be digfferent from the omported ome
        });
    const action = {
        type: GET_WEBS,
        payload: {
            promise: payload
        }
    };
    return action;
}
export function gotFieldsForListAction(webUrl, listId, fields) {
    return {
        type: GET_FIELDSFORLIST_SUCCESS,
        payload: {
            webUrl: webUrl,
            listId: listId,
            fields: fields
        }
    };
}
export function getFieldsForListActionError(error, webUrl, listId) {
    return {
        type: GET_FIELDSFORLIST_ERROR,
        payload: {
            webUrl: webUrl,
            listId: listId,
        }
    };
}

