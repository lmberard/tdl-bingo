# Instalation

1. Clone the repository

2. Inside the root folder, install dependencies

   ```bash
   npm install
   ```

3. Install [Ganache](https://trufflesuite.com/ganache/)
   ![image](https://user-images.githubusercontent.com/50753891/179372138-7bab2951-141b-4dac-ae29-fac2d23e5e0e.png)

4. Install [metamask chrome extension](https://metamask.io/)

   In order to use the metamask chrome extension, you will need to add fake accounts for testing

   1. Open Ganache and open a Quickstart Workspace
   2. Copy the private key for any of the wallet addresses
   3. Import it in the Metamask extension as a new account
   4. Add a new network with the port that Ganache uses in the account you copied.
   
   ![image](https://user-images.githubusercontent.com/50753891/179372115-9a7db972-3d90-4098-a77f-055bc5fe7f90.png)

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

   In case something fails, try:

   ```bash
    npx truffle compile
    npx truffle migrate
   ```

3. Run the server
   ```bash
   npx lite-server
   ```

**For each change in any of the solidity files you will need to compile and build again. **
