import React, { useState } from "react";

export const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion-section">
      <button className="accordion-toggle" onClick={() => setOpen(!open)}>
        {title}
      </button>
      {open && <div className="accordion-content">{children}</div>}
    </div>
  );
};