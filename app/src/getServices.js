import { Discover, send, GtmRegistry } from "@msteams/services-transport";
import { DefaultNamespace } from "@msteams/services-core-common";
import { ChatService } from "@msteams/services-chat";
import { SettingsUtilities } from "@msteams/services-settings";
import {PeopleService} from "@msteams/services-people";

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL2FwaS5zcGFjZXMuc2t5cGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1NjQwNjA3NzIsIm5iZiI6MTU2NDA2MDc3MiwiZXhwIjoxNTY0MDY0NjcyLCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOE1BQUFBbXVsWHIybVJOMFhXMGYrbmQ3Z3ZudGVtb3FwMm5EN1dwM0JJOVRrcTNlTUtybWxrVUcvZ3VxODVIWVNzVVYvUE81WDZGb09wRHBXQjczaFpEZVB0SVRDSFhXelNzNXVTN3NQSFFDa3RRalU9IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjFmZWM4ZTc4LWJjZTQtNGFhZi1hYjFiLTU0NTFjYzM4NzI2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiSmluZGFsIiwiZ2l2ZW5fbmFtZSI6IlBhcmFzIiwiaXBhZGRyIjoiMTY3LjIyMC4yMzguMTQ3IiwibmFtZSI6IlBhcmFzIEppbmRhbCIsIm9pZCI6IjczZTUwNmEwLWI5YTYtNDA0ZC04MGM0LTA3MDU4MjUyY2UyYiIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMTQ2NzczMDg1LTkwMzM2MzI4NS03MTkzNDQ3MDctMjM3MjAwOSIsInB1aWQiOiIxMDAzM0ZGRkFCREY5ODM1Iiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImlua25vd25udHdrIiwia21zaSJdLCJzdWIiOiIzWnpDeGhFSTk1czNTaVpOZnhjcWhtaXFRdFpQeXRkLVZMSkxfZlRJY2Z3IiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJwYWppbmRhbEBtaWNyb3NvZnQuY29tIiwidXBuIjoicGFqaW5kYWxAbWljcm9zb2Z0LmNvbSIsInV0aSI6Ijc4QXZXZy03cEVlM3Ytd3E2cVlYQUEiLCJ2ZXIiOiIxLjAifQ.dDa82_jaJIA8QQj7LEFxXfneuQYX43drzI5n5NvsyU_eh5A8PX9DDi7cv--IXsyChkT5BtFzojoBQfQ9PPG0_eWh0bvxPy-3J9y26W11OrUsT7qLijH3whXrMNXwqV512t1pVTffnch6lpPjbD6Wr03_ik8l_01lYip2Cb1UVIcxiChw4WZcKQM1VmtpvQIyZjA_yXr3VAPdqw4fmLzV8CL42u3paAHvNaY52hwKwLInd3fqAfFTY9FrKJ6ymjXae_2ZyNpPY6hAaTJ0PBUSq3y--azPxljP2ZOBQaRXcG2OuTymdOZNpabYZDEZIw4VPukRBUTHYrJrHTDIguuIIw";

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

  const peopleService = new PeopleService(gtmRegistry.bind(send, "middleTier"),);
  return {
    authenticationService,
    settingsService,
    discover,
    gtmRegistry,
    chatService,
    peopleService
  };
}
