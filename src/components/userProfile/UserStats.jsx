import React, { useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "../styles/styles.css";

const UserStats = ({
  freeSkillPoints,
  strength,
  dexterity,
  vitality,
  intelligence,
  luck,
  minDmg,
  maxDmg,
  npcKills,
}) => {
  const cookies = new Cookies();
  const headers = {
    "content-type": "application/json",
    Authorization: "Bearer " + cookies.get("token"),
  };

  const data = [
    { id: 1, skill: "strength" },
    { id: 2, skill: "dexterity" },
    { id: 3, skill: "vitality" },
    { id: 4, skill: "intelligence" },
    { id: 5, skill: "luck" },
  ];

  const [clickAddSkill, setClickAddSkill] = React.useState({
    stat: "",
    amount: 0,
  });

  async function handleClickAddSkill() {
    await axios
      .post(
        " https://ao-web.herokuapp.com/api/v1/users/add-skill-points",
        { skillPointName: clickAddSkill.stat, amount: clickAddSkill.amount },
        { headers }
      )
      .then(async (response) => {
        if (response.status === 200) {
        }
      });
  }

  function handleChangeAmount(e) {
    if (e.target.value < 0) {
      e.target.value = e.target.value * -1;
    } else if (e.target.value > freeSkillPoints) {
      e.target.value = freeSkillPoints;
    }

    const newValues = {
      stat: e.target.id,
      amount: e.target.value,
    };

    setClickAddSkill(newValues);
  }

  const [showAddStat, setShowAddStat] = React.useState(false);

  function showAddPoints() {
    if (freeSkillPoints > 0) {
      setShowAddStat(showAddStat ? false : true);
    }
  }

  useEffect(() => {
    showAddPoints();
  }, []);

  return (
    <section className="secondSection">
      <h3 className="secondSection--title">Stats</h3>
      <label className="m-2">Skill points: {freeSkillPoints}</label>

      <form className="secondSection--form">
        <div className="secondSection--stats">
          <label>Strength (STR): {strength}</label>
          <label>Dexterity (DEX): {dexterity}</label>
          <label>Vitality (VIT): {vitality}</label>
          <label>Intelligence (INT): {intelligence}</label>
          <label>Critical Chance: {luck}%</label>
        </div>

        {showAddStat && (
          <div className="secondSection--add">
            {data.map((zone) => (
              <div key={zone.id} className="secondSection--add--form">
                <input
                  type="number"
                  className="form-control"
                  onChange={handleChangeAmount}
                  id={zone.skill}
                  min="1"
                  max={freeSkillPoints}
                  pattern="^[0-9]+"
                />
                <button className="btn--stats" onClick={handleClickAddSkill}>
                  ✙
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>
          Min/Max DMG: {minDmg}/{maxDmg}
        </label>
      </div>
      <label className="mt-5">Npc killed: {npcKills}</label>
    </section>
  );
};

export default UserStats;
