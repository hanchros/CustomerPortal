import React from "react";
import { connect } from "react-redux";
import { Skeleton, Modal, Button } from "antd";
import { listMailByOrg, updateMail } from "../../../actions/mail";
import EditMailForm from "../setting/create-form";
import { Col, Row } from "reactstrap";

class OrgMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      curMail: {},
    };
  }

  hideModal = () => {
    this.setState({
      curMail: {},
      visible: false,
    });
  };

  openEdit = (tp) => {
    this.setState({
      curMail: tp,
      visible: true,
    });
  };

  componentDidMount = async () => {
    const { listMailByOrg, organization } = this.props;
    this.setState({ loading: true });
    await listMailByOrg(organization.currentOrganization._id);
    this.setState({ loading: false });
  };

  render() {
    const { loading, visible, curMail } = this.state;
    const { mail, updateMail } = this.props;
    const mails = mail.orgMails;
    const shortcodes = [
      {
        symbol: "[name]",
        value: "Users name",
      },
      {
        symbol: "[sender_name]",
        value: "Sender name",
      },
      {
        symbol: "[sender_org]",
        value: "Sender organization",
      },
      {
        symbol: "[project_name]",
        value: "Name of the project user will be invited to",
      },
    ];

    return (
      <Row>
        <Col md={4} className="mb-4 pr-4">
          <h4 className="mb-4">
            <b>Emails</b>
          </h4>
          <p>These notifications will be sent to the users.</p>
          <p className="mt-5">
            <b>Available shortcodes</b>
          </p>
          <hr />
          {shortcodes.map((sc) => (
            <React.Fragment key={sc.symbol}>
              <Row style={{ fontSize: "13px" }}>
                <Col xs={5}>{sc.symbol}</Col>
                <Col xs={7}>{sc.value}</Col>
              </Row>
              <hr />
            </React.Fragment>
          ))}
        </Col>
        <Col md={8}>
          <Skeleton active loading={loading} />
          {mails.map((ml) => (
            <div className="account-form-box mb-5" key={ml._id}>
              <div
                className="flex mb-4"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5>
                  <b>{ml.name}</b>
                </h5>
                <Button
                  type="ghost"
                  className="ghost-btn"
                  onClick={() => this.openEdit(ml)}
                >
                  edit template
                </Button>
              </div>
              <div
                className="sun-editor-editable"
                style={{ backgroundColor: "#F5F7FA" }}
                dangerouslySetInnerHTML={{ __html: ml.content }}
              />
            </div>
          ))}
          {visible && (
            <Modal
              title={"Update Mail"}
              visible={visible}
              width={800}
              footer={false}
              onCancel={this.hideModal}
            >
              <EditMailForm
                createMail={() => {}}
                updateMail={updateMail}
                curMail={curMail}
                hideModal={this.hideModal}
              />
            </Modal>
          )}
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return { mail: state.mail, organization: state.organization };
}

export default connect(mapStateToProps, {
  listMailByOrg,
  updateMail,
})(OrgMail);
