import { Button } from "@chakra-ui/react"
import { getTxLogs } from "services/berascan"

const USDC_BERA_Txs = [
  "0xb399541d50e835b732319ec56ac6f36797c5b2f27985e5d78aeb2c5335d27815",
  "0xb399541d50e835b732319ec56ac6f36797c5b2f27985e5d78aeb2c5335d27815",
  "0xd0f479ad901785fb125e8e3b37368ab5c2f817553522152eb1f029c7563abee8",
  "0xfc44523cb8b9668da2c7a58120d7ed0d9dffc4c20c9445816587acd6414de426",
  "0xfc44523cb8b9668da2c7a58120d7ed0d9dffc4c20c9445816587acd6414de426",
  "0x199123ee66ff5a4aa8eca4a96e22246013ef6fef023062b62410444d910ccdc3",
  "0x791f463cbdeceac14c66b37cee70e67ae626b2382602aff4c6e67ae65b343eac",
  "0x791f463cbdeceac14c66b37cee70e67ae626b2382602aff4c6e67ae65b343eac",
  "0xda205a9424241ab2f12db23d1b91965e66eaa35b62369d12f0692a7b683616ca",
  "0x2593c0cbb7ce696e527f6f4dc0e86dfa9d19d789ce380df3964f0ea9c36bd825",
  "0x2593c0cbb7ce696e527f6f4dc0e86dfa9d19d789ce380df3964f0ea9c36bd825",
  "0xcfeb17de5f78f16f8af98a158e6944777e03fbfb599ca3d6422cc0c6b806ee50",
  "0x07ce7daa706087ed548f60e8a0b906fd1896fbbc2bed42d7e7e1e6b3bccb4f53",
  "0xd21403559e13ed3895d3352680c797372608335755825dba6bca55a38b37c29e",
  "0x238feff32005c100d3e3b58849afb0c6257cb786bd3de34df5bf5c994772e232",
  "0x238feff32005c100d3e3b58849afb0c6257cb786bd3de34df5bf5c994772e232",
  "0xceb60c3787d418e36ea6bf60caeb3495e27a183e9a2995911b2a6ab715ffc1cf",
  "0xceb60c3787d418e36ea6bf60caeb3495e27a183e9a2995911b2a6ab715ffc1cf",
  "0x07c05ba84e8956a9904e378f66b5f1bc6fb2d19bdcf44c3c999a70bdb7663988",
  "0x68a85eeb530244872d4742621e45c9f80c5e91a68b3112dfaea9ad1244167006",
  "0x6dff7a53e0ecf72d248d24d3554f801529a70fe7f81ff7c11e9676b883687b57",
  "0x6dff7a53e0ecf72d248d24d3554f801529a70fe7f81ff7c11e9676b883687b57",
  "0x28097d2eb00429a86a93ee6c77a022186570b767c0f376d3dc51bf4e75865d44",
  "0x27db6df017aa4d657a18ff9067ddd095389005c982737f993d9c1ce919c1cab9",
  "0x60c0d43c31e478314cb535e5694c438ad92545765d24cd378758e68d8f9ffd48",
  "0x454eaf354efcc4bc0d09c8b8cdcabb98055f51be34837d8ae8506bd83b87f979",
  "0x001a6c743fbbc8a4dec7c92e7f95782ef092cdca76dc36091324e54f795b2a39",
  "0x001a6c743fbbc8a4dec7c92e7f95782ef092cdca76dc36091324e54f795b2a39",
  "0x6ff4d21505851405c3d05259f7d044e7e647eec1041554552cd3de7b74e1fc9b",
  "0x29659fc20daaea0b09cb113e3091a3a4c5aba7b8be0c0655bb7a9216b803ec2f",
  "0x29659fc20daaea0b09cb113e3091a3a4c5aba7b8be0c0655bb7a9216b803ec2f",
  "0xbe977b01697618d02bc5171eabbf8f0faeaee9a5215f55f8fe38247048df2a25",
  "0xd0e556087857abd53738268cdabd14ecd47d2f2b83c8b66c1b87121bc18ce7e0",
  "0x688b7178da67267fcc43d06f34582ce8790f784f7f5567fc44f27f32c9416941",
  "0x443734ad095ab174120f4c73a6967b9c8e2ab46bad0f0377b9b8e17c6ba17c25",
  "0x058c6d38221e4e55be90e7a6c3d35d71b6ea1ee7600519bb23b58e47c4dea6be",
  "0x3355ee8a56dcc64be807198d9fec2394717ce7eb631a5cd59504cf8d391367a2",
  "0x7f27c571ba0bd2f8026ee82f8a24207a1630e15827e53e5a3ef3e29397b85ef8",
  "0x5882b5c0c5506c86da4ab116dd5d45d5e9fc4b0cc39280c30484ddf8ed95235e",
  "0x1bdfb13dc353bd33af8202984f30c1c27cd141bab36d09f99687c9f997c10d8b",
  "0x9c5136ab51e59e30066723923488ba955f571b377297c4ce46ef143c3d799964",
  "0xc09730119292c4b6c27e3f621ebb5c940542f71f16baa17c5dca3d6cc0e2d264",
  "0x07df4abe799e0419358403f9987b814f0bcbb6ca1b8a68c4b062d9f21164d808",
  "0x07df4abe799e0419358403f9987b814f0bcbb6ca1b8a68c4b062d9f21164d808",
  "0x2b6f82121946dfd3d5b24ff2efdd25228b3b3dfeb1ff17ef63488650dca33e82",
  "0x07a0d567f7381de6e4c7529ff03a697506fcdcb86480a6528a014212e74f5252",
  "0x3da1b11ccbf47c0bce60e017aa8892f8a4d21e325cce720a965c1d5df579a286",
  "0x4522bc8cac8820e885d23a14a15d9bba80cd83b5524926d52f055432347a4846",
  "0x4522bc8cac8820e885d23a14a15d9bba80cd83b5524926d52f055432347a4846",
  "0x23d340ebce43be2bd0a852382ce8510c89e9df6c6def02e35762c419ffb70b51",
  "0xd2efacf1f2038526d6207e8b19f7858a640b9709b9e6d45b037eaa29cff9e797",
  "0xf292677edf27141be8981c990cb5a09917ddbe10a2cbb3a9c1429604b0e6e032",
  "0x62411070027514965c4b4f28ee732b8638e9e5ec00cddd2fa18d19108f6a410f",
  "0xca35f341daf4b33f4f7c62910053d6782478f401c7611601828fc22e57b7b575",
  "0x5f1cb4023078d97ba8dc528418d197a4d46b672fbfa67ebc3080d55973e5a3b8",
  "0x3ea8a6f26d696bff03573c7edc8b25a1e0e3c7b53d314ce6c0cc82200cd54e79",
]

