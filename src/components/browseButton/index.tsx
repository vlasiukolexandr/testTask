import React, { useCallback, useEffect, useRef } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import XLSX from 'xlsx';
import { setData, useAppSettingsState } from '../../store/appSettings';

const useStyles = makeStyles((theme) => ({
  hidden: {
    display: 'none',
  }
}), {
  name: 'BrowseButton'
});

const BrowseButton = () => {
  const inputRef = useRef(null);
  const classes = useStyles();

  const { context, contextDispatch } = useAppSettingsState();

  const handleClick = useCallback(() => {
    if (inputRef.current !== null) {
      (inputRef.current as any).click();
    }
  }, []);

  const handleLoad = useCallback((e: any) => {
    const data = e.target.result;
    let readedData = XLSX.read(data, {type: 'binary'});
    const wsname = readedData.SheetNames[0];
    const ws = readedData.Sheets[wsname];

    const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
    contextDispatch(setData(dataParse as Array<string | number>));
  }, []);

  const handleFiles = useCallback((e: any) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    const f = files[0];
    const reader = new FileReader();
    reader.onload = handleLoad;
    reader.readAsBinaryString(f);
    e.target.value = null;
  }, []);

  useEffect(() => {
    (inputRef.current as any).addEventListener("change", handleFiles, false);
  }, []);

  return (
    <> 
      <input type="file" ref={inputRef} className={classes.hidden} accept="xlsx" onChange={handleFiles}/>
      <Button disabled={!!context.data} onClick={handleClick} variant="contained">
        Browse xlsx File
      </Button>
    </>
  )
}

export default BrowseButton;
