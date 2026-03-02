<template>
    <v-container fluid grid-list-lg>
        <v-layout wrap>
            <v-flex xs12 sm6 md4 lg3 lx2 v-for="technique in authTechniques" :key="technique.name">
                <authentication-technique-card-component :auth-technique="technique" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {AuthenticationTechnique} from '../common/authentication-technique';
    import AuthenticationTechniqueCardComponent from "@/components/AuthenticationTechniqueCardComponent.vue";

    @Component({
        components: {
            AuthenticationTechniqueCardComponent,
        },
    })
    export default class AuthenticationTechniquesContainerComponent extends Vue {
        @Prop(Array) public authTechniques!: AuthenticationTechnique[];
        @Prop(String) public sorting!: string;

        @Watch('sorting')
        public onChangedSorting(sorting: string) {
            if (sorting.match("name.*")) {
                this.authTechniques.sort((a1, a2) => a1!.name!.localeCompare(a2!.name!));
            }
            if (sorting.match(".*Reverse")) {
                this.authTechniques.reverse();
            }
        }
    }
</script>
