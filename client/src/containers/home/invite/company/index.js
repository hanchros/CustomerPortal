import React from "react";
import { connect } from "react-redux";
import { registerCompany } from "../../../../actions/softcompany";
import { resolveInvite } from "../../../../actions/invite";
import Step1 from "./step1";
import Step2 from "./step2";
import CompanyComplete from "./company-complate";

class CompanyRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scData: {
        contact: props.pdfData.contact,
        email: props.pdfData.email,
        org_name: props.pdfData.organization,
        phone: props.pdfData.phone,
      },
      step: 1,
    };
  }

  goToStep = (step) => {
    this.setState({ step });
  };

  onSubmitRegister = async (values) => {
    const { registerCompany, pdfData, resolveInvite } = this.props;
    await registerCompany(values);
    await resolveInvite(pdfData.invite, true);
    this.goToStep(4);
  };

  onSubmit1 = (data) => {
    this.setState({ scData: data });
    this.goToStep(2);
  };

  render() {
    const { goBack } = this.props;
    const { step, scData } = this.state;
    if (step === 1)
      return (
        <Step1 goBack={goBack} onSubmit={this.onSubmit1} scData={scData} />
      );
    else if (step === 2)
      return (
        <Step2
          goBack={() => this.goToStep(1)}
          onSubmit={this.onSubmitRegister}
          scData={scData}
        />
      );
    return <CompanyComplete goBack={() => this.goToStep(2)} />;
  }
}

function mapStateToProps(state) {
  return {
    pdfData: state.auth.pdfData,
  };
}

export default connect(mapStateToProps, { registerCompany, resolveInvite })(
  CompanyRegister
);
