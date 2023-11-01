// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract DynamicSwap {
    event PoolCreated(uint256 indexed poolId, address indexed token1, address indexed token2);

    struct Pool {
        IERC20 token1;
        IERC20 token2;
        uint256 token1Liquidity;
        uint256 token2Liquidity;
    }
    

    mapping(uint256 => Pool) public pools;
    uint256 public nextPoolId;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createPool(address _token1, address _token2) external onlyOwner {
        pools[nextPoolId] = Pool({
            token1: IERC20(_token1),
            token2: IERC20(_token2),
            token1Liquidity: 0,
            token2Liquidity: 0
        });
        emit PoolCreated(nextPoolId, _token1, _token2); // Emit the event
        nextPoolId++;
    }

    function addLiquidity(uint256 poolId, uint256 amountToken1, uint256 amountToken2) external {
        Pool storage pool = pools[poolId];
        require(pool.token1.transferFrom(msg.sender, address(this), amountToken1), "Transfer of token1 failed");
        require(pool.token2.transferFrom(msg.sender, address(this), amountToken2), "Transfer of token2 failed");
        
        pool.token1Liquidity += amountToken1;
        pool.token2Liquidity += amountToken2;
    }

    function removeLiquidity(uint256 poolId, uint256 amountToken1, uint256 amountToken2) external onlyOwner {
        Pool storage pool = pools[poolId];
        require(pool.token1Liquidity >= amountToken1 && pool.token2Liquidity >= amountToken2, "Insufficient liquidity");
        
        require(pool.token1.transfer(msg.sender, amountToken1), "Transfer of token1 failed");
        require(pool.token2.transfer(msg.sender, amountToken2), "Transfer of token2 failed");
        
        pool.token1Liquidity -= amountToken1;
        pool.token2Liquidity -= amountToken2;
    }

    function swap(uint256 poolId, address tokenIn, uint256 amountIn) external {
        Pool storage pool = pools[poolId];
        require(tokenIn == address(pool.token1) || tokenIn == address(pool.token2), "Invalid token");
        
        bool isToken1 = tokenIn == address(pool.token1);
        IERC20 tokenOut = isToken1 ? pool.token2 : pool.token1;
        
        uint256 tokenOutLiquidity = isToken1 ? pool.token2Liquidity : pool.token1Liquidity;
        require(tokenOutLiquidity > 0, "Insufficient liquidity");
        
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Simple swap calculation (could be improved with an actual pricing algorithm)
        uint256 amountOut = (amountIn * tokenOutLiquidity) / (amountIn + tokenOutLiquidity);
        
        require(tokenOut.transfer(msg.sender, amountOut), "Transfer of tokenOut failed");
        
        if (isToken1) {
            pool.token1Liquidity += amountIn;
            pool.token2Liquidity -= amountOut;
        } else {
            pool.token1Liquidity -= amountOut;
            pool.token2Liquidity += amountIn;
        }
    }
}
