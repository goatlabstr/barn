import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Avatar, Divider, Stack} from "@mui/material";

type SelectValidatorProps = {
    title: string;
    validators: Array<any>;
    initialValue?: string;
    onChange?: Function;
}

export default function SelectValidator({title, validators, initialValue, onChange}: SelectValidatorProps) {
    const [value, setValue] = React.useState<string | null>(initialValue || null);

    const getImage = (validator) => {
        //@ts-ignore
        return <Avatar src={validator?.keybase_image}/>
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
                        getImage(option)
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
                            getImage(value)
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
