<template>
    <div>
        <v-tooltip top>
            <v-btn icon slot="activator" @click="copyBibtexToClipboard" :disabled="!hasSources">
                <v-icon>format_quote</v-icon>
            </v-btn>
            <span>Copy BibTeX citations to clipboard</span>
        </v-tooltip>
        <v-tooltip top>
            <v-btn icon slot="activator" @click="copyToClipboard">
                <v-icon>content_copy</v-icon>
            </v-btn>
            <span>Copy technique JSON to clipboard</span>
        </v-tooltip>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {AuthenticationTechnique} from '../common/authentication-technique';

    @Component
    export default class AuthenticationTechniqueActionsComponent extends Vue {
        @Prop(Object) public authenticationTechnique!: AuthenticationTechnique;

        public get hasSources(): boolean {
            return !!(this.authenticationTechnique && this.authenticationTechnique.sources && this.authenticationTechnique.sources.length > 0);
        }

        public copyToClipboard() {
            if (this.authenticationTechnique) {
                const jsonString = JSON.stringify(this.authenticationTechnique, null, 2);
                if ((navigator as any).clipboard) {
                    (navigator as any).clipboard.writeText(jsonString).then(() => {
                        this.$toasted.success('Technique JSON copied to clipboard!');
                    }).catch(() => {
                        this.$toasted.error('Failed to copy to clipboard');
                    });
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = jsonString;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        this.$toasted.success('Technique JSON copied to clipboard!');
                    } catch (err) {
                        this.$toasted.error('Failed to copy to clipboard');
                    }
                    document.body.removeChild(textarea);
                }
            }
        }

        public copyBibtexToClipboard() {
            if (this.authenticationTechnique && this.authenticationTechnique.sources) {
                const bibtexString = this.authenticationTechnique.sources.join('\n\n');
                if ((navigator as any).clipboard) {
                    (navigator as any).clipboard.writeText(bibtexString).then(() => {
                        this.$toasted.success('BibTeX citations copied to clipboard!');
                    }).catch(() => {
                        this.$toasted.error('Failed to copy to clipboard');
                    });
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = bibtexString;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        this.$toasted.success('BibTeX citations copied to clipboard!');
                    } catch (err) {
                        this.$toasted.error('Failed to copy to clipboard');
                    }
                    document.body.removeChild(textarea);
                }
            }
        }
    }
</script>
