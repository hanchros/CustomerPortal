import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerBody = (props) => {
  return (
    <div className="m-3">
      <Spinner type="grow" color="primary" />
      <Spinner type="grow" color="secondary" />
      <Spinner type="grow" color="success" />
      <Spinner type="grow" color="danger" />
      <Spinner type="grow" color="warning" />
      <Spinner type="grow" color="info" />
    </div>
  );
}

export default SpinnerBody;