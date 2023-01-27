import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { useLocation } from "react-router-dom";
import env from "react-dotenv";

const NpcCard = () => {
  const location = useLocation();
  const npcName = location.state.battleData.nameData;
  const cookies = new Cookies();
  const headers = {
    "content-type": "application/json",
    Authorization: "Bearer " + cookies.get("token"),
  };

  const [npcData, setNpcData] = React.useState([]);

  async function handleData() {
    await axios
      .get(env.API_URL + "/api/v1/npcs/" + npcName, { headers })
      .then((response) => {
        if (response.status === 200) {
          setNpcData(response.data);
          console.log(response.data);
        }
      });
  }

  useEffect(() => {
    handleData();
  }, []);

  let barHealthWidth = (npcData.hp * 250) / npcData.maxHp;

  return (
    <div className="pvebattle--npccard">
      <form className="pvebattle--npccard--form">
        <h3>
          {npcName.replace(/(^\w{1})/g, (letter) => letter.toUpperCase())}
        </h3>
        <div>
          <img
            src={require("../../img/npc/" + npcName + ".webp")}
            width="250px"
            height="315px"
          />
        </div>

        <div className="bar--background" style={{ width: "250px" }}>
          <div
            className="bar--foreground--health"
            style={{ width: barHealthWidth + "px" }}
          >
            {npcData.hp} / {npcData.maxHp}
          </div>
        </div>
        <label>
          Dmg: {npcData.minDmg}/{npcData.maxDmg}
        </label>
        <label>Level: {npcData.level}</label>
        <label>Zone: {npcData.zone}</label>
      </form>
    </div>
  );
};

export default NpcCard;
