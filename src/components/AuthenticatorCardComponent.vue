<template>
    <v-card style="display: flex; flex-direction: column;" height="100%">
        <v-card-title class="primary white--text">
            <div class="headline">{{authenticator.name}}</div>
        </v-card-title>
        <v-card-text class="grow">
            <div>{{authenticator.description}}</div>
            <div v-if="authenticator.authenticationFactor && authenticator.authenticationFactor.length > 0" class="mt-2">
                <div class="factor-hierarchy">
                    <span v-for="(factor, index) in authenticator.authenticationFactor" :key="factor" class="hierarchy-item">
                        <v-chip
                            small
                            :color="getChipColor(index)"
                            text-color="white"
                            class="mr-1 mb-1"
                        >
                            {{factor}}
                        </v-chip>
                        <v-icon v-if="index < authenticator.authenticationFactor.length - 1" small class="hierarchy-arrow">
                            keyboard_arrow_right
                        </v-icon>
                    </span>
                </div>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-dialog lazy scrollable v-model='dialog' @keydown.esc="dialog = false" width="1000px">
                <v-tooltip top slot="activator">
                    <v-btn icon slot="activator">
                        <v-icon>open_in_new</v-icon>
                    </v-btn>
                    <span>Open the detail view</span>
                </v-tooltip>
                <authenticator-detail-component
                    v-model="dialog"
                    :authenticator="authenticator"
                    :all-techniques="allTechniques"
                />
            </v-dialog>
            <v-spacer></v-spacer>
            <authenticator-actions-component :authenticator="authenticator"/>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Authenticator} from '../common/authenticator';
    import {AuthenticationTechnique} from '../common/authentication-technique';
    import AuthenticatorActionsComponent from "./AuthenticatorActionsComponent";
    import AuthenticatorDetailComponent from "./AuthenticatorDetailComponent";

    @Component({
        components: {
            AuthenticatorActionsComponent,
            AuthenticatorDetailComponent,
        },
    })
    export default class AuthenticatorCardComponent extends Vue {
        @Prop(Object) public authenticator!: Authenticator;
        @Prop({ type: Array, default: () => [] }) public allTechniques!: AuthenticationTechnique[];
        public dialog: boolean = false;

        @Watch('$route', {immediate: true, deep: true})
        public onRouteUpdate() {
            if (this.$route.query.authenticator === this.authenticator.name) {
                this.dialog = true;
            }
        }

        @Watch('dialog')
        public onDialogUpdate(newValue: boolean) {
            if (newValue) {
                this.$router.push({
                    name: 'authenticators',
                    query: { authenticator: this.authenticator!.name! },
                });
            } else {
                if (this.$route.query.authenticator) {
                    this.$router.push({ name: 'authenticators' });
                }
            }
        }

        public getChipColor(index: number): string {
            const colors = ['primary', 'secondary', 'accent'];
            return colors[index % colors.length];
        }
    }
</script>

<style scoped>
.factor-hierarchy {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.hierarchy-item {
    display: flex;
    align-items: center;
}

.hierarchy-arrow {
    margin: 0 4px;
    color: rgba(0, 0, 0, 0.6);
}
</style>
