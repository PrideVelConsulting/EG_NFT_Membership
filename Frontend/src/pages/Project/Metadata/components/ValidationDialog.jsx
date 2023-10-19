import React from "react";
import { Dialog } from "primereact/dialog";

const ValidationDialog = ({ visible, onHide, header, issues, title }) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      modal
      style={{ width: "50vw" }}
    >
      <div>
        <h4>{title}</h4>
        {issues?.map((issue, index) => (
          <div key={index}>
            <p>{`Row: ${issue.row}, Column: ${issue.column}`}</p>
            <p>{issue.message}</p>
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default ValidationDialog;
