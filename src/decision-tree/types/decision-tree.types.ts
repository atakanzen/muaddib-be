export type DecisionTree = {
    nodes: DecisionTreeNode[],
    edges: DecisionTreeEdge[],
    viewport: DecisionTreeViewport
};

export type DecisionTreeNode = {
    id: string,
    type: DecisionTreeNodeType,
    data: {},
    position: {
        x: number,
        y: number
    },
    measured: {
        width: number,
        height: number
    }
};

export enum DecisionTreeNodeType {
    decisionNode = 'decisionNode',
    chanceNode = 'chanceNode',
    endpointNode = 'endpointNode'
};

export type DecisionTreeEdge = {
    id: string,
    source: string,
    target: string,
    animated?: boolean
};

export type DecisionTreeViewport = {
    x: number,
    y: number,
    zoom: number
};

