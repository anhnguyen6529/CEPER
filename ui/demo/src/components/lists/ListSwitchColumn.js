import React from "react";
import { List, ListSubheader, ListItem, ListItemText, Switch } from "@mui/material";
import { Button } from "../common";
import { Visibility } from "@mui/icons-material";

const ListSwitchColumn = ({ columns, columnsChecked, onClickItem, onClickShowAll, ...other }) => {
    return (
        <List 
            subheader={<ListSubheader sx={{ lineHeight: '32px', mt: 1 }} component="div">Danh sách cột</ListSubheader>}
            {...other}
        >
            {columnsChecked.map((col, id) => (
                <ListItem 
                    button 
                    key={`column${id}`}
                    sx={{ py: 0 }}
                    onClick={() => onClickItem(id)}
                >
                    <ListItemText>{columns[id]}</ListItemText>
                    <Switch edge="end" size="small" color="primary" checked={columnsChecked[id]} inputProps={{ 'aria-label': 'Switch show/hide column' }} />
                </ListItem>
            ))}

            <ListItem sx={{ mt: 1 }}>
                <Button 
                    sx={{ width: '100%' }} 
                    startIcon={<Visibility />}
                    onClick={onClickShowAll} 
                    disabled={columnsChecked.every((element) => element === true)}
                >
                    Hiện tất cả cột
                </Button>   
            </ListItem>
            
        </List>
    )
}

export default ListSwitchColumn;