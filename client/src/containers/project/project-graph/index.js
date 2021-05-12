import React from "react";
import { connect } from "react-redux";
import ReactFlow, {
  Controls,
  Background,
  ReactFlowProvider,
  addEdge,
  removeElements,
} from "react-flow-renderer";
import { listPCByProject } from "../../../actions/softcompany";
import { listDiagrams, updateDiagrams } from "../../../actions/project";
import Sidebar from "./sider";

const orgStyle = {
  background: "#4472c4",
  color: "white",
  border: "1px solid #416199",
  width: "auto",
};
const pcStyle = {
  background: "#f9a307",
  color: "white",
  border: "1px solid #9c4513",
  width: "auto",
};
const Movestyle = {
  background: "#333333",
  color: "white",
  width: "auto",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ProjectGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      elements: [],
      selectedElement: null,
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { project, listDiagrams, listPCByProject } = this.props;
    const curProj = project.project;
    this.setState({loading: true})
    await listPCByProject(curProj._id);
    await listDiagrams(curProj._id);
    const elements = this.getElementData();
    await sleep(50);
    this.setState({ elements, loading: false });
  };

  onLoad = async (reactFlowInstance) => {
    await sleep(100);
    reactFlowInstance.fitView();
  };

  onConnect = (params) => {
    let els = this.state.elements;
    els = addEdge(params, els);
    this.setState({ elements: els });
  };

  onElementsRemove = (elementsToRemove) => {
    let els = this.state.elements;
    els = removeElements(elementsToRemove, els);
    this.setState({ elements: els });
  };

  getElementData = () => {
    const diagrams = this.props.project.diagrams;
    let companies = this.getCompanies();

    let elements = [],
      k = 0;
    for (let comp of companies) {
      let fdia = diagrams.filter((item) => item.org_id === comp.id);
      if (fdia.length > 0) {
        elements.push({
          id: comp.id,
          data: { label: comp.name },
          position: { x: fdia[0].position_x, y: fdia[0].position_y },
          style: comp.type === "org" ? orgStyle : pcStyle,
        });
      } else {
        elements.push({
          id: comp.id,
          data: { label: comp.name },
          position: { x: 0, y: 50 * k },
          style: comp.type === "org" ? orgStyle : pcStyle,
        });
        k++;
      }
    }
    for (let dia of diagrams) {
      if (!dia.org_id.includes("move")) continue;
      let ids = dia.org_id.split("-");
      if (ids.length !== 3) continue;
      elements.push({
        id: dia.org_id,
        data: {
          label: (
            <div>
              <pre className="pre-code">{dia.content}</pre>
            </div>
          ),
        },
        position: { x: dia.position_x, y: dia.position_y },
        style: Movestyle,
        content: dia.content,
      });
      elements.push({
        id: `line-${ids[1]}-${ids[2]}-1`,
        source: ids[1],
        target: dia.org_id,
        arrowHeadType: "arrow",
        type: "smoothstep",
      });
      elements.push({
        id: `line-${ids[1]}-${ids[2]}-2`,
        source: dia.org_id,
        target: ids[2],
        arrowHeadType: "arrow",
        type: "smoothstep",
      });
    }
    return elements;
  };

  onElementClick = (e, el) => {
    if (!el.id.includes("move")) {
      this.setState({ selectedElement: null });
      return;
    }
    this.setState({ selectedElement: el });
  };

  getCompanies = () => {
    const { project, softcompany } = this.props;
    const orgs = project.organizations || [];
    const projectcompanies = softcompany.projectcompanies;
    let pcs = projectcompanies.filter((pc) => pc.status === 0);
    let companies = [];
    for (let org of orgs) {
      companies.push({
        id: org.organization._id,
        name: org.organization.org_name,
        type: "org",
      });
    }
    for (let pc of pcs) {
      let fcps = companies.filter((item) => item.id === pc.softcompany._id);
      if (fcps.length === 0) {
        companies.push({
          id: pc.softcompany._id,
          name: pc.softcompany.profile.org_name,
          type: "company",
        });
      }
    }
    return companies;
  };

  render() {
    const { isCreator, project, updateDiagrams } = this.props;
    const { elements, selectedElement, loading } = this.state;

    return (
      <div style={{ height: "500px", width: "100%" }}>
        {!loading && (
          <ReactFlowProvider>
            <ReactFlow
              elements={elements}
              elementsSelectable={true}
              nodesDraggable={true}
              nodesConnectable={false}
              onElementClick={this.onElementClick}
              onLoad={this.onLoad}
              onConnect={this.onConnect}
              onElementsRemove={this.onElementsRemove}
              snapToGrid={true}
              snapGrid={[15, 15]}
            >
              <Controls />
              <Background color="#aaa" gap={16} />
              {isCreator && (
                <Sidebar
                  elements={elements}
                  selectedElement={selectedElement}
                  project={project.project}
                  updateDiagrams={updateDiagrams}
                  setState={(value) => this.setState(value)}
                  companies={this.getCompanies()}
                />
              )}
            </ReactFlow>
          </ReactFlowProvider>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    softcompany: state.softcompany,
  };
};

export default connect(mapStateToProps, {
  listPCByProject,
  listDiagrams,
  updateDiagrams,
})(ProjectGraph);
