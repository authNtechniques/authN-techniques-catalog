<template>
    <v-card>
        <v-card-title class="primary white--text">
            <div class="headline">{{authenticator.name}}</div>
            <v-spacer></v-spacer>
            <v-btn icon @click="$emit('input', false)">
                <v-icon color="white">close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text class="pt-3">

            <div v-if="authenticator.description" class="mb-3">
                <strong>Description:</strong>
                <p>{{authenticator.description}}</p>
            </div>

            <div v-if="authenticator.authenticationFactor && authenticator.authenticationFactor.length > 0" class="mb-3">
                <strong>Authentication Factor:</strong>
                <div class="mt-2">
                    <span v-for="(factor, index) in authenticator.authenticationFactor" :key="factor" class="hierarchy-item">
                        <v-chip :color="getChipColor(index)" text-color="white" class="mr-2 mb-2">
                            {{factor}}
                        </v-chip>
                        <v-icon v-if="index < authenticator.authenticationFactor.length - 1" class="hierarchy-arrow">
                            keyboard_arrow_right
                        </v-icon>
                    </span>
                </div>
            </div>

            <div v-if="authenticator.subjectType && authenticator.subjectType.length > 0" class="mb-3">
              <strong>Subject:</strong>
              <div class="mt-2">
                <v-chip
                    v-for="type in authenticator.subjectType"
                    :key="type"
                    small
                    class="mr-1 mb-1"
                >
                  {{type}}
                </v-chip>
              </div>
            </div>

            <div v-if="authenticator.interactionMode && authenticator.interactionMode.length > 0" class="mb-3">
                <strong>Interaction:</strong>
                <div class="mt-2">
                    <v-chip
                        v-for="mode in authenticator.interactionMode"
                        :key="mode"
                        small
                        class="mr-1 mb-1"
                    >
                        {{mode}}
                    </v-chip>
                </div>
            </div>

            <div v-if="authenticator.outputMode" class="mb-3">
              <strong>Output:</strong>

              <div class="mt-2">
                <v-chip
                  small
                  class="mr-1 mb-1"
                >
                  {{ authenticator.outputMode }}
                </v-chip>
              </div>
            </div>

            <div v-if="usedByTechniques.length > 0" class="mb-3">
                <strong>Used by Authentication Techniques:</strong>
                <div class="mt-2">
                    <v-chip
                        v-for="technique in usedByTechniques"
                        :key="technique.name"
                        color="secondary"
                        text-color="white"
                        class="mr-2 mb-2"
                        style="cursor: pointer;"
                        @click="openTechnique(technique.name)"
                    >
                        <v-icon left small>lock</v-icon>
                        {{technique.name}}
                    </v-chip>
                </div>
            </div>

            <authentication-technique-citations-component
                v-if="authenticator.sources && authenticator.sources.length > 0"
                :sources="authenticator.sources"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Authenticator} from '../common/authenticator';
    import {AuthenticationTechnique} from '../common/authentication-technique';
    import AuthenticationTechniqueCitationsComponent from './AuthenticationTechniqueCitationsComponent.vue';

    @Component({
        components: {
            AuthenticationTechniqueCitationsComponent,
        },
    })
    export default class AuthenticatorDetailComponent extends Vue {
        @Prop(Object) public authenticator!: Authenticator;
        @Prop({ type: Array, default: () => [] }) public allTechniques!: AuthenticationTechnique[];

        get usedByTechniques(): AuthenticationTechnique[] {
            if (!this.authenticator || !this.authenticator.name) {
              return [];
            }
            return this.allTechniques.filter((t) =>
                t.authenticators && t.authenticators.includes(this.authenticator.name!),
            );
        }

        public openTechnique(name: string) {
            this.$emit('input', false);
            this.$router.push({ name: 'techniques', query: { technique: name } });
        }

        public getChipColor(index: number): string {
            const colors = ['primary', 'secondary', 'accent'];
            return colors[index % colors.length];
        }
    }
</script>

<style scoped>
.hierarchy-item {
    display: inline-flex;
    align-items: center;
}

.hierarchy-arrow {
    margin: 0 8px;
    color: rgba(0, 0, 0, 0.6);
}
</style>
