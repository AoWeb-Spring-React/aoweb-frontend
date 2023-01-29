import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { headers, notifySuccess } from "../../../functions/utilities";
import { get, post } from "../../../functions/requestsApi";

const Quests = () => {
  let nonAcceptedQuestsNumber = 1;
  let acceptedQuestNumber = 1;
  const [nonAcceptedQuests, setNonAcceptedQuests] = useState([]);
  const [acceptedQuests, setAcceptedQuests] = useState([]);

  async function handleQuests(actionUrl, values) {
    const response = await post("/api/v1/quests/" + actionUrl, values, headers);
    if (response.status === 200 && actionUrl !== "complete")
      window.location.reload();

    if (response.status === 200){
      notifySuccess(
        "/quest",
        response.data.name + "- Completed!",
        "Experience: " + response.data.giveExp,
        "Gold: " + response.data.giveGold,
        "Diamonds: " + response.data.giveDiamonds
      );
    }
  }

  async function getQuests() {
    const response = await get("/api/v1/quests", headers);
    if (response.status === 200) {
      setAcceptedQuests(
        response.data.filter((quest) => quest.npcKillAmount !== undefined)
      );
      setNonAcceptedQuests(
        response.data.filter((quest) => quest.npcKillAmount === undefined)
      );
    }
  }

  useEffect(() => {
    getQuests();
  }, []);

  return (
    <div className="quest">
      {acceptedQuests.length >= 1 && (
        <div>
          <h1>Quests Acepted</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Npc Kill</th>
                <th>Npc Kills</th>
                <th>User Kills</th>
                <th>Exp</th>
                <th>Gold</th>
                <th>Diamonds</th>
                <th>Action</th>
              </tr>
            </thead>

            {acceptedQuests &&
              acceptedQuests?.length >= 1 &&
              acceptedQuests?.map((acceptedQuest, index) => (
                <tbody key={index}>
                  <tr>
                    <td>{acceptedQuestNumber++}</td>
                    <td>{acceptedQuest.quest.name}</td>
                    <td>{acceptedQuest.quest.description}</td>
                    <td>{acceptedQuest.quest.nameNpcKill}</td>
                    <td>
                      {acceptedQuest.npcKillAmount} /{" "}
                      {acceptedQuest.quest.npcKillAmountNeeded}
                    </td>
                    <td>
                      {acceptedQuest.userKillAmount} /{" "}
                      {acceptedQuest.quest.userKillAmountNeeded}
                    </td>
                    <td>{acceptedQuest.quest.giveExp}</td>
                    <td>{acceptedQuest.quest.giveGold}</td>
                    <td>{acceptedQuest.quest.giveDiamonds}</td>
                    {acceptedQuest.npcKillAmount >=
                      acceptedQuest.quest.npcKillAmountNeeded &&
                    acceptedQuest.userKillAmount >=
                      acceptedQuest.quest.userKillAmountNeeded ? (
                      <td>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => {
                            handleQuests("complete", {
                              name: acceptedQuest.quest.name,
                            });
                          }}
                        >
                          Complete
                        </button>
                      </td>
                    ) : (
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            handleQuests("cancel", {
                              name: acceptedQuest.quest.name,
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                </tbody>
              ))}
          </Table>
        </div>
      )}
      {nonAcceptedQuests.length >= 1 && (
        <div>
          <h1>Quests</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Npc Kill</th>
                <th>Amount NPC</th>
                <th>Amount USER</th>
                <th>Exp</th>
                <th>Gold</th>
                <th>Diamonds</th>
                <th>Action</th>
              </tr>
            </thead>
            {nonAcceptedQuests?.map((nonAcceptedQuest, index) => (
              <tbody key={index}>
                <tr>
                  <td>{nonAcceptedQuestsNumber++}</td>
                  <td>{nonAcceptedQuest.quest.name}</td>
                  <td>{nonAcceptedQuest.quest.description}</td>
                  <td>{nonAcceptedQuest.quest.nameNpcKill}</td>
                  <td>{nonAcceptedQuest.quest.npcKillAmountNeeded}</td>
                  <td>{nonAcceptedQuest.quest.userKillAmountNeeded}</td>
                  <td>{nonAcceptedQuest.quest.giveExp}</td>
                  <td>{nonAcceptedQuest.quest.giveGold}</td>
                  <td>{nonAcceptedQuest.quest.giveDiamonds}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        handleQuests("accept", {
                          name: nonAcceptedQuest.quest.name,
                        });
                      }}
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Quests;
