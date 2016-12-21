import { LookupOption, LookupOptions, LookupOptionStatus } from "../Model/LookupOptions";
import { Log } from "@microsoft/sp-client-base";
import * as _ from "lodash";
import {
    GET_LOOKUPOPTIONS,
    GET_LOOKUPOPTIONS_SUCCESS,
    GET_LOOKUPOPTIONS_ERROR
} from "../constants";

function getLookupOptions(state: Array<LookupOptions>, action) {
    debugger;
    let newstate = _.clone(state);
    newstate.push(action.payload.lookupOptions);
    Log.info("getLookupOptions", "Added Header Record");
    return newstate;
}
function updateLookupOption(state: Array<LookupOptions>, action: { payload: { lookupOptions: LookupOptions } }) {
    debugger;
    let newstate = _.clone(state);
    let index = _.findIndex<LookupOptions>(newstate, x =>
        (x.lookupField === action.payload.lookupOptions.lookupField) &&
        (x.lookupListId === action.payload.lookupOptions.lookupListId) &&
        (x.lookupSite === action.payload.lookupOptions.lookupSite) &&
        (x.lookupWebId === action.payload.lookupOptions.lookupWebId));
    if (index !== -1) {
        newstate[index] = action.payload.lookupOptions;
    }
    else {
        newstate.push(action.payload.lookupOptions);
    }
    Log.info("getLookupOptions", "Updated Header Record");
    return newstate;
}
const INITIAL_STATE = [];

function lookupOptionReducer(state = INITIAL_STATE, action: any = { type: "" }) {

    switch (action.type) {
        case GET_LOOKUPOPTIONS_SUCCESS:
        case GET_LOOKUPOPTIONS_ERROR:
            return updateLookupOption(state, action);
        case GET_LOOKUPOPTIONS:
            return getLookupOptions(state, action);
        default:
            return state;
    }
}
export default lookupOptionReducer;
