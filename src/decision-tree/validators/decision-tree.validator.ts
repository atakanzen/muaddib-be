import { DeepPartial } from "@/lib/common/types/deep-partial";
import { isArray, isBoolean, isNumber, isObject, isString } from "class-validator";
import { RawDecisionTree, RawDecisionTreeNode, DecisionTreeNodeType, RawDecisionTreeEdge, RawDecisionTreeViewport } from "../types/decision-tree.types";

const decisionTreeNodeTypes = Object.values(DecisionTreeNodeType);

export function validateDecisionTree(tree: any): { error: string, validatedTree?: RawDecisionTree } {
    if (!isObject<DeepPartial<RawDecisionTree>>(tree)) {
        return { error: 'Decision tree must be an object' };
    }

    // Output tree structure for stripped data
    const validatedTree: RawDecisionTree = {
        nodes: [],
        edges: [],
        viewport: {
            x: 0,
            y: 0,
            zoom: 0
        }
    };

    // Validate nodes
    const nodeValidation = validateNodes({
        nodes: tree.nodes,
        outputArray: validatedTree.nodes
    });

    if (nodeValidation.nodeIds === undefined) {
        return { error: nodeValidation.error };
    }

    // Validate edges
    const edgeValidation = validateEdges({
        edges: tree.edges,
        nodeIds: nodeValidation.nodeIds,
        outputArray: validatedTree.edges
    });

    if (edgeValidation?.error) {
        return { error: edgeValidation.error };
    }

    // Validate viewport
    const viewportValidation = validateViewport({
        viewport: tree.viewport,
        outputObject: validatedTree.viewport
    });

    if (viewportValidation?.error) {
        return { error: viewportValidation.error }
    }

    return {
        error: '',
        validatedTree: validatedTree
    }
}

// Validates nodes[] in decision tree object
// Returns either an error or a set of node ids
// Pushes the nodes to a outputArray to get rid of invalid data
function validateNodes({ nodes, outputArray }: {
    nodes: any;
    outputArray: RawDecisionTreeNode[];
}): { error: string, nodeIds?: Set<string> } {
    if (!isArray(nodes)) {
        return { error: 'Decision tree "nodes" must be an array' }
    }

    const nodeIds = new Set<string>();

    for (const node of nodes) {
        if (!isObject<DeepPartial<RawDecisionTreeNode>>(node)) {
            return { error: 'Decision tree "nodes" elements must all be objects' }
        }

        // Check id
        if (!isString(node.id)) {
            return { error: '"id" in decision tree "nodes" must be a string' }
        }

        if (nodeIds.has(node.id)) {
            return { error: `Decision tree "nodes" has duplicate id "${node.id}"` }
        }

        nodeIds.add(node.id);

        // Check type
        if (node.type === undefined) {
            return { error: '"type" in decision tree "nodes" must be defined' }
        }

        if (!decisionTreeNodeTypes.some(t => node.type === t)) {
            return { error: `"type" in decision tree "nodes" must equal to one of [${decisionTreeNodeTypes.join(' ')}]` };
        }

        // Check position
        if (node.position === undefined) {
            return { error: '"position" in decision tree "nodes" must be defined' }
        }

        if (!isNumber(node.position.x)) {
            return { error: '"position.x" in decision tree "nodes" must be a number' }
        }

        if (!isNumber(node.position.y)) {
            return { error: '"position.y" in decision tree "nodes" must be a number' }
        }

        // Check measures
        if (node.measured === undefined) {
            return { error: '"measured" in decision tree "nodes" must be defined' }
        }

        if (!isNumber(node.measured.width)) {
            return { error: '"measured.width" in decision tree "nodes" must be a number' }
        }

        if (!isNumber(node.measured.height)) {
            return { error: '"measured.height" in decision tree "nodes" must be a number' }
        }

        outputArray.push({
            id: node.id,
            type: node.type,
            data: node.data ?? {},
            position: node.position as { x: number, y: number },
            measured: node.measured as { width: number, height: number }
        });
    }

    return {
        error: '',
        nodeIds: nodeIds
    };
}

function validateEdges({ edges, nodeIds, outputArray }: {
    edges: any;
    nodeIds: Set<string>;
    outputArray: RawDecisionTreeEdge[];
}) {
    const edgeIds = new Set<string>();

    if (!isArray(edges)) {
        return { error: 'Decision tree "edges" must be an array' }
    }

    for (const edge of edges) {
        if (!isObject<DeepPartial<RawDecisionTreeEdge>>(edge)) {
            return { error: 'Decision tree "edges" elements must all be objects' }
        }

        // Check id
        if (!isString(edge.id)) {
            return { error: '"id" in decision tree "edges" must be a string' }
        }

        if (edgeIds.has(edge.id)) {
            return { error: `Decision tree "edges" has duplicate id "${edge.id}"` }
        }

        edgeIds.add(edge.id);

        // Check source and target
        if (!isString(edge.source)) {
            return { error: '"source" in decision tree "edges" must be a string' }
        }

        if (!nodeIds.has(edge.source)) {
            return { error: `One of the edge sources is "${edge.source}", but no such id is found in nodes` }
        }

        if (!isString(edge.target)) {
            return { error: '"target" in decision tree "edges" must be a string' }
        }

        if (!nodeIds.has(edge.target)) {
            return { error: `One of the edge targets is "${edge.target}", but no such id is found in nodes` }
        }

        if (edge.source === edge.target) {
            return { error: `One of the edges has same source and target "${edge.source}"` }
        }

        if (edge.animated !== undefined && !isBoolean(edge.animated)) {
            return { error: '"animated" in decision tree "edges" must be a boolean or undefined' }
        }

        outputArray.push({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            animated: edge.animated
        });
    }
}

function validateViewport({ viewport, outputObject }: {
    viewport: any;
    outputObject: RawDecisionTreeViewport;
}) {
    if (!isObject<DeepPartial<RawDecisionTreeViewport>>(viewport)) {
        return { error: 'Decision tree "viewport" must be an object' }
    }

    if (!isNumber(viewport.x)) {
        return { error: 'Decision tree "viewport.x" must be a number' }
    }

    if (!isNumber(viewport.y)) {
        return { error: 'Decision tree "viewport.y" must be a number' }
    }

    if (!isNumber(viewport.zoom)) {
        return { error: 'Decision tree "viewport.zoom" must be a number' }
    }

    outputObject.x = viewport.x;
    outputObject.y = viewport.y;
    outputObject.zoom = viewport.zoom;
}
