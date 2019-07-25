import { Discover, send, GtmRegistry } from "@msteams/services-transport";
import { DefaultNamespace } from "@msteams/services-core-common";
import { ChatService } from "@msteams/services-chat";
import { SettingsUtilities } from "@msteams/services-settings";

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL2FwaS5zcGFjZXMuc2t5cGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1NjQwNDg0NjIsIm5iZiI6MTU2NDA0ODQ2MiwiZXhwIjoxNTY0MDUyMzYyLCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOE1BQUFBdlhqSXdRaVAxeWNRSDgrODJjQzAwR1RtVHA5TlE5SzVTTU9nVE5tT2ROYWtQVzdNREVaN3JFMmhzTlhrRXVQcGtHdi9TR0lhVzF5bmR3Snk4WTgvU3hrYTlCcENQR1htQmtkbHdTa2FFL2c9IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjVlM2NlNmMwLTJiMWYtNDI4NS04ZDRiLTc1ZWU3ODc4NzM0NiIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiODQ5YzMzZmUtYmFiMi00NjVkLThkNzAtMDU5ZDEyYmE4NDliIiwiZmFtaWx5X25hbWUiOiJSYW1ha3Jpc2huYW4iLCJnaXZlbl9uYW1lIjoiU3JlZWppdGgiLCJpbl9jb3JwIjoidHJ1ZSIsImlwYWRkciI6IjE2Ny4yMjAuMjM4LjYyIiwibmFtZSI6IlNyZWVqaXRoIFJhbWFrcmlzaG5hbiIsIm9pZCI6ImE5ODNiZWUyLWY0MGEtNGQ5NS04MmYxLWQxNmJkZDI4ZTk0NyIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMTQ2NzczMDg1LTkwMzM2MzI4NS03MTkzNDQ3MDctMjMyNzAyMyIsInB1aWQiOiIxMDAzMDAwMEE4M0Q1ODg1Iiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImR2Y19tbmdkIiwiZHZjX2NtcCIsImttc2kiXSwic3ViIjoiVmFRYUtxYU1nd0NxZlRSYmF1QzdodXRIMjRMWVV5emRBR1RjVTVNTUt1SSIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoic3JyYW1ha3JAbWljcm9zb2Z0LmNvbSIsInVwbiI6InNycmFtYWtyQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJDS24tOHM4Uk4wT09PbUh4V1NjVUFBIiwidmVyIjoiMS4wIn0.ZhYyJdTXwcH2U_4EDslFtKarkqzFCohLQpGxEvGnptLU-hLNbYuojdnoYm3XEArF8RyLQRwzgT20uSdpWLSfHCbK0txyK5E4PyW_CQ6NHgFNejBS7rQ3RHfc5oATRAaOeUtE1pEtU6t4_Yn1O3FNInQr5Sc6_DAtrxFLHxRfeWghPlLdOmqR4J5zwuh9bOuWE74JW4fETP456AIOAl_nZhsqUYU8CUhOO_E5q_3sNaaH4XycrzqauIb4niyjbpV_Hc2FuwlHINHqS256RnueJguxXwd7L5rS-QKzTUyS9yVKjW4WH8ZpObTDz84ewvI-HIQp3_Yz0vc2omQ1Vkd-2w";

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
  return {
    authenticationService,
    settingsService,
    discover,
    gtmRegistry,
    chatService
  };
}
