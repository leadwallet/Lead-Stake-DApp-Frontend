import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import { initWeb3 } from "../utils.js";
import LeadStake from "../contracts/LeadStake.json";
import ERC20 from "../contracts/ERC20.json";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
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
  const [weeklyROI, setWeeklyROI] = useState();
  const [stakingRewards, setStakeRewards] = useState();
  const [minRegister, setMinRegister] = useState();
  const [totalRewards, setTotalRewards] = useState();
  const [registeredStatus, setRegisteredStaus] = useState();

  const [amount, setAmount] = useState();
  const [unstakeAmount, setUnstakeAmount] = useState();
  const [referrer, setReferrer] = useState();

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
    if (networkId !== 3) {
      setError("Please connect Ropsten Test Network account");
      setLoading(false);
      return;
    }

    const leadToken = new web3.eth.Contract(
      ERC20.abi,
      "0x9703e8b35f13f2835c4a0f60fe9f9993e3a45e30"
    ); //ropsten testnet address
    const totalSupply = await leadToken.methods.totalSupply().call();
    const balance = await leadToken.methods.balanceOf(accounts[0]).call();

    const leadStake = new web3.eth.Contract(
      LeadStake.abi,
      "0xFE9aFe28F5347C979e07686B2A42Afed8D4C8675"
    ); //ropsten testnet adddress
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
    const weeklyROI = await leadStake.methods.weeklyROI().call();
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
    setWeeklyROI(weeklyROI);
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
          window.ethereum.networkVersion === "3"
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
      updateTotalStakeholders(),
      stakeRewards(),
      minRegisteration(),
      totalReward(),
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

  async function updateTotalStakeholders() {
    if (leadStake) {
      const stakeholders = await leadStake.methods.stakeholders().call();
      return stakeholders.length;
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
      const sum = tax + value;
      await setMinRegister(sum);
      return sum;
    }
  }

  async function stakeRewards() {
    if (leadStake) {
      const rewards = parseInt(
        await leadStake.methods.stakeRewards(accounts[0]).call()
      );
      const weekly = parseInt(
        await leadStake.methods.calculateEarnings(accounts[0]).call()
      );
      const sum = rewards + weekly;
      await setStakeRewards(sum);
      return sum;
    }
  }

  async function totalReward() {
    const weekly = parseInt(
      await leadStake.methods.calculateEarnings(accounts[0]).call()
    );
    const stake = parseInt(
      await leadStake.methods.stakeRewards(accounts[0]).call()
    );
    const referral = parseInt(
      await leadStake.methods.referralRewards(accounts[0]).call()
    );
    const sum = stake + referral + weekly;
    await setTotalRewards(sum);
    return sum;
  }

  async function registerAndStake() {
    setStakeLoading(true);
    try {
      let ref = referrer;
      await leadToken.methods
        .approve("0xFE9aFe28F5347C979e07686B2A42Afed8D4C8675", amount)
        .send({ from: accounts[0] });
      if (!ref || ref.length !== 42)
        ref = "0x0000000000000000000000000000000000000000";
      await leadStake.methods
        .registerAndStake(amount, ref)
        .send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      console.error(err);
    }
    setStakeLoading(false);
  }

  async function stake() {
    setStakeLoading(true);
    try {
      await leadToken.methods
        .approve("0xFE9aFe28F5347C979e07686B2A42Afed8D4C8675", amount)
        .send({ from: accounts[0] });
      await leadStake.methods.stake(amount).send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      console.error(err);
    }
    setStakeLoading(false);
  }

  async function unstake() {
    setUnstakeLoading(true);
    // TODO compare current value and unstaked value
    try {
      await leadStake.methods
        .unstake(unstakeAmount)
        .send({ from: accounts[0] });
      await updateAll();
    } catch (err) {
      console.error(err);
    }
    setUnstakeLoading(false);
  }

  async function withdrawEarnings() {
    await leadStake.methods.withdrawEarnings().send({ from: accounts[0] });
    await updateAll();
  }

  return (
    <div className="w-full overflow-hidden">
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

        <div className="container mx-auto pb-24 px-4 force-height">
          {!accounts && (
            <div className="w-full py-6 text-center">
              <Button
                className="w-full md:w-2/5 text-2xl flex flex-row justify-center mx-auto"
                uppercase={false}
                onClick={async () => await init()}
              >
                {loading && <Spinner color="white" size={40} />}
                {!loading && (error !== "" ? error : "CONNECT YOUR WALLET")}
              </Button>
            </div>
          )}
          {accounts && (
            <div className="grid grid-col-1 md:grid-cols-2 gap-6 mt-10">
              <Card title="Total Staked LEAD">
                <div className="flex flex-col pt-8 pb-4 text-white">
                  <div className="text-center">
                    <span className="text-white text-5xl">
                      {parseFloat(totalStaked).toFixed(2)}
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
                            {registrationTax} LEAD
                          </span>
                        </li>
                        <li>
                          Staking Fee:{"  "}
                          <span className="text-white text-2xl">
                            {stakingTax} %
                          </span>
                        </li>
                        <li>
                          Unstaking Fee:{"  "}
                          <span className="text-white text-2xl">
                            {unstakingTax} %
                          </span>
                        </li>
                        <li>
                          Minimum Stake:{"  "}
                          <span className="text-white text-2xl">
                            {minStake} LEAD
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
                      <span className="text-white text-3xl">{minRegister}</span>
                      <span className="text-white text-2xl ml-2">LEAD</span>
                    </div>
                    <div className="text-center pb-4">
                      <span className="text-lg text-gray-400">
                        Available amount:{" "}
                      </span>
                      <span className="text-white text-3xl">{balance}</span>
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
                      <span className="text-white text-3xl">{minStake}</span>
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
                      {parseFloat(totalRewards).toFixed(2)}
                    </span>
                    <span className="text-white text-2xl ml-2">LEAD</span>
                  </div>
                  <div className="flex flex-row justify-center">
                    <Button
                      type="submit"
                      className="flex flex-row items-center w-32"
                      onClick={() => withdrawEarnings()}
                    >
                      <img src="/images/unlocked.svg" width="25" alt="" />
                      <span className="w-24">CLAIM</span>
                    </Button>
                  </div>
                  <div className="text-center text-white text-2xl mt-8 mx-2">
                    <div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Staking Reward:{" "}
                        </span>
                        {stakingRewards} LEAD
                      </div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Weekly Return:{" "}
                        </span>
                        {weeklyROI} %
                      </div>
                    </div>
                    <div>
                      <div>
                        <span className="text-gray-400 text-lg">
                          Referral Reward:
                        </span>{" "}
                        {referralRewards} LEAD
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

              <Card title="Available to Unstake">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-8">
                    <span className="text-white text-3xl">{stakes}</span>
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
