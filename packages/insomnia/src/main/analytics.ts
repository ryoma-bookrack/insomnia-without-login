import crypto from 'node:crypto';

import * as models from '../models/index';


export enum SegmentEvent {
  appStarted = 'App Started',
  collectionCreate = 'Collection Created',
  dataExport = 'Data Exported',
  dataImport = 'Data Imported',
  loginSuccess = 'Login Success',
  documentCreate = 'Document Created',
  kongConnected = 'Kong Connected',
  kongSync = 'Kong Synced',
  requestBodyTypeSelect = 'Request Body Type Selected',
  requestCreate = 'Request Created',
  requestExecute = 'Request Executed',
  collectionRunExecute = 'Collection Run Executed',
  projectLocalCreate = 'Local Project Created',
  projectLocalDelete = 'Local Project Deleted',
  testSuiteCreate = 'Test Suite Created',
  testSuiteDelete = 'Test Suite Deleted',
  unitTestCreate = 'Unit Test Created',
  unitTestDelete = 'Unit Test Deleted',
  unitTestRun = 'Ran Individual Unit Test',
  unitTestRunAll = 'Ran All Unit Tests',
  vcsSyncStart = 'VCS Sync Started',
  vcsSyncComplete = 'VCS Sync Completed',
  vcsAction = 'VCS Action Executed',
  buttonClick = 'Button Clicked',
}

function hashString(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function trackSegmentEvent(_event: SegmentEvent, _properties?: Record<string, any>) {
  const userSession = await models.userSession.getOrCreate();
  if (!userSession?.hashedAccountId) {
    userSession.hashedAccountId = userSession?.accountId ? hashString(userSession.accountId) : '';
  }
}

export async function trackPageView(_name: string) {
  const userSession = await models.userSession.getOrCreate();
  if (!userSession?.hashedAccountId) {
    userSession.hashedAccountId = userSession?.accountId ? hashString(userSession.accountId) : '';
  }
}
