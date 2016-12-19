
import SystemStatus from "../Model/SystemStatus";
let defaultStatus: SystemStatus = {
    currentAction: "",
    fetchStatus: ""
}
export default function SystemStatusReducer(state: SystemStatus=defaultStatus, action: any = { type: "" }) {
    let newstate = _.clone(state);
    if (action.type.startsWith("App/")) {
        newstate.currentAction = action.type;
    }
    if (action.type.endsWith("_ERROR")) {
        newstate.fetchStatus = action.payload.error.message;
    }
    return newstate;
}

