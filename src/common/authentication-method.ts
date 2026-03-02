export class AuthenticationMethod {
    public name?: string;
    public aliases?: string[];
    public description?: string;
    public requirements?: string;
    public authenticator?: Authenticator;
    public facets?: AuthenticationFacets;
    public sources?: string[];
    public tags?: string[];
    public relatedItems?: RelatedItem[];
    public relatedMethods?: RelatedAuthenticationMethod[];

    constructor(name?: string, aliases?: string[], description?: string, requirements?: string,
                authenticator?: Authenticator, facets?: AuthenticationFacets, sources?: string[], tags?: string[],
                relatedItems?: RelatedItem[]) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.requirements = requirements;
        this.authenticator = authenticator;
        this.facets = facets;
        this.sources = sources;
        this.tags = tags;
        this.relatedItems = relatedItems;
    }
}

export interface Authenticator {
    name: string;
    class: string[];
}

export interface AuthenticationFacets {
    sessionTrustContribution?: string;
    interaction?: string;
    locality?: string;
    variability?: string;
    privacyPreservation?: string;
    revocability?: string;
    contextAwareness?: string;
    uniqueness?: string;
    directionality?: string;
    subjectType?: string;
}

export interface RelatedItem {
    relation: string;
    name: string;
}

export interface RelatedAuthenticationMethod {
    relation: string;
    name: string;
    description: string;
}
