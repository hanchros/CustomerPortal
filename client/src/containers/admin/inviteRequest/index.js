import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Collapse, Button, Skeleton, Popconfirm } from "antd";
import {
  listInviteRequest,
  resolveInviteRequest,
} from "../../../actions/invite";
import { DeleteOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

class AdminInviteRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
    };
  }

  componentDidMount = async () => {
    const { listInviteRequest } = this.props;
    this.setLoading(true);
    await listInviteRequest();
    this.setLoading(false);
  };

  setLoading = (loading) => {
    this.setState({ loading });
  };

  onIgnoreRequest = async (ir) => {
    this.setLoading(true);
    await this.props.resolveInviteRequest(ir._id);
    this.setLoading(false);
  };

  genExtra = (ir) => (
    <React.Fragment>
      <Popconfirm
        title="Are you sure ignore this request?"
        onConfirm={() => this.onIgnoreRequest(ir)}
        okText="Yes"
        cancelText="No"
      >
        <Button
          className="btn-no-padding"
          type="link"
          style={{ color: "red" }}
          title="delete"
        >
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    </React.Fragment>
  );

  render() {
    const { inviteRequests } = this.props;
    const { loading } = this.state;

    return (
      <div className="container">
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        <Row>
          <Col className="flex">
            <h5 className="mr-auto mb-5">Invite Requests</h5>
          </Col>
        </Row>
        <Collapse accordion>
          {inviteRequests.map((ir) => (
            <Panel
              header={`${ir.first_name} ${ir.last_name}`}
              key={ir._id}
              extra={this.genExtra(ir)}
            >
              <div>
                <p>Name: {`${ir.first_name} ${ir.last_name}`}</p>
                <p>Email: {ir.email}</p>
                <p>Organization: {ir.organization}</p>
                <Button type="primary">Send Invite</Button>
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { inviteRequests: state.invite.inviteRequests };
}

export default connect(mapStateToProps, {
  listInviteRequest,
  resolveInviteRequest,
})(AdminInviteRequest);
