
import SystemStatus from "../Model/SystemStatus";
let defaultStatus: SystemStatus = {
    currentAction: "",
    fetchStatus: ""
}
export default function SystemStatusReducer(state: SystemStatus=defaultStatus, action: any = { type: "" }) {
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
         debugger;
        newstate.currentAction = action.type;
      }
       if (action.type.endsWith("_ERROR")) {
           debugger;
           newstate.fetchStatus = action.payload.error.message;
       }
    //   return newstate;
    return state;
}

