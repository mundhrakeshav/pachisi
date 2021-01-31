import React, { createContext, useState } from "react";

export const ProviderModalContext = createContext();

const ProviderModalContextProvider = (props) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <ProviderModalContext.Provider
      value={{
        modalShow,
        setModalShow,
      }}>
      {props.children}
    </ProviderModalContext.Provider>
  );
};

export default ProviderModalContextProvider;
