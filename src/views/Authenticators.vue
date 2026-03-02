<template>
  <div class="authenticators-view">
    <v-toolbar class="primary" app dark :extended="$vuetify.breakpoint.xs">
      <v-btn icon @click="toggleSidebar" class="hidden-md-and-up">
        <v-icon>filter_list</v-icon>
      </v-btn>
      <span class="title ml-1 mr-1 hidden-md-and-down">Authenticators</span>
      <v-text-field
        class="ml-1 mr-1"
        solo-inverted
        flat
        clearable
        hide-details
        label="Search"
        prepend-inner-icon="search"
        v-model="searchTerm"
        @keydown.esc="clearSearch()"
      ></v-text-field>
      <v-flex class="mr-2" xs12 sm4 md2 lg2 lx2 :slot="slot">
        <v-select
          v-model="sorting"
          style="padding: 0;"
          success
          label="Sorting"
          :items="sortingItems"
          item-text="name"
          item-value="value"
          prepend-icon="sort"
          single-line
          attach
          hide-details
        ></v-select>
      </v-flex>
      <v-chip
        class="title ml-1 mr-1"
        :slot="slot"
        outline
        text-color="white"
      >{{authenticators.length}}/{{authenticatorsAll.length}}</v-chip>
      <v-spacer class="hidden-md-and-down"></v-spacer>
      <v-btn
        v-if="repoUrl"
        icon
        :href="repoUrl"
        target="_blank"
        rel="noopener"
      >
        <font-awesome-icon size="2x" :icon="['fab', 'gitlab']"></font-awesome-icon>
      </v-btn>
    </v-toolbar>
    <authenticator-filter-sidebar-component
      :visible.sync="sidebarVisible"
      :authenticators="authenticatorsAll"
      @filter-change="onFilterChange"
    />
    <v-content :class="{ 'sidebar-offset': sidebarVisible && $vuetify.breakpoint.mdAndUp }">
      <authenticators-container-component
        :sorting="sorting"
        :authenticators="authenticators"
        :all-techniques="techniquesAll"
      />
    </v-content>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import AuthenticatorsContainerComponent from "../components/AuthenticatorsContainerComponent";
import AuthenticatorFilterSidebarComponent from "../components/AuthenticatorFilterSidebarComponent.vue";
import { SelectedAuthenticatorFilters } from "../common/filter-aggregator";
import { Authenticator } from "../common/authenticator";
import { AuthenticationTechnique } from "../common/authentication-technique";
import { FilterAggregator, HierarchyNode } from "../common/filter-aggregator";

@Component({
  components: {
    AuthenticatorsContainerComponent,
    AuthenticatorFilterSidebarComponent,
  },
})
export default class Authenticators extends Vue {
  private authenticators: Authenticator[] = [];
  private authenticatorsAll: Authenticator[] = [];
  private authenticatorsFiltered: Authenticator[] = [];
  private techniquesAll: AuthenticationTechnique[] = [];
  private searchTerm: string = "";
  private sorting: string = "";
  private sortingItems = [
    { name: "name: A-Z", value: "name" },
    { name: "name: Z-A", value: "nameReverse" },
  ];
  private sidebarVisible: boolean = false;
  private selectedFilters: SelectedAuthenticatorFilters = {
    authenticationFactors: [],
    interactionModes: [],
    subjectTypes: [],
    outputModes: [],
  };

  public get slot() {
    return this.$vuetify.breakpoint.xs ? "extension" : "default";
  }

  public get repoUrl(): string | null {
    const url = (process.env.VUE_APP_REPO_URL || "").trim();
    return url.length > 0 ? url : null;
  }

  get authenticationFactorTree(): HierarchyNode[] {
    return FilterAggregator.buildAuthenticationFactorTree(this.authenticatorsAll);
  }

  public created() {
    this.loadData();
  }

  public mounted() {
    this.sidebarVisible = this.$vuetify.breakpoint.mdAndUp;
  }

  public async loadData() {
    try {
      const [authenticatorsRes, techniquesRes] = await Promise.all([
        axios.get("assets/authenticators.json"),
        axios.get("assets/techniques.json"),
      ]);

      // Load authenticators
      const aData = authenticatorsRes.data;
      let authenticators: Authenticator[] = [];
      if (aData.authenticators) {
        authenticators = aData.authenticators;
      } else if (Array.isArray(aData)) {
        authenticators = aData;
      } else {
        Object.keys(aData).forEach(key => {
          if (aData[key] && aData[key].authenticators) {
            authenticators = authenticators.concat(aData[key].authenticators);
          }
        });
      }
      authenticators.filter((a: Authenticator) => a.name).forEach(a => {
        this.authenticatorsAll.push(a);
        this.authenticators.push(a);
        this.authenticatorsFiltered.push(a);
      });

      // Load techniques (for back-references in detail view)
      const tData = techniquesRes.data;
      let techniques: AuthenticationTechnique[] = [];
      if (tData.techniques) {
        techniques = tData.techniques;
      } else if (Array.isArray(tData)) {
        techniques = tData;
      } else {
        Object.keys(tData).forEach(key => {
          if (tData[key] && tData[key].techniques) {
            techniques = techniques.concat(tData[key].techniques);
          }
        });
      }
      techniques.filter((t: AuthenticationTechnique) => t.name).forEach(t => {
        this.techniquesAll.push(t);
      });

    } catch (e) {
      this.$toasted.error("Failed to load authenticators");
    }
  }

  public toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  public onFilterChange(filters: SelectedAuthenticatorFilters) {
    this.selectedFilters = filters;
    this.applyAllFilters();
  }

  @Watch("searchTerm")
  public onSearch() {
    this.applyAllFilters();
  }

  public clearSearch() {
    this.searchTerm = "";
  }

  private applyAllFilters() {
    let filtered = [...this.authenticatorsAll];

    // Authentication factor filter
    if (this.selectedFilters.authenticationFactors.length > 0) {
      filtered = filtered.filter(a =>
        FilterAggregator.matchesAuthenticatorByFactor(
          a,
          this.selectedFilters.authenticationFactors,
          this.authenticationFactorTree
        )
      );
    }

    // Interaction mode filter (OR logic)
    if (this.selectedFilters.interactionModes.length > 0) {
      filtered = filtered.filter(a =>
        a.interactionMode && a.interactionMode.some(m =>
          this.selectedFilters.interactionModes.includes(m)
        )
      );
    }

    // Subject type filter (OR logic)
    if (this.selectedFilters.subjectTypes.length > 0) {
      filtered = filtered.filter(a =>
        a.subjectType && a.subjectType.some(s =>
          this.selectedFilters.subjectTypes.includes(s)
        )
      );
    }

    // Output mode filter (OR logic)
    if (this.selectedFilters.outputModes.length > 0) {
      filtered = filtered.filter(a =>
        a.outputMode && this.selectedFilters.outputModes.includes(a.outputMode)
      );
    }

    // Search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a => {
        const name = a.name ? a.name.toLowerCase() : "";
        const description = a.description ? a.description.toLowerCase() : "";
        return name.includes(searchLower) || description.includes(searchLower);
      });
    }

    this.authenticatorsFiltered = filtered;
    this.authenticators = filtered;
  }
}
</script>

<style scoped>
.sidebar-offset {
  margin-left: 300px;
}
</style>
