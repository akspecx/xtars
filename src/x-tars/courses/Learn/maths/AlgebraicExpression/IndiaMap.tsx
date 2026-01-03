
import React, { useState, useEffect } from "react";
import World from "@svg-maps/world";
import { SVGMap } from "react-svg-map";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useSpring, animated } from "@react-spring/web";
import "./styles.css";

const countries = [
  "United States",
  "Canada",
  "Brazil",
  "Germany",
  "France",
  "Russia",
  "India",
  "China",
  "Australia",
  "Japan",
  "Mexico",
  "United Kingdom",
  "Italy",
  "South Korea",
  "South Africa",
  "Argentina",
  "Egypt",
  "Nigeria",
  "Saudi Arabia",
  "Spain",
  "Turkey",
  "Indonesia",
  "Thailand",
  "Pakistan",
  "Bangladesh",
  "Kenya",
  "Chile",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "North Korea",
  "South Korea",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const WorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [randomCountry, setRandomCountry] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({});
  const [countryId, setCountryId] = useState(null);

  const generateRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    setRandomCountry(countries[randomIndex]);
    setIsCorrect(null);
    setSelectedCountry(null);
  };

  const handleCountryClick = (event) => {
    const clickedCountry = event.target.attributes.getNamedItem("name").value;
    setSelectedCountry(clickedCountry);

    if (clickedCountry === randomCountry) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleCountryHover = (event) => {
    setHoveredCountry(event.target.attributes.getNamedItem("name").value);
    setTooltipPosition({ x: event.screenX, y: event.screenY });
    setCountryId(event.target.attributes.getNamedItem("id").value);
  };

  const handleCountryLeave = () => {
    setHoveredCountry(null);
  };

  const getCountryClassName = (country) => {
    let className = "svg-map__location";

    if (country.name === selectedCountry) {
      // Correct comparison here!
      if (isCorrect === true) {
        className += " correct";
      } else if (isCorrect === false) {
        className += " wrong";
      }
    }

    return className;
  };

  const animationProps = useSpring({
    opacity: randomCountry ? 1 : 0,
    transform: randomCountry ? "translateY(0)" : "translateY(-20px)",
    config: { tension: 170, friction: 26 },
  });

  useEffect(() => {
    generateRandomCountry();
  }, []);

  const getOffset = (country) => {
    const offsets = {
      US: -70,
      IN: -70,
      CN: -60,
      BR: -50,
      RU: -80,
    };
    return offsets[country] || -31;
  };

  return (
    <div className="worldMapContainer">
      <SVGMap
        map={World}
        className="svgWorldMap"
        onLocationClick={handleCountryClick}
        onLocationMouseOver={handleCountryHover}
        onLocationMouseOut={handleCountryLeave}
        locationClassName={getCountryClassName}
      />
      <ReactTooltip
        anchorSelect={`#${countryId}`}
        place="top"
        content={hoveredCountry}
        className="rc-tooltip-custom"
        offset={() => getOffset(countryId)}
        isOpen={hoveredCountry !== null}
        followCursor={true}
        globalEventOff="click"
      />

      <animated.div style={animationProps} className="random-country-name">
        <h3>Random Country: {randomCountry}</h3>
      </animated.div>

      <button className="random-country-button" onClick={generateRandomCountry}>
        Generate Random Country
      </button>
    </div>
  );
};

export default WorldMap;