import React from 'react';
import './App.css';
import moment from "moment";
import { Chat, Avatar, Provider, themes, Flex, Loader } from "@stardust-ui/react";
import { getServices } from "./getServices";

class App extends React.Component {
  convId = "";
  selfProfile = null;
  selfName = "";
  services = null;

  constructor (props) {
    super(props);
    this.state = {
      messages: [],
      isLoading: true
    };

    this.services = getServices();
  }

  async componentDidMount() {
    
    if (window.addEventListener) {
      window.addEventListener("message", this.onPostMessage, false);
    } else {
      window.attachEvent("onmessage", this.onPostMessage);
    }

    // first upn will be self
    const selectedUpns = JSON.parse(decodeURIComponent( window.location.href.split("#/")[1]));
    const selfProfileArray = await this.getPeopleProfiles(selectedUpns.slice(0,1));
    this.selfProfile = selfProfileArray[0];
    console.log(this.selfProfile);
    this.selfName = this.selfProfile && this.selfProfile.displayName;
    const selectedMris = await this.getMrisFromUpns(selectedUpns);
    this.convId = this.getConversationId(selectedMris);

    this.setState({ messages: await this.fetchMessages(), isLoading: false });
    window.scrollTo(0, document.body.scrollHeight);
  }

  fetchMessages = async (count = 20) => {
    const { messages } = await this.services.chatService.getConversationMessages(
      this.convId,
      1,
      null,
      count
    );
    messages.reverse();
    return messages
      .filter(e => e.content.length !== 0)
      .map(this.convertMessageToChatItem);
  }

  convertMessageToChatItem = message => {
    return {
      attached: 'top',
      contentPosition: message.imdisplayname === this.selfName ? "end" : "start",
      ...(message.imdisplayname !== this.selfName && {
        gutter: {
          content: <Avatar image="https://d1qb2nb5cznatu.cloudfront.net/users/2034610-large?1472209180" />
        }
      }),
      message: {
        content: (
          <Chat.Message
            content={{ content: (
              <div>
                {message.content}
              </div>
            )}}
            author={message.imdisplayname}
            timestamp={moment(message.composetime).format("dddd, MMMM Do YYYY, h:mm a")}
            mine={message.imdisplayname === this.selfName}
          />
        ),
      },
      key: message.id,
    };
  }

  sendMessage = messageText => this.services.chatService.postMessageToConversation(this.convId, this.generateMessage(messageText));

  onPostMessage = async (event) => {
    if (typeof event.data === "string" || event.data instanceof String) {
      await this.sendMessage(event.data);
      const messages = await this.fetchMessages(1);
      if (messages.length > 0) {
        this.setState({ messages: [...this.state.messages, messages[0]] });
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
  }

  render() {
    const { messages } = this.state;
    // const displayButton = true;
    if(this.state.isLoading) {
      return (
        <Provider theme={themes.teamsDark}>
          <Flex column style={{ height: '95vh', width: '93vw', justifyContent: 'center', alignItems: 'center' }} >
            <Loader/>
          </Flex>
        </Provider>
      );
    }
    // { displayButton && <Button onClick={() => this.onPostMessage("Test")}>Test</Button> }
    return (
      <Provider theme={themes.teamsDark}>
        <Flex column style={{ height: '95vh', width: '93vw' }}>
          <Flex.Item grow>
            <Chat ref={ref => this.chatPaneRef = ref} items={messages} />
          </Flex.Item>
        </Flex>
      </Provider>
    );
  }

  getConversationId = (selectedMris) => {
    // when only your email id is present
    if(selectedMris.length === 1) {
      return "";
    }
    // when the conversation is 1:1
    if(selectedMris.length === 2) {
      // console.log()
      return this.chatIdFromMembers(selectedMris[0],selectedMris[1]);
    }
  }
  userIdForChatFromMRI = (mri) => {
    if(mri) {
      return mri.slice(mri.includes("_") ? 41 : 8);
    }
    return "";
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

  getMrisFromUpns = async (selectedUpns) => {
    const profilesArray = await this.getPeopleProfiles(selectedUpns);
    const mris = profilesArray.map((profile) => {
      return profile.mri;
    });
    return mris;
  }

  getPeopleProfiles = async (upns) => {
    const profilesMap = await this.services.peopleService.getPeopleProfilesByEmails(upns);
    const profilesArray = Array.from( profilesMap.values() );
    return profilesArray;
  }

  generateMessage(text) {
    return {
      messagetype: "RichText/Html",
      contenttype: "text",
      content: text,
      imdisplayname: this.selfName,
      clientmessageid: Math.floor(Math.random() * 10551863936860307670).toString(),
      properties: {
        importance: "",
        links: "[]",
        mentions: "[]",
        files: "[]"
      }
    }
  }
}

export default App;
