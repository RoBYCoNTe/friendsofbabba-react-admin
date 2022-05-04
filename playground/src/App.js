import * as Components from "friendsofbabba-ra";
import * as Icons from "@material-ui/icons";

import { Admin, Loading, Resource } from "react-admin";
import {
  AppBar,
  CrudContext,
  CrudProvider,
  CrudResource,
  Layout,
  Menu,
  MenuGroup,
  MenuItem,
  UserMenu,
  UserMenuItem,
  WorkflowProvider,
  createI18nProvider,
  useAuthProvider,
  useDataProvider,
  useI18nCatcher,
  useI18nLanguages,
} from "friendsofbabba-ra";
import React, { useContext, useMemo } from "react";

import components from "./components";

console.info("Components:", Components);
const MyUserMenu = (props) => {
  const { logout } = props;
  return (
    <>
      <UserMenu {...props}>
        <UserMenuItem
          label="Profile"
          icon={<Icons.AccountCircle />}
          to="/profile"
        />
        <UserMenuItem label="Tickets" icon={<Icons.List />} to="/tickets" />
        {logout}
      </UserMenu>
    </>
  );
};
const MyAppBar = (props) => <AppBar {...props} userMenu={MyUserMenu} />;

const MyMenu = (props) => {
  const { data } = useContext(CrudContext);
  const badges = useMemo(
    () =>
      data
        ? Object.keys(data).reduce(
            (badges, k) =>
              data[k].badge != null
                ? { ...badges, [k]: data[k].badge }
                : badges,
            {}
          )
        : {},
    [data]
  );
  return (
    <Menu
      {...props}
      mode="build"
      order={{
        dashboard: 0,
        admin: 1,
      }}
      badges={badges}
    >
      <MenuGroup label="Useful Links">
        <MenuItem
          label="Doctor strange"
          sub="Doctor strange website"
          icon={Icons.AccessAlarm}
          href="https://doctorstrange.com"
          target="_blank"
        />
        <MenuItem
          label="My very long text label should be placed in two lines"
          sub="My very long text sub label should be placed in two lines"
          icon={Icons.AddToPhotos}
          to="/posts/create"
        />
      </MenuGroup>
    </Menu>
  );
};
const MyLayout = (props) => (
  <Layout {...props} menu={MyMenu} appBar={MyAppBar} />
);
const App = () => {
  const apiUrl = "http://babba.local/api";
  const languages = useI18nLanguages({ apiUrl });

  // Allow i18n to intercept and send unlocalized messages to the server.
  useI18nCatcher({ apiUrl, loading: languages?.loading });

  const dataProvider = useDataProvider({
    apiUrl,
    fileFields: ["media", "media_collection"],
  });
  const authProvider = useAuthProvider({ apiUrl });
  if (languages?.loading) {
    return (
      <Loading loadingPrimary="Loading" loadingSecondary="Please wait..." />
    );
  }

  return (
    <WorkflowProvider apiUrl={apiUrl}>
      <CrudProvider apiUrl={apiUrl}>
        <Admin
          layout={MyLayout}
          dataProvider={dataProvider}
          authProvider={authProvider}
          i18nProvider={createI18nProvider({
            languages: languages.data,
            locale: "it",
          })}
        >
          <CrudResource
            name="posts"
            icon={Icons.AcUnit}
            components={components}
          />
          <CrudResource name="tickets" icon={Icons.AccessAlarm} />
          <CrudResource
            name="users"
            icon={Icons.AccountCircle}
            roles={["admin"]}
          />
          <CrudResource name="todos" icon={Icons.TextureSharp} />
          <CrudResource name="d-tests" />
          <Resource name="roles" />
        </Admin>
      </CrudProvider>
    </WorkflowProvider>
  );
};
export default App;
