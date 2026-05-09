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

            // Build nodes
            const safeNodes = [
                { id: 'query_node', name: 'USER QUERY', group: 'query', metadata: { type: 'Query', judgement: query, case_name: 'USER QUERY' } }
            ];
            
            // Map for easy lookup of nodes by filename
            const filenameToNodeId = {};

            cases.forEach((c, idx) => {
                const nodeId = `case_${idx}`;
                const fname = c.filename || `case_${idx}`;
                filenameToNodeId[fname.toLowerCase()] = nodeId;
                
                let group = 'approved';
                if (c.verdict === 'Dissenting') group = 'dissenting';
                if (c.verdict === 'Rejected') group = 'rejected';
                
                safeNodes.push({
                    id: nodeId,
                    name: fname.replace(/\.(json|pdf|PDF)$/i, '').replace(/_/g, ' '),
                    group: group,
                    metadata: {
                        case_name: fname.replace(/\.(json|pdf|PDF)$/i, '').replace(/_/g, ' '),
                        type: c.verdict || 'Unknown',
                        judgement: c.holding || 'No holding available.',
                        acts: `Confidence: ${c.confidence_score || 0}%`,
                        charges: c.ratio_decidendi || 'No ratio decidendi.',
                        relevance: c.relevance_to_query || 'Matching legal intent.'
                    }
                });
            });

            // Build links
            const safeLinks = [];
            
            cases.forEach((c, idx) => {
                const nodeId = `case_${idx}`;
                
                // 1. Link to Query (the "Why")
                safeLinks.push({
                    source: nodeId,
                    target: 'query_node',
                    type: 'relevance',
                    label: c.relevance_to_query || 'Semantic match'
                });

                // 2. Lateral Links (the "How they relate")
                if (c.cited_precedents && Array.isArray(c.cited_precedents)) {
                    c.cited_precedents.forEach(precedent => {
                        const lowerP = precedent.toLowerCase();
                        // Check if the cited precedent is one of the other cases in our result set
                        for (const [fname, targetId] of Object.entries(filenameToNodeId)) {
                            if (fname.includes(lowerP) || lowerP.includes(fname)) {
                                if (targetId !== nodeId) { // Avoid self-citation
                                    safeLinks.push({
                                        source: nodeId,
                                        target: targetId,
                                        type: 'citation',
                                        label: 'Cited as precedent'
                                    });
                                }
                            }
                        }
                    });
                }
            });

            setHasData(true);
            setRenderError(null);

            const width = 800;
            const height = 450;

            const container = d3.select(containerRef.current);
            container.selectAll("*").remove();

            const svg = container.append("svg")
                .attr("viewBox", [0, 0, width, height])
                .style("width", "100%")
                .style("height", "450px")
                .style("display", "block")
                .style("cursor", "grab");

            const mainGroup = svg.append("g");

            const zoom = d3.zoom()
                .scaleExtent([0.3, 3])
                .on("zoom", (event) => {
                    mainGroup.attr("transform", event.transform);
                });
            svg.call(zoom);

            // Tooltip
            const tooltip = container.append("div")
                .style("position", "absolute")
                .style("background", "white")
                .style("border", "1px solid #e2e8f0")
                .style("border-radius", "1rem")
                .style("box-shadow", "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)")
                .style("padding", "1.25rem")
                .style("width", "380px")
                .style("max-height", "320px")
                .style("overflow-y", "auto")
                .style("z-index", "50")
                .style("opacity", "0")
                .style("pointer-events", "none")
                .style("font-family", "Inter, sans-serif")
                .style("transition", "opacity 0.2s");

            const simulation = d3.forceSimulation(safeNodes)
                .force("link", d3.forceLink(safeLinks).id(d => d.id).distance(d => d.type === 'relevance' ? 180 : 120))
                .force("charge", d3.forceManyBody().strength(-800))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("collision", d3.forceCollide().radius(60));

            // Markers for arrows
            const defs = mainGroup.append("defs");
            
            defs.append("marker")
                .attr("id", "arrow-relevance")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 25)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("fill", "#f97316")
                .attr("d", "M0,-5L10,0L0,5");

            defs.append("marker")
                .attr("id", "arrow-citation")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 25)
                .attr("refY", 0)
                .attr("markerWidth", 5)
                .attr("markerHeight", 5)
                .attr("orient", "auto")
                .append("path")
                .attr("fill", "#3b82f6")
                .attr("d", "M0,-5L10,0L0,5");

            // Draw Links
            const linkGroup = mainGroup.append("g");
            
            const link = linkGroup.selectAll(".link")
                .data(safeLinks)
                .join("g")
                .attr("class", "link-container");

            const linkLine = link.append("line")
                .attr("stroke", d => d.type === 'relevance' ? "#fdba74" : "#93c5fd")
                .attr("stroke-opacity", 0.6)
                .attr("stroke-width", d => d.type === 'relevance' ? 2 : 1.5)
                .attr("stroke-dasharray", d => d.type === 'citation' ? "4,4" : "0")
                .attr("marker-end", d => d.type === 'relevance' ? "url(#arrow-relevance)" : "url(#arrow-citation)")
                .style("cursor", "pointer")
                .on("mouseenter", function(event, d) {
                    d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", d.type === 'relevance' ? 4 : 3);
                    tooltip.style("opacity", "1");
                    const html = `
                        <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Relationship</div>
                        <div style="font-size:14px; font-weight:600; color:#0f172a; margin-bottom:8px;">${d.label}</div>
                        <div style="font-size:11px; color:#475569; line-height:1.5; font-style:italic;">
                            ${d.type === 'relevance' ? 'This case was selected because it specifically addresses the legal concepts in your query.' : 'Case A directly cites Case B as a foundational legal precedent.'}
                        </div>
                    `;
                    tooltip.html(html);
                })
                .on("mousemove", (event) => {
                    const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
                    tooltip.style("left", (mouseX + 15) + "px").style("top", (mouseY + 15) + "px");
                })
                .on("mouseleave", function() {
                    d3.select(this).attr("stroke-opacity", 0.6).attr("stroke-width", d => d.type === 'relevance' ? 2 : 1.5);
                    tooltip.style("opacity", "0");
                });

            // Draw Nodes
            const node = mainGroup.append("g")
                .selectAll("g")
                .data(safeNodes)
                .join("g")
                .call(drag(simulation))
                .on("mouseenter", (event, d) => {
                    if (d.id === 'query_node') return;
                    tooltip.style("opacity", "1");
                    const meta = d.metadata || {};
                    const color = d.group === 'dissenting' ? '#9333ea' : '#ea580c';

                    const html = `
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:12px;">
                            <div style="width:14px;height:14px;border-radius:4px;background:${color};flex-shrink:0;"></div>
                            <h4 style="font-size:14px;font-weight:bold;color:#0f172a;margin:0;line-height:1.2;">${meta.case_name}</h4>
                        </div>
                        <div style="font-size:11px;color:#475569;display:flex;flex-direction:column;gap:8px;">
                            <div style="background:#fff7ed; padding:8px; border-radius:8px; border:1px solid #ffedd5;">
                                <strong style="color:#c2410c;text-transform:uppercase;font-size:9px;display:block;margin-bottom:2px;">Selection Reason</strong>
                                <span style="color:#9a3412; font-weight:500;">${meta.relevance}</span>
                            </div>
                            <div><strong style="color:#94a3b8;text-transform:uppercase;margin-right:4px;">Type:</strong> ${meta.type}</div>
                            <div><strong style="color:#94a3b8;text-transform:uppercase;margin-right:4px;">Stats:</strong> ${meta.acts}</div>
                            <div style="margin-top:4px;padding-top:8px;border-top:1px solid #f1f5f9;">
                                <strong style="color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:4px;">Legal Ratio:</strong>
                                <i style="color:#64748b;line-height:1.5;">"${meta.judgement}"</i>
                            </div>
                        </div>
                    `;
                    tooltip.html(html);
                })
                .on("mousemove", (event) => {
                    const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
                    const safeX = Math.min(mouseX + 15, containerRef.current.clientWidth - 400);
                    const safeY = Math.min(mouseY + 15, containerRef.current.clientHeight - 320);
                    tooltip.style("left", safeX + "px").style("top", safeY + "px");
                })
                .on("mouseleave", () => {
                    tooltip.style("opacity", "0");
                });

            // Node visual
            node.append("circle")
                .attr("r", d => d.id === 'query_node' ? 18 : 14)
                .attr("fill", d => d.id === 'query_node' ? "#1e293b" : "white")
                .attr("stroke", d => d.id === 'query_node' ? "#334155" : (d.group === 'dissenting' ? "#9333ea" : "#ea580c"))
                .attr("stroke-width", d => d.id === 'query_node' ? 4 : 2)
                .style("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.1))");

            node.filter(d => d.id !== 'query_node').append("circle")
                .attr("r", 6)
                .attr("fill", d => d.group === 'dissenting' ? "#9333ea" : "#ea580c");

            node.filter(d => d.id === 'query_node').append("text")
                .text("?")
                .attr("text-anchor", "middle")
                .attr("dy", ".35em")
                .attr("fill", "white")
                .style("font-size", "14px")
                .style("font-weight", "bold");

            // Labels
            node.append("text")
                .text(d => d.id === 'query_node' ? "QUERY" : d.name)
                .attr("x", d => d.id === 'query_node' ? 0 : 22)
                .attr("y", d => d.id === 'query_node' ? 30 : 4)
                .attr("text-anchor", d => d.id === 'query_node' ? "middle" : "start")
                .attr("fill", "#334155")
                .style("font-size", "10px")
                .style("font-weight", "700")
                .style("text-transform", "uppercase")
                .style("pointer-events", "none");

            simulation.on("tick", () => {
                linkLine
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                node.attr("transform", d => `translate(${d.x},${d.y})`);
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

            containerRef.current.resetZoom = () => {
                svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
            };

        } catch (err) {
            console.error("D3 Rendering Error:", err);
            setRenderError(err.toString());
        }

    }, [cases, query]);

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 transition-all hover:border-orange-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xs uppercase tracking-widest font-black text-slate-400 m-0">Relational Intelligence Map</h3>
                    <p className="text-xs text-slate-500 mt-1 font-serif">Mapping the connections and selection logic between precedents</p>
                </div>
                {hasData && !renderError && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => containerRef.current?.resetZoom?.()}
                            className="text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
                        >
                            Recenter View
                        </button>
                    </div>
                )}
            </div>

            <div className="relative min-h-[450px] flex items-center justify-center bg-slate-50/50 rounded-[2rem] border border-slate-100 overflow-hidden">
                {renderError && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="text-center p-6 text-red-500 text-xs font-mono bg-red-50 rounded-2xl max-w-[80%] border border-red-100">
                            {renderError}
                        </div>
                    </div>
                )}

                {!hasData && !renderError && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating Relational Map...</p>
                        </div>
                    </div>
                )}

                {hasData && !renderError && (
                    <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-5 w-72 pointer-events-none">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Network Key</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <span className="text-[11px] text-slate-600 font-bold uppercase">Direct Relevance</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span className="text-[11px] text-slate-600 font-bold uppercase">Inter-Case Citation</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-[9px] text-slate-400 italic leading-relaxed">
                                    Hover over nodes to see **Why** they were selected. Hover over lines to see **How** they relate.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div
                    ref={containerRef}
                    className="w-full h-full relative"
                    style={{ minHeight: '450px', opacity: hasData ? 1 : 0 }}
                ></div>
            </div>
        </div>
    );
}
