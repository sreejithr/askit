import { Discover, send, GtmRegistry } from "@msteams/services-transport";
import { DefaultNamespace } from "@msteams/services-core-common";
// import { AuthenticationService } from "@msteams/services-auth";
// import { createRoutingServices } from "@msteams/services-routing";
// import { createHashHistory, createBrowserHistory } from "history";

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL2FwaS5zcGFjZXMuc2t5cGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1NjM5NjA3NTMsIm5iZiI6MTU2Mzk2MDc1MywiZXhwIjoxNTYzOTY0NjUzLCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOE1BQUFBaUZOcThsU3VzUVh2NmM4M09nejBRRllucVlTcVBSVTI2V0V2WWRLcm01Mk9RbXIyL2o4cEhqZkl4Y0RoUWN0di9OM2loemN2NUJ1bytoYi9PVkN5QTRYYmFkTW9YRm9aQzhSNEZ6N0Z1R3M9IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjVlM2NlNmMwLTJiMWYtNDI4NS04ZDRiLTc1ZWU3ODc4NzM0NiIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiODQ5YzMzZmUtYmFiMi00NjVkLThkNzAtMDU5ZDEyYmE4NDliIiwiZmFtaWx5X25hbWUiOiJSYW1ha3Jpc2huYW4iLCJnaXZlbl9uYW1lIjoiU3JlZWppdGgiLCJpbl9jb3JwIjoidHJ1ZSIsImlwYWRkciI6IjE2Ny4yMjAuMjM4LjE3OSIsIm5hbWUiOiJTcmVlaml0aCBSYW1ha3Jpc2huYW4iLCJvaWQiOiJhOTgzYmVlMi1mNDBhLTRkOTUtODJmMS1kMTZiZGQyOGU5NDciLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjE0Njc3MzA4NS05MDMzNjMyODUtNzE5MzQ0NzA3LTIzMjcwMjMiLCJwdWlkIjoiMTAwMzAwMDBBODNENTg4NSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJkdmNfbW5nZCIsImR2Y19jbXAiLCJrbXNpIl0sInN1YiI6IlZhUWFLcWFNZ3dDcWZUUmJhdUM3aHV0SDI0TFlVeXpkQUdUY1U1TU1LdUkiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InNycmFtYWtyQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJzcnJhbWFrckBtaWNyb3NvZnQuY29tIiwidXRpIjoiRVNqUHJ4VWJxVU9XYzRhcTh2QUpBQSIsInZlciI6IjEuMCJ9.QQoMVanPhqlavGWjo0WJ4HO-LGGY7zgRpp20Wo0vpVAlGOmy078a8hdv_wXB3QfNi50V-EPoMfBem47v9Cv11yxqjzOmDzrhuYtUmUKu71RDRvRReQTZ8iVmgnojHEE-exTdG2VSd-lrzo8GdGh6Mdyb_kaD-bhdwcUjRjFGhiyq64L8cY0qeai5ifQ_mtBEDpHbxwk8VND8gPFWU04Q0sX8yZN636vjGJYyACfxx-HHvTsO0AHiFuQ-Pk9KsLF74Ohitm5hwqDnUlJ4MJS3M3N4FLyGLEabngtuv_X72Xo4lnhiPIrmMMmeS9fP9Zx3hMuuf3UM3S9gFFzbUL4Y6g";

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

// const createMockLoggerFactory = (logger) => ({
//   newLogger: () => logger || createMockLogger()
// });

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
  //const mockLogger = createMockLogger();
  // const mockLoggerFactory = createMockLoggerFactory(mockLogger);
  const settingsService = new MockSettingsService(); // { platform: { clientType: "cdlworker" } });
  const authenticationService = {
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
  return {
    authenticationService,
    settingsService,
    discover,
    gtmRegistry
  };
}
