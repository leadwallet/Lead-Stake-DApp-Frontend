import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const HomePage = () => {
  const [total, setTotal] = useState(49.8);
  const [value, setValue] = useState(2.75);
  const [available, setAvailable] = useState("");
  const [reward, setReward] = useState("");

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
            <Button className="w-full md:w-2/5 text-2xl">
              Connect Your Wallet
            </Button>
          </div>

          <div className="grid grid-col-1 md:grid-cols-2 gap-6 mt-10">
            <Card title="Total Staked Lead">
              <div className="flex flex-col pt-16 pb-4">
                <div className="text-center">
                  <span className="text-white text-3xl">{total}</span>
                  <span className="text-white text-2xl ml-2">%</span>
                </div>
                <div className="text-center text-white text-xl">
                  Of circulating supply
                </div>
              </div>
            </Card>
            <Card title="Your Staked Lead">
              <div className="flex flex-col pt-16 pb-4 px-2">
                <div className="text-center">
                  <span className="text-white text-3xl">{value}</span>
                  <span className="text-white text-2xl ml-2">%</span>
                </div>
                <div className="text-center text-white text-xl">
                  Of staked Lead
                </div>
              </div>
            </Card>
            <Card title="Available Lead Balance">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-center pb-8">
                  <span className="text-white text-3xl">{available}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
                <div className="rounded-md border-2 border-primary p-2 flex justify-end">
                  <Button className="flex flex-row items-center">
                    <img src="/images/locked.svg" width="25" alt="" />
                    <span className="w-32">STAKE</span>
                  </Button>
                </div>
              </div>
            </Card>
            <Card title="Your Lead Reward">
              <div className="flex flex-col pt-8 px-2">
                <div className="text-center pb-8">
                  <span className="text-white text-3xl">{reward}</span>
                  <span className="text-white text-2xl ml-2">LEAD</span>
                </div>
                <div className="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                  <div className="text-white text-lg font-thin ml-3">
                    Lead To Stake
                  </div>
                  <Button className="flex flex-row items-center">
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
