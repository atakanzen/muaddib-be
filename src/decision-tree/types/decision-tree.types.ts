export type RawDecisionTree = {
    nodes: RawDecisionTreeNode[],
    edges: RawDecisionTreeEdge[],
    viewport: RawDecisionTreeViewport
};

export type RawDecisionTreeNode = {
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

export type RawDecisionTreeEdge = {
    id: string,
    source: string,
    target: string,
    animated?: boolean
};

export type RawDecisionTreeViewport = {
    x: number,
    y: number,
    zoom: number
};

