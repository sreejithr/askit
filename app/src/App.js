import React from 'react';
import { ChatService } from "@msteams/services-chat";
import { Chat, Avatar, Provider, themes, Flex, Button, Input } from "@stardust-ui/react";
import { send } from "@msteams/services-transport";
import { SettingsUtilities } from "@msteams/services-settings";
import './App.css';
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

function App() {
  const convId = "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces";
  const { settingsService, gtmRegistry } = getServices();
  const settingsUtils = new SettingsUtilities(settingsService);
  const chatService = new ChatService(
    gtmRegistry.bind(send, "chatService"),
    settingsUtils
  );
  const message = {
    messagetype: "RichText/Html",
    contenttype: "text",
    content: "<p>test</p>",
    imdisplayname: "Sreejith Ramakrishnan",
    clientmessageid: Math.floor(Math.random() * 10551863936860307670).toString(),
    properties: {
      importance: "",
      links: "[]",
      mentions: "[]",
      files: "[]"
    }
  }
  const sendMsg = () => chatService.postMessageToConversation(convId, message);
  return (
    <Provider theme={themes.teamsDark}>
      <Flex column style={{ height: '100vh', width: '100vw' }}>
        <Flex.Item grow>
          <Chat items={items} />
        </Flex.Item>
        <Flex gap={"small"}>
          <Input fluid/>
          <Button onClick={sendMsg}>Send</Button>
        </Flex>
      </Flex>
    </Provider>
  );
}

export default App;
