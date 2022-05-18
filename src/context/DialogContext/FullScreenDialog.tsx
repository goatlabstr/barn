import React, { FunctionComponent } from "react";

import {Dialog, AppBar, Toolbar, IconButton, Typography} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import {Theme} from "@mui/material/styles";
import {makeStyles} from "@mui/styles";

type DialogPropTypes = {
  open: boolean;
  title: string;
  content: JSX.Element;
  handleClose: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const FullScreenDialog: FunctionComponent<DialogPropTypes> = (props) => {
  const { open, title, content, handleClose } = props;
  const classes = useStyles();

  return (
    <Dialog
      aria-labelledby="fullscreen-dialog-title"
      fullWidth
      maxWidth={"sm"}
      open={open}
      onClose={handleClose}
      fullScreen
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      {content}
    </Dialog>
  );
};

export default FullScreenDialog;
