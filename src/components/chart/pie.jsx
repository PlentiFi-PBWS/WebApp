import React from "react";
import Chart from "react-apexcharts";

export default function AphexChart() {
  const data = [
    {
      name: "BTC",
      quantity: 5
    },
    {
      name: "ETH",
      quantity: 27
    },
    {
      name: "DOGE",
      quantity: 9
    }
  ];

  let names = [];
  let quantities = [];
  data.forEach(function (n) {
    names.push(n.name);
    quantities.push(n.quantity);
  });

  return React.createElement(Chart, {
    type: "pie",
    series: quantities,
    labels: {
      show: false,
      name: {
        show: true
      }
    },
    options: {
      labels: names,
      legend: {
        show: true,
        position: "bottom"
      },
      colors: ["#ffd23f", "#ee4266", "#540d6e", ""]
    }
  });
}
