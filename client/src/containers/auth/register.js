import React, { Component } from "react";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";
import { Form, Input, message, Row, Col, Modal, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { registerUser, dropRegFile } from "../../actions/auth";
import { Link } from "react-router-dom";
import HomeHOC from "../../components/template/home-hoc";
import { FileDrop } from "react-file-drop";

const SignupForm = ({ onSubmit, pdfData }) => {
  const onFinish = (values) => {
    if (values.password !== values.conf_password) {
      message.error("password confirmation doesn't match!");
      return;
    }
    delete values.conf_password;
    onSubmit(values);
  };

  return (
    <Form
      name="register"
      className="register-form"
      onFinish={onFinish}
      initialValues={{ ...pdfData }}
    >
      <Row gutter={30}>
        <Col md={12} sm={24}>
          <Form.Item
            name="first_name"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
            ]}
          >
            <Input size="large" placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item
            name="last_name"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
              },
            ]}
          >
            <Input size="large" placeholder="Last Name" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col md={12} sm={24}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input size="large" type="email" placeholder="E-mail" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col md={12} sm={24}>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input size="large" type="password" placeholder="Password" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item
            name="conf_password"
            rules={[
              {
                required: true,
                message: "Please confirm your Password!",
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="signup-btn mt-5">
        <button type="submit" className="main-btn">
          Register
        </button>
        <div className="mt-5 v-center">
          <LeftOutlined />
          <Link to="/">&nbsp; RETURN TO HOME</Link>
        </div>
      </div>
    </Form>
  );
};

class Register extends Component {
  constructor() {
    super();

    this.state = {
      pdfData: {},
      fileReading: false,
      showModal: false,
      isShowPDFData: false,
    };
  }

  onSubmit = (values) => {
    const { registerUser } = this.props;
    values.usertype = "participant";
    registerUser(values);
  };

  handleDropFile = async (files, e) => {
    if (!files || files.length === 0) return;
    this.setState({ fileReading: true, showModal: true });
    const res = await this.props.dropRegFile(files[0]);
    if (!res.data.result) {
      message.error("Invalid file format!");
      this.setState({ showModal: false, fileReading: false });
      return;
    }
    this.setState({ pdfData: res.data.result, fileReading: false });
  };

  showPDFData = () => {
    this.setState({ isShowPDFData: true, showModal: false });
  };

  render() {
    const { fileReading, pdfData, showModal, isShowPDFData } = this.state;
    return (
      <HomeHOC>
        <div className="main-background-title">REGISTRATION</div>
        <FileDrop onDrop={this.handleDropFile}>
          {!isShowPDFData && (
            <SignupForm onSubmit={this.onSubmit} pdfData={{}} />
          )}
          {isShowPDFData && (
            <SignupForm onSubmit={this.onSubmit} pdfData={pdfData} />
          )}
          <Modal
            title={null}
            visible={showModal}
            width={300}
            footer={false}
            closable={false}
            centered
            className={`fileread-modal ${fileReading && "transparent"}`}
          >
            {fileReading && (
              <Spinner
                color="primary"
                style={{ width: "3rem", height: "3rem" }}
              />
            )}
            {!fileReading && (
              <React.Fragment>
                <p>Document has been authenticated by Integra</p>
                <Button type="link" onClick={this.showPDFData}>
                  IMPORT AUTHENTICATED DATA
                </Button>
              </React.Fragment>
            )}
          </Modal>
        </FileDrop>
      </HomeHOC>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { registerUser, dropRegFile })(
  Register
);
