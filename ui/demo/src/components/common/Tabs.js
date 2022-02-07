import React from "react";
import { Tab, Tabs as MuiTabs } from "@mui/material";
import { Close } from "@mui/icons-material";

const Tabs = (props) => {
    const { value, setValue, tabs, ...other } = props;

    const handleCloseTab = (index) => {
        setValue(index - 1);
        tabs.splice(index, 1);
    }

    return (
        <MuiTabs 
            value={value} 
            onChange={(event, newValue) => setValue(newValue)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            {...other}
        >
            {tabs.map((tab, index) => (
                tab.showIcon
                    ? (tab.icon
                        ? <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="end" />
                        : <Tab 
                            key={index} 
                            label={tab.label} 
                            icon={index === value ? <Close sx={{ cursor: 'pointer' }} onClick={() => handleCloseTab(index)} /> : null}
                            iconPosition="end"
                        />
                    )
                    : <Tab key={index} label={tab.label}/>
            ))}
        </MuiTabs>
    )
}

export default Tabs;