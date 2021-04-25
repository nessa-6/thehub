import React, { Component } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
  NativeSelect,
  createMuiTheme,
  blueGrey,
} from "@material-ui/core";

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: "#31769e",
    },
    secondary: {
      main: "#292929",
    },
    tertiary: {
      main: "#000000",
    },
  },
});

export default Theme;
