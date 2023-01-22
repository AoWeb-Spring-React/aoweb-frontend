import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import "../styles/styles.css";
import { Table } from "react-bootstrap";
import env from "react-dotenv";

const Ranking = () => {
  const cookies = new Cookies();
  const headers = {
    "content-type": "application/json",
    Authorization: "Bearer " + cookies.get("token"),
  };

  let usersCounter = 1;
  let guildsCounter = 1;

  const [ranking, setRanking] = React.useState([]);
  const [guilds, setGuilds] = React.useState([]);

  async function handleDataUsers() {
    await axios
      .get(env.API_URL + "/api/v1/users/ranking", { headers })
      .then(async (response) => {
        if (response.status === 200) {
          setRanking(response.data);
        }
      });
  }

  async function handleDataGuilds() {
    await axios
      .get(env.API_URL + "/api/v1/guilds", { headers })
      .then(async (response) => {
        if (response.status === 200) {
          setGuilds(response.data);
        }
      });
  }

  useEffect(() => {
    handleDataUsers();
    handleDataGuilds();
  }, []);

  return (
    <div className="ranking">
      <div className="ranking--tableUsers">
        <h1>Ranking Users</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Class</th>
              <th>Level</th>
              <th>Title</th>
              <th>Title Points</th>
              <th>Strength</th>
              <th>Dexterity</th>
              <th>Vitality</th>
              <th>Intelligence</th>
              <th>Luck</th>
              <th>Critical Chance</th>
              <th>Defense</th>
              <th>Evasion</th>
              <th>PvP Win</th>
              <th>PvP Loss</th>
            </tr>
          </thead>
          {ranking?.map((users) => (
            <tbody key={users.username}>
              <tr>
                <td>{usersCounter++}</td>
                <td>{users.username}</td>
                {users.aclass && <td>{users.aclass.name}</td>}
                <td>{users.level}</td>
                <td>{users.title.name}</td>
                <td>{users.titlePoints}</td>
                <td>{users.strength}</td>
                <td>{users.dexterity}</td>
                <td>{users.vitality}</td>
                <td>{users.intelligence}</td>
                <td>{users.luck}</td>
                <td>{users.criticalChance}%</td>
                <td>{users.defense}</td>
                <td>{users.evasion}%</td>
                <td>{users.pvpWins}</td>
                <td>{users.pvpLosses}</td>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>
      {guilds.length >= 1 && (
        <div>
          <h1>Ranking Guilds</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>TAG</th>
                <th>Description</th>
                <th>Leader</th>
                <th>Sub Leader</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            {guilds?.map((guild) => (
              <tbody key={guild.name}>
                <tr>
                  <td>{guildsCounter++}</td>
                  <td>{guild.name}</td>
                  <td>{guild.tag}</td>
                  <td>{guild.description}</td>
                  <td>{guild.leader}</td>
                  <td>{guild.subLeader}</td>
                  <td>{guild.memberAmount}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        axios
                          .post(
                            env.API_URL + "/api/v1/guilds/add",
                            { name: guild.name },
                            { headers }
                          )
                          .then((response) => {
                            if (response.status === 200)
                              window.location.reload();
                          });
                      }}
                    >
                      Apply
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </div>
      )}
    </div>
  );
};

export default Ranking;
