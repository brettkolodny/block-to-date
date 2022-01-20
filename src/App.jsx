import React from "react";
import BlockForm from "./BlockForm";

const App = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
      <div className="w-9/12 lg:w-1/3 min-h-60 bg-gray-200 shadow-offset-purple">
        <BlockForm />
      </div>
    </div>
  );
};

export default App;
