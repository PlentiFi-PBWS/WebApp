
import React from 'react';
import { formatNumber } from "../../utils/tokenAmountToString"

const DynamicTable = ({ assets }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Value</th>

        </tr>
      </thead>
      <tbody>
        {assets.map((asset, index) => {
          return (
            <tr key={index}>
              <td>{asset.name}</td>
              <td>{asset.ticker}</td>
              <td>{"$" + asset.price}</td>
              <td>{formatNumber(asset.amount, 7)}</td>
              <td>{"$" + formatNumber(Number(asset.price) * Number(formatNumber(asset.amount, 7)), 4)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

export default DynamicTable;
