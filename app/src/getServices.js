import { Discover, send, GtmRegistry } from "@msteams/services-transport";
import { DefaultNamespace } from "@msteams/services-core-common";
import { ChatService } from "@msteams/services-chat";
import { SettingsUtilities } from "@msteams/services-settings";

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL2FwaS5zcGFjZXMuc2t5cGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1NjM5ODMwMjEsIm5iZiI6MTU2Mzk4MzAyMSwiZXhwIjoxNTYzOTg2OTIxLCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOE1BQUFBK3VOY25GWnVwVjY0ajFQbzJvTjhlZCt0dGpTOW1BOXdvVWFNWk5ZUVlXZnBjQ1JWOHVOYXdwWnVNdUdHeWdGS1lxcW5kdFZLcGdWSGl0ODBMeSswMDRDSldzS29lRSt6MTBmN0sxQkJDc009IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjVlM2NlNmMwLTJiMWYtNDI4NS04ZDRiLTc1ZWU3ODc4NzM0NiIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiODQ5YzMzZmUtYmFiMi00NjVkLThkNzAtMDU5ZDEyYmE4NDliIiwiZmFtaWx5X25hbWUiOiJSYW1ha3Jpc2huYW4iLCJnaXZlbl9uYW1lIjoiU3JlZWppdGgiLCJpbl9jb3JwIjoidHJ1ZSIsImlwYWRkciI6IjE2Ny4yMjAuMjM4LjE3OSIsIm5hbWUiOiJTcmVlaml0aCBSYW1ha3Jpc2huYW4iLCJvaWQiOiJhOTgzYmVlMi1mNDBhLTRkOTUtODJmMS1kMTZiZGQyOGU5NDciLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjE0Njc3MzA4NS05MDMzNjMyODUtNzE5MzQ0NzA3LTIzMjcwMjMiLCJwdWlkIjoiMTAwMzAwMDBBODNENTg4NSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJkdmNfbW5nZCIsImR2Y19jbXAiLCJrbXNpIl0sInN1YiI6IlZhUWFLcWFNZ3dDcWZUUmJhdUM3aHV0SDI0TFlVeXpkQUdUY1U1TU1LdUkiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InNycmFtYWtyQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJzcnJhbWFrckBtaWNyb3NvZnQuY29tIiwidXRpIjoiNDJsYWpoR3JERUtHNlhMUm5lQVFBQSIsInZlciI6IjEuMCJ9.Yq-r4_JKG3WYARiyS_fpvtdTOhH4_XepKxKDTLvUyiwi0pC5mzJRjMeWI2-PHxy-b1UyAtqeSVYISYE--j9H98InGd9Lyx9O6DY1f9cCuB6yjop6Ut8kMv-TbCi99iYA6xWRwqVrl1sJmLUgFBZ78o5wPMo7GjzVpLO3gtHyV6mFSLIZKyoIZMqM6DkU-snr7cBv7ZtDmYwxw1qswt6D19WAHLHscZLGWYuBUivjGgjskgSdOZrvtmJty07MeNJuN158uh0IDVfTBJoe-8otL-4uX4xZkPYh7mcoDAM5IxrRQa7hOIQy0u-6AtN4P05CE_X9ICiZeWeopNPyN7qFtQ";

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

const createMockLogger = () => ({
  log: () => {},
  error: () => {},
  debug: () => {},
  warn: () => {}
});

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
