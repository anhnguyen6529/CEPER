import React from "react";
import { Tab, Tabs as MuiTabs } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";

const Tabs = (props) => {
    const { value, setValue, tabs, ...other } = props;
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);

    const handleCloseTab = (index) => {
        setValue(index - 1);
        tabs.splice(index, 1);
    }

    const StyledTabs = styled(MuiTabs)(({ theme }) => ({
        '& .MuiTabs-indicator': {
          backgroundColor: theme.palette[accentColor].main,
        },
    }));
    
    const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
          '&.Mui-selected': {
            color: theme.palette[accentColor].main,
          }
        }),
      );

    return (
        <StyledTabs 
            value={value} 
            onChange={(_, newValue) => setValue(newValue)}
            {...other}
        >
            {tabs.map((tab, index) => (
                tab.showIcon
                    ? (tab.icon
                        ? <StyledTab key={index} label={tab.label} icon={tab.icon} iconPosition="end" />
                        : <StyledTab 
                            key={index} 
                            label={tab.label} 
                            icon={index === value ? <Close sx={{ cursor: 'pointer' }} onClick={() => handleCloseTab(index)} /> : null}
                            iconPosition="end"
                        />
                    )
                    : <StyledTab key={index} label={tab.label}/>
            ))}
        </StyledTabs>
    )
}

export default Tabs;