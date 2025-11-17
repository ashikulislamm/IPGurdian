import { ethers } from 'ethers';

class Web3Service {
  constructor() {
    // Local Ethereum node configuration
    this.rpcUrl = process.env.ETH_RPC_URL || 'http://127.0.0.1:8545';
    this.chainId = parseInt(process.env.CHAIN_ID || '1337');
    this.provider = null;
    this.signer = null;
  }

  /**
   * Initialize Web3 provider
   */
  async initProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
      
      // Test connection
      const network = await this.provider.getNetwork();
      console.log('✅ Connected to Ethereum network:', {
        name: network.name,
        chainId: network.chainId.toString()
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Ethereum node:', error.message);
      return false;
    }
  }

  /**
   * Get provider instance
   */
  getProvider() {
    if (!this.provider) {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    }
    return this.provider;
  }

  /**
   * Get signer for transactions
   */
  async getSigner(privateKey) {
    const provider = this.getProvider();
    return new ethers.Wallet(privateKey, provider);
  }

  /**
   * Get current block number
   */
  async getCurrentBlock() {
    try {
      const provider = this.getProvider();
      return await provider.getBlockNumber();
    } catch (error) {
      console.error('Get block number error:', error);
      throw error;
    }
  }

  /**
   * Get ETH balance
   */
  async getBalance(address) {
    try {
      const provider = this.getProvider();
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash) {
    try {
      const provider = this.getProvider();
      return await provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Get transaction receipt error:', error);
      throw error;
    }
  }

  /**
   * Calculate gas estimate
   */
  async estimateGas(transaction) {
    try {
      const provider = this.getProvider();
      return await provider.estimateGas(transaction);
    } catch (error) {
      console.error('Estimate gas error:', error);
      throw error;
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(signer, transaction) {
    try {
      const tx = await signer.sendTransaction(transaction);
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);
      
      return receipt;
    } catch (error) {
      console.error('Send transaction error:', error);
      throw error;
    }
  }

  /**
   * Format ether value
   */
  formatEther(value) {
    return ethers.formatEther(value);
  }

  /**
   * Parse ether value
   */
  parseEther(value) {
    return ethers.parseEther(value.toString());
  }

  /**
   * Keccak256 hash
   */
  keccak256(data) {
    return ethers.keccak256(data);
  }

  /**
   * Convert to UTF8 bytes
   */
  toUtf8Bytes(text) {
    return ethers.toUtf8Bytes(text);
  }
}

const web3Service = new Web3Service();
export default web3Service;
