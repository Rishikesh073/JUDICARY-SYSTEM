import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function CitationGraph({ cases, query }) {
    const containerRef = useRef();
    const [hasData, setHasData] = useState(false);
    const [renderError, setRenderError] = useState(null);

    useEffect(() => {
        try {
            if (!cases || !Array.isArray(cases) || cases.length === 0) {
                setHasData(false);
                return;
            }

            // Build nodes and links from Om's case payload
            const safeNodes = [
                { id: 'query_node', name: 'USER QUERY', group: 'query', metadata: { type: 'Query', judgement: query, case_name: 'USER QUERY' } }
            ];
            const safeLinks = [];
            
            cases.forEach((c, idx) => {
                const nodeId = `case_${idx}`;
                let group = 'approved';
                if (c.verdict === 'Dissenting') group = 'dissenting';
                if (c.verdict === 'Rejected') group = 'rejected';
                
                safeNodes.push({
                    id: nodeId,
                    name: c.filename ? c.filename.replace('.json', '') : `Case ${idx+1}`,
                    group: group,
                    metadata: {
                        case_name: c.filename ? c.filename.replace('.json', '') : `Case ${idx+1}`,
                        type: c.verdict || 'Unknown',
                        judgement: c.holding || 'No holding available.',
                        acts: `Confidence: ${c.confidence_score || 0}%`,
                        charges: c.ratio_decidendi || 'No ratio decidendi.'
                    }
                });
                
                safeLinks.push({
                    source: nodeId,
                    target: 'query_node'
                });
            });

            const nodeIds = new Set(safeNodes.map(n => n.id));

            // No need to filter since we built the links perfectly
            setHasData(true);
            setRenderError(null);

            const width = 800;
            const height = 400;

            // Select container and clear EVERYTHING
            const container = d3.select(containerRef.current);
            container.selectAll("*").remove();

            // Create a wrapper for zoom
            const svg = container.append("svg")
                .attr("viewBox", [0, 0, width, height])
                .style("width", "100%")
                .style("height", "400px")
                .style("display", "block")
                .style("cursor", "grab");

            // Main group that will be scaled/panned
            const mainGroup = svg.append("g");

            // Setup Zoom
            const zoom = d3.zoom()
                .scaleExtent([0.3, 3])
                .on("zoom", (event) => {
                    mainGroup.attr("transform", event.transform);
                });
            svg.call(zoom);

            // Append a purely D3-controlled Tooltip DIV (Hidden by default)
            const tooltip = container.append("div")
                .style("position", "absolute")
                .style("background", "white")
                .style("border", "1px solid #e2e8f0")
                .style("border-radius", "0.75rem")
                .style("box-shadow", "0 10px 15px -3px rgba(0,0,0,0.1)")
                .style("padding", "1rem")
                .style("width", "380px") // Expanded width
                .style("max-height", "280px") // Add max-height
                .style("overflow-y", "auto") // Add scrollbar for long text
                .style("z-index", "50")
                .style("opacity", "0")
                .style("pointer-events", "none") // Prevent tooltip from intercepting zoom/pan
                .style("font-family", "sans-serif")
                .style("transition", "opacity 0.2s");

            const simulation = d3.forceSimulation(safeNodes)
                .force("link", d3.forceLink(safeLinks).id(d => d.id).distance(150))
                .force("charge", d3.forceManyBody().strength(-500))
                .force("center", d3.forceCenter(width / 2, height / 2));

            // Add arrows to mainGroup instead of SVG
            mainGroup.append("defs").selectAll("marker")
                .data(["citing"])
                .enter().append("marker")
                .attr("id", d => d)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 20)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("fill", "#94a3b8")
                .attr("d", "M0,-5L10,0L0,5");

            const link = mainGroup.append("g")
                .attr("stroke", "#cbd5e1")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(safeLinks)
                .join("line")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#citing)");

            const node = mainGroup.append("g")
                .selectAll("g")
                .data(safeNodes)
                .join("g")
                .call(drag(simulation))
                .on("mouseenter", (event, d) => {
                    tooltip.style("opacity", "1");
                    const meta = d.metadata || {};
                    const color = d.group === 'dissenting' ? '#9333ea' : '#ea580c';

                    const html = `
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:12px;">
                            <div style="width:12px;height:12px;border-radius:50%;background:${color};flex-shrink:0;"></div>
                            <h4 style="font-size:12px;font-weight:bold;color:#0f172a;margin:0;line-height:1.2;">${meta.case_name || d.name}</h4>
                        </div>
                        <div style="font-size:10px;color:#475569;display:flex;flex-direction:column;gap:6px;">
                            <div><strong style="color:#94a3b8;text-transform:uppercase;margin-right:4px;">Date:</strong> ${meta.date || 'N/A'}</div>
                            <div><strong style="color:#94a3b8;text-transform:uppercase;margin-right:4px;">Case No:</strong> <span style="font-family:monospace">${meta.case_no || 'N/A'}</span></div>
                            <div><strong style="color:#94a3b8;text-transform:uppercase;margin-right:4px;">Type:</strong> ${meta.type || 'N/A'}</div>
                            <div><strong style="color:#94a3b8;text-transform:uppercase;margin-right:4px;">Charges:</strong> ${meta.charges || 'N/A'}</div>
                            <div><strong style="color:#94a3b8;text-transform:uppercase;margin-right:4px;">Acts:</strong> ${meta.acts || 'N/A'}</div>
                            <div style="margin-top:8px;padding-top:8px;border-top:1px solid #f1f5f9;">
                                <strong style="color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:4px;">AI Summary:</strong>
                                <i style="color:#64748b;line-height:1.4;">"${meta.judgement || 'No summary available.'}"</i>
                            </div>
                        </div>
                    `;
                    tooltip.html(html);
                })
                .on("mousemove", (event) => {
                    // Position tooltip relative to container to prevent off-screen clipping
                    const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
                    // Safe bounding constraints for the wider 380px tooltip
                    const safeX = Math.min(mouseX + 15, containerRef.current.clientWidth - 400);
                    const safeY = Math.min(mouseY + 15, containerRef.current.clientHeight - 280);

                    tooltip
                        .style("left", safeX + "px")
                        .style("top", safeY + "px");
                })
                .on("mouseleave", () => {
                    tooltip.style("opacity", "0");
                });

            // Shadow/Glow effect
            node.append("circle")
                .attr("r", 12)
                .attr("fill", "white")
                .attr("stroke", d => d.group === 'dissenting' ? "#9333ea" : "#ea580c")
                .attr("stroke-width", 2)
                .style("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.1))");

            node.append("circle")
                .attr("r", 6)
                .attr("fill", d => d.group === 'dissenting' ? "#9333ea" : "#ea580c");

            // Labels with safe navigation
            node.append("text")
                .text(d => {
                    const safeName = d.name || "";
                    return safeName.includes('_') ? safeName.split('_').slice(0, 3).join(' ') : safeName.substring(0, 20);
                })
                .attr("x", 18)
                .attr("y", 4)
                .attr("fill", "#0f172a")
                .style("font-size", "11px")
                .style("font-weight", "600")
                .style("text-shadow", "0 0 4px white")
                .style("pointer-events", "none");

            simulation.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                node
                    .attr("transform", d => `translate(${d.x},${d.y})`);
            });

            function drag(simulation) {
                function dragstarted(event) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    event.subject.fx = event.subject.x;
                    event.subject.fy = event.subject.y;
                }
                function dragged(event) {
                    event.subject.fx = event.x;
                    event.subject.fy = event.y;
                }
                function dragended(event) {
                    if (!event.active) simulation.alphaTarget(0);
                    event.subject.fx = null;
                    event.subject.fy = null;
                }
                return d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
            }

            // Expose a method to reset zoom if needed
            containerRef.current.resetZoom = () => {
                svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
            };

        } catch (err) {
            console.error("D3 Rendering Error:", err);
            setRenderError(err.toString());
        }

    }, [cases, query]);

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 transition-all hover:border-orange-200">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 m-0">Citation Network Analysis</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">Visualizing relationship between legal precedents</p>
                </div>
                {!hasData && !renderError && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 italic animate-pulse">
                        Waiting for case analysis...
                    </div>
                )}
                {renderError && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                        Graph Rendering Failed
                    </div>
                )}
                {hasData && !renderError && (
                    <button
                        onClick={() => containerRef.current?.resetZoom?.()}
                        className="text-[10px] font-bold text-slate-500 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 transition-colors cursor-pointer shadow-sm"
                    >
                        Recenter View
                    </button>
                )}
            </div>

            <div className="relative min-h-[400px] flex items-center justify-center bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                {/* React-managed Error State */}
                {renderError && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                        <div className="text-center p-6 text-red-500 text-xs font-mono bg-red-50 rounded-lg max-w-[80%] break-words">
                            {renderError}
                        </div>
                    </div>
                )}

                {/* React-managed Loading State */}
                {!hasData && !renderError && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                        <div className="text-center">
                            <div className="w-12 h-12 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-xs text-slate-500">Processing citation vectors...</p>
                        </div>
                    </div>
                )}

                {/* Legend Overlay */}
                {hasData && !renderError && (
                    <div className="absolute bottom-4 left-4 z-10 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl p-4 w-64 pointer-events-none">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Node Index</h4>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.4)] ring-2 ring-orange-100 flex-shrink-0"></div>
                                <span className="text-xs text-slate-700 font-semibold">Binding Precedent</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.4)] ring-2 ring-purple-100 flex-shrink-0"></div>
                                <span className="text-xs text-slate-700 font-semibold leading-tight">Dissenting / Distinguished</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pure D3 Container - React NEVER touches its children */}
                <div
                    ref={containerRef}
                    className="w-full h-full relative"
                    style={{ minHeight: '400px', opacity: hasData ? 1 : 0 }}
                ></div>
            </div>
        </div>
    );
}
