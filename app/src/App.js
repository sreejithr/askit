import React from 'react';
import './App.css';
import { ChatService } from "@msteams/services-chat";
import { Chat, Avatar, Provider, themes, Flex, Button } from "@stardust-ui/react";
import { Discover, send, GtmRegistry } from "@msteams/services-transport";
import { SettingsUtilities } from "@msteams/services-settings";
// import { createMockSettingsService } from "@msteams/services-settings/index.mock";
import { AuthenticationService } from "@msteams/services-auth";
import { createRoutingServices } from "@msteams/services-routing";
import { createHashHistory, createBrowserHistory } from "history";
import {
  DefaultNamespace
} from "@msteams/services-core-common";

const config = require("./config.json");

export const mockScenario = {
  appendEventData: () => {},
  stop: () => {},
  fail: () => {},
  cancel: () => {},
  mark: () => {}
};

export const mockScenarioFactory = {
  newScenario: () => mockScenario,
  findScenario: () => {},
  createScenarioWithoutStarting: () => mockScenario,
  cancelExistingAndCreateScenario: () => mockScenario,
  stopScenarioIfActive: () => {},
  findScenarioByNameAndId: () => mockScenario,
  initialize: () => {},
  timestamp: () => {}
};

export const createMockLogger = () => ({
  log: () => {},
  error: () => {},
  debug: () => {},
  warn: () => {}
});

export const createMockLoggerFactory = (logger) => ({
  newLogger: () => logger || createMockLogger()
});

export class MockSettingsService {
  addListener = () => {};
  removeListener = () => {};
  enumerateListeners = () => {};
  registerProvider = () => {};
  registerProviders = () => {};
  registerAggregators = () => {};
  refreshSettings = () => {};
  getSettingsForNamespace = () => {};

  constructor(_settings = {}) {
    this._settings = _settings;
  }

  get = (key, settingsNamespace = DefaultNamespace) =>
    (this._settings[settingsNamespace] || {})[key];
  getBoolean = (key, settingsNamespace) =>
    this.get(key, settingsNamespace);
  getString = (key, settingsNamespace) =>
    this.get(key, settingsNamespace);
  getNumber = (key, settingsNamespace) =>
    this.get(key, settingsNamespace);

  // Mock helper to set settings
  set = (
    settings,
    settingsNamespace = DefaultNamespace
  ) => {
    this._settings[settingsNamespace] = {
      ...this._settings[settingsNamespace],
      ...settings
    };
  };
}

// import { SendMessageAction } from "@msteams/data-schema/generated/server-schema.interface";
const SendMessageAction = {
  Create: "Create",
  Update: "Update",
};

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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL2FwaS5zcGFjZXMuc2t5cGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1NjM5NTQ1NjEsIm5iZiI6MTU2Mzk1NDU2MSwiZXhwIjoxNTYzOTU4NDYxLCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOE1BQUFBcS9UbE9Ua3JyY2FKc2VhU2svRGJGKzZzR1dDYTYvaE5pQmpnVTdHeVNBZ3QrUEg2ekpkMmdrL1pYRTNIenQrZ2RudHhkaE40MVZDRmYyZzBYUUtJVndJTGgrekVkSHh2NHpXL2xkbEd1ak09IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjVlM2NlNmMwLTJiMWYtNDI4NS04ZDRiLTc1ZWU3ODc4NzM0NiIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiODQ5YzMzZmUtYmFiMi00NjVkLThkNzAtMDU5ZDEyYmE4NDliIiwiZmFtaWx5X25hbWUiOiJSYW1ha3Jpc2huYW4iLCJnaXZlbl9uYW1lIjoiU3JlZWppdGgiLCJpbl9jb3JwIjoidHJ1ZSIsImlwYWRkciI6IjE2Ny4yMjAuMjM4LjE3OSIsIm5hbWUiOiJTcmVlaml0aCBSYW1ha3Jpc2huYW4iLCJvaWQiOiJhOTgzYmVlMi1mNDBhLTRkOTUtODJmMS1kMTZiZGQyOGU5NDciLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjE0Njc3MzA4NS05MDMzNjMyODUtNzE5MzQ0NzA3LTIzMjcwMjMiLCJwdWlkIjoiMTAwMzAwMDBBODNENTg4NSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJkdmNfbW5nZCIsImR2Y19jbXAiLCJrbXNpIl0sInN1YiI6IlZhUWFLcWFNZ3dDcWZUUmJhdUM3aHV0SDI0TFlVeXpkQUdUY1U1TU1LdUkiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InNycmFtYWtyQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJzcnJhbWFrckBtaWNyb3NvZnQuY29tIiwidXRpIjoiNDJsYWpoR3JERUtHNlhMUndLQUdBQSIsInZlciI6IjEuMCJ9.A115XdbqGy1w1UVIQFghEcYk_hTarkZlfEvCRItJmMc12tlJAy84i-Yp6u3sdXM-B6KDpJ1C79tY_TZ7phEcKHFGq6VQAt2Nskbni4iQvSpkDO6noSASvQySdg1LtVWX73wQshqPBvlAEVlABrv4UvDbgUQP8S8PXtv2SjzXr70K1nmT0xj4S5Ed-i1LN6dBbZl4iI3xofZPQHHdVgh6viaesZcGYVv8TI6wGsN5Lc4e_CerH3bo2YC0wXAWl-bknHlyHt00dFqWzzGHnAhMst25EKRyzKhShu3sOWE156pZrCVZg4kZJmeB8fxgYupltTlbDgH02YfIIKt4oZyxEA";
  const convId = "19:73e506a0-b9a6-404d-80c4-07058252ce2b_a983bee2-f40a-4d95-82f1-d16bdd28e947@unq.gbl.spaces";

  const mockLogger = createMockLogger();
  const mockLoggerFactory = createMockLoggerFactory(mockLogger);
  const settingsService = new MockSettingsService(); // { platform: { clientType: "cdlworker" } });
  const authService = {
    // acquireToken: () => Promise.resolve(token),
    authorize: (send, resource) => {
      return async request => {
        const response = await send({
          ...request,
          headers: {
            ...request.headers,
            Authorization: `Bearer ${token}`
          }
        });
        return response;
      }
    }
  };
  // const historyObj =
  //     !window || window.location.hash === ""
  //       ? createBrowserHistory({ basename: "/" })
  //       : createHashHistory({ basename: "/" });
  // createRoutingServices(
  //   mockLoggerFactory,
  //   historyObj,
  //   window && window.location
  // );
  // const authService = new AuthenticationService(
  //   mockLoggerFactory,
  //   settingsService,
  //   mockScenarioFactory,
  //   config
  // );
  // authService.acquireToken = () => Promise.resolve(token);
  const discover = new Discover(
    authService,
    send,
    settingsService,
    mockScenarioFactory
  );
  const gtmRegistry = new GtmRegistry(
    authService,
    discover,
    settingsService
  );
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
        <Button onClick={sendMsg}>Send</Button>
      </Flex>
    </Provider>
  );
}

export default App;
