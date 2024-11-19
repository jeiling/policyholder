import React, { useState, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  useReactFlow,
} from "react-flow-renderer";
import { Policyholder, RelationshipChartProps } from "./types";

const RelationshipChart: React.FC<RelationshipChartProps> = ({
  policyholder,
  onNodeSelect,
}) => {
  const [selectedNode, setSelectedNode] = useState<Policyholder | null>(
    policyholder
  );
  const { setViewport } = useReactFlow();

  useEffect(() => {
    setSelectedNode(policyholder);
  }, [policyholder]);

  if (!policyholder) return null;

  const createNodesAndEdges = (
    holder: Policyholder,
    x: number = 0,
    y: number = 0
  ) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const addNodeAndEdges = (
      holder: Policyholder,
      x: number,
      y: number,
      parentId?: string
    ) => {
      const nodeId = holder.code;

      let nodeColor = "yellow";
      if (selectedNode && holder.code === selectedNode.code) {
        nodeColor = "orange";
      } else if (parentId) {
        nodeColor = parentId < nodeId ? "lightblue" : "lightgreen";
      }

      nodes.push({
        id: nodeId,
        data: {
          label: (
            <div
              onClick={() => handleNodeClick(holder)}
              className="cursor-pointer font-bold"
            >
              {holder.code}
              <br />
              {holder.name}
            </div>
          ),
        },
        position: { x, y },
        style: {
          background: nodeColor,
          color: "#333",
          borderRadius: "5px",
          padding: "10px",
        },
      });

      if (parentId) {
        edges.push({
          id: `${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          animated: true,
          style: { stroke: parentId < nodeId ? "blue" : "green" },
        });
      }

      if (holder.l) {
        holder.l.forEach((child) => {
          addNodeAndEdges(child, x - 200, y + 100, holder.code);
        });
      }

      if (holder.r) {
        holder.r.forEach((child) => {
          addNodeAndEdges(child, x + 200, y + 100, holder.code);
        });
      }
    };

    addNodeAndEdges(selectedNode || holder, x, y);

    return { nodes, edges };
  };

  const handleNodeClick = (holder: Policyholder) => {
    setSelectedNode(holder);
    onNodeSelect(holder);
    setViewport({
      x: 0,
      y: 0,
      zoom: 1,
    });
  };

  const { nodes, edges } = createNodesAndEdges(selectedNode || policyholder);

  return (
    <div className="h-[600px] w-full border border-gray-300 mt-5">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default RelationshipChart;
