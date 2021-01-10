<template>
    <div class="wipe-data">
        <h3 class="title">
            Danger Zone
        </h3>
        <div class="danger-zone">
            <span 
                class="wipe-button"
                @click="wipeStore"
            >
                Wipe Store
            </span>
        </div>
        <div 
            v-if="showConfirmation" 
            class="confirmation-container"
        >
            <div class="confirmation-warning">
                <strong>Careful!</strong>
                This will delete the whole warehouse data.<br/>
                Are you sure?
            </div>
            <div class="confirmation-dialog-container">
                <span 
                    class="confirmation-dialog" 
                    @click="confirmDeletion"
                >Yes</span>
                <span 
                    class="confirmation-dialog" 
                    @click="cancelDeletion"
                >No</span>
            </div>
        </div>
        <div 
            v-if="showDeletionConfirm" 
            class="confirmation-warning"
        >
            Warehouse data was wiped!!!
        </div>
    </div>
</template>

<script lang="ts" src="./WipeData.ts" />
<style scoped lang="scss" src="./WipeData.scss" />