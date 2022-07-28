import React, { useCallback, useState, FunctionComponent } from "react";
import SimpleDialog from "./SimpleDialog";
import FullScreenDialog from "./FullScreenDialog";

const DialogContext = React.createContext({
  closeDialog: () => {},
  openDialog: (content: JSX.Element, title?: string, fullscreen?: boolean, action?: JSX.Element) => {},
  changeDialogContent: (content: JSX.Element) => {},
  changeDialogTitle: (title: string) => {}
});

const DialogProvider: FunctionComponent = (props) => {
  const [content, setContent] = useState(<React.Fragment />);
  const [action, setAction] = useState(<React.Fragment />);
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [title, setTitle] = useState("");
  const closeDialog = useCallback(() => {
    setOpen(false);
    setTitle("");
    setContent(<React.Fragment />);
  }, [setContent]);

  const openDialog = (content: JSX.Element, title?: string, fullscreen?: boolean, action?: JSX.Element) => {
    setContent(content || <React.Fragment />);
    setAction(action || <React.Fragment />);
    setTitle(title || "");
    setOpen(true);
    setFullscreen(!!fullscreen);
  };

  const changeDialogContent = (content: JSX.Element) => {
    setContent(content);
  };

  const changeDialogTitle = (title: string) => {
    setTitle(title);
  };

  const setDialogAsFullScreen = (val: boolean) => {
    setFullscreen(val);
  };

  return (
    <DialogContext.Provider
      value={{
        closeDialog,
        openDialog,
        changeDialogContent,
        changeDialogTitle,
      }}
      {...props}
    >
      {props.children}
      {content &&
        (fullscreen ? (
          <FullScreenDialog
            content={content}
            open={open}
            title={title}
            handleClose={closeDialog}
            action={action}
          />
        ) : (
          <SimpleDialog
            content={content}
            open={open}
            title={title}
            handleClose={closeDialog}
          />
        ))}
    </DialogContext.Provider>
  );
};

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
};

export { DialogProvider, useDialog };