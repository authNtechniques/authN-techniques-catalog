export class Authenticator {
    public name?: string;
    public description?: string;
    public authenticationFactor?: string[];
    public interactionMode?: string[];
    public subjectType?: string[];
    public outputMode?: string;
    public sources?: string[];

    constructor(name?: string, description?: string, authenticationFactor?: string[],
                interactionMode?: string[], subjectType?: string[], outputMode?: string,
                sources?: string[]) {
        this.name = name;
        this.description = description;
        this.authenticationFactor = authenticationFactor;
        this.interactionMode = interactionMode;
        this.subjectType = subjectType;
        this.outputMode = outputMode;
        this.sources = sources;
    }
}

export const AUTHENTICATION_FACTOR_TREE: AuthenticationFactorNode[] = [
    {
        name: 'inherence-based',
        children: [
            { name: 'behavioural', children: [] },
            { name: 'physiological', children: [] },
        ],
    },
    {
        name: 'knowledge-based',
        children: [
            { name: 'associative', children: [] },
            { name: 'free-recall', children: [] },
        ],
    },
    {
        name: 'possession-based',
        children: [
            { name: 'physical', children: [] },
            { name: 'digital', children: [] },
        ],
    },
];

export interface AuthenticationFactorNode {
    name: string;
    children: AuthenticationFactorNode[];
}
