import {
    GOT_WEBS,
    GET_LISTSFORWEB_SUCCESS,
    GET_FIELDSFORLIST_SUCCESS

} from "../constants";
import * as _ from "lodash";
import { Site } from "../model/Site";
const INITIAL_STATE: Array<Site> = [];
function siteReducer(state: Array<Site> = INITIAL_STATE, action: any = { type: "" }): Array<Site> {

    switch (action.type) {
        case GOT_WEBS:
            let sitea: Site = new Site(action.payload.siteUrl);
            sitea.webs = action.payload.webs;
            return _.union(state, new Array<Site>(sitea));
        case GET_LISTSFORWEB_SUCCESS:
            debugger;
            let newState = _.clone(state);
            //find the site and add the lists to it
            for (const site of newState) {
                for (const web of site.webs) {
                    if (web.url === action.payload.webUrl) {
                        web.lists = action.payload.lists;
                        web.listsFetched = true;
                    }
                }
            }
            return newState;
        case GET_FIELDSFORLIST_SUCCESS:
            {
                debugger;
                let newState2 = _.clone(state);
                //find the site and add the lists to it
                for (const site of newState2) {
                    for (const web of site.webs) {
                        if (web.url ===action.payload.webUrl){
                        for (const list of web.lists) {
                            if (list.id === action.payload.listId) {
                                list.fields = action.payload.fields;
                                list.fieldsFetched = true;
                            }
                        }
                    }}
                }
                return newState2;
            }
        default:
            return state;
    }
}
export default siteReducer;

