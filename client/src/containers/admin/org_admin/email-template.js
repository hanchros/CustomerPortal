import React from "react";
import { connect } from "react-redux";
import { Collapse, Skeleton, Modal, Tooltip } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { listMailByOrg, updateMail } from "../../../actions/mail";
import EditMailForm from "../setting/create-form";

const { Panel } = Collapse;

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

  genExtra = (mail) => (
    <Tooltip title="Edit">
      <SettingOutlined
        onClick={(event) => {
          event.stopPropagation();
          this.setState({
            visible: true,
            curMail: mail,
          });
        }}
      />
    </Tooltip>
  );

  render() {
    const { loading, visible, curMail } = this.state;
    const { mail, updateMail } = this.props;
    const mails = mail.orgMails;
    return (
      <div className="mt-4">
        <h3 className="mt-4 mb-4">Email Templates</h3>
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {!loading && (
          <Collapse accordion>
            {mails.map((ml) => (
              <Panel key={ml._id} header={ml.name} extra={this.genExtra(ml)}>
                <div dangerouslySetInnerHTML={{ __html: ml.content }} />
              </Panel>
            ))}
          </Collapse>
        )}
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
      </div>
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
