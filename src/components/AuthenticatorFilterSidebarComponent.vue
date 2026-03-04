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

        <!-- Authentication Factor -->
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
                @toggle="toggleFactor"
              />
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>

        <!-- Interaction Mode -->
        <v-expansion-panel-content v-if="interactionModeValues.length > 0">
          <template v-slot:header>
            <div class="filter-section-header">
              <span class="font-weight-medium">Interaction Mode</span>
            </div>
          </template>
          <v-card>
            <v-card-text>
              <v-checkbox
                v-for="value in interactionModeValues"
                :key="value"
                v-model="selectedFilters.interactionModes"
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

        <!-- Subject Type -->
        <v-expansion-panel-content v-if="subjectTypeValues.length > 0">
          <template v-slot:header>
            <div class="filter-section-header">
              <span class="font-weight-medium">Subject Type</span>
            </div>
          </template>
          <v-card>
            <v-card-text>
              <v-checkbox
                v-for="value in subjectTypeValues"
                :key="value"
                v-model="selectedFilters.subjectTypes"
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

        <!-- Output Mode -->
        <v-expansion-panel-content v-if="outputModeValues.length > 0">
          <template v-slot:header>
            <div class="filter-section-header">
              <span class="font-weight-medium">Output Mode</span>
            </div>
          </template>
          <v-card>
            <v-card-text>
              <v-checkbox
                v-for="value in outputModeValues"
                :key="value"
                v-model="selectedFilters.outputModes"
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
import { Authenticator } from '@/common/authenticator';
import { FilterAggregator, HierarchyNode, SelectedAuthenticatorFilters } from '@/common/filter-aggregator';
import HierarchyTreeItemComponent from './HierarchyTreeItemComponent.vue';

@Component({
  components: {
    HierarchyTreeItemComponent,
  },
})
export default class AuthenticatorFilterSidebarComponent extends Vue {
  @Prop({ type: Boolean, default: false })
  public visible!: boolean;

  @Prop({ type: Array, required: true })
  public authenticators!: Authenticator[];

  private drawerVisible: boolean = false;
  private expandedPanels: boolean[] = [];

  private selectedFilters: SelectedAuthenticatorFilters = {
    authenticationFactors: [],
    interactionModes: [],
    subjectTypes: [],
    outputModes: [],
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
    return FilterAggregator.buildAuthenticationFactorTree(this.authenticators);
  }

  get interactionModeValues(): string[] {
    return FilterAggregator.getAuthenticatorFieldValues(this.authenticators, 'interactionMode');
  }

  get subjectTypeValues(): string[] {
    return FilterAggregator.getAuthenticatorFieldValues(this.authenticators, 'subjectType');
  }

  get outputModeValues(): string[] {
    return FilterAggregator.getAuthenticatorFieldValues(this.authenticators, 'outputMode');
  }

  public toggleFactor(name: string) {
    const index = this.selectedFilters.authenticationFactors.indexOf(name);
    if (index > -1) {
      this.selectedFilters.authenticationFactors.splice(index, 1);
    } else {
      this.selectedFilters.authenticationFactors.push(name);
    }
    this.onFilterChange();
  }

  get hasActiveFilters(): boolean {
    return (
      this.selectedFilters.authenticationFactors.length > 0 ||
      this.selectedFilters.interactionModes.length > 0 ||
      this.selectedFilters.subjectTypes.length > 0 ||
      this.selectedFilters.outputModes.length > 0
    );
  }

  public mounted() {
    this.drawerVisible = this.visible;
  }

  public onFilterChange() {
    this.$emit('filter-change', this.selectedFilters);
  }

  public clearAllFilters() {
    this.selectedFilters = {
      authenticationFactors: [],
      interactionModes: [],
      subjectTypes: [],
      outputModes: [],
    };
    this.onFilterChange();
  }

  public closeDrawer() {
    this.drawerVisible = false;
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
