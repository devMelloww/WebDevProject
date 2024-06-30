// src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Profile, Tour } from "./server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "profile/save":
      saveProfile(message[1], user).then((profile) =>
        apply((model) => ({ ...model, profile }))
      );
      break;
    case "profile/select":
      selectProfile(message[1], user).then((profile) =>
        apply((model) => ({ ...model, profile }))
      );
      break;
    case "tour/select":
      selectTour(message[1], user).then((tour) =>
        apply((model) => ({ ...model, tour }))
      );
      break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function saveProfile(
  msg: { userid: string; profile: Profile },
  user: Auth.User
) {
  return fetch(`/api/profiles/${msg.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.profile),
  })
    .then((response) => {
      if (response.status === 200) return response.json();
      return undefined;
    })
    .then((json) => {
      if (json) return json as Profile;
      return undefined;
    });
}

function selectProfile(
  msg: { userid: string },
  user: Auth.User
) {
  return fetch(`/api/profiles/${msg.userid}`, {
    headers: {
      ...Auth.headers(user),
    },
  })
    .then((response) => response.json())
    .then((json) => json as Profile);
}

function selectTour(
  msg: { tourid: string },
  user: Auth.User
) {
  return fetch(`/api/tours/${msg.tourid}`, {
    headers: {
      ...Auth.headers(user),
    },
  })
    .then((response) => response.json())
    .then((json) => json as Tour);
}
