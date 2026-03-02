<template>
    <v-app>
        <v-tabs
            color="primary"
            slider-color="white"
            dark
            fixed-tabs
            style="position: fixed; top: 0; left: 0; right: 0; z-index: 7;"
        >
            <v-tab :to="{ name: 'techniques' }" exact>Authentication Techniques</v-tab>
            <v-tab :to="{ name: 'authenticators' }">Authenticators</v-tab>
        </v-tabs>
        <div style="padding-top: 48px;">
            <router-view/>
        </div>
    </v-app>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class App extends Vue {}
</script>

<style>
.v-tabs__bar {
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
