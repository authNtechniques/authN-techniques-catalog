<template>
  <v-navigation-drawer
    v-model="drawerVisible"
    :temporary="$vuetify.breakpoint.smAndDown"
    fixed
    class="filter-sidebar"
    width="300"
    :style="{ top: '112px', height: 'calc(100vh - 112px)' }"
  >
    <v-toolbar flat class="sidebar-header">
      <v-toolbar-title>Filters</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        @click="clearAllFilters"
        :disabled="!hasActiveFilters"
        title="Clear all filters"
      >
        <v-icon small>undo</v-icon>
      </v-btn>
      <v-btn v-if="$vuetify.breakpoint.smAndDown" icon @click="closeDrawer">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <div class="filter-content">
      <v-expansion-panel v-model="expandedPanels" expand>

        <!-- Authentication Factor Filter (cross-references authenticators) -->
        <v-expansion-panel-content v-if="authenticationFactorTree.length > 0">
          <template v-slot:header>
            <div class="filter-section-header">
              <span class="font-weight-medium">Authentication Factor</span>
            </div>
          </template>
          <v-card>
            <v-card-text>
              <hierarchy-tree-item-component
                v-for="node in authenticationFactorTree"
                :key="node.name"
                :node="node"
                :selected-items="selectedFilters.authenticationFactors"
                @toggle="toggleAuthenticationFactorNode"
              />
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>

        <!-- Facet: Authenticator Employment (hierarchical) -->
        <v-expansion-panel-content v-if="authenticatorEmploymentTree.length > 0">
          <template v-slot:header>
            <div class="filter-section-header">
              <span class="font-weight-medium">{{ formatFacetName('authenticatorEmployment') }}</span>
            </div>
          </template>
          <v-card>
            <v-card-text>
              <hierarchy-tree-item-component
                v-for="node in authenticatorEmploymentTree"
                :key="node.name"
                :node="node"
                :selected-items="selectedFilters.facets['authenticatorEmployment']"
                @toggle="toggleAuthenticatorEmploymentNode"
              />
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>

        <!-- Facet Filters (flat; skip authenticatorEmployment because it is rendered as a tree above) -->
        <v-expansion-panel-content
          v-for="[facetKey, facetValues] in availableFacets"
          :key="facetKey"
          v-if="facetKey !== 'authenticatorEmployment'"
        >
          <template v-slot:header>
            <div class="filter-section-header">
              <span class="font-weight-medium">{{ formatFacetName(facetKey) }}</span>
            </div>
          </template>
          <v-card>
            <v-card-text>
              <v-checkbox
                v-for="value in facetValues"
                :key="value"
                v-model="selectedFilters.facets[facetKey]"
                :label="value"
                :value="value"
                color="primary"
                hide-details
                class="filter-checkbox"
                @change="onFilterChange"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>

      </v-expansion-panel>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { AuthenticationTechnique, AuthenticationFacets } from '@/common/authentication-technique';
import { Authenticator } from '@/common/authenticator';
import { FilterAggregator, HierarchyNode, SelectedTechniqueFilters } from '@/common/filter-aggregator';
import HierarchyTreeItemComponent from './HierarchyTreeItemComponent.vue';

@Component({
  components: {
    HierarchyTreeItemComponent,
  },
})
export default class FilterSidebarComponent extends Vue {
  @Prop({ type: Boolean, default: false })
  public visible!: boolean;

  @Prop({ type: Array, required: true })
  public authTechniques!: AuthenticationTechnique[];

  @Prop({ type: Array, default: () => [] })
  public allAuthenticators!: Authenticator[];

  private drawerVisible: boolean = false;
  private expandedPanels: boolean[] = [];

  private selectedFilters: SelectedTechniqueFilters = {
    authenticationFactors: [],
    facets: {},
  };

  @Watch('visible')
  public onVisibleChange(newVal: boolean) {
    this.drawerVisible = newVal;
  }

  @Watch('drawerVisible')
  public onDrawerVisibleChange(newVal: boolean) {
    this.$emit('update:visible', newVal);
  }

  get authenticationFactorTree(): HierarchyNode[] {
    return FilterAggregator.buildAuthenticationFactorTree(this.allAuthenticators);
  }

  get authenticatorEmploymentTree(): HierarchyNode[] {
    return FilterAggregator.buildAuthenticatorEmploymentTree(this.authTechniques);
  }

  get availableFacets(): Map<string, string[]> {
    return FilterAggregator.getAllFacetOptions(this.authTechniques);
  }

  public toggleAuthenticationFactorNode(node: HierarchyNode) {
    this.toggleAuthenticationFactor(node.name);
  }

  public toggleAuthenticationFactor(name: string) {
    const index = this.selectedFilters.authenticationFactors.indexOf(name);
    if (index > -1) {
      this.selectedFilters.authenticationFactors.splice(index, 1);
    } else {
      this.selectedFilters.authenticationFactors.push(name);
    }
    this.onFilterChange();
  }

  public toggleAuthenticatorEmploymentNode(node: HierarchyNode) {
    const key = 'authenticatorEmployment';
    const selected: string[] = this.selectedFilters.facets[key] || [];
    const index = selected.indexOf(node.name);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(node.name);
    }

    this.selectedFilters.facets[key] = selected;
    this.onFilterChange();
  }

  get hasActiveFilters(): boolean {
    if (this.selectedFilters.authenticationFactors.length > 0) {
      return true;
    }
    for (const key in this.selectedFilters.facets) {
      if (this.selectedFilters.facets[key] && this.selectedFilters.facets[key].length > 0) {
        return true;
      }
    }
    return false;
  }

  public mounted() {
    this.drawerVisible = this.visible;
    this.initializeFacetFilters();
  }

  public formatFacetName(key: string): string {
    return FilterAggregator.formatFacetName(key);
  }

  public onFilterChange() {
    this.$emit('filter-change', this.selectedFilters);
  }

  public clearAllFilters() {
    this.selectedFilters.authenticationFactors = [];
    for (const key of Object.keys(this.selectedFilters.facets)) {
      this.selectedFilters.facets[key] = [];
    }
    this.onFilterChange();
  }

  public closeDrawer() {
    this.drawerVisible = false;
  }

  private initializeFacetFilters() {
    const facetKeys: Array<keyof AuthenticationFacets> = [
      'authenticatorEmployment', 'factor', 'contextuality', 'sessionTrustContribution', 'subject', 'subjectInteraction',
      'directionality', 'locality', 'privacyPreservation', 'revocability',  'uniqueness',
    ];
    facetKeys.forEach((key) => {
      this.$set(this.selectedFilters.facets, key, []);
    });
  }
}
</script>

<style scoped>
.filter-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.sidebar-header {
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.filter-content {
  overflow-y: auto;
  height: calc(100vh - 176px);
  background-color: white;
}

.filter-section-header {
  display: flex;
  align-items: center;
  width: 100%;
}

.filter-checkbox {
  margin-top: 4px;
  margin-bottom: 4px;
}

.filter-checkbox >>> .v-input--selection-controls__input {
  margin-right: 8px;
}

.filter-checkbox >>> .v-label {
  font-size: 14px;
}
</style>
