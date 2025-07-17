import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Party } from '../types';

interface SeatVisualizationProps {
  parties: Party[];
  totalSeats: number;
}

const SeatVisualization: React.FC<SeatVisualizationProps> = ({ parties, totalSeats }) => {
  const ref = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null>(null);

  // Effect to manage tooltip lifecycle (mount/unmount)
  useEffect(() => {
    // Create tooltip on mount
    tooltipRef.current = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px");

    // Cleanup on unmount
    return () => {
      tooltipRef.current?.remove();
    };
  }, []); // Empty dependency array ensures this runs only once

  // Effect to draw/update the visualization
  useEffect(() => {
    if (!ref.current || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const svg = d3.select(ref.current);
    
    // More efficient clear: remove the main 'g' container instead of all SVG children
    svg.select("g").remove();

    if (parties.length === 0 || totalSeats === 0) {
      return;
    }

    const width = 500;
    const height = 250;
    const radius = Math.min(width, height * 2) / 2 - 10;

    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height})`);
    
    const seatData: { party: Party }[] = [];
    parties.forEach(party => {
        for(let i=0; i<party.seats; i++){
            seatData.push({ party });
        }
    });

    const pie = d3.pie<{ party: Party }>()
      .value(1)
      .sort(null)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const arc = d3.arc<d3.PieArcDatum<{ party: Party }>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const path = g.selectAll("path")
      .data(pie(seatData))
      .enter().append("path")
        .attr("d", arc)
        .attr("fill", d => d.data.party.color)
        .attr("stroke", "white")
        .attr("stroke-width", "1px");

    path.on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").text(d.data.party.name);
        d3.select(event.currentTarget).style("opacity", 0.8);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", (event) => {
        tooltip.style("visibility", "hidden");
        d3.select(event.currentTarget).style("opacity", 1);
      });
      
  }, [parties, totalSeats]);

  return (
    <div className="flex flex-col items-center">
        <svg ref={ref} width="500" height="250" viewBox="0 0 500 250"></svg>
        <p className="text-sm text-gray-600 mt-2">Total Seats: {totalSeats}</p>
    </div>
  );
};

export default React.memo(SeatVisualization);