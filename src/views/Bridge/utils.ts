import { encodePacked, getAddress, pad, size } from "viem"

export function encodeOptions(gas: bigint, value: bigint, nativeValue: bigint, receiver: Address) {
  const newOptions = encodePacked(["uint16"], [3])

  // _value == 0 ? abi.encodePacked(_gas) : abi.encodePacked(_gas, _value);
  const lzReceiveOption =
    value === 0n ? encodePacked(["uint128"], [gas]) : encodePacked(["uint128", "uint128"], [gas, value])

  /*
        abi.encodePacked(
            _options,
            ExecutorOptions.WORKER_ID, // default 1
            _option.length.toUint16() + 1, // +1 for optionType
            _optionType, // OPTION_TYPE_LZRECEIVE = 1, OPTION_TYPE_NATIVE_DROP = 2
            _option
        );
    */
  let options = encodePacked(
    ["bytes", "uint8", "uint16", "uint8", "bytes"],
    [newOptions, 1, size(lzReceiveOption) + 1, 1, lzReceiveOption],
  )

  if (nativeValue !== 0n) {
    // abi.encodePacked(_amount, _receiver);
    const nativeDropOption = encodePacked(["uint128", "bytes32"], [nativeValue, pad(getAddress(receiver))])

    /*
        abi.encodePacked(
            _options,
            ExecutorOptions.WORKER_ID, // default 1
            _option.length.toUint16() + 1, // +1 for optionType
            _optionType, // OPTION_TYPE_LZRECEIVE = 1, OPTION_TYPE_NATIVE_DROP = 2
            _option
        );
        */
    options = encodePacked(
      ["bytes", "uint8", "uint16", "uint8", "bytes"],
      [options, 1, size(nativeDropOption) + 1, 2, nativeDropOption],
    )
  }

  return options
}
