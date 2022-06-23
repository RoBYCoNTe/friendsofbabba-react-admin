import { FormHelperText } from "@material-ui/core";
import React from "react";

const ValidationError = ({ classes, submitError }) =>
  (submitError && typeof submitError === "string" && (
    <FormHelperText error className={classes.error}>
      {submitError}
    </FormHelperText>
  )) ||
  null;

export default ValidationError;
