<template>
    <div class="pt-5 is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1 overflow-inherit">
        <section class="hero mx-5 mb-5 is-flex-shrink-0  is-dark">
            <div class="hero-body">
                <div class="container">
                    <p class="title">
                        {{ asset?.name }}
                    </p>
                    <p class="subtitle">{{asset?.asset_type}}</p>
                </div>
            </div>
        </section>
        <div class="mx-5 card">
            <div class="card-content">
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Name</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" name="name" v-model="asset.name"
                                    placeholder="Benchie" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Move To Project</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <b-autocomplete v-model="projectName" placeholder="Project name" open-on-focus
                                    :data="filteredDataObj" field="name" @select="option => (selectedProject = option)"
                                    clearable>
                                </b-autocomplete>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item" @click.prevent="save()">Save</a>
                <a href="#" class="card-footer-item is-text-warning" @click.prevent="deleteAsset()">Delete</a>
                <a href="/discovery" class="card-footer-item">Cancel</a>
            </footer>
        </div>

    </div>
</template>
  
<script>
import { useProjectsStore } from "../../stores/projects.js";
import { useAssetsStore } from "../../stores/assets.js";
import { TYPE } from "vue-toastification";
import pinia from "@/stores/store.js";

export default {
    name: "AssetEdit",
    created() { },
    data() {
        return {
            projectName: '',
            selectedProject: {},
            baseUrl: import.meta.env.VITE_API_URL,
        };
    },
    computed: {
        projects() {
            return useProjectsStore(pinia).getProjects;
        },
        asset() {
            return useAssetsStore(pinia).getSelectedAsset;
        },
        filteredDataObj() {
            return Object.values(this.projects).filter(option => {
                return (
                    option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.projectName.toLowerCase()) >= 0
                )
            })
        }
    },
    methods: {
        async deleteAsset() {
            try {
                await useAssetsStore(pinia).deleteAsset(this.asset.sha1);
                this.$toast("Asset Deleted", {
                    timeout: 2000,
                });
                this.$router.push("/projects/");
            } catch (e) {
                this.$toast("Failed to delete Asset", {
                    timeout: 2000,
                    type: TYPE.WARNING
                });
            }

        },
        save() {
            if (this.selectedProject.uuid) {
                this.asset.project_uuid = this.selectedProject.uuid;
            }
            try {
                useAssetsStore(pinia).saveAsset(this.asset);
                this.$toast("Asset Saved", {
                    timeout: 2000,
                });
                this.$router.push("/projects/");
            } catch (e) {
                this.$toast("Failed to save Asset", {
                    timeout: 2000,
                    type: TYPE.WARNING
                });
            }
        },
    },
    mounted() {
        console.log(this.asset)
    },
};
</script>
  
<style scoped>

</style>
  