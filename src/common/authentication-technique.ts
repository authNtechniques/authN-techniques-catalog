export class AuthenticationTechnique {
    public name?: string;
    public aliases?: string[];
    public description?: string;
    public requirements?: string;
    public authenticators?: string[];
    public facets?: AuthenticationFacets;
    public sources?: string[];
    public tags?: string[];
    public relatedItems?: RelatedItem[];
    public relatedMethods?: RelatedAuthenticationTechnique[];

    constructor(name?: string, aliases?: string[], description?: string, requirements?: string,
                authenticators?: string[], facets?: AuthenticationFacets, sources?: string[], tags?: string[],
                relatedItems?: RelatedItem[]) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.requirements = requirements;
        this.authenticators = authenticators;
        this.facets = facets;
        this.sources = sources;
        this.tags = tags;
        this.relatedItems = relatedItems;
    }
}

export interface AuthenticationFacets {
    authenticatorEmployment?: string[];
    factor?: string;
    contextuality?: string[];
    sessionTrustContribution?: string[];
    subject?: string[];
    subjectInteraction?: string[];
    directionality?: string;
    locality?: string;
    privacyPreservation?: string;
    revocability?: string;
    uniqueness?: string;
}

export interface RelatedItem {
    relation: string;
    name: string;
}

export interface RelatedAuthenticationTechnique {
    relation: string;
    name: string;
    description: string;
}
