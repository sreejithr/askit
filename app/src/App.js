import React from 'react';
import './App.css';
import moment from "moment";
import { Chat, Avatar, Provider, themes, Flex, Button, Loader } from "@stardust-ui/react";
import { getServices } from "./getServices";

function generateMessage(text) {
  return {
    messagetype: "RichText/Html",
    contenttype: "text",
    content: text,
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

// function App() {
//   const convId = "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces";
//   const { chatService } = getServices();
  
//   const onPostMessage = event => sendMessage(event.data);
//   const sendMessage = messageText => chatService.postMessageToConversation(convId, generateMessage(messageText));

//   if (window.addEventListener) {
//     window.addEventListener("message", onPostMessage, false);
//   } else {
//     window.attachEvent("onmessage", onPostMessage);
//   }
//   const displayButton = false;
//   return (
//     <Provider theme={themes.teamsDark}>
//       <Flex column style={{ height: '95vh', width: '93vw' }}>
//         <Flex.Item grow>
//           <Chat items={items} />
//         </Flex.Item>
//         <Flex.Item>
//           { displayButton && <Button onClick={() => sendMessage("Test message")}/> }
//         </Flex.Item>
//       </Flex>
//     </Provider>
//   );
// }
class App extends React.Component {
  chatService = getServices().chatService;
  convId = "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces";
  myName = "Sreejith Ramakrishnan"
  chatPaneRef = null;
  

    

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isLoading: true
    };
    // first upn will be self
    const selectedUpns = JSON.parse(window.location.href.split("#/")[1]);
    const selectedMris = this.getMrisFromUpns(selectedUpns);
    this.convId = this.getConversationId(selectedMris);
  }

  async componentDidMount() {
    if (window.addEventListener) {
      window.addEventListener("message", this.onPostMessage, false);
    } else {
      window.attachEvent("onmessage", this.onPostMessage);
    }

    this.setState({ messages: await this.fetchMessages(), isLoading: false });
    window.scrollTo(0, document.body.scrollHeight);
  }

  fetchMessages = async (count = 20) => {
    const { messages } = await this.chatService.getConversationMessages(
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
    // Sample message -
    // clientmessageid: "9077193612436755000"
    // composetime: "2019-07-24T13:56:57.5440000Z"
    // content: "<p>[object Object]</p>"
    // contenttype: "text"
    // conversationLink: "https://bl2pv2.ng.msg.teams.microsoft.com/v1/users/ME/conversations/19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces"
    // conversationid: "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces"
    // from: "https://bl2pv2.ng.msg.teams.microsoft.com/v1/users/ME/contacts/8:orgid:a983bee2-f40a-4d95-82f1-d16bdd28e947"
    // id: "1563976617544"
    // imdisplayname: 
    // messagetype: "RichText/Html"
    // originalarrivaltime: "2019-07-24T13:56:57.5440000Z"
    // properties: {links: "[]", mentions: "[]", files: "[]"}
    // sequenceId: 110
    // type: "Message"
    // version: "1563976617544"
    return {
      attached: 'top',
      contentPosition: message.imdisplayname === this.myName ? "end" : "start",
      ...(message.imdisplayname !== this.myName && {
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
            mine={message.imdisplayname === this.myName}
          />
        ),
      },
      key: message.id,
    };
  }

  generateFakeMessage = messageText => {
    return {
      clientmessageid: Math.floor(Math.random() * 10551863936860307670).toString(),
      composetime: moment().format("dddd, MMMM Do YYYY, h:mm a"),
      content: messageText,
      contenttype: "text",
      conversationLink: "https://bl2pv2.ng.msg.teams.microsoft.com/v1/users/ME/conversations/19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces",
      conversationid: "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces",
      from: "https://bl2pv2.ng.msg.teams.microsoft.com/v1/users/ME/contacts/8:orgid:a983bee2-f40a-4d95-82f1-d16bdd28e947",
      id: "1563976617544",
      imdisplayname: "Sreejith Ramakrishnan",
      messagetype: "RichText/Html",
      originalarrivaltime: "2019-07-24T13:56:57.5440000Z",
      properties: {links: "[]", mentions: "[]", files: "[]"},
      sequenceId: 110,
      type: "Message",
      version: "1563976617544"
    }
  }

  sendMessage = messageText => this.chatService.postMessageToConversation(this.convId, generateMessage(messageText));

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
