import React from 'react';
import { Box, Grid } from '@material-ui/core';
import BrowseButton from '../browseButton';
import ExcelGrid from '../excelGrid';

const Dashboard = () => {
  return (
    <Box m={2}>
      <Grid container>
        <Grid item xs={12}>
          <Box my={2}>
            <Grid container>
              <Grid item xs={12} md={2}>
                <BrowseButton />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ExcelGrid />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard;
