import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input, message } from "antd";
import { sendInvite } from "../../actions/auth";
import { Header, Footer } from "../../components/template";

const InviteForm = ({ onSubmit }) => {
  const [file, setFile] = useState(null)

  const onFinish = (values) => {
    if (!file) {
      message.error("Please select smart document!")
      return
    }
    onSubmit(values.email, file)
  };
  
  const onFileChange = e => { 
    setFile(e.target.files[0]); 
  }; 

  return (
    <Form
      name="invite"
      className="invite-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input
          size="large"
          type="email"
          placeholder="Email"
        />
      </Form.Item>
      <Input
        size="large"
        type="file"
        placeholder="Click to Upload"
        onChange={onFileChange}
      />
      <div className="signup-btn mt-5">
        <button type="submit" className="main-btn">
          Send
        </button>
      </div>
    </Form>
  );
};

class Invite extends Component {
  render() {
    const { sendInvite } = this.props;
    return (
      <React.Fragment>
      <Header />
      <Container className="content">
        <div className="invite-title"><h1 >Send Invitation</h1></div> 
        <InviteForm onSubmit={sendInvite} />
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { sendInvite })(Invite);
