import { matchPath, type PathMatch } from 'react-router';

import { database } from '../common/database';
import * as models from '../models';
import type { Organization } from '../models/organization';
import { findPersonalOrganization } from '../models/organization';
import type { Project } from '../models/project';
import { scopeToActivity } from '../models/workspace';
export const enum AsyncTask {
  SyncOrganization,
  MigrateProjects,
  SyncProjects,
}

const getMatchParams = (location: string) => {
  const workspaceMatch = matchPath(
    {
      path: '/organization/:organizationId/project/:projectId/workspace/:workspaceId',
      end: false,
    },
    location,
  );

  const projectMatch = matchPath(
    {
      path: '/organization/:organizationId/project/:projectId',
      end: false,
    },
    location,
  );

  return (workspaceMatch || projectMatch) as PathMatch<'organizationId' | 'projectId' | 'workspaceId'> | null;
};

export const getInitialRouteForOrganization = async ({
  organizationId,
  navigateToWorkspace = false,
}: {
  organizationId: string;
  navigateToWorkspace?: boolean;
}) => {
  // 1. assuming we have history, try to redirect to the last visited project
  const prevOrganizationLocation = localStorage.getItem(`locationHistoryEntry:${organizationId}`);
  // Check if the last visited project exists and redirect to it
  if (prevOrganizationLocation) {
    const match = getMatchParams(prevOrganizationLocation);

    if (match && match.params.organizationId && match.params.projectId) {
      const existingProject = await models.project.getById(match.params.projectId);

      if (existingProject) {
        console.log('Redirecting to last visited project', existingProject._id);

        if (match.params.workspaceId && navigateToWorkspace) {
          const existingWorkspace = await models.workspace.getById(match.params.workspaceId);
          if (existingWorkspace) {
            return `/organization/${match.params.organizationId}/project/${existingProject._id}/workspace/${existingWorkspace._id}/${scopeToActivity(existingWorkspace.scope)}`;
          }
        }

        return `/organization/${match?.params.organizationId}/project/${existingProject._id}`;
      }
    }
  }
  // 2. if no history, redirect to the first project
  const firstProject = await database.getWhere<Project>(models.project.type, { parentId: organizationId });

  if (firstProject?._id) {
    return `/organization/${organizationId}/project/${firstProject?._id}`;
  }
  // 3. if no project, redirect to the project route
  return `/organization/${organizationId}/project`;
};

export const getInitialEntry = async () => {
  // 如果用户还没有看过引导页面，则显示引导页面
  // 否则如果用户未登录且之前从未登录过，则显示登录页面
  // 否则如果用户已登录，则显示组织页面
  return '/organization/org_scratchpad/project/proj_scratchpad/workspace/wrk_scratchpad/debug';
};
