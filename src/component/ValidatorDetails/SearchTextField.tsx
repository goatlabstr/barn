import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchTextField(props) {
    const {className, ...otherProps} = props;
    return (
        <Paper
            component="form"
            sx={{display: 'flex', alignItems: 'center', borderRadius: 5}}
            className={className}
        >
            <IconButton type="submit" sx={{p: '10px'}} aria-label="search">
                <SearchIcon/>
            </IconButton>
            <InputBase
                sx={{ml: 1, flex: 1}}
                placeholder="Search"
                {...otherProps}
            />
        </Paper>
    );
}
