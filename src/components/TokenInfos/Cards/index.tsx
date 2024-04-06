import React from 'react';
import './cards.scss'; // Assume your CSS styles are here


type Props = {
  cardTitle: string;
  value: string | undefined;
};

export const BalanceCard = (props: Props) => {



  return (
    <div className="balance-card">
      <div className="card-body">
        <p className="balance-title">{props.cardTitle}</p>
        <p className="balance-amount">{props.value}</p>
      </div>
    </div>
  );
};

export default BalanceCard;
