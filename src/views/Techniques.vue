<template>
  <div class="techniques-view">
    <v-toolbar class="primary techniques-topbar" fixed dark :extended="$vuetify.breakpoint.xs">
      <v-btn icon @click="toggleSidebar" class="hidden-md-and-up">
        <v-icon>filter_list</v-icon>
      </v-btn>
      <span class="title ml-1 mr-1 hidden-md-and-down">Authentication Techniques</span>
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
      >{{authTechniques.length}}/{{authTechniquesAll.length}}</v-chip>
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

    <div class="techniques-topbar-spacer"></div>

    <filter-sidebar-component
      :visible.sync="sidebarVisible"
      :auth-techniques="authTechniquesAll"
      :all-authenticators="authenticatorsAll"
      @filter-change="onFilterChange"
    />
    <v-content :class="{ 'sidebar-offset': sidebarVisible && $vuetify.breakpoint.mdAndUp }">
      <authentication-techniques-container-component :sorting="sorting" :auth-techniques="authTechniques" />
    </v-content>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import AuthenticationTechniquesContainerComponent from "../components/AuthenticationTechniquesContainerComponent";
import FilterSidebarComponent from "../components/FilterSidebarComponent.vue";
import { SelectedTechniqueFilters } from "../common/filter-aggregator";
import { AuthenticationTechnique } from "../common/authentication-technique";
import { Authenticator } from "../common/authenticator";
import { FilterAggregator, HierarchyNode } from "../common/filter-aggregator";
import Cite from "citation-js";
import { BibliographyTemplate } from "@/common/bibliography";

@Component({
  components: {
    AuthenticationTechniquesContainerComponent,
    FilterSidebarComponent,
  },
})
export default class Techniques extends Vue {
  private authTechniques: AuthenticationTechnique[] = [];
  private authTechniquesAll: AuthenticationTechnique[] = [];
  private authTechniquesFiltered: AuthenticationTechnique[] = [];
  private authenticatorsAll: Authenticator[] = [];
  private searchTerm: string = "";
  private sorting: string = "";
  private sortingItems = [
    { name: "name: A-Z", value: "name" },
    { name: "name: Z-A", value: "nameReverse" },
  ];
  private sidebarVisible: boolean = false;
  private selectedFilters: SelectedTechniqueFilters = {
    authenticationFactors: [],
    facets: {},
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
    this.loadCitationStyles();
  }

  public mounted() {
    this.sidebarVisible = this.$vuetify.breakpoint.mdAndUp;
  }

  public async loadData() {
    try {
      const [techniquesRes, authenticatorsRes] = await Promise.all([
        axios.get("assets/techniques.json"),
        axios.get("assets/authenticators.json"),
      ]);

      // Load techniques
      const tData = techniquesRes.data;
      let techniques: AuthenticationTechnique[] = [];
      if (tData.techniques) {
        techniques = tData.techniques;
      } else if (Array.isArray(tData)) {
        techniques = tData;
      } else {
        Object.keys(tData).forEach((key) => {
          if (tData[key] && tData[key].techniques) {
            techniques = techniques.concat(tData[key].techniques);
          }
        });
      }
      techniques.filter((t: AuthenticationTechnique) => t.name).forEach((t) => {
        this.authTechniquesAll.push(t);
        this.authTechniques.push(t);
        this.authTechniquesFiltered.push(t);
      });

      // Load authenticators
      const aData = authenticatorsRes.data;
      let authenticators: Authenticator[] = [];
      if (aData.authenticators) {
        authenticators = aData.authenticators;
      } else if (Array.isArray(aData)) {
        authenticators = aData;
      } else {
        Object.keys(aData).forEach((key) => {
          if (aData[key] && aData[key].authenticators) {
            authenticators = authenticators.concat(aData[key].authenticators);
          }
        });
      }
      authenticators.filter((a: Authenticator) => a.name).forEach((a) => {
        this.authenticatorsAll.push(a);
      });

    } catch (e) {
      this.$toasted.error("Failed to load data");
    }
  }

  public loadCitationStyles() {
    for (const template of Object.keys(BibliographyTemplate)) {
      const templateName = template.toLowerCase().replace(/_/g, "-");
      const styleUrl =
        "https://raw.githubusercontent.com/citation-style-language/styles/master/" +
        templateName + ".csl";
      if (!["apa", "harvard1", "vancouver", "bibtex"].includes(templateName)) {
        axios.get(styleUrl).then((response) => {
          const config = Cite.plugins.config.get("@csl");
          config.templates.add(templateName, response.data);
        }).catch(() => {
          this.$toasted.error("Failed to load citation style " + templateName);
        });
      }
    }
  }

  public toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  public onFilterChange(filters: SelectedTechniqueFilters) {
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
    let filtered = [...this.authTechniquesAll];

    // Authentication factor cross-filter (OR logic: match any selected factor)
    if (this.selectedFilters.authenticationFactors.length > 0) {
      filtered = filtered.filter((t) =>
        FilterAggregator.matchesTechniqueByFactor(
          t,
          this.selectedFilters.authenticationFactors,
          this.authenticatorsAll,
          this.authenticationFactorTree,
        ),
      );
    }

    // Facet filters (OR within facet, AND across facets)
    for (const facetKey of Object.keys(this.selectedFilters.facets)) {
      const selectedValues = this.selectedFilters.facets[facetKey];
      if (selectedValues && selectedValues.length > 0) {
        filtered = filtered.filter((t) => {
          if (!t.facets) {
            return false;
          }

          const rawValue = (t.facets as any)[facetKey] as string | string[] | undefined | null;
          if (!rawValue) {
            return false;
          }

          const techniqueValues = Array.isArray(rawValue) ? rawValue : [rawValue];

          if (facetKey === "authenticatorEmployment") {
            const leaf =
              techniqueValues.length > 0 ? techniqueValues[techniqueValues.length - 1] : "";
            return !!leaf && selectedValues.includes(leaf);
          }

          return techniqueValues.some((v) => selectedValues.includes(v));
        });
      }
    }

    // Search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter((t) => {
        const name = t.name ? t.name.toLowerCase() : "";
        const description = t.description ? t.description.toLowerCase() : "";
        let aliasMatch = false;
        if (t.aliases) {
          t.aliases.forEach((a) => {
            if (a && a.toLowerCase().includes(searchLower)) {
              aliasMatch = true;
            }
          });
        }
        return name.includes(searchLower) || description.includes(searchLower) || aliasMatch;
      });
    }

    this.authTechniquesFiltered = filtered;
    this.authTechniques = filtered;
  }
}
</script>

<style>
.toast {
  font-size: 20px !important;
}

.sidebar-offset {
  margin-left: 300px;
}

.techniques-topbar {
  top: 48px; /* unter der fixed Tabs-Leiste aus App.vue */
  left: 0;
  right: 0;
  z-index: 6; /* unter Tabs (z-index: 7), über Content */
}

.techniques-topbar-spacer {
  height: 64px; /* Standard-Toolbar-Höhe (Desktop) */
}
</style>
