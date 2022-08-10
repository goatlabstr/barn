import React, {FunctionComponent, useEffect, useMemo, useState} from "react";
import {isAndroid, isMobile as isMobileWC, saveMobileLinkInfo,} from "@walletconnect/browser-utils";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {useWindowSize} from "../../hooks/window/use-window-size";
import {Box, Button} from "@mui/material";
import QRCode from "qrcode.react";

export const KeplrWalletConnectQRDialog: FunctionComponent<{
    isOpen: boolean;
    onRequestClose: () => void;
    uri: string;
}> = ({isOpen, onRequestClose, uri}) => {
    // Below is used for styling for mobile device.
    // Check the size of window.
    const {isMobile} = useWindowSize();

    // Below is used for real mobile environment.
    // Check the user agent.
    const [checkMobile] = useState(() => isMobileWC());
    const [checkAndroid] = useState(() => isAndroid());

    const navigateToAppURL = useMemo(() => {
        if (!uri) {
            return;
        }

        if (checkMobile) {
            if (checkAndroid) {
                // Save the mobile link.
                saveMobileLinkInfo({
                    name: "Keplr",
                    href: "intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;",
                });
                return `intent://wcV1?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
            } else {
                // Save the mobile link.
                saveMobileLinkInfo({
                    name: "Keplr",
                    href: "keplrwallet://wcV1",
                });

                return `keplrwallet://wcV1?${uri}`;
            }
        }
    }, [checkAndroid, checkMobile, uri]);

    useEffect(() => {
        if (navigateToAppURL) {
            window.location.href = navigateToAppURL;
        }
    }, [navigateToAppURL]);

    const handleClose = () => {
        onRequestClose();
    };

    return (
        <Dialog onClose={handleClose}
                open={isOpen}
                PaperProps={{
                    style: {borderRadius: 10}
                }}>
            <DialogTitle>{checkMobile ? "Open Keplr app to connect the wallet" : "Scan QR Code"}</DialogTitle>
            {uri ? (
                !checkMobile ? (
                    (() => {
                        return (
                            <Box sx={{p: 5}}>
                                <QRCode size={isMobile ? 290 : 450} value={uri}/>
                            </Box>
                        );
                    })()
                ) : (
                    <Button
                        onClick={() => {
                            if (navigateToAppURL) {
                                window.location.href = navigateToAppURL;
                            }
                        }}
                    >
                        Open App
                    </Button>
                )
            ) : undefined}
        </Dialog>
    )
};
