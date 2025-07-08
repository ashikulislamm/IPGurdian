--Commands to execute for installing HLF 2.5.x--

sudo usermod -aG docker $USER
newgrp docker
sudo apt update
sudo apt install -y git curl
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" \
-o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version
cd ~
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.0 1.5.6
docker images
export PATH=$PATH:$HOME/fabric-samples/bin
echo 'export PATH=$PATH:$HOME/fabric-samples/bin' >> ~/.bashrc
source ~/.bashrc



generate crypto material using crypto-config.yaml
cryptogen generate --config=./crypto-config.yaml --output=./crypto-config

generate channel transactions using configtx.yaml 
generate genesis block -> configtxgen -profile OneOrgOrdererGenesis -channelID system-channel   -outputBlock ./system-genesis-block/genesis.block
create channel tx -> configtxgen -profile OneOrgChannel -outputCreateChannelTx ./channel-artifacts/mychannel.tx -channelID mychannel
configtxgen -profile OneOrgChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP


docker-compose.yaml file run
docker-compose -f docker-compose.yaml up -d
docker ps ---checks the containers which are up

docker exec -it peer0.org1.example.com mkdir -p /etc/hyperledger/fabric/ordererOrganizations/example.com/orderers/orderer1.example.com/msp/tlscacerts/
docker cp ./crypto-config/ordererOrganizations/example.com/orderers/orderer1.example.com/msp/tlscacerts/tlsca.example.com-cert.pem peer0.org1.example.com:/etc/hyperledger/fabric/ordererOrganizations/example.com/orderers/orderer1.example.com/msp/tlscacerts/



docker logs orderer1.example.com

docker cp ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp peer0.org1.example.com:/etc/hyperledger/fabric/users/Admin@org1.example.com/

docker exec -it peer0.org1.example.com bash
ls /etc/hyperledger/fabric/users/Admin@org1.example.com/msp

docker exec -it peer1.org1.example.com peer channel list

ALTERNATE JOINING
docker exec -it peer0.org1.example.com bash
peer channel join -b /etc/hyperledger/fabric/channel-artifacts/mychannel.block --tls --cafile /etc/hyperledger/fabric/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/ca.crt


openssl x509 -in Admin@org1.example.com-cert.pem -noout -subject

*INSTALL IPFS*
wget https://dist.ipfs.tech/kubo/v0.25.0/kubo_v0.25.0_linux-amd64.tar.gz
tar -xvzf kubo_v0.25.0_linux-amd64.tar.gz
cd kubo
sudo bash install.sh
ipfs --version  # should show v0.25.0
