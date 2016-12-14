import {
    ADD_PAGECONTEXT
} from "../constants";
import { Log } from "@microsoft/sp-client-base";

export default function PageContextReducer(state = {}, action: any = { type: "" }) {

    switch (action.type) {
        case ADD_PAGECONTEXT:
            return action.payload.pageContext;

        default:

            return state;
    }
}

