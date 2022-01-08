
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import { initWeb3 } from "../utils.js";
import LeadStake from "../contracts/LeadStake.json";
import ERC20 from "../contracts/ERC20.json";
import fromExponential from "from-exponential";
import {Link} from "react-router-dom";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [error, setError] = useState("");
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [leadStake, setLeadStake] = useState();
  const [leadToken, setLeadToken] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [balance, setBalance] = useState();
  const [totalStaked, setTotalStaked] = useState();
  const [stakes, setStakes] = useState();
  const [minStake, setMinStake] = useState();
  const [stakingTax, setStakingTax] = useState();
  const [unstakingTax, setUnstakingTax] = useState();
  const [registrationTax, setRegistrationTax] = useState();
  const [referralRewards, setReferralRewards] = useState();
  const [referralCount, setReferralCount] = useState();
  const [dailyROI, setDailyROI] = useState();
  const [stakingRewards, setStakeRewards] = useState();
  const [minRegister, setMinRegister] = useState();
  const [totalRewards, setTotalRewards] = useState();
  const [registeredStatus, setRegisteredStaus] = useState();
  const [amount, setAmount] = useState();
  const [unstakeAmount, setUnstakeAmount] = useState();
  const [referrer, setReferrer] = useState();
  const [showModal, setShowModal] = useState(false);

  const init = async () => {
    if (isReady()) {
      return;
    }

    setLoading(true);
    let web3;
    try {
      web3 = await initWeb3();
    } catch (err) {
      console.error(err);
      setLoading(false);
      return;
    }

    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    console.log(networkId);

    if (networkId !== 56) {
      setError("Please connect BSC Mainnet");
      setLoading(false);
      return;
    }
    const leadToken = new web3.eth.Contract(
      ERC20.abi,
      "0x2ed9e96edd11a1ff5163599a66fb6f1c77fa9c66"
    ); //mainnet address for lead token
    const totalSupply = await leadToken.methods.totalSupply().call();
    const balance = await leadToken.methods.balanceOf(accounts[0]).call();

    const leadStake = new web3.eth.Contract(
      LeadStake.abi,
      "0x86ffdd2431b78685eb32df30cdf03ec627eafcdb"
    ); //mainnet address for staking dapp
    const totalStaked = await leadStake.methods.totalStaked().call();
    const minStake = await leadStake.methods.minimumStakeValue().call();
    const stakingTax = await leadStake.methods.stakingTaxRate().call();
    const unstakingTax = await leadStake.methods.unstakingTaxRate().call();
    const registrationTax = await leadStake.methods.registrationTax().call();
    const referralRewards = await leadStake.methods
      .referralRewards(accounts[0])
      .call();
    const referralCount = await leadStake.methods
      .referralCount(accounts[0])
      .call();
    const dailyROI = await leadStake.methods.dailyROI().call();
    const status = await leadStake.methods.registered(accounts[0]).call();

    setWeb3(web3);
    setAccounts(accounts);
    setLeadStake(leadStake);
    setLeadToken(leadToken);
    setTotalSupply(totalSupply);
    setBalance(balance);
    setTotalStaked(totalStaked);
    setMinStake(minStake);
    setStakingTax(stakingTax);
    setUnstakingTax(unstakingTax);
    setRegistrationTax(registrationTax);
    setReferralRewards(referralRewards);
    setReferralCount(referralCount);
    setDailyROI(dailyROI);
    setRegisteredStaus(status);

    window.ethereum.on("accountsChanged", (accounts) => {
      setAccounts(accounts);
    });

    setLoading(false);
  };

  const isReady = () => {
    return !!leadStake && !!web3 && !!accounts;
  };

  useEffect(() => {
    const triggerAlreadyInjectedWeb3 = async () => {
      if (window.ethereum) {
        if (
          window.ethereum.selectedAddress &&
          window.ethereum.networkVersion === "56"
        ) {
          await init();
        }
      }
    };
    triggerAlreadyInjectedWeb3();
  }, []);

 

  async function updateAll() {
    await Promise.all([
      updateStakes(),
      updateTotalSupply(),
      updateAccountBalance(),
      updateTotalStaked(),
      stakeRewards(),
      minRegisteration(),
      totalReward(),
      updateReferrals(),
      updateStatus()
    ]);
  }

  useEffect(() => {
    if (isReady()) {
      updateAll();
    }
  }, [leadStake, leadToken, web3, accounts]);

  async function updateStakes() {
    const stake = await leadStake.methods.stakes(accounts[0]).call();
    setStakes(stake);
    return stake;
  }

  async function updateReferrals() {
    if (leadToken) {
      const referralRewards = await leadStake.methods
        .referralRewards(accounts[0])
        .call();
      const referralCount = await leadStake.methods
        .referralCount(accounts[0])
        .call();
      setReferralRewards(referralRewards);
      setReferralCount(referralCount);
    }
  }

  async function updateAccountBalance() {
    if (leadToken) {
      const balance = await leadToken.methods.balanceOf(accounts[0]).call();
      setBalance(balance);
      return balance;
    }
  }

  async function updateTotalSupply() {
    if (leadToken) {
      const totalSupply = await leadToken.methods.totalSupply().call();
      setTotalSupply(totalSupply);
      return totalSupply;
    }
  }

  async function updateTotalStaked() {
    if (leadStake) {
      const totalStaked = await leadStake.methods.totalStaked().call();
      return totalStaked;
    }
  }

  async function minRegisteration() {
    if (leadStake) {
      const tax = parseInt(await leadStake.methods.registrationTax().call());
      const value = parseInt(
        await leadStake.methods.minimumStakeValue().call()
      );
      const sum =
        parseInt(tax / 1000000000000000000) +
        parseInt(value / 1000000000000000000);
      await setMinRegister(sum);
      return sum;
    }
  }

  async function stakeRewards() {
    if (leadStake) {
      const rewards = parseInt(
        await leadStake.methods.stakeRewards(accounts[0]).call()
      );
      const owing = parseInt(
        await leadStake.methods.calculateEarnings(accounts[0]).call()
      );
      const sum = rewards + owing;
      await setStakeRewards(sum);
      return sum;
    }
  }

  async function totalReward() {
    const owing = parseInt(
      await leadStake.methods.calculateEarnings(accounts[0]).call()
    );
    const recorded = parseInt(
      await leadStake.methods.stakeRewards(accounts[0]).call()
    );
    const referral = parseInt(
      await leadStake.methods.referralRewards(accounts[0]).call()
    );
    const sum = owing + referral + recorded;
    await setTotalRewards(sum);
    return sum;
  }

  async function updateStatus() {
    if (leadToken) {
      const status = await leadStake.methods.registered(accounts[0]).call();
      setRegisteredStaus(status);
    }
  }

  async function registerAndStake() {
    setStakeLoading(true);
    const actual = amount * 10 ** 18;
    const arg = fromExponential(actual);
    try {
      let ref = referrer;
      await leadToken.methods
        .approve("0x86ffdd2431b78685eb32df30cdf03ec627eafcdb", arg)
        .send({ from: accounts[0] });
      if (!ref || ref.length !== 42)
        ref = "0x0000000000000000000000000000000000000000";
      await leadStake.methods
        .registerAndStake(arg, ref)
        .send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      if (err.code !== 4001) {
        setShowModal(true);
      }
      console.error(err);
    }
    setStakeLoading(false);
  }

  async function stake() {
    setStakeLoading(true);
    const actual = amount * 10 ** 18;
    const arg = fromExponential(actual);
    try {
      await leadToken.methods
        .approve("0x86ffdd2431b78685eb32df30cdf03ec627eafcdb", arg)
        .send({ from: accounts[0] });

      await leadStake.methods.stake(arg).send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      if (err.code !== 4001) {
        setShowModal(true);
      }
      console.error(err);
    }
    setStakeLoading(false);
  }

  async function unstake() {
    if (parseFloat(stakes) === 0) {
      console.error("You don't have any staked LEADs yet!");
      return;
    }
    setUnstakeLoading(true);
    const actual = unstakeAmount * 10 ** 18;
    const arg = fromExponential(actual);
    try {
      await leadStake.methods.unstake(arg).send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      if (err.code !== 4001) {
        setShowModal(true);
      }
      console.error(err);
    }
    setUnstakeLoading(false);
  }

  async function withdrawEarnings() {
    if (parseFloat(totalRewards) === 0) {
      console.error("No earnings yet!");
      return;
    }
    setWithdrawLoading(true);
    try {
      await leadStake.methods.withdrawEarnings().send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      if (err.code !== 4001) {
        setShowModal(true);
      }
      console.error(err);
    }
    setWithdrawLoading(false);
  }

  return (
    <div className="w-full overflow-hidden">
      {showModal && (
        <Modal title="" onClose={() => setShowModal(false)}>
          <div className="text-2xl mb-2">
            Error! Your transaction has been reverted!
          </div>
          <div>1. Please check your account and retry again...</div>
          <div>2. Your referrer's address is a registered member if any</div>

          <div className="my-2">
            Thanks for your support and feel free to{" "}
            <a href="https://www.leadwallet.io/contact" className="text-blue-500">
              contact us
            </a>
          </div>

          <div className="flex flex-row justify-center">
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </Modal>
      )}
      <div className="relative z-20 w-full top-0">
        <img
          src="/images/nosiy.png"
          alt=""
          className="absolute z-10 top-noisy"
        />
        <img
          src="/images/nosiy.png"
          alt=""
          className="absolute z-10 second-noisy"
        />
      </div>

      <div className="relative z-10 w-full top-0">
        <div className="absolute w-full home-gradient"></div>
      </div>

      <div className="relative w-full z-30">
        <Header />

        <div className="container mx-auto pb-18 px-4 force-height">
          {!accounts && (
            <div className="w-full py-6 text-center">
                 <div id='controls'>
        <Link id='toggler' to='/' >Switch To Ethereum Chain</  Link>

    </div>
              <Button
                className="w-full md:w-2/5 text-2xl flex flex-row justify-center mx-auto"
                uppercase={false}
                onClick={async () => await init()}
              >
                {loading && <Spinner color="white" size={40} />}
                {!loading && (error !== "" ? error : "CONNECT METAMASK WALLET")}
              </Button>

              <div className="text-white text-center mt-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
                <h1>Stake Your LEAD Token</h1>
              </div>
              <div className="w-full md:w-3/6 justify-center mx-auto mt-6">
                <Card title="Rules">
                  <div className="flex flex-col pt-8 pb-4 text-white text-center">
                    <ul>
                      <li>1. Connect your MetaMask wallet to participate</li>
                      <li>
                        2. Stake LEAD tokens and earn daily returns from
                        allocated pool
                      </li>
                      <li>3. Withdraw earned rewards anytime</li>
                      <li>4. Unstake LEAD tokens anytime</li>
                      <li>5. Earn extra rewards by referring new members</li>
                    </ul>
                  </div>
                </Card>
                <div className="flex flex-col pt-8 px-2">
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
                <Card noLine>
                  <div className="flex flex-col px-2">
                    <div className="text-center pb-4">
                      <div className="text-white text-xs">
                        <span className="text-blue-500">Disclaimer</span>{" "}
                        Staking Smart Contract was audited by{" "}
                        <a
                          href="https://immunebytes.com/"
                          target="_blank"
                          className="text-blue-500"
                        >
                          Immune Bytes
                        </a>
                        . Keep in mind that security audits don't fully
                        eliminate all possible security risks. Use our staking
                        page at your own risk. <br />
                        <span className="text-blue-500">Note</span> The Stake
                        Rewards can be reduced without prior warning, stakers
                        are advised to claim their rewards daily.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          {accounts && (
            <div className="grid grid-col-1 md:grid-cols-2 gap-6 mt-10">
              <Card title="Total Staked LEAD">
                <div className="flex flex-col pt-8 pb-4 text-white">
                  <div className="text-center">
                    <span className="text-white text-5xl">
                      {(
                        parseFloat(totalStaked).toFixed(2) / 1000000000000000000
                      ).toFixed(2)}
                    </span>
                    <span className="text-white text-2xl ml-2">LEAD</span>
                  </div>
                  <div className="text-center">
                    {(
                      (parseFloat(totalStaked) * 100.0) /
                      parseFloat(totalSupply)
                    ).toFixed(5)}
                    %
                  </div>
                  <div className="text-center">of total supply</div>
                </div>
              </Card>
              <Card title="Fees">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-8">
                    <div className="text-gray-400 text-lg font-thin">
                      <ul>
                        <li>
                          Registration Fee:{"  "}
                          <span className="text-white text-2xl">
                            {parseInt(registrationTax) / 1000000000000000000}{" "}
                            LEAD
                          </span>
                        </li>
                        <li>
                          Staking Fee:{"  "}
                          <span className="text-white text-2xl">
                            {parseFloat(stakingTax) / 10} %
                          </span>
                        </li>
                        <li>
                          Unstaking Fee:{"  "}
                          <span className="text-white text-2xl">
                            {parseFloat(unstakingTax) / 10} %
                          </span>
                        </li>
                        <li>
                          Minimum Stake:{"  "}
                          <span className="text-white text-2xl">
                            {parseInt(minStake) / 1000000000000000000} LEAD
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
              {!registeredStatus ? (
                <Card title="Staking">
                  <div className="flex flex-col pt-8 px-2">
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Minimum amount needed:{" "}
                      </span>
                      <span className="text-white text-3xl">
                        {parseInt(minRegister)}
                      </span>
                      <span className="text-white text-2xl ml-2">LEAD</span>
                    </div>
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Available amount:{" "}
                      </span>
                      <span className="text-white text-3xl">
                        {parseInt(parseInt(balance) / 1000000000000000000)}
                      </span>
                      <span className="text-white text-2xl ml-2">LEAD</span>
                    </div>
                    <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                      <input
                        type="number"
                        placeholder="LEAD To Stake"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-white font-extrabold flex-shrink text-2xl w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                      />
                      <Button
                        onClick={() => registerAndStake()}
                        className="flex flex-row items-center w-48 justify-center"
                      >
                        {stakeLoading ? (
                          <Spinner size={30} />
                        ) : (
                          <>
                            <img src="/images/locked.svg" width="25" alt="" />
                            <span className="w-16">STAKE</span>{" "}
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-white text-center mt-4">
                      Has referrer's address?
                    </div>
                    <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                      <input
                        placeholder="Referrer Address"
                        value={referrer}
                        onChange={(e) => setReferrer(e.target.value)}
                        className="text-white font-extrabold flex-shrink text-2xl w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                      />
                    </div>
                  </div>
                </Card>
              ) : (
                <Card title="Staking">
                  <div className="flex flex-col pt-8 px-2">
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Minimum amount needed:{" "}
                      </span>
                      <span className="text-white text-3xl">
                        {parseInt(minStake) / 1000000000000000000}
                      </span>
                      <span className="text-white text-2xl ml-2">LEAD</span>
                    </div>
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Available amount:{" "}
                      </span>
                      <span className="text-white text-3xl">
                        {parseInt(parseInt(balance) / 1000000000000000000)}
                      </span>
                      <span className="text-white text-2xl ml-2">LEAD</span>
                    </div>
                    <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                      <input
                        type="number"
                        placeholder="LEAD To Stake"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-white font-extrabold flex-shrink text-2xl w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                      />
                      <Button
                        onClick={() => stake()}
                        className="flex flex-row items-center w-48 justify-center"
                      >
                        {stakeLoading ? (
                          <Spinner size={30} />
                        ) : (
                          <>
                            <img src="/images/locked.svg" width="25" alt="" />
                            <span className="w-16">STAKE</span>{" "}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              <Card title="Your Earnings">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-8">
                    <span className="text-white text-5xl">
                      {(parseFloat(totalRewards) / 1000000000000000000).toFixed(
                        2
                      )}
                    </span>
                    <span className="text-white text-2xl ml-2">LEAD</span>
                  </div>
                  <div className="flex flex-row justify-center">
                    <Button
                      type="submit"
                      className="flex flex-row items-center justify-center w-32"
                      onClick={() => withdrawEarnings()}
                    >
                      {withdrawLoading ? (
                        <Spinner size={30} />
                      ) : (
                        <>
                          <img src="/images/unlocked.svg" width="25" alt="" />
                          <span className="w-24">CLAIM</span>{" "}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-white text-2xl mt-8 mx-2">
                    <div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Staking Reward:{" "}
                        </span>
                        {parseFloat(stakingRewards) / 1000000000000000000} LEAD
                      </div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Daily Return:{" "}
                        </span>
                        {parseFloat(dailyROI) / 100} %
                      </div>
                    </div>
                    <div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Referral Reward:
                        </span>{" "}
                        {parseFloat(referralRewards) / 1000000000000000000} LEAD
                      </div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Referral Count:
                        </span>{" "}
                        {referralCount}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Unstaking">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-4">
                    <span className="text-lg text-gray-400">
                      Available to unstake:{" "}
                    </span>
                    <span className="text-white text-3xl">
                      {(parseFloat(stakes) / 1000000000000000000).toFixed()}
                    </span>
                    <span className="text-white text-2xl ml-2">LEAD</span>
                  </div>
                  <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                    <input
                      type="number"
                      placeholder="LEAD To Unstake"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="text-white font-extrabold flex-shrink text-2xl w-full bg-transparent focus:outline-none focus:bg-white focus:text-black px-2"
                    />
                    <Button
                      onClick={() => unstake()}
                      className="flex flex-row items-center w-48 justify-center"
                    >
                      {unstakeLoading ? (
                        <Spinner size={30} />
                      ) : (
                        <>
                          <img src="/images/unlocked.svg" width="25" alt="" />
                          <span className="w-24">UNSTAKE</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;

