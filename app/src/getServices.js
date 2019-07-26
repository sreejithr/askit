import { Discover, send, GtmRegistry } from "@msteams/services-transport";
import { DefaultNamespace } from "@msteams/services-core-common";
import { ChatService, CSAService } from "@msteams/services-chat";
import { SettingsUtilities } from "@msteams/services-settings";
import {PeopleService} from "@msteams/services-people";

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL2NoYXRzdmNhZ2cudGVhbXMubWljcm9zb2Z0LmNvbSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1NjQxMTgxOTcsIm5iZiI6MTU2NDExODE5NywiZXhwIjoxNTY0MTIyMDk3LCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOE1BQUFBUU9YdlJUdGZIMU8yWGZpVVc2Z1VqM2JoWGNKNFZRYm5pTlROcGdXamtydEdzbG5XaFNXZDBiMEFWYzFnNzhmR3VxbE0rRFl2OGpYTmlhcW1TaTFIMXhBUTVmM3ZOZC9MSzFETHRFSkF3aTA9IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjVlM2NlNmMwLTJiMWYtNDI4NS04ZDRiLTc1ZWU3ODc4NzM0NiIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiSmluZGFsIiwiZ2l2ZW5fbmFtZSI6IlBhcmFzIiwiaW5fY29ycCI6InRydWUiLCJpcGFkZHIiOiIxNjcuMjIwLjIzOC43NCIsIm5hbWUiOiJQYXJhcyBKaW5kYWwiLCJvaWQiOiI3M2U1MDZhMC1iOWE2LTQwNGQtODBjNC0wNzA1ODI1MmNlMmIiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjE0Njc3MzA4NS05MDMzNjMyODUtNzE5MzQ0NzA3LTIzNzIwMDkiLCJwdWlkIjoiMTAwMzNGRkZBQkRGOTgzNSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IjdsRTE0WnZlcFh0UWhUblotLVUzY2tDaGFIU1RmN1VfME82cFdIdkpxdTAiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InBhamluZGFsQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJwYWppbmRhbEBtaWNyb3NvZnQuY29tIiwidXRpIjoiVnd2V1RKd0JnRWFkYlk4Q3ZuOEdBQSIsInZlciI6IjEuMCJ9.jhBAe8ffTEtpzfFNewdX8czsn2qP-rBUFGVE_TxV-dgvtfp2z-AkxiyHpZEiFWRW-Xd6yhtcBTjkhv8n43dD9P_9t-vKZo0SEWFspB79g6Stc0eozok2hXe2iQwpcQcRiHhZgiCqhcuwxRmBBBTmajzLgIzJ3iIEZXz2vxz5FWA85IOQCW8AYrm8-hOXKl-jRl6UB-TTe_nqqPliMvAJfCn20Sx6waBZ7W5S3RSuqTAeI5fGzdpk61dKuJUZ3LYt-5PfUC26HlLMAnWM5HX0kBQtehb64ikqwr15yMofTn2bse2ozZqZaYcLLHuaIFVyYUIjQh9I6imKy9BeP5y9Og";

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
  const csaService = new CSAService(
    authenticationService,
    settingsService,
    send
  );
  

  const peopleService = new PeopleService(gtmRegistry.bind(send, "middleTier"),);
  return {
    authenticationService,
    settingsService,
    discover,
    gtmRegistry,
    chatService,
    peopleService,
    csaService
  };
}
