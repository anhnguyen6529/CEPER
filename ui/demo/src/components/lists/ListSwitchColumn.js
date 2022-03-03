import React from "react";
import { List, ListSubheader, ListItem, ListItemIcon, ListItemText, Switch } from "@mui/material";
import { Button } from "../common";

const ListSwitchColumn = ({ columns, columnsChecked, onClickItem, onClickShowAll }) => {
    return (
        <List subheader={<ListSubheader sx={{ lineHeight: '32px', mt: 1 }} component="div">Danh sách cột</ListSubheader>}>
            {columnsChecked.map((col, id) => (
                <ListItem 
                    button 
                    key={`column${id}`}
                    sx={{ py: 0 }}
                    onClick={() => onClickItem(id)}
                >
                    <ListItemIcon>
                        <Switch size="small" checked={columnsChecked[id]} />
                    </ListItemIcon>
                    <ListItemText>
                        {columns[id]}
                    </ListItemText>
                </ListItem>
            ))}

            {columnsChecked.some((element) => element === false) &&
                <ListItem sx={{ mt: 1 }}>
                    <Button sx={{ width: '100%' }} onClick={onClickShowAll} >
                        Hiện tất cả cột
                    </Button>   
                </ListItem>
            }
            
        </List>
    )
}

export default ListSwitchColumn;