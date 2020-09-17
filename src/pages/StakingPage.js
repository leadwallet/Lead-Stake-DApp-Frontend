import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { initWeb3 } from "../utils.js";
import LeadStake from '../contracts/LeadStake.json';

const HomePage = () => {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState(undefined);
  const [leadStake, setLeadStake] = useState(undefined);
  const [totalStaked, setTotalStaked] = useState(undefined);
  const [stakes, setStakes] = useState(undefined);
  const [minStake, setMinStake] = useState(undefined);
  const [stakingTax, setStakingTax] = useState(undefined);
  const [unstakingTax, setUnstakingTax] = useState(undefined);
  const [registrationTax, setRegistrationTax] = useState(undefined);
  const [referralRewards, setReferralRewards] = useState(undefined);
  const [referralCount, setReferralCount] = useState(undefined);
  const [weeklyROI, setWeeklyROI] = useState(undefined);
  const [stakingRewards, setStakeRewards] = useState(undefined);
  const [minRegister, setMinRegister] = useState(undefined);
  const [totalRewards, setTotalRewards] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await initWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LeadStake.networks[networkId];
      const leadStake = new web3.eth.Contract(LeadStake.abi, deployedNetwork && deployedNetwork.address);
      const totalStaked = await leadStake.methods.totalStaked().call();
      const minStake = await leadStake.methods.minimumStakeValue().call();
      const stakingTax = await leadStake.methods.stakingTaxRate().call();
      const unstakingTax = await leadStake.methods.unstakingTaxRate().call();
      const registrationTax = await leadStake.methods.registrationTax().call();
      const referralRewards = await leadStake.methods.referralRewards(accounts[0]).call();
      const referralCount = await leadStake.methods.referralCount(accounts[0]).call();
      const weeklyROI = await leadStake.methods.weeklyROI().call();
      setWeb3(web3);
      setAccounts(accounts);
      setLeadStake(leadStake);
      setTotalStaked(totalStaked);
      setMinStake(minStake);
      setStakingTax(stakingTax);
      setUnstakingTax(unstakingTax);
      setRegistrationTax(registrationTax);
      setReferralRewards(referralRewards);
      setReferralCount(referralCount);
      setWeeklyROI(weeklyROI);
    };
    init();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccounts(accounts);
      });
    }
  }, []);

  const isReady = () => {
    return !!leadStake && !!web3 && !!accounts;
  };

  useEffect(() => {
    if (isReady()) {
      updateStakes();
      updateStakeRewards();
      updateTotalStaked();
      stakeRewards();
      minRegisteration();
      totalReward();
    }
  }, [leadStake, web3, accounts]);

  async function updateStakes() {
    const stake = await leadStake.methods.stakes(accounts[0]).call();
    await setStakes(stake);
    return stake;
  }

  async function updateStakeRewards() {
    const rewards = await leadStake.methods.stakeRewards(accounts[0]).call();
    return rewards;
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
    const rewards = parseInt(await leadStake.methods.stakeRewards(accounts[0]).call());
    const weekly = parseInt(await leadStake.methods.calculateEarnings(accounts[0]).call());
    const sum = rewards + weekly;
    await setStakeRewards(sum);
    return sum;
  }

  async function registered() {
    const status = await leadStake.methods.registered(accounts[0]).call();
    return status;
  }

  async function totalReward() {
    const weekly = parseInt(await leadStake.methods.calculateEarnings(accounts[0]).call());
    const stake = parseInt(await leadStake.methods.stakeRewards(accounts[0]).call());
    const referral = parseInt(await leadStake.methods.referralRewards(accounts[0]).call());
    const sum = stake + referral + weekly;
    await setTotalRewards(sum);
    return sum;
  }

  async function registerAndStake(e) {
    e.preventDefault();
    const amount = e.target.element[0].value;
    let referrer = e.target.element[1].value;
    if(!referrer || referrer.length !== 42 ) referrer = '0x0000000000000000000000000000000000000000'
    await leadStake.methods.registerAndStake(amount, referrer).send({from: accounts[0]});
    await updateStakes();
    await updateTotalStaked();
    await updateTotalStakeholders();
  }

  async function stake(e) {
    e.preventDefault();
    const amount = e.target.element[0].value;
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
    updateStakeRewards();
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
            <Button className="w-full md:w-2/5 text-2xl" onClick={web3}>
              Connect Your Wallet
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
            
            {!registered ? (

            <Card title="Minimum Stake">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-center pb-8">
                  <span className="text-white text-3xl">{minRegister}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
                <form onSubmit={e => registerAndStake(e)}>
                  <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                    <br/>
                    <div className="form-group text-white text-lg font-thin ml-1">
                      <label htmlFor="amount">Amount</label>
                      <input type="number" className="form-control text-black"/>
                    </div>
                    <br/>
                    <div className="form-group text-white text-lg font-thin ml-1">
                      <label htmlFor="referrer">Referrer Address</label>
                      <input type="text" className="form-control"/>
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
                  <form onSubmit={e => stake(e)}>
                    <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                      <br/>
                      <div className="form-group text-white text-lg font-thin ml-1">
                        <label htmlFor="amount">Amount </label>
                        <input type="number" className="form-control text-black"/>
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
                <form onSubmit={e => unstake(e)}>          
                  <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                    <br/>
                    <div className="form-group text-white text-lg font-thin ml-1">
                      <label htmlFor="amount">Amount </label>
                      <input type="number" className="form-control text-black"/>
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