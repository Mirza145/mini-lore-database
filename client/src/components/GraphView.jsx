import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { RELATIONSHIP_TYPE_MAP } from '../constants.js';

const styles = [
  {
    selector: 'node',
    style: {
      'background-color': '#16233f',
      label: 'data(label)',
      color: '#16233f',
      'font-family': 'Inter, system-ui, sans-serif',
      'font-size': 11,
      'font-weight': 600,
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 9,
      'text-wrap': 'wrap',
      'text-max-width': '110px',
      width: 54,
      height: 54,
      'border-width': 3,
      'border-color': '#f8f2e7',
      'overlay-opacity': 0,
    },
  },
  {
    selector: 'node[?center]',
    style: {
      'background-color': '#b3202a',
      'border-color': '#c9942f',
      'border-width': 4,
      width: 72,
      height: 72,
      'font-size': 13,
      'font-weight': 700,
    },
  },
  {
    selector: 'node:active',
    style: {
      'overlay-color': '#c9942f',
      'overlay-opacity': 0.18,
      'overlay-padding': 8,
    },
  },
  {
    selector: 'edge',
    style: {
      width: 2,
      'line-color': 'data(color)',
      'target-arrow-color': 'data(color)',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.9,
      'curve-style': 'bezier',
      label: 'data(label)',
      'font-family': 'Inter, system-ui, sans-serif',
      'font-size': 9.5,
      'font-weight': 600,
      color: '#44506b',
      'text-background-color': '#fdfaf3',
      'text-background-opacity': 1,
      'text-background-padding': '3px',
      'text-background-shape': 'roundrectangle',
      'text-rotation': 'autorotate',
      'overlay-opacity': 0,
    },
  },
  {
    selector: 'edge:selected',
    style: {
      width: 3.5,
      'line-color': '#c9942f',
      'target-arrow-color': '#c9942f',
    },
  },
];

export default function GraphView({ character, relationships, onNodeClick }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !character) return undefined;

    const nodeMap = new Map();
    nodeMap.set(character.id, { id: character.id, label: character.name, center: true });

    relationships.forEach((relationship) => {
      const other =
        relationship.fromCharacter.id === character.id
          ? relationship.toCharacter
          : relationship.fromCharacter;

      if (other && !nodeMap.has(other.id)) {
        nodeMap.set(other.id, { id: other.id, label: other.name, center: false });
      }
    });

    const nodeIds = [...nodeMap.keys()];
    const otherIds = nodeIds.filter((id) => id !== character.id);
    const radius = Math.max(220, otherIds.length * 38);

    const positions = new Map([[character.id, { x: 0, y: 0 }]]);
    otherIds.forEach((id, index) => {
      const angle = (2 * Math.PI * index) / otherIds.length - Math.PI / 2;
      positions.set(id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
    });

    const elements = [
      ...nodeIds.map((id) => {
        const node = nodeMap.get(id);
        return {
          group: 'nodes',
          data: { id: node.id, label: node.label, center: node.center },
          position: positions.get(id),
        };
      }),
      ...relationships
        .filter(
          (relationship) =>
            nodeMap.has(relationship.fromCharacter?.id) &&
            nodeMap.has(relationship.toCharacter?.id),
        )
        .map((relationship) => {
          const type = RELATIONSHIP_TYPE_MAP[relationship.type];
          return {
            group: 'edges',
            data: {
              id: relationship.id,
              source: relationship.fromCharacter.id,
              target: relationship.toCharacter.id,
              label: type?.label ?? relationship.type,
              color: type?.color ?? '#6f7789',
            },
          };
        }),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      layout: { name: 'preset', fit: true, padding: 80 },
      style: styles,
      wheelSensitivity: 0.2,
      minZoom: 0.35,
      maxZoom: 2.2,
      boxSelectionEnabled: false,
    });

    const handleTap = (event) => {
      onNodeClick?.(event.target.id());
    };

    cy.on('tap', 'node', handleTap);

    return () => {
      cy.removeListener('tap', 'node', handleTap);
      cy.destroy();
    };
  }, [character, relationships, onNodeClick]);

  return (
    <div
      ref={containerRef}
      className="h-[520px] w-full sm:h-[580px]"
      role="img"
      aria-label={`Relationship graph for ${character?.name ?? 'the selected character'}`}
    />
  );
}
