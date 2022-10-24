<template>
  <page-layout page-title="Settings">
    <template #actionsPane>
      <page-action-header>
        <template #breadcrumbs>
          <TabContainer>
            <TabItem :title="'Profile Information'" :to="{name: 'settings.edit.partner'}"/>
            <TabItem :title="'Company Information'" :to="{name: 'settings.edit.partner.company'}"/>
            <TabItem :title="'Settlement Account'" :to="{name: 'settings.edit.settlemet.account'}"/>
          </TabContainer>
        </template>
        </page-action-header>
      </template>
    <main>
      <router-view />
    </main>
  </page-layout>
</template>

<script>
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import TabContainer from '@/components/tab/TabContainer.vue';
import TabItem from '@/components/tab/TabItem.vue';
import emitter from '@/libs/emitter';
export default {
  components: {
    PageLayout,
    PageActionHeader,
    TabContainer,
    TabItem
  },
  methods: {
    showProfilePage () {
      emitter.emit("settings:go-to-profile");
    },
    showCompanyInfo () {
      emitter.emit("settings:go-to-company");
    },
    showAccountsPage () {
      emitter.emit("settings:go-to-settlement");
    },
  }
};
</script>

<style>
</style>
