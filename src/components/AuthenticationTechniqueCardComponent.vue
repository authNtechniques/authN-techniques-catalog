<template>
    <v-card style="display: flex; flex-direction: column;" height="100%">
        <v-card-title class="primary white--text">
            <div class="headline">{{authTechnique.name}}</div>
        </v-card-title>
        <v-card-text class="grow">
            <div>{{authTechnique.description}}</div>
            <div v-if="authTechnique.authenticators && authTechnique.authenticators.length > 0" class="mt-2">
                <strong>Authenticators:</strong>
                <div class="mt-1">
                    <v-chip
                        v-for="authName in authTechnique.authenticators"
                        :key="authName"
                        small
                        color="primary"
                        text-color="white"
                        class="mr-1 mb-1"
                    >
                        {{authName}}
                    </v-chip>
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
                <authentication-technique-detail-component v-model="dialog" :authentication-technique="authTechnique" />
            </v-dialog>
            <v-spacer></v-spacer>
            <authentication-technique-actions-component :authentication-technique="authTechnique"/>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {AuthenticationTechnique} from '../common/authentication-technique';
    import AuthenticationTechniqueActionsComponent from "./AuthenticationTechniqueActionsComponent";
    import AuthenticationTechniqueDetailComponent from "./AuthenticationTechniqueDetailComponent";

    @Component({
        components: {
            AuthenticationTechniqueActionsComponent,
            AuthenticationTechniqueDetailComponent,
        },
    })
    export default class AuthenticationTechniqueCardComponent extends Vue {
        @Prop(Object) public authTechnique!: AuthenticationTechnique;
        public dialog: boolean = false;

        @Watch('$route', {immediate: true, deep: true})
        public onRouteUpdate() {
            if (this.$route.query.technique === this.authTechnique.name) {
                this.dialog = true;
            }
        }

        @Watch('dialog')
        public onDialogUpdate(newValue: boolean) {
            if (newValue) {
                this.$router.push({
                    name: 'techniques',
                    query: { technique: this.authTechnique!.name! },
                });
            } else {
                if (this.$route.query.technique) {
                    this.$router.push({ name: 'techniques' });
                }
            }
        }
    }
</script>
