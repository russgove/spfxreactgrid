﻿import {  SiteUsers } from "../Model/SiteUsers";
import { Log } from "@microsoft/sp-client-base";
import * as _ from "lodash";
import {
    GET_SITE_USERS,
    GET_SITE_USERS_SUCCESS,
    GET_SITE_USERS_ERROR
} from "../constants";

function getSiteUsers(state: Array<SiteUsers>, action) {

    let newstate = _.clone(state);
    newstate.push(action.payload.lookupOptions);
    Log.info("getLookupOptions", "Added Header Record");
    return newstate;
}
function updateSiteUser(state: Array<SiteUsers>, action: { payload: { siteUsers: SiteUsers } }) {

    let newstate = _.clone(state);
    let index = _.findIndex<SiteUsers>(newstate, x =>
        (x.siteUrl === action.payload.siteUsers.siteUrl) );
    if (index !== -1) {
        newstate[index] = action.payload.siteUsers;
    }
    else {
        newstate.push(action.payload.siteUsers);
    }
    Log.info("GetSiteYsers", "Updated Header Record");
    return newstate;
}
const INITIAL_STATE = [];

function lookupOptionReducer(state = INITIAL_STATE, action: any = { type: "" }) {

    switch (action.type) {
        case GET_SITE_USERS:
            Log.verbose("getLookupOptions", "In getLookupOptions GET_LOOKUPOPTIONS listItemReducer ActionType is " + action.type);
            return getSiteUsers(state, action);
        case GET_SITE_USERS_SUCCESS:
            Log.verbose("getLookupOptions", "In getLookupOptions GET_LOOKUPOPTIONS_SUCCESSof listItemReducer ActionType is " + action.type);
            return updateSiteUser(state, action);
        case GET_SITE_USERS_ERROR:
            /** The ActionCreator has set the state to error , so i just update the item */
            Log.verbose("getLookupOptions", "In getLookupOptions GET_LOOKUPOPTIONS_ERRORof listItemReducer ActionType is " + action.type);
            return updateSiteUser(state, action);

        default:
            return state;
    }
}
export default lookupOptionReducer;
