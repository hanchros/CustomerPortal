import React from "react";
import { connect } from "react-redux";
import { Collapse, Skeleton, Modal, Button, Tooltip } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { listMailGlobal, createMail, updateMail } from "../../../actions/mail";
import EditMailForm from "./create-form";

const { Panel } = Collapse;

class GlobalMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      curMail: {},
    };
  }

  createNew = () => {
    this.setState({
      curMail: {},
      visible: true,
    });
  };

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
    const { listMailGlobal } = this.props;
    this.setState({ loading: true });
    await listMailGlobal();
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
    const { mail, createMail, updateMail } = this.props;
    const mails = mail.globalMails;
    return (
      <div className="mt-4">
        <h3 className="mt-4 mb-4">Global Email Templates</h3>
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
        <Button type="primary" className="mt-4" onClick={this.createNew}>
          Add New
        </Button>
        {visible && (
          <Modal
            title={`${curMail._id ? "Update" : "Create"} Mail`}
            visible={visible}
            width={800}
            footer={false}
            onCancel={this.hideModal}
          >
            <EditMailForm
              createMail={createMail}
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
  return { mail: state.mail };
}

export default connect(mapStateToProps, {
  listMailGlobal,
  createMail,
  updateMail,
})(GlobalMail);
