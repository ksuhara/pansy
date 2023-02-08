export type AptinSupplyPoolData = {
  type: string;
  apn_last_timestamp: string;
  pause: {
    bit_field: [];
    length: string;
  };
  position: [
    {
      amount: string;
      apn_reward: string;
      collateral: boolean;
      profit: string;
      profit_last_timestamp: string;
      user: string;
    },
  ];
};

export type AptinBorrowPoolData = {
  type: string;
  apn_last_timestamp: string;
  pause: {
    bit_field: [];
    length: string;
  };
  position: [
    {
      amount: string;
      apn_reward: string;
      collateral: boolean;
      profit: string;
      profit_last_timestamp: string;
      user: string;
    },
  ];
};
