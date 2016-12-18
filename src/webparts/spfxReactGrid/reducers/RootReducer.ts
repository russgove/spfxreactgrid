import { combineReducers } from "redux";
import ListReducer from "./ListReducer";
import listItemReducer from "./listItemReducer";
import ColumnReducer from "./ColumnReducer";
import PageContextReducer from "./PageContextReducer";
import SiteReducer from "./SiteReducer";
import SystemStatus from "./SystemStatus";
import { Log } from "@microsoft/sp-client-base";
const { routerReducer } = require("react-router-redux");
export function RootReducer(state, action) {
    Log.verbose("RootReducer", "In RootReducer of RootReducer");
    const combinedReducers = combineReducers(
        {
            items: listItemReducer,
            lists: ListReducer,
            columns: ColumnReducer,
            sites: SiteReducer,
            pageContext: PageContextReducer,
            routing: routerReducer,
            systemStatus:SystemStatus
        }
    );
    return combinedReducers(state, action);
}

