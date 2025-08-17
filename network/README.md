# ----------------------------GETH Private Node Setup------------------------------------- #

# Step 1: Create Node Folders
    -> cd network
    -> mkdir node1
    -> mkdir node2

# Step 2: Create Node Account
    -> cd node1
    -> geth --datadir "./data" account new
    -> cd ../node2
    -> geth --datadir "./data" account new

# Step 3: Create genesis.json

# Step 4: Init Node 1 and Node 2
    -> cd ../node1
    -> geth --datadir ./data init ../genesis.json
    -> cd ../node2
    -> geth --datadir ./data init ../genesis.json

# Step 5: Create Bootnode
    -> cd ..
    -> mkdir bnode
    -> cd bnode
    -> bootnode -genkey boot.key

# Step 6: Start Bootnode
    -> bootnode -nodekey boot.key -verbosity 7 -addr "127.0.0.1:30301"

# Step 7: Start Node 1
    -> geth --datadir "./data"  --port 30304 --bootnodes enode://743b5eda3597487178831e5c969cc288a77c9382c06ee14a29b562cd97a2e0cbbd5a70e2b5df2c86518506c982c56a6efaae72023c3f64be8ef5562171d971dd@127.0.0.1:0?discport=30301 --authrpc.port 8547 --ipcdisable --allow-insecure-unlock  --http --http.corsdomain="https://remix.ethereum.org" --http.api web3,eth,debug,personal,net --networkid 454545 --unlock 0x2270f85F95512c14E46cCC66125860eaE17bC35E --password password.txt  --mine --miner.etherbase=0x2270f85F95512c14E46cCC66125860eaE17bC35E

    -> FROM GPT
    geth --datadir "./data" --port 30304 --networkid 454545 --bootnodes enode://743b5eda3597487178831e5c969cc288a77c9382c06ee14a29b562cd97a2e0cbbd5a70e2b5df2c86518506c982c56a6efaae72023c3f64be8ef5562171d971dd@127.0.0.1:30301?discport=30301 --authrpc.port 8547 --ipcdisable --http --http.addr 127.0.0.1 --http.port 8545 --http.api web3,eth,debug,personal,net,txpool --http.corsdomain "https://remix.ethereum.org" --allow-insecure-unlock --unlock 0x2270f85F95512c14E46cCC66125860eaE17bC35E --password password.txt --mine --miner.etherbase=0x2270f85F95512c14E46cCC66125860eaE17bC35E --miner.gasprice 0 --txpool.pricelimit 0



# Step 8: Start Node 2
    -> geth --datadir "./data"  --port 30306 --bootnodes enode://743b5eda3597487178831e5c969cc288a77c9382c06ee14a29b562cd97a2e0cbbd5a70e2b5df2c86518506c982c56a6efaae72023c3f64be8ef5562171d971dd@127.0.0.1:0?discport=30301 --authrpc.port 8546 --networkid 454545 --unlock 0xB853E18982127DE39898aEc262B24e0f72190aE4 --password password.txt

    -> FROM GPT
    geth --datadir "./data" --port 30306 --networkid 454545 --bootnodes enode://743b5eda3597487178831e5c969cc288a77c9382c06ee14a29b562cd97a2e0cbbd5a70e2b5df2c86518506c982c56a6efaae72023c3f64be8ef5562171d971dd@127.0.0.1:30301?discport=30301 --authrpc.port 8546 --ipcdisable --allow-insecure-unlock --unlock 0xB853E18982127DE39898aEc262B24e0f72190aE4 --password password.txt

# Step 9: Connect with Metamask:
    -> geth attach http://127.0.0.1:8545
    -> eth.sendTransaction({  from: "0x2270f85F95512c14E46cCC66125860eaE17bC35E",  to:   "0xD891006E241d70F30B8E5cC7Dbf578e8953ca0dE",  value: web3.toWei(1, "ether"),    gas: 21000                     })

    -> Output hash="0x1ea3a14d3c07633658aea10cbe0c83a846aeb947b873020bcb06b5cda95482e6"

# Extra
    -> to check balance:
    eth.getBalance("0x2270f85F95512c14E46cCC66125860eaE17bC35E")
    -> to check ethers:
    web3.fromWei(eth.getBalance("0x2270f85F95512c14E46cCC66125860eaE17bC35E"), "ether")

    1️⃣ Check transaction status in Geth console
    -> eth.getTransactionReceipt("0x1ea3a14d3c07633658aea10cbe0c83a846aeb947b873020bcb06b5cda95482e6")

    If status: 0x1, it’s confirmed.

    2️⃣ Check balances
    -> web3.fromWei(eth.getBalance("0xD891006E241d70F30B8E5cC7Dbf578e8953ca0dE"), "ether")
    -> web3.fromWei(eth.getBalance("0x2270f85F95512c14E46cCC66125860eaE17bC35E"), "ether")

    First is your MetaMask account → should now show 1 ETH more than before.
    Second is the sender → should be 1 ETH + gas fee less.








