import { Discover, send, GtmRegistry } from "@msteams/services-transport";
import { DefaultNamespace } from "@msteams/services-core-common";
import { ChatService } from "@msteams/services-chat";
import { SettingsUtilities } from "@msteams/services-settings";
import {PeopleService} from "@msteams/services-people";

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL2FwaS5zcGFjZXMuc2t5cGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1NjQwMzYzMDYsIm5iZiI6MTU2NDAzNjMwNiwiZXhwIjoxNTY0MDQwMjA2LCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOE1BQUFBMnFsWWRVN0VsUHE4eGhraVRCZXRaYjM5Mzh2TW92ZUNBZ2dzYUZIN082M2puWHJjVWtOS25nMHEvUVlGa001bENmMDlXaUZadlhVSTYwMXVkQnRMakE2OFE3Rjhrc0lWR29UZXhSZDQycWs9IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjVlM2NlNmMwLTJiMWYtNDI4NS04ZDRiLTc1ZWU3ODc4NzM0NiIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiODQ5YzMzZmUtYmFiMi00NjVkLThkNzAtMDU5ZDEyYmE4NDliIiwiZmFtaWx5X25hbWUiOiJSYW1ha3Jpc2huYW4iLCJnaXZlbl9uYW1lIjoiU3JlZWppdGgiLCJpcGFkZHIiOiIxNjcuMjIwLjIzOC42MiIsIm5hbWUiOiJTcmVlaml0aCBSYW1ha3Jpc2huYW4iLCJvaWQiOiJhOTgzYmVlMi1mNDBhLTRkOTUtODJmMS1kMTZiZGQyOGU5NDciLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjE0Njc3MzA4NS05MDMzNjMyODUtNzE5MzQ0NzA3LTIzMjcwMjMiLCJwdWlkIjoiMTAwMzAwMDBBODNENTg4NSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJkdmNfbW5nZCIsImR2Y19jbXAiLCJrbXNpIl0sInN1YiI6IlZhUWFLcWFNZ3dDcWZUUmJhdUM3aHV0SDI0TFlVeXpkQUdUY1U1TU1LdUkiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InNycmFtYWtyQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJzcnJhbWFrckBtaWNyb3NvZnQuY29tIiwidXRpIjoieTBaWThjbkdCRXF1SmhlanNkTU5BQSIsInZlciI6IjEuMCJ9.ILRDbm8bhuhyXjbCJiljF3DK7Ax7WbdmeJWTGLoruLa-lnYmLFQE4SLiFj7xLRGjCm4Vc1CxyC_TgbFfzkd5k3QggBMDAP0b7rOeDisVyg6a7RmmY9wCJMD--pd6m_2ag8P1b5O0bFs_RECUS0BB1wkSvdxAv8KVqhQC_vQ_ibFHV-yV27reDKyS5KCsf2KYAivRXqz370Jd4GiyPcpjsXTRmlPvvn9isbQWr566kkzWFcORRgZO7vVaZaZ3VMszUJUA1SuxmPQ0HblmdpbGwBPM8jeHrZj3czkwuan7TBg_Goj66Qx3UJyuABaw4TEC815JZvDvFkVJgeeIhF5Rkw";

const mockScenario = {
  appendEventData: () => {},
  stop: () => {},
  fail: () => {},
  cancel: () => {},
  mark: () => {}
};

const mockScenarioFactory = {
  newScenario: () => mockScenario,
  findScenario: () => {},
  createScenarioWithoutStarting: () => mockScenario,
  cancelExistingAndCreateScenario: () => mockScenario,
  stopScenarioIfActive: () => {},
  findScenarioByNameAndId: () => mockScenario,
  initialize: () => {},
  timestamp: () => {}
};

class MockSettingsService {
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

export function getServices() {
  const settingsService = new MockSettingsService();
  const authenticationService = {
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
  const discover = new Discover(
    authenticationService,
    send,
    settingsService,
    mockScenarioFactory
  );
  const gtmRegistry = new GtmRegistry(
    authenticationService,
    discover,
    settingsService
  );
  const settingsUtils = new SettingsUtilities(settingsService);
  const chatService = new ChatService(
    gtmRegistry.bind(send, "chatService"),
    settingsUtils
  );
  const peopleService = new PeopleService(send);
  return {
    authenticationService,
    settingsService,
    discover,
    gtmRegistry,
    chatService,
    peopleService
  };
}
