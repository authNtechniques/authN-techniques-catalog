<template>
    <v-card>
        <v-card-title class="primary white--text">
            <div class="headline">{{authenticationTechnique.name}}</div>
            <v-spacer></v-spacer>
            <v-btn icon @click="$emit('input', false)">
                <v-icon color="white">close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text class="pt-3">
            <div v-if="authenticationTechnique.aliases && authenticationTechnique.aliases.length > 0" class="mb-3">
                <strong>Aliases:</strong>
                <v-chip v-for="alias in authenticationTechnique.aliases" :key="alias" small class="ml-2">{{alias}}</v-chip>
            </div>

            <div v-if="authenticationTechnique.description" class="mb-3">
                <strong>Description:</strong>
                <p>{{authenticationTechnique.description}}</p>
            </div>

            <div v-if="authenticationTechnique.requirements" class="mb-3">
                <strong>Requirements:</strong>
                <p>{{authenticationTechnique.requirements}}</p>
            </div>

            <div v-if="authenticationTechnique.authenticators && authenticationTechnique.authenticators.length > 0" class="mb-3">
                <strong>Authenticators:</strong>
                <div class="mt-2">
                    <v-chip
                        v-for="authName in authenticationTechnique.authenticators"
                        :key="authName"
                        color="primary"
                        text-color="white"
                        class="mr-2 mb-2"
                        style="cursor: pointer;"
                        @click="openAuthenticator(authName)"
                    >
                        <v-icon left small>person</v-icon>
                        {{authName}}
                    </v-chip>
                </div>
            </div>

          <div v-if="authenticationTechnique.facets" class="mb-3">
            <strong>Authentication Facets:</strong>

            <v-layout wrap class="ml-2 mt-2">
              <v-flex
                  xs12 sm6 md4
                  v-for="(value, key) in authenticationTechnique.facets"
                  :key="key"
                  v-if="value && (!Array.isArray(value) || value.length)"
              >
                <div class="mb-2">
                  <strong>{{ formatFacetName(key) }}:</strong>

                  <div class="mt-1">
                    <v-chip
                        v-for="item in (Array.isArray(value) ? value : [value]).filter(v => v && v.trim() !== '')"
                        :key="item"
                        small
                        class="mr-1 mb-1"
                    >
                      {{ item }}
                    </v-chip>
                  </div>

                </div>
              </v-flex>
            </v-layout>
          </div>

            <authentication-technique-citations-component
                v-if="authenticationTechnique.sources && authenticationTechnique.sources.length > 0"
                :sources="authenticationTechnique.sources"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {AuthenticationTechnique} from '../common/authentication-technique';
    import AuthenticationTechniqueCitationsComponent from './AuthenticationTechniqueCitationsComponent.vue';

    @Component({
        components: {
            AuthenticationTechniqueCitationsComponent,
        },
    })
    export default class AuthenticationTechniqueDetailComponent extends Vue {
        @Prop(Object) public authenticationTechnique!: AuthenticationTechnique;

        public openAuthenticator(name: string) {
            this.$emit('input', false);
            this.$router.push({ name: 'authenticators', query: { authenticator: name } });
        }

        public formatFacetName(key: string): string {
            return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        }
    }
</script>
