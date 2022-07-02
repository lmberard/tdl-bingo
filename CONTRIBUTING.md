# Instalation 

1. Clone the repository 

2. Install [metamask chrome extension](https://metamask.io/)

    In order to use the metamask chrome extension, you will need to add fake accounts for testing
    1. Open Ganache and open a Quickstart Workspace
    2. Copy the private key for any of the wallet addresses
    3. Import it in the Metamask extension as a new account
    4. Add a new network with the port that Ganache uses in the account you copied.
    
3. Install dependencies and lite-server
    ```bash
    npm install
    ```  
    ```bash
    npm install lite-server
    ```  

In case something fails, check that you are using the same port in the `truffle-config.js`, `bs-config.json` and Ganache. 

# Compile and Deploy 
1. Compile the contracts 
   ```bash
    truffle compile
    ```  
2. Deploy the contract
   ```bash
    truffle migrate
    ```  
3. Run the server 
   ```bash
   npm lite-server
   ```

**For each change in any of the solidity files you will need to compile and build again. **