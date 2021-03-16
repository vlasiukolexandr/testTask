import { Button } from "@material-ui/core";
import React, { useCallback } from "react";

import * as d3 from 'd3';

import './styles.css'

import { useAppSettingsState } from "../../store/appSettings";

const TextContainer = () => {
  const { context } = useAppSettingsState();

  const handleText = useCallback(() => {
    const c = d3.select("#gridContainer").append("svg")
    c.classed('textItem')

    const drag: any = d3.drag()
    .on("drag", function (d: any) {
        c.select('circle')
          .attr("cx", function() {
            return d.x;
          })
          .attr("cy", function() {
            return d.y;
          });
        c.select('foreignObject')
          .attr("x", function() {
            return d.x;
          })
          .attr("y", function() {
            return d.y;
          });
      });

    const resize: any = d3.drag()
    .on("drag", function (d: any) {
      c.select('foreignObject')
        .attr("width", function() {
          return d.x + 5;
        })
        .attr("height", function() {
          return d.y + 5;
        })
    });
  
    // text shape
    c.append("foreignObject").attr('class', 'text-wrapper')
      .attr("x", 0)
      .attr("y", 50)
      .attr("width", 240)
      .attr("height", 200)
      .html(function(d: any) {
        return `
          <div class="text">
            <input type="text" id="text-input" value="Text goes here" />
            <div class="point-bottom"></div>
            <input type="color" id="color" name="head" value="#000">
          </div>`
      });

    // circle for dragging
    c.append("circle").attr('class', 'point')
      .attr("cx", 0)
      .attr("cy", 50)
      .attr("width", 10)
      .attr("height", 10)
      .attr("r", 10)
      .attr("fill", 'red')
      .attr("cursor", 'move')

    const inputChanged = function(event: any) {
      c.select('#text-input').style('color', event.target.value)
    }
    const input = c.select('#color')
    input.on('change', inputChanged, false);

    c.select('circle')
    .call(drag);

    c.select('foreignObject .point-bottom')
    .call(resize);
  }, [])

  return (
    <Button disabled={!context.data} onClick={handleText} variant="contained">Text</Button>
  )
}

export default TextContainer;
