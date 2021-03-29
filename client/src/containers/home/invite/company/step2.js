import React from "react";
import { Col, Row } from "reactstrap";
import { Button, Checkbox, Collapse } from "antd";
import { PlusSquareFilled, MinusSquareFilled } from "@ant-design/icons";
import { company_services } from "../../../../constants";

const { Panel } = Collapse;

class SCStep2 extends React.Component {
  constructor() {
    super();

    this.state = {
      services: [],
      activeKeys: [],
    };
  }

  componentDidMount = () => {
    let services = this.props.scData.services;
    if (!services)
      services = company_services.map((cs) => {
        return {
          title: cs.title,
          items: [],
        };
      });
    this.setState({ services });
  };

  onChangeCheck = (cs, item) => {
    const { services } = this.state;
    for (let i = 0; i < services.length; i++) {
      if (services[i].title === cs.title) {
        const index = services[i].items.indexOf(item);
        if (index === -1) services[i].items.push(item);
        else services[i].items.splice(index, 1);
      }
    }
    this.setState({ services });
  };

  checkItems = (cs, item) => {
    const { services } = this.state;
    for (let sv of services) {
      if (sv.title === cs.title) {
        const index = sv.items.indexOf(item);
        return index !== -1;
      }
    }
  };

  genExtra = (cs) => {
    const { services } = this.state;
    for (let sv of services) {
      if (sv.title === cs.title && sv.items.length > 0) {
        return <span className="sc-services">{sv.items.length}</span>;
      }
    }
    return null;
  };

  onSubmitResult = () => {
    const { onSubmit, scData } = this.props;
    scData.services = this.state.services;
    onSubmit(scData);
  };

  onChangeCollapse = (keys) => {
    this.setState({ activeKeys: keys });
  };

  render() {
    const { goBack } = this.props;
    const { activeKeys } = this.state;
    return (
      <Row>
        <Col md={4}>
          <span>
            <b>STEP 3 of 4</b>
          </span>
          <div className="main-home-title mt-2 mb-4">
            Complete your company profile
          </div>
          <p className="mt-4 mb-4">
            Some information may be prefilled, but there are fields you need to
            complete.
          </p>
        </Col>
        <Col md={8}>
          <div className="home-invite-form company-invite">
            <h5 className="mb-5">
              <b>What type of software do you provide?</b>
            </h5>
            <p className="mb-5">
              Please check the boxes for the categories of software that your
              organization provides.
            </p>
            <Collapse onChange={this.onChangeCollapse}>
              {company_services.map((cs) => (
                <Panel
                  header={
                    <span className="flex" style={{ alignItems: "center" }}>
                      {activeKeys.indexOf(cs.title) === -1 && (
                        <PlusSquareFilled />
                      )}
                      {activeKeys.indexOf(cs.title) !== -1 && (
                        <MinusSquareFilled />
                      )}
                      {cs.title}
                    </span>
                  }
                  key={cs.title}
                  extra={this.genExtra(cs)}
                  showArrow={false}
                >
                  {cs.items.map((item) => (
                    <p className="cs-checker" key={item}>
                      <Checkbox
                        onChange={() => this.onChangeCheck(cs, item)}
                        checked={this.checkItems(cs, item)}
                      >
                        {item}
                      </Checkbox>
                    </p>
                  ))}
                </Panel>
              ))}
            </Collapse>
          </div>
          <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
            <Button type="ghost" onClick={goBack} className="ghost-btn wide">
              Cancel
            </Button>
            <Button
              type="ghost"
              onClick={this.onSubmitResult}
              className="black-btn wide ml-3"
            >
              Continue
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}

export default SCStep2;
