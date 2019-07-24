import React from 'react';
import './App.css';
import { Chat, Avatar, Provider, themes, Flex  } from "@stardust-ui/react";
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

function App() {
  const convId = "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces";
  const { chatService } = getServices();
  
  const onPostMessage = event => sendMessage(event.data);
  const sendMessage = messageText => chatService.postMessageToConversation(convId, generateMessage(messageText));

  if (window.addEventListener) {
    window.addEventListener("message", onPostMessage, false);
  } else {
    window.attachEvent("onmessage", onPostMessage);
  }
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

export default App;
