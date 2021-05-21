export const getAppConfig = (apps, appName) => {
  const app = getApp(apps, appName);
  return app && app.config;
};

export const getApp = (apps, uuid) => apps && apps.find(app => app.uuid === uuid);
