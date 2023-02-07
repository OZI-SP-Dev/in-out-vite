import {
  Avatar,
  Text,
  Tooltip,
  makeStyles,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from "@fluentui/react-components";
import { useContext, FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "providers/UserProvider";
import { tokens } from "@fluentui/react-theme";
import { RoleType } from "api/RolesApi";
import { ImpersonationForm } from "components/AppHeader/ImpersonationForm";

/* FluentUI Styling */
const useStyles = makeStyles({
  navHeader: {
    display: "flex",
    position: "fixed",
    zIndex: 1000,
    width: "100%",
    height: "3em",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor:
      import.meta.env.MODE === "testing"
        ? tokens.colorPaletteDarkOrangeBackground3
        : tokens.colorBrandBackground,
  },
  navHeaderPadding: {
    height: "3em",
  },
  navHeaderSiteName: {
    fontWeight: "bold",
    fontSize: "1.5em",
  },
  navLink: {
    marginLeft: "1em",
    marginRight: "1em",
    textDecorationLine: "none",
    ":hover": { textDecorationLine: "underline" },
    color: tokens.colorBrandBackgroundInverted,
  },
  navAvatar: { marginLeft: "auto", marginRight: "5px" }, // Force the Avatar icon to be positioned at the right most side
});

export const AppHeader: FunctionComponent<any> = (props) => {
  const classes = useStyles();

  const userContext = useContext(UserContext);

  const title =
    import.meta.env.MODE === "testing" || import.meta.env.DEV
      ? "In-Out-Process TEST"
      : "In-Out-Process";

  return (
    <>
      <div className={classes.navHeader}>
        <Link className={classes.navLink} to="/">
          <Text className={classes.navHeaderSiteName}>{title}</Text>
        </Link>
        <Link to="/new" className={classes.navLink}>
          New In Processing
        </Link>
        <Link to="/myCheckListItems" className={classes.navLink}>
          My Checklist Items
        </Link>
        {
          /* Include a link to Manage Roles if the current user is an ADMIN */
          userContext.roles?.includes(RoleType.ADMIN) && (
            <Link to="/roles" className={classes.navLink}>
              Manage Roles
            </Link>
          )
        }
        <Popover trapFocus={true} closeOnScroll={true} withArrow={true}>
          <PopoverTrigger>
            <Tooltip
              relationship="description"
              content={userContext.user ? userContext.user?.Title : ""}
            >
              <Avatar
                className={classes.navAvatar}
                image={
                  // If we don't have an imageUrl such as when Impersonating, just show Initials
                  userContext.user?.imageUrl
                    ? { src: userContext.user?.imageUrl }
                    : undefined
                }
                name={userContext.user?.Title}
                size={32}
              ></Avatar>
            </Tooltip>
          </PopoverTrigger>
          <PopoverSurface aria-label="Your roles">
            <ul>
              {userContext.roles?.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
            {
              //Only load the Impersonation Form if we are in NodeJS or a TEST environment
              (import.meta.env.DEV || import.meta.env.MODE === "testing") && (
                <ImpersonationForm></ImpersonationForm>
              )
            }
          </PopoverSurface>
        </Popover>
      </div>
      {/* The below div is set to the same height of the above div,
            to ensure all conent loaded has proper padding at the top so that it isn't below the header */}
      <div className={classes.navHeaderPadding}></div>
    </>
  );
};
