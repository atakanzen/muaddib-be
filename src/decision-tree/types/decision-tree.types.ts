export type RawDecisionTree = {
    nodes: RawDecisionTreeNode[];
    edges: RawDecisionTreeEdge[];
    viewport: RawDecisionTreeViewport;
};

export type RawDecisionTreeNode = {
    id: string;
    type: DecisionTreeNodeType;
    data: Record<string, unknown>;
    position: {
        x: number;
        y: number;
    };
    measured: {
        width: number;
        height: number;
    };
};

export enum DecisionTreeNodeType {
    decisionNode = 'decisionNode',
    chanceNode = 'chanceNode',
    endpointNode = 'endpointNode',
    textNode = 'textNode',
}

export enum DecisionTreeEdgeType {
    decisionEdge = 'decisionEdge',
    chanceToEndpointEdge = 'chanceToEndpointEdge',
    chanceToChanceEdge = 'chanceToChanceEdge',
}

export type RawDecisionTreeEdge = {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
    data?: Record<string, unknown>;
};

export type RawDecisionTreeViewport = {
    x: number;
    y: number;
    zoom: number;
};
