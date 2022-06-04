import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {useEffect} from "react";
import {Done} from "@mui/icons-material";
import {Avatar, Divider, Stack} from "@mui/material";

type SelectValidatorProps = {
    title: string;
    validators: Array<any>;
    images: Array<any>;
    initialValue?: string;
    onChange?: Function;
}

export default function SelectValidator({title, validators, images, initialValue='', onChange}: SelectValidatorProps) {
    const [value, setValue] = React.useState<string | null>(initialValue);

    const getImage = (id) => {
        const image = images.filter((value) => value._id === id?.toString());
        //@ts-ignore
        return <Avatar src={image[0]?.them[0]?.pictures?.primary?.url}/>
    }

    return (
        <Autocomplete
            id="validators-select-field"
            sx={{ width: "100%" }}
            options={validators}
            autoHighlight
            //@ts-ignore
            getOptionLabel={(validator) => validator?.description?.moniker?.trim()}
            value={value}
            onChange={(event: any, newValue: string | null) => {
                setValue(newValue);
                onChange?.(newValue)
            }}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                    {   //@ts-ignore
                        getImage(option?.description?.identity)
                    }
                    <Divider orientation={"vertical"} sx={{mr: 1, ml: 1}}/>
                    {   //@ts-ignore
                        option?.description?.moniker}
                </Box>
            )}
            renderInput={(params) => (
                <>
                    <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
                        {value && //@ts-ignore
                            getImage(value?.description?.identity)
                        }
                        {value &&
                            <Divider orientation={"vertical"} sx={{mr: 1, ml: 1}} color={"secondary"}/>
                        }
                        <TextField
                            {...params}
                            label={title}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    </Stack>
                </>
            )}
        />
    );
}
