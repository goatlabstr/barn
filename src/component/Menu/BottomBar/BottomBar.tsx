import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {useLocation, useNavigate} from "react-router-dom";
import {Paper} from "@mui/material";
import {useTheme} from "@mui/styles";

export default function BottomBar(props) {
    const {menuItems} = props;
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

    const getInitialKey = () => {
        const initMenu = menuItems.filter(m => m.path === location.pathname);
        return initMenu[0]?.key;
    }

    const [value, setValue] = React.useState(getInitialKey());

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        const selectedMenu = menuItems.filter(m => m.key === newValue);
        navigate(selectedMenu[0]?.path);
    };

    return (
        <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10, display: {md: "none"}}} elevation={12}>
            <BottomNavigation showLabels value={value} onChange={handleChange}>
                {menuItems.map((data, index) => (
                    <BottomNavigationAction
                        key={data.key}
                        label={data.title}
                        value={data.key}
                        icon={data.icon}
                        //@ts-ignore
                        sx={{color: data.key === value ? theme.palette.secondary.main + " !important" : ""}}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}
