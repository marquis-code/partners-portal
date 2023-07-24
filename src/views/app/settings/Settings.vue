<template>
  <page-layout page-title="Settings">
    <template #actionsPane>
      <page-action-header>
        <template #breadcrumbs>
          <main class="overflow-x-auto w-full">
            <TabContainer>
              <TabItem
                :title="'Profile Information'"
                :to="{ name: 'settings.edit.partner' }"
              />
              <TabItem
                v-if="partnerContext.onboardingState.address.partner_type === 'business'"
                :title="'Company Information'"
                :to="{ name: 'settings.edit.partner.company' }"
              />
              <TabItem
                :title="'Settlement Account'"
                :to="{ name: 'settings.edit.settlement.account' }"
              />
              <!-- <TabItem
                :title="'Role Management'"
                :to="{ name: 'settings.edit.role.management' }"
              /> -->
            </TabContainer>
          </main>
        </template>
      </page-action-header>
    </template>
    <main>
      <router-view />
    </main>
  </page-layout>
</template>

<!-- <script>
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import TabContainer from '@/components/tab/TabContainer.vue';
import TabItem from '@/components/tab/TabItem.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    PageLayout,
    PageActionHeader,
    TabContainer,
    TabItem
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
};
</script> -->

<script setup lang="ts">
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import TabContainer from '@/components/tab/TabContainer.vue';
import TabItem from '@/components/tab/TabItem.vue';
import { useStore } from 'vuex';
import { computed } from 'vue'

const store = useStore()
const partnerContext:any = computed(() => store.getters['auth/activeContext'])

</script>
