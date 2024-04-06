import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AVAILABLE_TOKENS } from '../../constants';
import "./Navbar.scss";

type Props = {
    address: string | undefined;
    name: string;
  };

  const Navbar = (props: Props) => {
      const displayAddress = `${props.address?.slice(0, 4) ?? ""}...`;
      const displayName = `${props.name?.slice(0, 10) ?? ""}..`;
  
      const [isOpen, setIsOpen] = useState(false);
      const toggle = () => setIsOpen(!isOpen);
      const [searchTerm, setSearchTerm] = useState("");
      const navigate = useNavigate();

      const handleSearchChange = (event: any) => {
        setSearchTerm(event.target.value);
      };
    
      const handleSearchSubmit = (event: any) => {
        event.preventDefault();
        // Find the asset in the AVAILABLE_TOKENS array that matches the search term
        const asset = AVAILABLE_TOKENS.find((token) => token.ticker.toLowerCase() === searchTerm.toLowerCase());
        if (asset) {
          // Redirect to the Invest page for the selected asset
          navigate(`/Invest/${asset.ticker}`);
        } else {
          // Handle cases where the asset is not found (optional)
          console.log("Asset not found");
        }
      };
  
    return ( 
    <div className="nav">
              <form onSubmit={handleSearchSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Asset, Token Address, ..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="submit-button" type="submit">Find</button>
      </form>
    
        <button className="adress-button">
                <div>send</div>
        </button>

        <button className="adress-button">
            <div>receive</div>
                     {/* TODO tx */}
        </button>

        <button className="adress-button">
            <div>buy</div>
                     {/* TODO tx */}
        </button>
        <div className="eye-icon">
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 8C9.67159 7.99961 9.34632 8.064 9.04283 8.1895C8.73933 8.315 8.46358 8.49913 8.23135 8.73135C7.99913 8.96358 7.815 9.23933 7.6895 9.54283C7.564 9.84632 7.49961 10.1716 7.5 10.5C7.5 11.883 8.617 13 10 13C11.383 13 12.5 11.883 12.5 10.5C12.5 9.117 11.383 8 10 8Z" fill="#16161A"/>
            <path d="M10 15.95C6.28701 15.95 3.09601 13.708 1.70001 10.5C3.09501 7.292 6.28601 5.05 10 5.05C13.714 5.05 16.904 7.292 18.301 10.5C16.905 13.708 13.714 15.95 10.001 15.95H10Z" stroke="#16161A" stroke-width="1.6"/>
           </svg>
        </div>
    </div>
        );
    };
    
    export default Navbar;