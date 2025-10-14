import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

class IPFSService {
  constructor() {
    this.apiUrl = process.env.IPFS_API_URL || 'http://127.0.0.1:5001/api/v0';
    this.gatewayUrl = process.env.IPFS_GATEWAY_URL || 'http://127.0.0.1:8080';
  }

  /**
   * Test IPFS node connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      // First try the version endpoint
      console.log(`🔍 Trying IPFS API at: ${this.apiUrl}`);
      
      const response = await axios.post(`${this.apiUrl}/version`, null, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('✅ IPFS connection successful:', response.data);
      return true;
    } catch (error) {
      console.error('❌ IPFS connection failed:', error.message);
      
      // Try alternative endpoints and provide helpful error messages
      if (error.code === 'ECONNREFUSED') {
        console.error('💡 IPFS node is not running. Please:');
        console.error('   1. Start IPFS Desktop');
        console.error('   2. Or run: ipfs daemon');
        console.error('   3. Check if IPFS API is available at http://127.0.0.1:5001');
      } else if (error.response?.status === 405) {
        console.error('💡 Method not allowed. Trying alternative approach...');
        return await this.testConnectionAlternative();
      } else if (error.response?.status === 403) {
        console.error('💡 CORS issue detected. Please configure IPFS CORS settings:');
        console.error('   Run: ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin \'["*"]\'');
        console.error('   Run: ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods \'["PUT", "POST", "GET"]\'');
      }
      
      return false;
    }
  }

  /**
   * Alternative connection test using different method
   */
  async testConnectionAlternative() {
    try {
      console.log('🔄 Trying alternative connection method...');
      
      // Try using GET method instead of POST
      const response = await axios.get(`${this.apiUrl}/id`, {
        timeout: 5000
      });
      
      console.log('✅ IPFS connection successful (alternative method):', {
        id: response.data.ID,
        version: response.data.AgentVersion
      });
      return true;
    } catch (altError) {
      console.error('❌ Alternative connection method also failed:', altError.message);
      
      // Try the gateway instead
      try {
        console.log('🔄 Testing IPFS Gateway...');
        const gatewayResponse = await axios.get(`${this.gatewayUrl}/ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn`, {
          timeout: 5000
        });
        
        console.log('✅ IPFS Gateway is working (API might have CORS issues)');
        return true;
      } catch (gatewayError) {
        console.error('❌ IPFS Gateway also failed:', gatewayError.message);
        return false;
      }
    }
  }

  /**
   * Upload file to IPFS
   * @param {string} filePath - Path to the file to upload
   * @param {string} fileName - Original filename
   * @returns {Promise<Object>} Upload result with IPFS hash
   */
  async uploadFile(filePath, fileName) {
    try {
      // Verify file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Create form data
      const formData = new FormData();
      const fileStream = fs.createReadStream(filePath);
      formData.append('file', fileStream, fileName);

      // Upload to IPFS
      const response = await axios.post(`${this.apiUrl}/add`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000, // 30 seconds timeout
      });

      const result = response.data;
      console.log('✅ File uploaded to IPFS:', result);

      return {
        success: true,
        hash: result.Hash,
        name: result.Name,
        size: result.Size,
        gatewayUrl: `${this.gatewayUrl}/ipfs/${result.Hash}`
      };
    } catch (error) {
      console.error('❌ IPFS upload failed:', error.message);
      throw new Error(`Failed to upload file to IPFS: ${error.message}`);
    }
  }

  /**
   * Upload multiple files to IPFS
   * @param {Array} files - Array of file objects {path, name}
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleFiles(files) {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file.path, file.name)
      );

      const results = await Promise.allSettled(uploadPromises);
      
      return results.map((result, index) => ({
        file: files[index].name,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      console.error('❌ Multiple file upload failed:', error.message);
      throw error;
    }
  }

  /**
   * Get file from IPFS
   * @param {string} hash - IPFS hash of the file
   * @returns {Promise<Buffer>} File data
   */
  async getFile(hash) {
    try {
      const response = await axios.get(`${this.apiUrl}/cat?arg=${hash}`, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('❌ Failed to retrieve file from IPFS:', error.message);
      throw new Error(`Failed to retrieve file from IPFS: ${error.message}`);
    }
  }

  /**
   * Pin file to ensure it stays available
   * @param {string} hash - IPFS hash to pin
   * @returns {Promise<Object>} Pin result
   */
  async pinFile(hash) {
    try {
      const response = await axios.post(`${this.apiUrl}/pin/add?arg=${hash}`);
      console.log('✅ File pinned successfully:', response.data);
      return {
        success: true,
        hash: hash,
        pinned: true
      };
    } catch (error) {
      console.error('❌ Failed to pin file:', error.message);
      throw new Error(`Failed to pin file: ${error.message}`);
    }
  }

  /**
   * Unpin file from IPFS
   * @param {string} hash - IPFS hash to unpin
   * @returns {Promise<Object>} Unpin result
   */
  async unpinFile(hash) {
    try {
      const response = await axios.post(`${this.apiUrl}/pin/rm?arg=${hash}`);
      console.log('✅ File unpinned successfully:', response.data);
      return {
        success: true,
        hash: hash,
        pinned: false
      };
    } catch (error) {
      console.error('❌ Failed to unpin file:', error.message);
      throw new Error(`Failed to unpin file: ${error.message}`);
    }
  }

  /**
   * Get file stats from IPFS
   * @param {string} hash - IPFS hash
   * @returns {Promise<Object>} File stats
   */
  async getFileStats(hash) {
    try {
      const response = await axios.get(`${this.apiUrl}/object/stat?arg=${hash}`);
      return {
        success: true,
        stats: response.data
      };
    } catch (error) {
      console.error('❌ Failed to get file stats:', error.message);
      throw new Error(`Failed to get file stats: ${error.message}`);
    }
  }

  /**
   * List pinned files
   * @returns {Promise<Array>} List of pinned files
   */
  async listPinnedFiles() {
    try {
      const response = await axios.get(`${this.apiUrl}/pin/ls`);
      return {
        success: true,
        pins: response.data.Keys || {}
      };
    } catch (error) {
      console.error('❌ Failed to list pinned files:', error.message);
      throw new Error(`Failed to list pinned files: ${error.message}`);
    }
  }

  /**
   * Generate gateway URL for file
   * @param {string} hash - IPFS hash
   * @returns {string} Gateway URL
   */
  generateGatewayUrl(hash) {
    return `${this.gatewayUrl}/ipfs/${hash}`;
  }

  /**
   * Generate public gateway URLs (for backup access)
   * @param {string} hash - IPFS hash
   * @returns {Array} Array of public gateway URLs
   */
  generatePublicGatewayUrls(hash) {
    const publicGateways = [
      'https://ipfs.io/ipfs',
      'https://gateway.pinata.cloud/ipfs',
      'https://cloudflare-ipfs.com/ipfs',
      'https://dweb.link/ipfs'
    ];

    return publicGateways.map(gateway => `${gateway}/${hash}`);
  }
}

// Export singleton instance
const ipfsService = new IPFSService();
export default ipfsService;