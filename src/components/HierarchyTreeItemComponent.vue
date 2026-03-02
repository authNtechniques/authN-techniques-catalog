<template>
  <div class="tree-item">
    <v-checkbox
      :input-value="isSelected"
      :indeterminate="isIndeterminate"
      :label="node.name"
      color="primary"
      hide-details
      class="filter-checkbox"
      :style="{ paddingLeft: (node.level * 20) + 'px' }"
      @change="onToggle($event)"
    ></v-checkbox>
    <hierarchy-tree-item-component
      v-for="child in node.children"
      :key="child.name"
      :node="child"
      :selected-items="selectedItems"
      @toggle="onChildToggle"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { HierarchyNode, FilterAggregator } from '@/common/filter-aggregator';

@Component({
  name: 'HierarchyTreeItemComponent'
})
export default class HierarchyTreeItemComponent extends Vue {
  @Prop({ type: Object, required: true })
  public node!: HierarchyNode;

  @Prop({ type: Array, required: true })
  public selectedItems!: string[];

  get isSelected(): boolean {
    return this.selectedItems.includes(this.node.name);
  }

  get isIndeterminate(): boolean {
    return FilterAggregator.isNodeIndeterminate(this.node, this.selectedItems);
  }

  public onToggle() {
    this.$emit('toggle', this.node.name);
  }

  public onChildToggle(name: string) {
    this.$emit('toggle', name);
  }
}
</script>

<style scoped>
.tree-item {
  width: 100%;
}

.filter-checkbox {
  margin-top: 4px;
  margin-bottom: 4px;
}

.filter-checkbox >>> .v-input--selection-controls__input {
  margin-right: 8px;
}
</style>
