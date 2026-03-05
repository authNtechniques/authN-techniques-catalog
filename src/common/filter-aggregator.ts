import { AuthenticationTechnique, AuthenticationFacets } from './authentication-technique';
import { Authenticator } from './authenticator';

export interface HierarchyNode {
  name: string;
  level: number;
  children: HierarchyNode[];
  path: string[];
}

export interface SelectedTechniqueFilters {
  authenticationFactors: string[];
  facets: { [key: string]: string[] };
}

export interface SelectedAuthenticatorFilters {
  authenticationFactors: string[];
  interactionModes: string[];
  subjectTypes: string[];
  outputModes: string[];
}

export class FilterAggregator {

  // ---------------------------------------------------------------------------
  // Generic hierarchy tree builder
  // ---------------------------------------------------------------------------

  public static buildTree(paths: string[][]): HierarchyNode[] {
    const rootNodes = new Map<string, HierarchyNode>();

    paths.forEach((path) => {
      if (!path || path.length === 0) {
          return;

      }
      path.forEach((name, index) => {
        const currentPath = path.slice(0, index + 1);

        if (index === 0) {
          if (!rootNodes.has(name)) {
            rootNodes.set(name, { name, level: 0, children: [], path: [name] });
          }
        } else {
          const parent = this.findNodeByPath(Array.from(rootNodes.values()), currentPath.slice(0, -1));
          if (parent) {
            const existingChild = parent.children.find((c) => c.name === name);
            if (!existingChild) {
              parent.children.push({ name, level: index, children: [], path: [...currentPath] });
            }
          }
        }
      });
    });

    const sortTree = (nodes: HierarchyNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((node) => sortTree(node.children));
    };

    const result = Array.from(rootNodes.values());
    sortTree(result);
    return result;
  }

  public static buildAuthenticationFactorTree(authenticators: Authenticator[]): HierarchyNode[] {
    const paths = authenticators
      .filter((a) => a.authenticationFactor && a.authenticationFactor.length > 0)
      .map((a) => a.authenticationFactor!);
    return this.buildTree(paths);
  }

  public static buildAuthenticatorEmploymentTree(techniques: AuthenticationTechnique[]): HierarchyNode[] {
    const paths = techniques
      .filter((t) =>
          t.facets && Array.isArray(t.facets.authenticatorEmployment) && t.facets.authenticatorEmployment.length > 0)
      .map((t) => (t.facets!.authenticatorEmployment as string[]).filter((p) => p && p.trim() !== ''));

    return this.buildTree(paths.filter((p) => p.length > 0));
  }

  public static findNodeByPath(nodes: HierarchyNode[], path: string[]): HierarchyNode | null {
    if (path.length === 0) {
        return null;
    }
    const node = nodes.find((n) => n.name === path[0]);
    if (!node) {
        return null;
    }
    if (path.length === 1) {
        return node;
    }
    return this.findNodeByPath(node.children, path.slice(1));
  }

  public static getDescendants(tree: HierarchyNode[], name: string): string[] {
    const descendants: string[] = [];
    const traverse = (nodes: HierarchyNode[]): boolean => {
      for (const node of nodes) {
        if (node.name === name) {
          const collectAll = (n: HierarchyNode) => {
            descendants.push(n.name);
            n.children.forEach(collectAll);
          };
          collectAll(node);
          return true;
        }
        if (traverse(node.children)) {
            return true;
        }
      }
      return false;
    };
    traverse(tree);
    return descendants;
  }

  public static getLeafDescendants(node: HierarchyNode): string[] {
    const leaves: string[] = [];
    const traverse = (n: HierarchyNode) => {
      if (n.children.length === 0) {
        leaves.push(n.name);
      } else {
        n.children.forEach(traverse);
      }
    };
    traverse(node);
    return leaves;
  }

