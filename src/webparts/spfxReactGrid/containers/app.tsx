import * as React from "react";
import {
  Button,
  MessageBar,
  MessageBarType,
  Label,
} from "office-ui-fabric-react";
const connect = require("react-redux").connect;
import SystemStatus from "../model/SystemStatus";
const Link = require("react-router").Link;
import Content from "../components/content";
import Navigator from "../components/navigator";
import NavigatorItem from "../components/navigator-item";
interface IAppProps extends React.Props<any> {
  systemStatus: SystemStatus
}
function mapStateToProps(state) {
  return {
    systemStatus: state.systemStatus,
  };
}
function mapDispatchToProps(dispatch) {
  return {

  };
}
class App extends React.Component<IAppProps, void> {
  public render() {
    debugger;
    const { children} = this.props;
    return (

      <div>
        <Button> <Link to="/lists">List Definitions</Link></Button>
        <Button> <Link to="/columns">Column Definitions</Link></Button>
        <Button> <Link to="/">List Items>List Items</Link></Button>
        <div>
          <MessageBar hidden={(this.props.systemStatus.fetchStatus === "")} messageBarType={MessageBarType.error} >  {this.props.systemStatus.fetchStatus}
          </MessageBar>
          <div>{this.props.systemStatus.currentAction}
          </div>
        </div>
        <Content isVisible={true}>
          {children}
        </Content>
      </div>
    );
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
