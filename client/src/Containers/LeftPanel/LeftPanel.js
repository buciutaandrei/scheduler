import React, { useState } from "react";
import DatePicker from "../../Components/DatePicker/DatePicker.js";
import "tachyons";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { toggleAddModal, loggingOut } from "../../actions/index";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import "./LeftPanel.css";

const useStyles = makeStyles(theme =>
  createStyles({
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: 240,
        flexShrink: 0
      }
    }
  })
);

const mapDispatchToProps = dispatch => {
  return {
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    loggingOut: logOut => dispatch(loggingOut(logOut))
  };
};

const LeftPanel = props => {
  const [drawer, toggleDrawer] = useState(true);
  const classes = useStyles();

  const drawerContent = (
    <div className="shadow-5 leftPanelSwipe">
      <div className="datePickerWrapper ma4 pa3 shadow-3">
        <DatePicker />
      </div>
      <Button
        style={{
          position: "absolute",
          padding: "1.5rem",
          bottom: "0",
          left: "0",
          width: "23rem",
          height: "2rem",
          color: "#fafafa",
          letterSpacing: "2px",
          zIndex: "1"
        }}
        onClick={props.loggingOut}
      >
        Log out
      </Button>
    </div>
  );

  return (
    <div id="drawerId" className={classes.drawer}>
      <Hidden smUp implementation="js">
        <Drawer
          variant="temporary"
          open={drawer}
          onClose={() => toggleDrawer(false)}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="js">
        <Drawer variant="permanent" open>
          {drawerContent}
        </Drawer>
      </Hidden>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(LeftPanel);
