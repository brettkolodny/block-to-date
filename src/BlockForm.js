import React, { useState, useEffect, useRef } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@acala-network/api";

const endpoints = {
  polkadot: ["wss://polkadot.api.onfinality.io/public-ws"],
  kusama: ["wss://kusama-rpc.polkadot.io"],
  acala: ["wss://acala.polkawallet.io"],
  karura: ["wss://karura.api.onfinality.io/public-ws"],
};

const BlockForm = () => {
  const [chain, setChain] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [api, setApi] = useState(null);
  const inputRef = useRef();
  const subRef = useRef();
  const [targetDate, setTargetDate] = useState(null);
  const [expectedDate, setExpecetedDate] = useState(null);

  const changeChain = async () => {
    if (api) {
      api.disconnect();
    }

    let provider = new WsProvider(endpoints[chain ?? "polkadot"]);

    if (!chain || chain === "polkadot" || chain === "kusama") {
      return await ApiPromise.create({ provider });
    } else if (chain === "acala" || chain === "karura") {
      return await ApiPromise.create(options({ provider }));
    }
  };

  const calculate = async () => {
    let targetBlockTime;

    switch (chain) {
      case null:
      case "polkadot":
      case "kusama":
        targetBlockTime = 6;
        break;
      case "acala":
      case "karura":
        targetBlockTime = 12;
        break;
    }

    let apiInstance = api;
    if (!apiInstance) {
      apiInstance = await changeChain();
    }

    const currentBlock = (await apiInstance.query.system.number()).toNumber();
    const targetBlock = parseInt(inputRef.current.value);

    console.log(targetBlock, currentBlock);

    const targetSecondsToBlock = (targetBlock - currentBlock) * targetBlockTime;
    console.log(targetSecondsToBlock);

    const targetDate = new Date();
    targetDate.setUTCSeconds(targetDate.getUTCSeconds() + targetSecondsToBlock);

    setTargetDate(targetDate);
    estimateBlockTime(targetBlock, currentBlock);
    console.log(targetDate);
  };

  const estimateBlockTime = async (targetBlock, currentBlock) => {
    try {
      subRef.current();
    } catch {}

    let times = [];
    let count = 0;
    let prev = null;
    subRef.current = await api.query.system.number(() => {
      if (!prev) {
        prev = new Date();
      } else {
        const newTime = new Date();
        times.push(newTime - prev);
        prev = newTime;
        count += 1;
      }

      if (count == 10) {
        subRef.current();
        let averageTime =
          times.reduce((a, b) => a + b, 0) / times.length / 1000;

        console.log(averageTime);
        const expectedSecondsToBlock =
          (targetBlock - currentBlock) * averageTime;
        const expectedDate = new Date();
        expectedDate.setUTCSeconds(
          expectedDate.getUTCSeconds() + expectedSecondsToBlock
        );

        setExpecetedDate(expectedDate);
      }
    });
  };

  useEffect(() => {
    const connect = async () => {
      let newApi = await changeChain();
      setApi(newApi);
    };

    connect();
    setShowDropdown(false);

    return () => (api ? api.disconnect() : null);
  }, [chain]);

  return (
    <div className="flex flex-col justify-center items-center mx-8 my-14">
      <div className="flex flex-row-reverse gap-3">
        <input
          type="number"
          ref={inputRef}
          className="w-full bg-white focus:outline-none shadow-inner pl-4 border border-gray-500"
          placeholder="target block number"
        />
        <div className="relative w-20">
          <div 
            className="relative cursor-pointer px-2 py-1 border border-gray-400 shadow-md"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {chain ?? "polkadot"}
          </div>
          {showDropdown ? (
            <div className="absolute shadow-md w-full border border-gray-400 px-2">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setChain("polkadot");
                }}
              >
                polkadot
              </div>
              <div onClick={() => setChain("kusama")}>kusama</div>
              <div onClick={() => setChain("acala")}>acala</div>
              <div onClick={() => setChain("karura")}>karura</div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <div className="border border-black cursor-pointer px-2 py-1 mt-4" onClick={calculate}>calculate</div>
      <div>
        <div className="flex justify-center items-center border border-gray-400 my-4">{targetDate ? targetDate.toString() : null}</div>
        <div className="flex justify-center items-center border border-gray-400 my-4">{expectedDate ? expectedDate.toString() : null}</div>
      </div>
    </div>
  );
};

export default BlockForm;
