﻿
import SystemStatus from "../Model/SystemStatus";
let defaultStatus: SystemStatus = {
    currentAction: "",
    fetchStatus: ""
}
import { Log } from "@microsoft/sp-client-base";
export default function SystemStatusReducer(state: SystemStatus = defaultStatus, action: any = { type: "" }) {
    /**
     *
     *
     * DO NOT UNCOMMENTS
     *     CAUSING INFINITE LOOP
     *
     *
     *
     *
     */
    let newstate = _.clone(state);
    if (action.type.startsWith("App/")) {

        newstate.currentAction = action.type;
    }
    if (action.type.endsWith("_ERROR")) {
        Log.info("SystemStatusReducer", "canged sfetch Status to action.payload.error.message");
        newstate.fetchStatus = action.payload.error.message;
    }
    return newstate;
    //return state;
}

