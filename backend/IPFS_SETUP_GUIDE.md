# IPGuardian IPFS Setup Guide

## Issue: IPFS Connection Failed with 405 Error

The error "Request failed with status code 405" indicates that IPFS Desktop's API server is not properly configured for external access.

## Quick Fix Steps:

### Step 1: Configure IPFS CORS Settings

Open Command Prompt or PowerShell as Administrator and run these commands:

```bash
# Allow cross-origin requests
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

# Allow required HTTP methods
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'

# Allow required headers
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization", "Content-Type"]'
```

### Step 2: Restart IPFS

1. **Close IPFS Desktop** completely (check system tray)
2. **Restart IPFS Desktop**
3. Wait for it to fully initialize (green icon in system tray)

### Step 3: Verify Configuration

Test the connection:
```bash
curl -X POST http://127.0.0.1:5001/api/v0/version
```

You should get a JSON response with IPFS version info.

## Alternative: Manual IPFS Desktop Configuration

If command line doesn't work:

1. Open **IPFS Desktop**
2. Go to **Settings** → **IPFS Config**
3. Find the `API` section and add:
```json
{
  "API": {
    "HTTPHeaders": {
      "Access-Control-Allow-Origin": ["*"],
      "Access-Control-Allow-Methods": ["PUT", "POST", "GET"],
      "Access-Control-Allow-Headers": ["Authorization", "Content-Type"]
    }
  }
}
```
4. **Save** and **restart** IPFS Desktop

## Verification Steps:

1. **Check IPFS Status:**
   - IPFS Desktop should show "Ready" or green status
   - Web UI should be accessible at: http://127.0.0.1:5001/webui

2. **Test API Access:**
   ```bash
   curl -X POST http://127.0.0.1:5001/api/v0/id
   ```

3. **Test Backend Connection:**
   ```bash
   curl -X GET http://localhost:5000/api/files/test
   ```

## Common Issues:

### Issue 1: IPFS Desktop Not Running
- **Solution**: Start IPFS Desktop and wait for initialization

### Issue 2: Port Conflicts
- **Check**: Make sure ports 5001 (API) and 8080 (Gateway) are not used by other apps
- **Solution**: Configure different ports if needed

### Issue 3: Windows Firewall
- **Solution**: Allow IPFS Desktop through Windows Firewall

### Issue 4: Antivirus Blocking
- **Solution**: Add IPFS Desktop to antivirus exclusions

## Expected Output After Fix:

When you restart your backend server, you should see:
```
🚀 Server running on port 5000
📊 Health check: http://localhost:5000/api/health
🔄 Testing IPFS connection...
🔍 Trying IPFS API at: http://127.0.0.1:5001/api/v0
✅ IPFS connection successful: { Version: "0.x.x", ... }
✅ IPFS connection successful - File uploads enabled
```

## Testing File Upload:

Once IPFS is working, test file upload:
```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-file.txt" \
  -F "ipRegistrationId=your_ip_id" \
  -F "isPublic=false"
```

## Still Having Issues?

1. **Check IPFS logs** in IPFS Desktop → Advanced → Logs
2. **Try restarting** your computer
3. **Reinstall IPFS Desktop** if configuration is corrupted
4. **Use alternative IPFS node** (like Infura IPFS) for testing

---

After following these steps, your IPFS integration should work properly! 🎉