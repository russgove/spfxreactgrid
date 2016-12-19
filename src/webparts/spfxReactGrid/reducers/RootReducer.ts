import { combineReducers } from "redux";
import ListReducer from "./ListReducer";
import listItemReducer from "./listItemReducer";
import ColumnReducer from "./ColumnReducer";
import PageContextReducer from "./PageContextReducer";
import SiteReducer from "./SiteReducer";
import SystemStatus from "./SystemStatus";
const { routerReducer } = require("react-router-redux");
export function RootReducer(state, action) {
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

