import React from "react";

const ButtonComponent = ({ label = "", classname = "", onButtonClick }) => {
  return (
    <>
      <button
        onClick={onButtonClick}
        className={`bg-[#878aff] hover:bg-[#767bfc] text-white px-8 py-1 text-lg rounded hover:text-white ${classname}`}
      >
        {label}
      </button>
    </>
  );
};

export default ButtonComponent;
