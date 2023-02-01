import React, { useEffect, useState } from "react";
import UserInventory from "../../userProfile/UserInventory";
import Navbar from "../../userProfile/Navbar";

import { headers, dataTooltip, sounds } from "../../../functions/utilities";
import { get, post } from "../../../functions/requestsApi";

const Shop = () => {
  const [dataItem, setDataItem] = useState("");
  const [profile, setProfile] = useState({});
  const [itemDragBuy, setItemDragBuy] = useState("");
  const [itemsShop, setItemsShop] = useState([]);
  const [showTooltip, setShowTooltip] = useState(true);

  const [itemDragSell, setItemDragSell] = useState(null);

  async function getProfile() {
    const response = await get("/api/v1/users/profile", headers);
    if (response.status === 200) {
      setProfile(response.data);
    }
  }

  async function handleItems(iClass) {
    const response = await get("/api/v1/items/shop/" + iClass, headers);
    if (response.status === 200) setItemsShop(response.data);
  }

  async function handleISelltems(values) {
    const response = await post("/api/v1/items/sell", values, headers);
    if (response.status === 200) {
      setItemDragSell(response.data.inventory);
      sounds("buySell");
    }
  }

  useEffect(() => {
    getProfile();
    handleItems("none");
  }, []);

  const dragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="shop">
      <Navbar
        gold={profile.gold}
        diamond={profile.diamond}
        role={profile.role}
      />
      <div className="shop--items">
        <div className="shop--inventory">
          {profile.equipment && (
            <UserInventory
              inventory={profile.inventory}
              equipment={profile.equipment}
              aclass={profile.aclass}
              nameItemBuy={dataItem}
              itemDragBuy={itemDragBuy}
              level={profile.level}
              itemDragSell={itemDragSell}
            />
          )}
        </div>
        <div className="shop--npc">
          <h3>Shop</h3>
          <div>
            <div className="shop--npc--button">
              <button
                id="none"
                onClick={() => {
                  handleItems("none");
                }}
              >
                All
              </button>
              <button
                id="mage"
                onClick={() => {
                  handleItems("mage");
                }}
              >
                Mage
              </button>
              <button
                id="warrior"
                onClick={() => {
                  handleItems("warrior");
                }}
              >
                Warrior
              </button>
              <button
                id="archer"
                onClick={() => {
                  handleItems("archer");
                }}
              >
                Archer
              </button>
            </div>
            <div
              className="shop--npc--section"
              id="shop--npc--card"
              onDragOver={dragOver}
            >
              <div
                className="shop--npc--card"
                id="shopNpcSellBuy"
                onDrop={(event) => {
                  if (
                    itemDragBuy === "S" ||
                    event.dataTransfer.getData("ETransfer") === "E"
                  ) {
                    return;
                  }
                  handleISelltems({
                    name: event.dataTransfer.getData("nameItemSell"),
                  });
                  setItemDragSell(null);
                }}
              >
                {itemsShop.map((item, index) => (
                  <div
                    draggable="true"
                    key={index}
                    id={item.id}
                    style={ItemStyle}
                    className={
                      profile.aclass &&
                      item.classRequired !== profile.aclass.name &&
                      item.classRequired !== "none"
                        ? "itemNoClass"
                        : item.lvlMin > profile.level
                        ? "itemNoLevel"
                        : ""
                    }
                    onDragStart={() => {
                      setShowTooltip(false);
                      setDataItem(item.name);
                      setItemDragBuy("S");
                    }}
                    onDragEnd={() => {
                      setShowTooltip(true);
                      setDataItem("");
                      setItemDragBuy("");
                    }}
                    {...(showTooltip && {
                      "data-tooltip": dataTooltip(item, 1),
                    })}
                  >
                    <img
                      src={require(`../../img/items/${item.name}.png`)}
                      className="item"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

const ItemStyle = {
  display: "flex",
  maxWidth: "36px",
  maxHeight: "36px",
  marginLeft: "3px",
  marginTop: "2px",
};