const decodeData = (data: string) => {
  const [amount0, amount1] = [data.substring(0, 66), "0x" + (data.substring(66) || "0")].map((hex) =>
    BigInt(hex).toString(),
  )
  // .map((amount) => amount.toString())
  return [amount0, amount1]
}

const handleTx = async (txHash: string) => {
  const { items: logs }: TxLogs = await getTxLogs(txHash)
  let amount0,
    amount1,
    LPBurn = "0",
    LPMint = "0",
    reserve0,
    reserve1

  logs.forEach((log) => {
    if (log.event.startsWith("Burn") || log.event.startsWith("Mint")) {
      ;[amount0, amount1] = decodeData(log.data)
    }
    if (log.event.startsWith("Sync")) {
      ;[reserve0, reserve1] = decodeData(log.data)
    }
  })
  const isMint = logs.some((log) => log.event.startsWith("Mint"))
  if (isMint) {
    ;[LPMint] = decodeData(logs[logs.length - 3].data)
  } else {
    ;[LPBurn] = decodeData(logs[0].data)
  }

  return `${txHash}\t${reserve0}\t${reserve1}\t${amount0}\t${amount1}\t${LPBurn}\t${LPMint}`
}

const Hotel = () => {
  const handleTxs = async () => {
    const data = await Promise.all(USDC_BERA_Txs.map((txHash) => handleTx(txHash))).then((data) => data.join("\n"))
    console.log(data)
  }

  return (
    <div>
      HOTEL
      <Button onClick={() => handleTxs()}>Get Tx</Button>
    </div>
  )
}

export default Hotel
