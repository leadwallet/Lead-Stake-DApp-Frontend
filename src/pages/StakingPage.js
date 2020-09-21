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
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [leadStake, setLeadStake] = useState();
  const [leadToken, setLeadToken] = useState();
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

  const init = async () => {
    setLoading(true);
    let web3;
    try {
      web3 = await initWeb3();
    } catch (err) {
      console.error(err);
      setLoading(false);
      return;
    }

    console.log(web3);

    const accounts = await web3.eth.getAccounts();

    console.log(accounts[0]);
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    const deployedNetwork = LeadStake.networks[networkId];
    const leadStake = new web3.eth.Contract(
      LeadStake.abi,
      "0xFE9aFe28F5347C979e07686B2A42Afed8D4C8675"
    ); //ropsten testnet adddress
    const leadToken = new web3.eth.Contract(
      ERC20.abi,
      "0x9703e8b35f13f2835c4a0f60fe9f9993e3a45e30"
    ); //ropsten testnet address
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
    if (isReady()) {
      updateStakes();
      updateTotalStaked();
      stakeRewards();
      minRegisteration();
      totalReward();
    }
  }, [leadStake, web3, accounts]);

  async function updateStakes() {
    const stake = await leadStake.methods.stakes(accounts[0]).call();
    setStakes(stake);
    return stake;
  }

  async function updateTotalStakeholders() {
    const stakeholders = await leadStake.methods.stakeholders().call();
    return stakeholders.length;
  }

  async function updateTotalStaked() {
    const totalStaked = await leadStake.methods.totalStaked().call();
    return totalStaked;
  }

  async function minRegisteration() {
    const tax = parseInt(await leadStake.methods.registrationTax().call());
    const value = parseInt(await leadStake.methods.minimumStakeValue().call());
    const sum = tax + value;
    await setMinRegister(sum);
    return sum;
  }

  async function stakeRewards() {
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

  async function registerAndStake(e) {
    e.preventDefault();
    const amount = e.target.element[0].value;
    let referrer = e.target.element[1].value;
    await leadToken.methods
      .approve("0xFE9aFe28F5347C979e07686B2A42Afed8D4C8675", amount)
      .send({ from: accounts[0] });
    if (!referrer || referrer.length !== 42)
      referrer = "0x0000000000000000000000000000000000000000";
    await leadStake.methods
      .registerAndStake(amount, referrer)
      .send({ from: accounts[0] });
    await updateStakes();
    await updateTotalStaked();
    await updateTotalStakeholders();
  }

  async function stake(e) {
    e.preventDefault();
    const amount = e.target.element[0].value;
    await leadToken.methods
      .approve("0xFE9aFe28F5347C979e07686B2A42Afed8D4C8675", amount)
      .send({ from: accounts[0] });
    await leadStake.methods.stake(amount).send({ from: accounts[0] });
    await updateStakes();
    await updateTotalStaked();
  }

  async function unstake(e) {
    e.preventDefault();
    const amount = e.target.element[0].value;
    await leadStake.methods.unstake(amount).send({ from: accounts[0] });
    updateStakes();
  }

  async function withdrawEarnings(e) {
    e.preventDefault();
    await leadStake.methods.withdrawEarnings().send({ from: accounts[0] });
    await stakeRewards();
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

        <div className="container mx-auto mb-48 px-4">
          <div className="w-full py-6 text-center">
            <Button
              className="w-full md:w-3/5 text-2xl flex flex-row justify-center mx-auto"
              onClick={async () => await init()}
            >
              {loading && <Spinner color="white" size={40} />}
              {!loading && (!accounts ? "Connect Your Wallet" : accounts[0])}
            </Button>
          </div>
          <div className="grid grid-col-1 md:grid-cols-2 gap-6 mt-10">
            <Card title="Stats">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-left pb-8">
                  <div className="text-white text-lg font-thin ml-3">
                    <ul>
                      <li>Stake Reward: {stakingRewards} LEAD</li>
                      <li>Referral Reward: {referralRewards} LEAD</li>
                      <li>Referral Count: {referralCount} Stakeholders</li>
                      <li>Weekly Return: {weeklyROI} %</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Fees">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-left pb-8">
                  <div className="text-white text-lg font-thin ml-3">
                    <ul>
                      <li>Registration Fee: {registrationTax} LEAD</li>
                      <li>Staking Fee: {stakingTax} %</li>
                      <li>Unstaking Fee: {unstakingTax} %</li>
                      <li>Minimum Stake: {minStake} LEAD</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {!registeredStatus ? (
              <Card title="Minimum Stake">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-8">
                    <span className="text-white text-3xl">{minRegister}</span>
                    <span className="text-white text-2xl ml-2">LEAD</span>
                  </div>
                  <form onSubmit={(e) => registerAndStake(e)}>
                    <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                      <br />
                      <div className="form-group text-white text-lg font-thin ml-1">
                        <label htmlFor="amount">Amount</label>
                        <input
                          type="number"
                          className="form-control text-black"
                        />
                      </div>
                      <br />
                      <div className="form-group text-white text-lg font-thin ml-1">
                        <label htmlFor="referrer">Referrer Address</label>
                        <input type="text" className="form-control" />
                      </div>
                      <Button
                        type="submit"
                        className="flex flex-row items-center"
                      >
                        <img src="/images/locked.svg" width="25" alt="" />
                        <span className="w-16">STAKE</span>
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            ) : (
              <Card title="Minimum Stake">
                <div className="flex flex-col pt-8 px-2">
                  <div className="text-center pb-8">
                    <span className="text-white text-3xl">{minStake}</span>
                    <span className="text-white text-2xl ml-2">LEAD</span>
                  </div>
                  <form onSubmit={(e) => stake(e)}>
                    <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                      <br />
                      <div className="form-group text-white text-lg font-thin ml-1">
                        <label htmlFor="amount">Amount </label>
                        <input
                          type="number"
                          className="form-control text-black"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="flex flex-row items-center"
                      >
                        <img src="/images/locked.svg" width="25" alt="" />
                        <span className="w-24">STAKE</span>
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            )}

            <Card title="Your Earnings">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-center pb-8">
                  <span className="text-white text-3xl">{totalRewards}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
                <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                  <div className="text-white text-lg font-thin ml-3">
                    Withdraw Earnings
                  </div>
                  <Button
                    type="submit"
                    className="flex flex-row items-center"
                    onClick={withdrawEarnings}
                  >
                    <img src="/images/unlocked.svg" width="25" alt="" />
                    <span className="w-24">WITHDRAW</span>
                  </Button>
                </div>
              </div>
            </Card>

            <Card title="Available to Unstake">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-center pb-8">
                  <span className="text-white text-3xl">{stakes}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
                <form onSubmit={(e) => unstake(e)}>
                  <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                    <br />
                    <div className="form-group text-white text-lg font-thin ml-1">
                      <label htmlFor="amount">Amount </label>
                      <input
                        type="number"
                        className="form-control text-black"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="flex flex-row items-center"
                    >
                      <img src="/images/unlocked.svg" width="25" alt="" />
                      <span className="w-24">UNSTAKE</span>
                    </Button>
                  </div>
                </form>
              </div>
            </Card>

            <Card title="Total Staked LEAD">
              <div className="flex flex-col pt-16 pb-4">
                <div className="text-center">
                  <span className="text-white text-3xl">{totalStaked}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
