import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { initWeb3, initLeadStake } from "../utils.js";

const HomePage = () => {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [leadStake, setLeadStake] = useState();
  const [totalStakeholders, setTotalStakeholders] = useState();
  const [totalStaked, setTotalStaked] = useState();
  const [stakes, setStakes] = useState();
  const [stakeRewards, setStakeRewards] = useState();
  const [minStake, setMinStake] = useState();

  useEffect(() => {
    const init = async () => {
      const web3 = await initWeb3();
      const accounts = await web3.eth.getAccounts();
      const leadStake = await initLeadStake(web3);
      const totalStakeholders = await updateTotalStakeholders();
      const totalStaked = await leadStake.methods.totalStaked().call();
      const minStake = await leadStake.methods.minimumStakeValue().call();
      setWeb3(web3);
      setAccounts(accounts);
      setLeadStake(leadStake);
      setTotalStakeholders(totalStakeholders);
      setTotalStaked(totalStaked);
      setMinStake(minStake);
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
    }
  }, [leadStake, web3, accounts]);

  async function updateStakes() {
    const stake = await leadStake.methods.stakes(accounts[0]).call();
    await setStakes(stake);
    return stake;
  }

  async function updateStakeRewards() {
    const rewards = await leadStake.methods.stakeRewards(accounts[0]).call();
    await setStakeRewards(rewards);
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

  //async function stakingTaxRate() {
  // const tax = await leadStake.methods.stakingTaxRate().call();
  // return tax;
  //}

  //async function registrationTax() {
  //  const tax = await leadStake.methods.registrationTax().call();
  //  return tax;
  //}

  //async function weeklyROI() {
  //  const ROI = await leadStake.methods.weeklyROI().call();
  //  return ROI;
  //}

  //async function referralCount() {
  //  const count = await leadStake.methods.referralCount(accounts[0]).call();
  //  return count;
  //}

  //async function referralRewards() {
  //  const rewards = await leadStake.methods.referralRewards(accounts[0]).call();
  //  return rewards;
  //}

  //async function registerAndStake(e) {
  //e.preventDefault();
  //const amount = e.target.element[0].value;
  //const referrer = e.target.element[1].value;
  //if(!referrer || referrer.length !== 42 ) referrer = '0x0000000000000000000000000000000000000000'
  //await leadStake.methods.registerAndStake(amount, referrer).send({from: accounts[0]});
  //updateStakes();
  //updateTotalStaked();
  //updateTotalStakeholders();
  //updateBalance();
  //}

  async function stake(e) {
    e.preventDefault();
    const amount = e.target.element[0].value;
    await leadStake.methods.stake(amount).send({ from: accounts[0] });
    updateStakes();
    updateTotalStaked();
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
            <Card title="Total Staked LEAD">
              <div className="flex flex-col pt-16 pb-4">
                <div className="text-center">
                  <span className="text-white text-3xl">{totalStaked}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
              </div>
            </Card>

            <Card title="Your Staked LEAD">
              <div className="flex flex-col pt-16 pb-4 px-2">
                <div className="text-center">
                  <span className="text-white text-3xl">{stakes}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
              </div>
            </Card>

            <Card title="Minimum Stake">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-center pb-8">
                  <span className="text-white text-3xl">{minStake}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
                <div className="rounded-md border-2 border-primary p-2 flex justify-end">
                  <Button
                    type="submit"
                    className="flex flex-row items-center"
                    onClick={stake}
                  >
                    <img src="/images/locked.svg" width="25" alt="" />
                    <span className="w-32">STAKE</span>
                  </Button>
                </div>
              </div>
            </Card>

            <Card title="Your Earnings">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-center pb-8">
                  <span className="text-white text-3xl">{stakeRewards}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
                <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                  <div className="text-white text-lg font-thin ml-3">
                    Lead To Stake
                  </div>
                  <Button
                    type="submit"
                    className="flex flex-row items-center"
                    onClick={withdrawEarnings}
                  >
                    <img src="/images/unlocked.svg" width="25" alt="" />
                    <span className="w-32">WITHDRAW</span>
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
                <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                  <div className="text-white text-lg font-thin ml-3">
                    Lead To Stake
                  </div>
                  <Button
                    type="submit"
                    className="flex flex-row items-center"
                    onClick={unstake}
                  >
                    <img src="/images/unlocked.svg" width="25" alt="" />
                    <span className="w-32">WITHDRAW</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-col-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-row items-center mx-auto">
              <img src="/images/favorite.svg" width="25" alt="" />
              <span className="text-white text-md ml-2">
                Deposit & Stake Your Lead With 2.5% Fee
              </span>
            </div>
            <div className="flex flex-row items-center mx-auto">
              <img src="/images/flask.svg" width="25" alt="" />
              <span className="text-white text-md ml-2">
                Withdraw Any Time For A 2.5% Unstaking Fee
              </span>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
