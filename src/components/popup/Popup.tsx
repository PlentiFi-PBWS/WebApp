import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './Popup.scss';

type Props = {
  title: string;
  content: any;
};

const ControlledPopup = (props: Props) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  return (
    <div>
      <button type="button" className="button" onClick={() => setOpen(o => !o)}>
        Controlled Popup
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <div className="header">{props.title}</div> {/* Placeholder if you decide to add a header */}
          <div className="content">
            {props.content}
          </div>
          <div className="actions">
            {/* Placeholder for actions if you add any */}
          </div>
          <button type="button" className="button" onClick={closeModal}>
                I understand !
          </button>
        </div>
      </Popup>
    </div>
  );
};

export default ControlledPopup;
