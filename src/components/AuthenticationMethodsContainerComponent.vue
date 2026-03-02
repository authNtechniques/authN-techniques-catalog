<template>
    <v-container fluid grid-list-lg>
        <v-layout wrap>
            <v-flex xs12 sm6 md4 lg3 lx2 v-for="authMethod in authMethods" :key="authMethod.name">
                <authentication-method-card-component :auth-method="authMethod" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {AuthenticationMethod} from '../common/authentication-method';
    import AuthenticationMethodCardComponent from "@/components/AuthenticationMethodCardComponent.vue";

    @Component({
        components: {
            AuthenticationMethodCardComponent,
        },
    })
    export default class AuthenticationMethodsContainerComponent extends Vue {
        @Prop(Array) public authMethods!: AuthenticationMethod[];
        @Prop(String) public sorting!: string;

        @Watch('sorting')
        public onChangedSorting(sorting: string) {
            if (sorting.match("name.*")) {
                this.authMethods.sort((a1, a2) => a1!.name!.localeCompare(a2!.name!));
            }
            if (sorting.match(".*Reverse")) {
                this.authMethods.reverse();
            }
        }
    }
</script>