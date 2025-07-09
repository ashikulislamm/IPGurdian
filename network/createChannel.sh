#!/bin/bash

CHANNEL_NAME="mychannel"
ORDERER_ADDRESS=orderer1.example.com:7050

echo "🔄 Copying channel artifacts into peer0 ..."
docker cp ./channel-artifacts peer0.org1.example.com:/etc/hyperledger/fabric/
# docker cp ./channel-artifacts peer1.org1.example.com:/etc/hyperledger/fabric/

echo "✅ Creating channel from peer0..."
docker exec peer0.org1.example.com bash -c "
cd /etc/hyperledger/fabric &&
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@org1.example.com/msp
# export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
export ORDERER_CA=/etc/hyperledger/fabric/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/ca.crt
peer channel create -o orderer1.example.com:7050 \
  --ordererTLSHostnameOverride orderer1.example.com \
  -c mychannel \
  -f ./channel-artifacts/mychannel.tx \
  --outputBlock /etc/hyperledger/fabric/channel-artifacts/mychannel.block \
  --tls --cafile \$ORDERER_CA
"
# docker cp peer0.org1.example.com:/etc/hyperledger/fabric/channel-artifacts/mychannel.block ./channel-artifacts/mychannel.block
echo "✅ Joining peer0 to the channel..."
docker exec peer0.org1.example.com bash -c "
cd /etc/hyperledger/fabric &&
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
peer channel join \
  -b /etc/hyperledger/fabric/channel-artifacts/mychannel.block \
  --tls \
  --cafile /etc/hyperledger/fabric/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/ca.crt
" || echo "❌ Peer0 failed to join the channel. Check CA or MSP path."

# echo "✅ Copying channel block from peer0 to peer1..."
# docker cp peer0.org1.example.com:/etc/hyperledger/fabric/channel-artifacts/$CHANNEL_NAME.block ./channel-artifacts/
# docker cp ./channel-artifacts/$CHANNEL_NAME.block peer1.org1.example.com:/etc/hyperledger/fabric/channel-artifacts/

# echo "✅ Joining peer1 to the channel..."
# docker exec peer1.org1.example.com bash -c "
# export CORE_PEER_LOCALMSPID=Org1MSP
# export CORE_PEER_TLS_ENABLED=true
# export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@org1.example.com/msp
# export CORE_PEER_ADDRESS=peer1.org1.example.com:8051
# export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
# # peer channel join -b /etc/hyperledger/fabric/channel-artifacts/$CHANNEL_NAME.block
# peer channel join \
#   -b /etc/hyperledger/fabric/channel-artifacts/mychannel.block \
#   --tls \
#   --cafile /etc/hyperledger/fabric/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/ca.crt
# " || echo "❌ Peer1 failed to join the channel. Check CA or MSP path."


echo "✅ Updating anchor peer..."
docker exec peer0.org1.example.com bash -c "
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
export ORDERER_CA=/etc/hyperledger/fabric/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/ca.crt
peer channel update -o orderer1.example.com:7050 \
  --ordererTLSHostnameOverride orderer1.example.com \
  -c mychannel \
  -f /etc/hyperledger/fabric/channel-artifacts/Org1MSPanchors.tx \
  --tls --cafile \$ORDERER_CA
"

# echo "🎉 Channel '$CHANNEL_NAME' created, peers joined, and anchor updated!"
