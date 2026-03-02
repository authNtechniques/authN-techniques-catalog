<template>
    <v-card>
        <v-card-title class="primary white--text">
            <div class="headline">{{authenticationMethod.name}}</div>
            <v-spacer></v-spacer>
            <v-btn icon @click="$emit('input', false)">
                <v-icon color="white">close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text class="pt-3">
            <div v-if="authenticationMethod.aliases && authenticationMethod.aliases.length > 0" class="mb-3">
                <strong>Aliases:</strong>
                <v-chip v-for="alias in authenticationMethod.aliases" :key="alias" small class="ml-2">{{alias}}</v-chip>
            </div>

            <div v-if="authenticationMethod.description" class="mb-3">
                <strong>Description:</strong>
                <p>{{authenticationMethod.description}}</p>
            </div>

            <div v-if="authenticationMethod.requirements" class="mb-3">
                <strong>Requirements:</strong>
                <p>{{authenticationMethod.requirements}}</p>
            </div>

            <div v-if="authenticationMethod.authenticator" class="mb-3">
                <strong>Authenticator:</strong> {{authenticationMethod.authenticator.name}}
                <div class="mt-2">
                    <div class="authenticator-hierarchy-detail">
                        <span v-for="(cls, index) in authenticationMethod.authenticator.class" :key="cls" class="hierarchy-item">
                            <v-chip 
                                :color="getChipColor(index)" 
                                :text-color="getChipTextColor(index)"
                                class="mr-2 mb-2"
                            >
                                {{cls}}
                            </v-chip>
                            <v-icon v-if="index < authenticationMethod.authenticator.class.length - 1" class="hierarchy-arrow-detail">
                                keyboard_arrow_right
                            </v-icon>
                        </span>
                    </div>
                </div>
            </div>

            <div v-if="authenticationMethod.facets" class="mb-3">
                <strong>Authentication Facets:</strong>
                <v-layout wrap class="ml-2 mt-2">
                    <v-flex xs12 sm6 md4 v-for="(value, key) in authenticationMethod.facets" :key="key" v-if="value">
                        <div class="mb-2">
                            <strong>{{formatFacetName(key)}}:</strong> {{value}}
                        </div>
                    </v-flex>
                </v-layout>
            </div>

            <authentication-method-citations-component 
                :sources="authenticationMethod.sources"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {AuthenticationMethod} from '../common/authentication-method';
    import {Source} from '../common/bibliography';
    import AuthenticationMethodCitationsComponent from './AuthenticationMethodCitationsComponent.vue';

    @Component({
        components: {
            AuthenticationMethodCitationsComponent,
        },
    })
    export default class AuthenticationMethodDetailComponent extends Vue {
        @Prop(Object) public authenticationMethod!: AuthenticationMethod;

        public formatFacetName(key: string): string {
            return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
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
.authenticator-hierarchy-detail {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.hierarchy-item {
    display: flex;
    align-items: center;
}

.hierarchy-arrow-detail {
    margin: 0 12px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 20px;
}
</style>