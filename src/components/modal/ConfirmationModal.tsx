import React from 'react';

interface ConfirmationModal {
  id?: string;
  title: string;
  confirmFun: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModal> = ({
  id = 'exampleModal', title, confirmFun, children,
}): JSX.Element => (
  <div className="modal fade" id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-rad">
        <div className="modal-header border-0">
          <h5 className="title-text" id="exampleModalLabel">{title}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body py-0">
          {children}
        </div>
        <div className="modal-footer bg-white border-0 border-rad">
          <button type="button" className="btn btn-lg btn-reef w-100 border-rad" onClick={confirmFun} data-bs-dismiss="modal">{title}</button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmationModal;
