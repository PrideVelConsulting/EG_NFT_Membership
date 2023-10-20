import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const GenericDialog = (props) => {
  const {
    visible,
    onHide,
    header,
    onSubmit,
    onCancel,
    saveButtonTitle,
    cancelButtonTitle,
    children,
  } = props;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      modal
      style={{ width: "50vw" }}
      footer={
        <div>
          {onSubmit && (
            <Button
              label={saveButtonTitle || "Save"}
              onClick={onSubmit}
              className="p-button-success"
            />
          )}
          {onCancel && (
            <Button
              label={cancelButtonTitle || "Cancel"}
              onClick={onCancel}
              className="p-button-secondary"
            />
          )}
        </div>
      }
    >
      {children}
    </Dialog>
  );
};

export default GenericDialog;
