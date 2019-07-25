import React from 'react';
import './App.css';
import { Chat, Avatar, Provider, themes, Flex  } from "@stardust-ui/react";
import { getServices } from "./getServices";

function generateMessage(text) {
  return {
    messagetype: "RichText/Html",
    contenttype: "text",
    content: `<p>${text}</p>`,
    imdisplayname: "Sreejith Ramakrishnan",
    clientmessageid: Math.floor(Math.random() * 10551863936860307670).toString(),
    properties: {
      importance: "",
      links: "[]",
      mentions: "[]",
      files: "[]"
    }
  }
}

export class App extends React.Component {
  services = getServices();
  convId = "";

  constructor(props) {
    super(props);
    if (window.addEventListener) {
      window.addEventListener("message", this.onPostMessage, false);
    } else {
      window.attachEvent("onmessage", this.onPostMessage);
    }
    // first upn will be self
    const selectedUpns = JSON.parse(window.location.href.split("#/")[1]);
    const selectedMris = this.getMrisFromUpns(selectedUpns);
    this.convId = this.getConversationId(selectedMris);
    // this.convId = "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces";
  };

  componentDidMount() {

  }

  render() {
    return (
      <Provider theme={themes.teamsDark}>
        <Flex column style={{ height: '95vh', width: '93vw' }}>
          <Flex.Item grow>
            <Chat items={items} />
          </Flex.Item>
        </Flex>
      </Provider>
    );
  }

  onPostMessage = (event) => {
    this.sendMessage(event.data);
  }


  sendMessage = (messageText) => {
    const {chatService} = this.services;
    chatService.postMessageToConversation(this.convId, generateMessage(messageText));
  }

  getConversationId = (selectedMris) => {
    // when only your email id is present
    if(selectedMris.length === 1) {
      return "";
    }
    // when the conversation is 1:1
    if(selectedMris.length === 2) {
      this.chatIdFromMembers(selectedMris[0],selectedMris[1]);
    }
  }
  userIdForChatFromMRI = (mri) => {
    return mri.slice(mri.includes("_") ? 41 : 8);
  };
  /**
   * Construct 1:1 chat ID given MRIs of participants
   */
  chatIdFromMembers = (userId1, userId2) => {
    const members = [
      this.userIdForChatFromMRI(userId1),
      this.userIdForChatFromMRI(userId2)
    ].sort();
    return `19:${members[0]}_${members[1]}@unq.gbl.spaces`;
  };

  getMrisFromUpns = (selectedUpns) => {
    const profiles = this.services.peopleService.getPeopleProfilesByEmails(selectedUpns);
    const mris = profiles.map((profile) => {
      return profile.mri;
    });
    return mris;
  }


}

export default App;
