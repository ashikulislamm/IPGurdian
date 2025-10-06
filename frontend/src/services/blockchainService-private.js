import { ethers } from 'ethers';

export class BlockchainService {
  constructor(contract, signer) {
    this.contract = contract;
    this.signer = signer;
  }

  // Generate IP hash for blockchain proof
  static generateIPHash(title, description, category = '') {
    const data = `${title}:${description}:${category}:${Date.now()}`;
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  }

  // Register IP on your private blockchain
  async registerIP(ipData) {
    try {
      const { title, description, category } = ipData;

      console.log('🔗 Starting blockchain registration...');
      console.log('📝 IP Data:', { title, description, category });

      // Generate IP hash
      const ipHash = BlockchainService.generateIPHash(title, description, category);
      console.log('🔐 Generated IP Hash:', ipHash);

      // Estimate gas for the transaction
      console.log('⛽ Estimating gas...');
      const gasEstimate = await this.contract.registerIP.estimateGas(
        title.trim(),
        description.trim(),
        category.trim(),
        ipHash
      );
      
      const gasLimit = gasEstimate * 120n / 100n; // Add 20% buffer
      console.log('⛽ Gas estimate:', gasEstimate.toString());
      console.log('⛽ Gas limit:', gasLimit.toString());

      // Prepare transaction options for private network
      const txOptions = {
        gasLimit: gasLimit,
        gasPrice: 0, // Free transactions on your private network
      };

      console.log('📤 Sending transaction to private blockchain...');
      
      // Execute the transaction
      const tx = await this.contract.registerIP(
        title.trim(),
        description.trim(),
        category.trim(),
        ipHash,
        txOptions
      );

      console.log('✅ Transaction sent! Hash:', tx.hash);
      console.log('⏳ Waiting for confirmation on private network...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('🎉 Transaction confirmed!');
      console.log('📋 Receipt:', receipt);

      // Verify transaction success
      if (receipt.status !== 1) {
        throw new Error('Transaction failed on blockchain');
      }

      // Extract IP ID from events
      const ipId = this.extractIPIdFromLogs(receipt.logs);
      console.log('🆔 Extracted IP ID:', ipId);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
        ipHash: ipHash,
        ipId: ipId,
        timestamp: new Date().toISOString(),
        network: 'IPGuardian Private Network',
        chainId: 40404040,
      };

    } catch (error) {
      console.error('❌ Blockchain registration failed:', error);
      
      let errorMessage = 'Unknown blockchain error';
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for gas fees';
      } else if (error.code === 'USER_REJECTED') {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message?.includes('execution reverted')) {
        errorMessage = 'Smart contract execution failed';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network connection error - ensure your private blockchain is running';
      } else {
        errorMessage = error.message || 'Blockchain transaction failed';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Extract IP ID from transaction logs
  extractIPIdFromLogs(logs) {
    try {
      // Look for IPRegistered event
      for (const log of logs) {
        try {
          const parsedLog = this.contract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          
          if (parsedLog && parsedLog.name === 'IPRegistered') {
            return parsedLog.args.ipId.toString();
          }
        } catch (parseError) {
          console.log('Could not parse log:', parseError);
          continue;
        }
      }
      
      // If no event found, return null
      return null;
    } catch (error) {
      console.error('Error extracting IP ID from logs:', error);
      return null;
    }
  }

  // Get IP details by ID
  async getIP(ipId) {
    try {
      const result = await this.contract.getIP(ipId);
      return {
        success: true,
        data: {
          title: result[0],
          description: result[1],
          category: result[2],
          owner: result[3],
          timestamp: new Date(Number(result[4]) * 1000).toISOString(),
          ipHash: result[5],
        },
      };
    } catch (error) {
      console.error('Failed to get IP:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve IP from blockchain',
      };
    }
  }

  // Get user's registered IPs
  async getUserIPs(address) {
    try {
      const ipIds = await this.contract.getUserIPs(address);
      const userIPs = [];

      for (const ipId of ipIds) {
        const ipResult = await this.getIP(ipId);
        if (ipResult.success) {
          userIPs.push({
            id: ipId.toString(),
            ...ipResult.data,
          });
        }
      }

      return {
        success: true,
        data: userIPs,
      };
    } catch (error) {
      console.error('Failed to get user IPs:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve user IPs from blockchain',
      };
    }
  }

  // Check if address owns specific IP
  async verifyOwnership(ipId, address) {
    try {
      const ipResult = await this.getIP(ipId);
      if (!ipResult.success) {
        return { success: false, error: 'IP not found' };
      }

      const isOwner = ipResult.data.owner.toLowerCase() === address.toLowerCase();
      return {
        success: true,
        isOwner: isOwner,
        owner: ipResult.data.owner,
      };
    } catch (error) {
      console.error('Failed to verify ownership:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify IP ownership',
      };
    }
  }
}