  public static isNodeIndeterminate(node: HierarchyNode, selectedItems: string[]): boolean {
    if (selectedItems.includes(node.name)) {
        return false;
    }
    if (node.children.length === 0) {
        return false;
    }
    const leaves = this.getLeafDescendants(node);
    if (leaves.length === 0) {
        return false;
    }
    const selectedCount = leaves.filter((l) => selectedItems.includes(l)).length;
    return selectedCount > 0 && selectedCount < leaves.length;
  }

  public static areAllDescendantsSelected(node: HierarchyNode, selectedItems: string[]): boolean {
      const leaves = this.getLeafDescendants(node);
      if (leaves.length === 0) {
          return false;
      }
      return leaves.every((l) => selectedItems.includes(l));
  }

  // ---------------------------------------------------------------------------
  // Technique filtering
  // ---------------------------------------------------------------------------

  public static matchesTechniqueByFactor(
    technique: AuthenticationTechnique,
    selectedFactors: string[],
    allAuthenticators: Authenticator[],
    factorTree: HierarchyNode[],
  ): boolean {
    if (!technique.authenticators || technique.authenticators.length === 0) {
        return false;
    }
    return selectedFactors.some((selectedFactor) => {
      const descendants = new Set(this.getDescendants(factorTree, selectedFactor));
      return technique.authenticators!.some((authName) => {
        const auth = allAuthenticators.find((a) => a.name === authName);
        if (!auth || !auth.authenticationFactor) {
            return false;
        }
        return auth.authenticationFactor.some((f) => descendants.has(f));
      });
    });
  }

  public static getFacetValues(
      techniques: AuthenticationTechnique[],
      facetKey: keyof AuthenticationFacets,
  ): string[] {
      const valueSet = new Set<string>();

      techniques.forEach((t) => {
          if (!t.facets) {
              return;
          }

          const value = t.facets[facetKey];
          if (!value) {
              return;
          }

          const values = Array.isArray(value) ? value : [value];

          values
              .filter((v) => v && v.trim() !== '')
              .forEach((v) => valueSet.add(v));
      });

      return Array.from(valueSet).sort();
    }

  public static getAllFacetOptions(techniques: AuthenticationTechnique[]): Map<string, string[]> {
    const facetKeys: Array<keyof AuthenticationFacets> = [
      'authenticatorEmployment', 'sessionTrustContribution', 'subjectInteraction', 'locality', 'factor',
      'privacyPreservation', 'revocability', 'contextAwareness', 'uniqueness',
      'directionality', 'subjectType',
    ];
    const optionsMap = new Map<string, string[]>();
    facetKeys.forEach((key) => {
      const values = this.getFacetValues(techniques, key);
      if (values.length > 0) {
          optionsMap.set(key, values);
      }
    });
    return optionsMap;
  }

  // ---------------------------------------------------------------------------
  // Authenticator filtering
  // ---------------------------------------------------------------------------

  public static matchesAuthenticatorByFactor(
    authenticator: Authenticator,
    selectedFactors: string[],
    factorTree: HierarchyNode[],
  ): boolean {
    if (!authenticator.authenticationFactor || authenticator.authenticationFactor.length === 0) {
        return false;
    }
    return selectedFactors.some((selected) => {
      const descendants = new Set(this.getDescendants(factorTree, selected));
      return authenticator.authenticationFactor!.some((f) => descendants.has(f));
    });
  }

  public static getAuthenticatorFieldValues(authenticators: Authenticator[], field: keyof Authenticator): string[] {
    const valueSet = new Set<string>();
    authenticators.forEach((a) => {
      const val = a[field];
      if (Array.isArray(val)) {
        (val as string[]).forEach((v: string) => { if (v && v.trim()) {
            valueSet.add(v);
            }
        });
      } else if (typeof val === 'string' && val.trim()) {
        valueSet.add(val);
      }
    });
    return Array.from(valueSet).sort();
  }

  // ---------------------------------------------------------------------------
  // Shared utilities
  // ---------------------------------------------------------------------------

  public static formatFacetName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
