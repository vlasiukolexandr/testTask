import { Box, Button } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import TextContainer from './textContainer';

import * as d3 from 'd3';
import * as R from 'ramda';

import './styles.css'

import { useAppSettingsState } from "../../store/appSettings";
import { parsedDataFunc } from "../../helpers/parseData";

const prop = R.prop;

const ExcelGrid = () => {
  const { context } = useAppSettingsState();
  const canvas = useRef<any>(null);
  const gridRef = useRef<any>(null);
  const crop = useRef<any>(false);
  const borderRef = useRef<any>({
    left: -1,
    right: -1,
    top: -1,
    bottom: -1,
  });
  const croppedRef = useRef<any>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  // Prepare data from 
  const parsedData = useMemo(() => parsedDataFunc(context.data), [context.data]);

  const scale = useCallback((x, dragbar) => {
    const scale = x / gridRef.current.offsetWidth;

    gridRef.current.style.transform = `scale(${scale})`;
    gridRef.current.parentNode.style.height = `${gridRef.current.offsetHeight * scale}px`;
    d3.select('#grid').attr('data-scale', scale);
    dragbar.attr('height', `${gridRef.current.offsetHeight * scale}px`)
    canvas.current.select(`#rect-dragTop`).attr('width', `${gridRef.current.offsetWidth * scale}px`)
    canvas.current.select(`#dragTop`).attr('width', `${gridRef.current.offsetWidth * scale}px`)
    canvas.current.select(`#rect-dragBottom`).attr('width', `${gridRef.current.offsetWidth * scale}px`)
    canvas.current.select(`#rect-dragBottom`).attr('y', `${gridRef.current.offsetHeight * scale}px`)
    canvas.current.select(`#dragBottom`).attr('width', `${gridRef.current.offsetWidth * scale}px`)
    canvas.current.select(`#dragBottom`).attr('y', `${(gridRef.current.offsetHeight - 5) * scale}px`)
  }, []);

  const drawBorder = (options: any) => {
    const rectangle = canvas.current.append("rect")
    .attr("x", options.rec.x)
    .attr("y", options.rec.y)
    .attr("width", options.rec.width)
    .attr("fill", options.rec.color)
    .attr("id", `rect-${options.id}`)
    .attr("fill-opacity", options.rec.opacity)
    .attr("height", options.rec.height);
    
  const dragTop: any = d3.drag()
    .on("drag", function (d: any) {
      const dragy = d.y;

      dragbar
        .attr("y", function() {
          const val = dragy - (options.rec.lineHeight/2); 
          return val > 0 ? val : 0;
        });

      borderRef.current.top = d.y;
       

      rectangle
        .attr("height", dragy > 0 ? dragy : 0);
  });

  const dragBottom: any = d3.drag()
    .on("drag", function (d: any) {
      const dragy = d.y;

      dragbar
        .attr("y", function() {
          const val = dragy - (options.rec.lineHeight/2); 
          return val;
        });

      borderRef.current.bottom = d.y;
      rectangle
        .attr("y", `${dragy}px`)
        .attr("height", `calc(100% + ${dragy}px)`);
  });

  const dragLeft: any = d3.drag()
    .on("drag", function (d: any) {
      dragbar
        .attr("x", function() {
          const val = d.x - (options.rec.lineWidth/2); 
          return val > 0 ? val : 0;
        });

      borderRef.current.left = d.x;
      rectangle
        .attr("width", d.x > 0 ? d.x : 0);
  });

  const dragRight: any = d3.drag()
    .on("drag", function (d: any) {
      dragbar
        .attr("x", function() {
          const val = d.x; 
          return val > 0 ? val : 0;
        });
      borderRef.current.right = d.x;
      scale(d.x, dragbar)
      rectangle
        .attr("x", `${d.x}px`)
        .attr("width", `${gridRef.current.offsetWidth - d.x}px`);
  });

  let func = dragTop;
  switch(options.type) {
    case 'top':
      func = dragTop;
      break;
    case 'left':
      func = dragLeft;
      break;
    case 'bottom':
      func = dragBottom;
      break;
    case 'right':
      func = dragRight;
      break;
    default: 
      func = dragTop;
  }

  let cursor = "ns-resize";
  switch(options.type) {
    case 'top':
      cursor = "ns-resize";
      break;
    case 'bottom':
      cursor = "ns-resize";
      break;
    case 'left':
      cursor = "ew-resize";
      break;
    case 'right':
      cursor = "ew-resize";
      break;
    default: 
    cursor = "ns-resize";
  }
  
  const dragbar = canvas.current.append("rect")
    .attr("x", options.rec.linex)
    .attr("y", options.rec.liney)
    .attr("width", options.rec.lineWidth)
    .attr("fill", options.rec.color)
    .attr("id", options.id)
    .attr("height", options.rec.lineHeight)
    .attr("cursor", cursor)

    if(options.type === 'right' && borderRef.current.right > 0) {
      dragbar.attr("x", borderRef.current.right)
    }

    dragbar
    .call(func);
  }

  const describedBorders = useCallback(() => {
    d3.select("#gridContainer svg.table-class").remove()
    canvas.current = d3.select("#gridContainer").append("svg");
    canvas.current.attr('class', 'table-class');

    const optionsTop = {
      rec: {
        x: 0,
        y: 0,
        linex: 0,
        liney: 0,
        width: `${gridRef.current.getElementsByTagName('table')[0].offsetWidth}px`,
        height: 0,
        lineHeight: 5,
        lineWidth: `${gridRef.current.getElementsByTagName('table')[0].offsetWidth}px`,
        color: "red",
        opacity: .5,
      },
      type: 'top',
      id: "dragTop",
    }
    drawBorder(optionsTop)

    const optionsLeft = {
      rec: {
        x: 0,
        y: 0,
        linex: 0,
        liney: 0,
        width: 0,
        height: "100%",
        lineHeight: "100%",
        lineWidth: 5,
        color: "red",
        opacity: .5,
      },
      type: 'left',
      id: "dragLeft"
  
    }
    drawBorder(optionsLeft)

    const optionsBottom = {
      rec: {
        x: 0,
        y: "calc(100% - 5px)",
        linex: 0,
        liney: "calc(100% - 5px)",
        width: `${gridRef.current.getElementsByTagName('table')[0].offsetWidth}px`,
        height: 0,
        lineHeight: 5,
        lineWidth: `${gridRef.current.getElementsByTagName('table')[0].offsetWidth}px`,
        color: "red",
        opacity: .5,
      },
      type: 'bottom',
      id: "dragBottom"
  
    }
    drawBorder(optionsBottom)

    const optionsRight = {
      rec: {
        x: `${gridRef.current.getElementsByTagName('table')[0].offsetWidth}px`,
        y: 0,
        linex: `${gridRef.current.getElementsByTagName('table')[0].offsetWidth}px`,
        liney: 0,
        width: 0,
        height: "100%",
        lineHeight: "100%",
        lineWidth: 5,
        color: "blue",
        opacity: 0,
      },
      type: 'right',
      id: "dragRight",
    }
    drawBorder(optionsRight)
    
  }, []);

  const renderTable = useCallback(() => {
    d3.select('#grid table').remove();
    const table = d3.select('#grid')
      .append('table');

    const columns: any = [];
    if (parsedData[0]) {
      parsedData[0].forEach((el: any, k: number) => {
        columns.push({ head: '', cl: 'center', html: prop(`${k}`) })
      })
    }
    table.append('tbody')
      .selectAll('tr')
      .data(parsedData).enter()
      .append('tr')
      .selectAll('td')
      .data(function(row, i) {
        return columns.map(function(c: any) {
          return Object.keys(c).reduce(function(acc: any, k: any) {
            acc[k] = typeof c[k] == 'function' ? c[k](row) : c[k];
            return acc;
          }, {});
        });
      })
      .enter()
      .append('td')
      .html(prop('html') as any);
  }, [ parsedData ]);

  useEffect(() => {
    renderTable();
  }, [ parsedData ]);

  const handleCrop = useCallback(() => {
    if (!crop.current) {
      describedBorders();
    } else {
      d3.select('#gridContainer svg.table-class').remove();
    }
    crop.current = !crop.current;
  }, []);

  const handleCropClick = useCallback(() => {
    if(canvas.current === null) {
      return;
    }

    const scale = +(d3.select('#grid').attr('data-scale') || 1);
    const table = gridRef.current.getElementsByTagName('table')[0];
    // top
    if (borderRef.current.top > 0) {
      const reduce = croppedRef.current.top + borderRef.current.top;
      table.style.marginTop = `${-reduce / scale}px`
      croppedRef.current.top = reduce;
    }
    
    // left
    if (borderRef.current.left > 0) {
      const reduce = croppedRef.current.left + borderRef.current.left;
      table.style.marginLeft = `${-reduce * scale}px`
      table.style.width = `calc(100% + ${reduce * scale}px)`
      croppedRef.current.left = reduce;
    }
    
    if (borderRef.current.bottom > 0) {
      if ((table.offsetHeight - (table.offsetHeight - borderRef.current.bottom) - croppedRef.current.top - 10) < 0) {
        gridRef.current.style.height = `0px`
      } else {
        gridRef.current.style.height = `${(borderRef.current.bottom / scale) - (croppedRef.current.top * scale)}px`
      }
    }
    
    borderRef.current = {
      ...borderRef.current,
      left: 0,
      top: -1,
    };
    canvas.current.select(`#dragTop`).attr('y', `0px`)
    canvas.current.select(`#rect-dragTop`).attr('height', `0px`)
    canvas.current.select(`#rect-dragBottom`).attr('height', "0px")
    canvas.current.select(`#dragLeft`).attr('x', `0px`)
    canvas.current.select(`#rect-dragLeft`).attr('width', `0px`)
    canvas.current.select(`#dragBottom`).attr('y', `${(gridRef.current.offsetHeight - 5) * scale}px`)
    canvas.current.select(`#dragLeft`).attr('height', `${(gridRef.current.offsetHeight - 5) * scale}px`)
    canvas.current.select(`#dragRight`).attr('height', `${(gridRef.current.offsetHeight + 10) * scale}px`)
  }, [])

  return (
    <>
      <TextContainer />
      <Button disabled={!context.data} onClick={handleCrop} variant="contained">Switch Crop</Button>
      <Button disabled={!context.data} onClick={handleCropClick} variant="contained">Crop</Button>
      <Box id="gridContainer" my={2}>
        <div id="grid" ref={gridRef} />
      </Box>
    </>
  )
}

export default ExcelGrid;
