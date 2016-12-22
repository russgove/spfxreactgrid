import ListItem from "../Model/ListItem";
import * as _ from "lodash";
import {
    ADD_LISTITEM,
    REMOVE_LISTITEM,
    GOT_LISTITEMS,
    CLEAR_LISTITEMS,
    SAVE_LISTITEM, UNDO_LISTITEMCHANGES,
    UPDATE_LISTITEM,
    UPDATE_LISTITEM_SUCCESS,
    UPDATE_LISTITEM_ERROR
} from "../constants";

import { Log } from "@microsoft/sp-client-base";
const INITIAL_STATE = [];
function updateListItemSuccess(state: Array<ListItem>, action) {
    let newState = _.clone(state);
    let index = _.findIndex(newState, { GUID: action.payload.listItem.GUID });
    if (newState[index].__metadata__OriginalValues) {
        delete newState[index].__metadata__OriginalValues;
    }
    return newState;
}
function listItemReducer(state = INITIAL_STATE, action: any = { type: "" }) {


    switch (action.type) {
        case ADD_LISTITEM:
            let newarray = _.clone(state);
            newarray.push(action.payload.listItem);
            return newarray;
        case REMOVE_LISTITEM:
            // st status to tobedeleted
            alert("not implemented");
            let newArr = _.filter(state, (o) => { return o.GUID !== action.payload.listItem.guid; });
            return newArr;
        case CLEAR_LISTITEMS:
            return [];
        case SAVE_LISTITEM:
            let newarray2 = _.clone(state);
            let item = newarray2.find(item => item.GUID === action.payload.listItem.GUID);
            item = action.payload.listItem;

            if (!item.__metadata__OriginalValues) {
                item.__metadata__OriginalValues = state.find(item => item.GUID === action.payload.listItem.GUID);
            }
            return newarray2;
        case UPDATE_LISTITEM_SUCCESS:

            return updateListItemSuccess(state, action);
        case UNDO_LISTITEMCHANGES:
            let newarray3 = _.clone(state);
            // let item3 = newarray3.find(item => item.GUID === action.payload.listItem.GUID);
            // item3 = action.payload.listItem.__metadata__OriginalValues;
            let index = _.findIndex(newarray3, { GUID: action.payload.listItem.GUID });
            if (newarray3[index].__metadata__OriginalValues) {
                newarray3[index] = newarray3[index].__metadata__OriginalValues;
            }
            return newarray3;
        case GOT_LISTITEMS:

            return _.union(state, action.payload.items);

        default:

            return state;
    }
}
export default listItemReducer;
