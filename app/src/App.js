import React from 'react';
import './App.css';
import moment from "moment";
import { Chat, Avatar, Provider, themes, Flex, Button, Loader } from "@stardust-ui/react";
import { getServices } from "./getServices";

const items = [
  {
    attached: 'top',
    contentPosition: 'end',
    message: {
      content: (
        <Chat.Message
          content="Hello"
          author="John Doe"
          timestamp="Yesterday, 10:15 PM"
          mine
        />
      ),
    },
    key: 'message-1',
  },
  {
    attached: 'bottom',
    contentPosition: 'end',
    key: 'message-2',
    message: {
      content: (
        <Chat.Message
          content="I'm back!"
          author="John Doe"
          timestamp="Yesterday, 10:15 PM"
          mine
        />
      ),
    },
  },
  {
    gutter: {
      content: <Avatar image="https://stardust-ui.github.io/react/public/images/avatar/small/ade.jpg" />,
    },
    message: {
      content: (
        <Chat.Message
          content="Hi"
          author="Jane Doe"
          timestamp="Yesterday, 10:15 PM"
        />
      ),
    },
    key: 'message-3',
  },
];

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

class App extends React.Component {
  chatService = getServices().chatService;
  convId = "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces";
  myName = "Sreejith Ramakrishnan"
  chatPaneRef = null;
  state = {
    messages: [],
    isLoading: true
  };

  async componentDidMount() {
    if (window.addEventListener) {
      window.addEventListener("message", this.onPostMessage, false);
    } else {
      window.attachEvent("onmessage", this.onPostMessage);
    }

    this.setState({ messages: await this.fetchMessages(), isLoading: false });
    window.scrollTo(0, document.body.scrollHeight);
  }

  fetchMessages = async (count = 30) => {
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
    /**
     * Sample message -
     * clientmessageid: "9077193612436755000"
     * composetime: "2019-07-24T13:56:57.5440000Z"
     * content: "<p>[object Object]</p>"
     * contenttype: "text"
     * conversationLink: "https://bl2pv2.ng.msg.teams.microsoft.com/v1/users/ME/conversations/19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces"
     * conversationid: "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces"
     * from: "https://bl2pv2.ng.msg.teams.microsoft.com/v1/users/ME/contacts/8:orgid:a983bee2-f40a-4d95-82f1-d16bdd28e947"
     * id: "1563976617544"
     * imdisplayname: 
     * messagetype: "RichText/Html"
     * originalarrivaltime: "2019-07-24T13:56:57.5440000Z"
     * properties: {links: "[]", mentions: "[]", files: "[]"}
     * sequenceId: 110
     * type: "Message"
     * version: "1563976617544"
     */
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

  generateFakeMessage = messageText => ({
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
  });

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
    if (this.state.isLoading) {
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
}

export default App;
