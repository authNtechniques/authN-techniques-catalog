<template>
    <v-card style="display: flex; flex-direction: column;" height="100%">
        <v-card-title class="primary white--text">
            <div class="headline">{{authMethod.name}}</div>
        </v-card-title>
        <v-card-text class="grow">
            <div>{{authMethod.description}}</div>
            <div v-if="authMethod.authenticator" class="mt-2">
                <strong>Authenticator:</strong> {{authMethod.authenticator.name}}
                <div class="mt-2">
                    <div class="authenticator-hierarchy">
                        <span v-for="(cls, index) in authMethod.authenticator.class" :key="cls" class="hierarchy-item">
                            <v-chip 
                                small 
                                :color="getChipColor(index)" 
                                :text-color="getChipTextColor(index)"
                                class="mr-1 mb-1"
                            >
                                {{cls}}
                            </v-chip>
                            <v-icon v-if="index < authMethod.authenticator.class.length - 1" small class="hierarchy-arrow">
                                keyboard_arrow_right
                            </v-icon>
                        </span>
                    </div>
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
                <authentication-method-detail-component v-model="dialog" :authentication-method="authMethod" />
            </v-dialog>
            <v-spacer></v-spacer>
            <authentication-method-actions-component :authenticationMethod="authMethod"/>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {AuthenticationMethod} from '../common/authentication-method';
    import {Source} from '../common/bibliography';
    import AuthenticationMethodActionsComponent from "./AuthenticationMethodActionsComponent";
    import AuthenticationMethodDetailComponent from "./AuthenticationMethodDetailComponent";

    @Component({
        components: {
            AuthenticationMethodActionsComponent,
            AuthenticationMethodDetailComponent,
        },
    })
    export default class AuthenticationMethodCardComponent extends Vue {
        @Prop(Object) public authMethod!: AuthenticationMethod;
        public dialog: boolean = false;

        @Watch('router', {immediate: true, deep: true})
        public beforeRouteUpdate(to: any, from: any) {
            if (this.$route.query.method === this.authMethod.name) {
                this.dialog = true;
            }
        }

        @Watch('dialog')
        public onDialogUpdate(newValue: boolean, oldValue: boolean) {
            if (newValue) {
                this.$router.push({
                    name: 'home',
                    query: {method: this.authMethod!.name!},
                });
            } else {
                this.$router.push({name: 'home'});
            }
        }

        public getChipColor(index: number): string {
            const colors = ['primary', 'secondary', 'accent'];
            return colors[index % colors.length];
        }

        public getChipTextColor(index: number): string {
            return 'white';
        }
    }
</script>

<style scoped>
.authenticator-hierarchy {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.hierarchy-item {
    display: flex;
    align-items: center;
}

.hierarchy-arrow {
    margin: 0 8px;
    color: rgba(0, 0, 0, 0.6);
}
</style>
