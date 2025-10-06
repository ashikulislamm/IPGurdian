import { ethers } from 'ethers';

export class BlockchainService {
  constructor(contract, signer) {
    if (!contract || !signer) {
      throw new Error('Contract and signer are required');
    }
    this.contract = contract;
    this.signer = signer;
  }

  // Generate secure IP hash
  static generateIPHash(title, description, timestamp = Date.now()) {
    try {
      const dataString = `${title}||${description}||${timestamp}`;
      return ethers.keccak256(ethers.toUtf8Bytes(dataString));
    } catch (error) {
      throw new Error(`Failed to generate IP hash: ${error.message}`);
    }
  }

  // Validate input data
  static validateIPData(ipData) {
    const { title, description, category } = ipData;
    
    if (!title || title.trim().length === 0) {
      throw new Error('IP title is required');
    }
    
    if (!description || description.trim().length === 0) {
      throw new Error('IP description is required');
    }
    
    if (!category || category.trim().length === 0) {
      throw new Error('IP category is required');
    }
    
    if (title.length > 100) {
      throw new Error('IP title too long (max 100 characters)');
    }
    
    if (description.length > 1000) {
      throw new Error('IP description too long (max 1000 characters)');
    }
    
    return true;
  }

  // Check contract connection
  checkConnection() {
    if (!this.contract) {
      throw new Error('Smart contract not connected');
    }
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
  }

  // Register IP on blockchain with comprehensive error handling
  async registerIP(ipData) {
    try {
      this.checkConnection();
      BlockchainService.validateIPData(ipData);

      const { title, description, category } = ipData;
      const ipHash = BlockchainService.generateIPHash(title, description);

      // Check if user has sufficient balance
      const balance = await this.signer.provider.getBalance(await this.signer.getAddress());
      const minBalance = ethers.parseEther('0.001'); // Minimum balance for transaction
      
      if (balance < minBalance) {
        throw new Error('Insufficient balance for transaction');
      }

      // Estimate gas with buffer
      let gasEstimate;
      try {
        gasEstimate = await this.contract.registerIP.estimateGas(
          title.trim(),
          description.trim(),
          category.trim(),
          ipHash
        );
      } catch (estimateError) {
        console.error('Gas estimation failed:', estimateError);
        throw new Error('Transaction may fail. Please check contract conditions.');
      }

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate * BigInt(120) / BigInt(100);

      // Get current gas price
      const feeData = await this.signer.provider.getFeeData();
      
      const txOptions = {
        gasLimit: gasLimit,
      };

      // Use EIP-1559 if supported
      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        txOptions.maxFeePerGas = feeData.maxFeePerGas;
        txOptions.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      } else {
        txOptions.gasPrice = feeData.gasPrice;
      }

      // Execute transaction
      const tx = await this.contract.registerIP(
        title.trim(),
        description.trim(),
        category.trim(),
        ipHash,
        txOptions
      );

      // Wait for confirmation with timeout
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction timeout')), 300000) // 5 minute timeout
        )
      ]);

      // Verify transaction success
      if (receipt.status !== 1) {
        throw new Error('Transaction failed');
      }

      // Extract IP ID from events
      const ipId = this.extractIPIdFromLogs(receipt.logs);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        ipHash: ipHash,
        ipId: ipId,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      console.error('Error registering IP:', error);
      
      return {
        success: false,
        error: this.formatError(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Extract IP ID from transaction logs
  extractIPIdFromLogs(logs) {
    try {
      for (const log of logs) {
        try {
          const parsedLog = this.contract.interface.parseLog(log);
          // Adjust event name based on your contract
          if (parsedLog && (parsedLog.name === 'IPRegistered' || parsedLog.name === 'IPCreated')) {
            return parsedLog.args.ipId ? parsedLog.args.ipId.toString() : parsedLog.args[0]?.toString();
          }
        } catch (parseError) {
          // Continue to next log
          continue;
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting IP ID:', error);
      return null;
    }
  }

  // Get IP details with error handling
  async getIPDetails(ipId) {
    try {
      this.checkConnection();
      
      if (!ipId || isNaN(ipId)) {
        throw new Error('Invalid IP ID');
      }

      const ipDetails = await this.contract.getIP(ipId);
      
      return {
        success: true,
        data: {
          id: ipDetails.id.toString(),
          title: ipDetails.title,
          description: ipDetails.description,
          category: ipDetails.category,
          owner: ipDetails.owner,
          timestamp: new Date(Number(ipDetails.timestamp) * 1000),
          isActive: ipDetails.isActive,
        },
      };
    } catch (error) {
      console.error('Error getting IP details:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  // Get user's IPs with pagination
  async getUserIPs(userAddress, limit = 50) {
    try {
      this.checkConnection();
      
      if (!ethers.isAddress(userAddress)) {
        throw new Error('Invalid user address');
      }

      const ipIds = await this.contract.getUserIPs(userAddress);
      const ips = [];
      
      // Limit the number of IPs to fetch
      const maxIPs = Math.min(ipIds.length, limit);
      
      for (let i = 0; i < maxIPs; i++) {
        try {
          const ipId = ipIds[i].toString();
          const ipDetails = await this.getIPDetails(ipId);
          if (ipDetails.success) {
            ips.push(ipDetails.data);
          }
        } catch (error) {
          console.warn(`Failed to fetch IP ${ipIds[i]}:`, error);
          // Continue with other IPs
        }
      }
      
      return {
        success: true,
        data: ips,
        total: ipIds.length,
        fetched: ips.length,
      };
    } catch (error) {
      console.error('Error getting user IPs:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  // Verify IP ownership
  async verifyOwnership(ipId, userAddress) {
    try {
      this.checkConnection();
      
      if (!ipId || isNaN(ipId)) {
        throw new Error('Invalid IP ID');
      }
      
      if (!ethers.isAddress(userAddress)) {
        throw new Error('Invalid user address');
      }

      // Try different method names based on your contract
      let isOwner;
      try {
        isOwner = await this.contract.isOwner(ipId, userAddress);
      } catch (error) {
        // Fallback: check owner directly
        const ipDetails = await this.contract.getIP(ipId);
        isOwner = ipDetails.owner.toLowerCase() === userAddress.toLowerCase();
      }
      
      return {
        success: true,
        isOwner,
      };
    } catch (error) {
      console.error('Error verifying ownership:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  // Get transaction details
  async getTransactionDetails(txHash) {
    try {
      this.checkConnection();
      
      if (!txHash || typeof txHash !== 'string') {
        throw new Error('Invalid transaction hash');
      }

      const [tx, receipt] = await Promise.all([
        this.signer.provider.getTransaction(txHash),
        this.signer.provider.getTransactionReceipt(txHash)
      ]);

      return {
        success: true,
        data: {
          hash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          status: receipt.status === 1 ? 'Success' : 'Failed',
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
        },
      };
    } catch (error) {
      console.error('Error getting transaction details:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  // Format error messages for user display
  formatError(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      return 'Transaction may fail. Please check contract conditions.';
    }
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return 'Insufficient funds for transaction';
    }
    
    if (error.code === 'NETWORK_ERROR') {
      return 'Network connection error. Please try again.';
    }
    
    if (error.code === 4001) {
      return 'Transaction rejected by user';
    }
    
    if (error.reason) {
      return error.reason;
    }
    
    if (error.message) {
      // Clean up common error messages
      if (error.message.includes('execution reverted')) {
        return 'Smart contract execution failed';
      }
      return error.message;
    }
    
    return 'Unknown error occurred';
  }
}