<template>
    <v-container fluid grid-list-lg>
        <v-layout wrap>
            <v-flex xs12 sm6 md4 lg3 lx2 v-for="authenticator in authenticators" :key="authenticator.name">
                <authenticator-card-component
                    :authenticator="authenticator"
                    :all-techniques="allTechniques"
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Authenticator} from '../common/authenticator';
    import {AuthenticationTechnique} from '../common/authentication-technique';
    import AuthenticatorCardComponent from "@/components/AuthenticatorCardComponent.vue";

    @Component({
        components: {
            AuthenticatorCardComponent,
        },
    })
    export default class AuthenticatorsContainerComponent extends Vue {
        @Prop(Array) public authenticators!: Authenticator[];
        @Prop({ type: Array, default: () => [] }) public allTechniques!: AuthenticationTechnique[];
        @Prop(String) public sorting!: string;

        @Watch('sorting')
        public onChangedSorting(sorting: string) {
            if (sorting.match("name.*")) {
                this.authenticators.sort((a1, a2) => a1!.name!.localeCompare(a2!.name!));
            }
            if (sorting.match(".*Reverse")) {
                this.authenticators.reverse();
            }
        }
    }
</script>
