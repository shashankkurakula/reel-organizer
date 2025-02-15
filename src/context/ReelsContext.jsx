import { createContext, useContext, useState } from "react";

const ReelsContext = createContext();

export const ReelsProvider = ({ children }) => {
  const [reels, setReels] = useState([]);

  return (
    <ReelsContext.Provider value={{ reels, setReels }}>
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => {
  return useContext(ReelsContext);
};
