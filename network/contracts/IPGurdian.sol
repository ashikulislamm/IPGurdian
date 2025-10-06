// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * IPGuardianNFT (robust / validated)
 * v5-ready: no Counters, fixed imports, _isAuthorized usage
 * IPFS-enforced: all tokenURIs must start with "ipfs://"
 */
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/utils/ReentrancyGuard.sol";

contract IPGuardianNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    // Simple incremental token id (start at 1)
    uint256 private _nextTokenId = 1;

    // -------- Custom Errors --------
    error HashRequired();
    error AlreadyRegistered(bytes32 dataHash);
    error TokenDoesNotExist(uint256 tokenId);
    error NotOwnerNorApproved();
    error PriceIsZero();
    error AlreadyListed(uint256 tokenId);
    error NotListed(uint256 tokenId);
    error WrongPayment(uint256 expected, uint256 provided);
    error SellerChanged(address expected, address current);
    error CannotBuyOwnToken();
    error LicensingDisabled();
    error NotIPFSURI(); // <- new: thrown when URI isn't ipfs://

    // -------- Data --------
    struct Listing {
        bool active;
        uint256 priceWei;
        address seller;   // snapshot of owner at listing time
    }

    // content hash => tokenId (0 means not registered)
    mapping(bytes32 => uint256) public hashToTokenId;

    // tokenId => listing
    mapping(uint256 => Listing) private _listings;

    // tokenId => (licensee => hasLicense)
    mapping(uint256 => mapping(address => bool)) public hasLicense;

    // tokenId => license price (0 = disabled)
    mapping(uint256 => uint256) public licensePriceWei;

    // -------- Events --------
    event Minted(uint256 indexed tokenId, address indexed owner, bytes32 indexed dataHash, string tokenURI);
    event Listed(uint256 indexed tokenId, uint256 priceWei, address indexed seller);
    event Delisted(uint256 indexed tokenId);
    event Purchased(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 priceWei);
    event LicensePriceSet(uint256 indexed tokenId, uint256 priceWei);
    event LicensePurchased(uint256 indexed tokenId, address indexed licensee, uint256 priceWei);
    event TokenURIUpdated(uint256 indexed tokenId, string newURI);

    constructor() ERC721("IPGuardian NFT", "IPG-NFT") Ownable(msg.sender) {}

    // -------- Internal helpers & modifiers --------

    // Enforce "ipfs://" prefix (7 bytes)
    function _requireIPFS(string memory uri) internal pure {
        bytes memory b = bytes(uri);
        if (b.length < 7) revert NotIPFSURI();
        // "ipfs://"
        if (
            b[0] != 0x69 || // i
            b[1] != 0x70 || // p
            b[2] != 0x66 || // f
            b[3] != 0x73 || // s
            b[4] != 0x3a || // :
            b[5] != 0x2f || // /
            b[6] != 0x2f    // /
        ) revert NotIPFSURI();
    }

    // Convenience helper for UIs / off-chain checks
    function isIPFSURI(string memory uri) public pure returns (bool) {
        bytes memory b = bytes(uri);
        if (b.length < 7) return false;
        return (b[0]==0x69 && b[1]==0x70 && b[2]==0x66 && b[3]==0x73 && b[4]==0x3a && b[5]==0x2f && b[6]==0x2f);
    }

    function _existsToken(uint256 tokenId) internal view returns (bool) {
        // OZ v5 ERC721 exposes _ownerOf internally
        return _ownerOf(tokenId) != address(0);
    }

    modifier tokenMustExist(uint256 tokenId) {
        if (!_existsToken(tokenId)) revert TokenDoesNotExist(tokenId);
        _;
    }

    modifier onlyApprovedOrOwner(uint256 tokenId) {
        // In v5, use _isAuthorized(owner, spender, tokenId)
        address _owner = _requireOwned(tokenId); // reverts if token doesn't exist
        if (!_isAuthorized(_owner, msg.sender, tokenId)) revert NotOwnerNorApproved();
        _;
    }

    modifier mustBeListed(uint256 tokenId) {
        if (!_listings[tokenId].active) revert NotListed(tokenId);
        _;
    }

    modifier mustNotBeListed(uint256 tokenId) {
        if (_listings[tokenId].active) revert AlreadyListed(tokenId);
        _;
    }

    // -----------------
    // Minting / Register
    // -----------------
    /// @notice Register + mint a new NFT for a unique content hash
    /// @param dataHash bytes32 digest of the original content (e.g., SHA-256)
    /// @param _tokenURI MUST be an IPFS URI like "ipfs://<CID>/metadata.json"
    function registerAndMint(bytes32 dataHash, string calldata _tokenURI) external returns (uint256 tokenId) {
        if (dataHash == bytes32(0)) revert HashRequired();
        if (hashToTokenId[dataHash] != 0) revert AlreadyRegistered(dataHash);

        // Enforce ipfs:// metadata URI
        _requireIPFS(_tokenURI);

        tokenId = _nextTokenId;
        _nextTokenId = tokenId + 1;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        hashToTokenId[dataHash] = tokenId;

        emit Minted(tokenId, msg.sender, dataHash, _tokenURI);
    }

    // ---------------
    // Metadata update
    // ---------------
    /// @notice Update tokenURI; MUST remain ipfs://
    function updateTokenURI(uint256 tokenId, string calldata newURI)
        external
        tokenMustExist(tokenId)
        onlyApprovedOrOwner(tokenId)
    {
        _requireIPFS(newURI);
        _setTokenURI(tokenId, newURI);
        emit TokenURIUpdated(tokenId, newURI);
    }

    // -------------
    // Verification
    // -------------
    /// @notice Verify by content hash. Returns (exists, tokenId, owner, tokenURI)
    function verifyByHash(bytes32 dataHash)
        external
        view
        returns (bool exists, uint256 tokenId, address owner_, string memory uri_)
    {
        tokenId = hashToTokenId[dataHash];
        if (tokenId == 0) {
            return (false, 0, address(0), "");
        }
        owner_ = ownerOf(tokenId);
        uri_ = tokenURI(tokenId);
        return (true, tokenId, owner_, uri_);
    }

    // -------------
    // Marketplace
    // -------------
    function listForSale(uint256 tokenId, uint256 priceWei)
        external
        tokenMustExist(tokenId)
        onlyApprovedOrOwner(tokenId)
        mustNotBeListed(tokenId)
    {
        if (priceWei == 0) revert PriceIsZero();

        _listings[tokenId] = Listing({
            active: true,
            priceWei: priceWei,
            seller: ownerOf(tokenId)
        });
        emit Listed(tokenId, priceWei, _listings[tokenId].seller);
    }

    function delist(uint256 tokenId)
        external
        tokenMustExist(tokenId)
        onlyApprovedOrOwner(tokenId)
        mustBeListed(tokenId)
    {
        delete _listings[tokenId];
        emit Delisted(tokenId);
    }

    function buy(uint256 tokenId)
        external
        payable
        tokenMustExist(tokenId)
        mustBeListed(tokenId)
        nonReentrant
    {
        Listing memory L = _listings[tokenId];

        // Validate seller is still the current owner (prevents stale listing exploit)
        address currentOwner = ownerOf(tokenId);
        if (L.seller != currentOwner) revert SellerChanged(L.seller, currentOwner);

        if (msg.sender == currentOwner) revert CannotBuyOwnToken();
        if (msg.value != L.priceWei) revert WrongPayment(L.priceWei, msg.value);

        // Effects
        delete _listings[tokenId];  // ensure atomic delist before transfer/payment

        // Transfer NFT
        _transfer(currentOwner, msg.sender, tokenId);

        // Payout
        (bool ok, ) = payable(currentOwner).call{value: msg.value}("");
        require(ok, "ETH payout failed");

        emit Purchased(tokenId, currentOwner, msg.sender, msg.value);
    }

    // -----------
    // Licensing
    // -----------
    function setLicensePrice(uint256 tokenId, uint256 priceWei)
        external
        tokenMustExist(tokenId)
        onlyApprovedOrOwner(tokenId)
    {
        // allow 0 => disables licensing
        licensePriceWei[tokenId] = priceWei;
        emit LicensePriceSet(tokenId, priceWei);
    }

    function purchaseLicense(uint256 tokenId)
        external
        payable
        tokenMustExist(tokenId)
        nonReentrant
    {
        uint256 p = licensePriceWei[tokenId];
        if (p == 0) revert LicensingDisabled();
        if (msg.value != p) revert WrongPayment(p, msg.value);

        address owner_ = ownerOf(tokenId);
        if (msg.sender == owner_) revert CannotBuyOwnToken(); // owner already has full rights

        hasLicense[tokenId][msg.sender] = true;

        (bool ok, ) = payable(owner_).call{value: msg.value}("");
        require(ok, "ETH payout failed");

        emit LicensePurchased(tokenId, msg.sender, msg.value);
    }

    // ----------------
    // View convenience
    // ----------------
    /// @notice Returns (active, priceWei, seller) or (false,0,address(0)) if not listed
    function getListing(uint256 tokenId)
        external
        view
        tokenMustExist(tokenId)
        returns (bool, uint256, address)
    {
        Listing memory L = _listings[tokenId];
        return (L.active, L.priceWei, L.seller);
    }

    function isListed(uint256 tokenId)
        external
        view
        tokenMustExist(tokenId)
        returns (bool)
    {
        return _listings[tokenId].active;
    }

    function getLicensePrice(uint256 tokenId)
        external
        view
        tokenMustExist(tokenId)
        returns (uint256)
    {
        return licensePriceWei[tokenId];
    }

    function hasLicenseOf(uint256 tokenId, address user)
        external
        view
        tokenMustExist(tokenId)
        returns (bool)
    {
        return hasLicense[tokenId][user];
    }
}