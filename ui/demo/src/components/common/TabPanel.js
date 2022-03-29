import React from "react";
import { Box } from "@mui/material";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        {...other}
        style={{ borderRadius: 4 }}
      >
        {value === index && (
          <Box sx={{ px: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
}

export default TabPanel;