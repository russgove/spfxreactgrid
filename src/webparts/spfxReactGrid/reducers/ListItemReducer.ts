import ListItem from "../Model/ListItem";
import * as _ from "lodash";
import {
    ADD_LISTITEM,
    REMOVE_LISTITEM,
    GOT_LISTITEMS,
    CLEAR_LISTITEMS,
    SAVE_LISTITEM
} from "../constants";
import { Log } from "@microsoft/sp-client-base";
const INITIAL_STATE = new Array<ListItem>();
function listItemReducer(state = INITIAL_STATE, action: any = { type: "" }) {
    Log.verbose("listItemReducer", "In listItemReducer of listItemReducer ActionType is " + action.type);

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

        case GOT_LISTITEMS:
            return _.union(state, action.payload.items);

        default:
            Log.verbose("listItemReducer", " listItemReducer returning default  " + state);
            return state;
    }
}
export default listItemReducer;
