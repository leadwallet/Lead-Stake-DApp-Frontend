import Web3 from 'web3';
import LeadStake from './contracts/LeadStake.json';

const initWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            if(window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    resolve(web3);
                } catch(error) {
                    reject(error);
                }
            } else if(window.web3) {
                resolve(window.web3);
            } else {
                reject('Must install metamask');
            }
        });
    });
};

const initLeadStake = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = await LeadStake.networks[networkId];
    return new web3.eth.Contract(LeadStake.abi, deployedNetwork && deployedNetwork.address);
};

export { initWeb3, initLeadStake };
