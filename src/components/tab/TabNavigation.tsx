import React, { useState, useEffect } from 'react';
import Historyy from './subComponent/History';
import NFTs from './subComponent/NFT';
import Tokens from './subComponent/Tokens';
import './TabNavigation.scss';
import AssetDisplay from '../listAsset/AssetDisplay';
import ApexCharts from '../chart/pie';

const data = {
  labels: ["Critical case", "Urgent case", "Errors", "Reviewed", "Success"],
  datasets: [
    {
      data: [30, 30, 5, 15, 20],
      backgroundColor: [
        "rgb(242,165,152)",
        "rgb(255,232,157)",
        "rgb(236,107,109)",
        "rgb(122,231,125)",
        "rgb(195,233,151)"
      ],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    }
  ],
 
  plugins: {
    labels: {
      render: "percentage",
      fontColor: ["green", "white", "red"],
      precision: 2
    },
  },
   text: "23%",
};

enum TabName {
  Tokens = "Tokens",
  NFTs = "NFTs",
  History = "History",
}

// Define the props for the Tab component
interface TabProps {
  name: TabName;
  isActive: boolean;
  onClick: () => void;
}

// Tab component
const Tab: React.FC<TabProps> = ({ name, isActive, onClick }) => (
  <button
    className={`tab ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {name}
  </button>
);

const TypingText = ({ text }: any) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust the interval to control the speed of typing
    return () => clearInterval(interval);
  }, [text]);

  return <p>{displayedText}</p>;
};


// TabNavigation component
const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>(TabName.Tokens);

  // Function to render the correct tab content
  const renderContent = () => {
    switch (activeTab) {
      case TabName.Tokens:
        return <Tokens />;
      case TabName.NFTs:
        return <NFTs />;
      case TabName.History:
        return <Historyy />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="tabs">
        <div>
        {Object.values(TabName).map((name) => (
          
          <Tab
            key={name}
            name={name}
            isActive={activeTab === name}
            onClick={() => setActiveTab(name)}
          />
        ))}
     
        </div>
      </div>
      <div className='container-content-history'>
      <div className="tab-content">
        {renderContent()}
      </div>

      <div className='content-IA'>
        <div className='sub-IA'>
        <img className='beeAI' src="https://cdn.glitch.global/c93534af-5272-405e-be3c-dd8c87171bf3/swarm%20(1).png?v=1711215358099" alt="" />

      <TypingText className="txt" text="I am BeeAI, your virtual assistant. What can I teach you today?" />

      <div className="input-button-container">
            <input type="text" placeholder="Type something..." />
            <button className="button">
              <img src="https://cdn.glitch.global/c93534af-5272-405e-be3c-dd8c87171bf3/sparkler%20(2).png?v=1711215068560" alt="Sparkler" style={{ marginRight: '8px' }} />
              Ask to BeeAI
            </button>
          </div>
      </div>
    </div>

       {/* <div className='chart'>
       <ApexCharts />   
       </div> */}
       </div>

      <AssetDisplay/>
      
    </div>
  );
};

export default TabNavigation;