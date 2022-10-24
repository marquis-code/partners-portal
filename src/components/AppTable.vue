<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div
          class="overflow-hidden border-b border-gray-200 sm:rounded-lg"
          style="box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.09)"
        >
          <div
            class="
              w-full
              overflow-hidden
              origin-left
              transform
              opacity-75
              bg-green-type-1
              animate-progress
            "
            :class="{ hidden: !loading }"
            style="height: 2px"
          ></div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-white">
              <tr>
                <th v-for="field in fields" :key="field.key" scope="col">
                  <slot :name="`field_${field.key}`">
                    <div
                      class="
                        p-4
                        text-sm
                        font-medium
                        tracking-wider
                        text-left
                        lg:p-8
                        text-gray-500
                      "
                    >
                      <p>{{ field.label }}</p>
                    </div>
                  </slot>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-type-7">
              <template v-if="loading">
                <tr>
                  <td :colspan="fields.length" class="py-10 text-center">
                    <spinner></spinner>
                    <span>Loading...</span>
                  </td>
                </tr>
              </template>
              <template v-else>
                <template v-if="errorLoading"></template>
                <template v-if="tableItems && tableItems.length">
                  <tr
                    v-for="(item, index) in tableItems"
                    :key="index"
                    @click="handleRowClick(item)"
                    class="cursor-pointer"
                  >
                    <td
                      v-for="field in fields"
                      :key="field.key"
                      class="py-5 pl-8 whitespace-nowrap"
                    >
                      <slot :name="field.key" v-bind:item="item">
                        <div
                          v-if="field.filter"
                          class="text-xs font-medium text-gray-type-3"
                        >
                          {{ field.filter(getPropPath(item, field.key)) }}
                        </div>
                        <div v-else class="font-light text-sm text-gray-type-3">
                          {{ getPropPath(item, field.key) }}
                        </div>
                      </slot>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <slot name="no-items">
                    <tr>
                      <td :colspan="fields.length" class="py-3 text-center h-[40vh] items-center">
                        <div class="w-full flex flex-col items-center justify-center">
                          <img class="items-center" src="@/assets/icons/no-table-data.svg"/>
                          <p>No data available.</p>
                        </div>
                        <!-- <tr>
                          <td></td>
                        </tr> -->
                      </td>
                    </tr>
                  </slot>
                </template>
              </template>
            </tbody>
            <tfoot class="bg-white" v-if="usePagination && tableItems.length">
              <tr>
                <td :colspan="fields.length" class="p-3">
                  <div class="flex flex-row-reverse items-center">
                    <div class="flex items-center space-x-4">
                      <button
                        :disabled="paginationIsInFirstPage"
                        class="
                          flex
                          items-center
                          justify-center
                          w-8
                          h-8
                          ml-4
                          rounded-full
                          focus:outline-none focus:ring
                        "
                        :class="
                          paginationIsInFirstPage
                            ? 'cursor-not-allowed text-gray-type-11'
                            : 'hover:bg-gray-type-7'
                        "
                        @click="prevPage"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          class="w-4 h-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        :disabled="paginationIsInLastPage"
                        class="
                          flex
                          items-center
                          justify-center
                          w-8
                          h-8
                          ml-4
                          rounded-full
                          focus:outline-none focus:ring
                        "
                        :class="
                          paginationIsInLastPage
                            ? 'cursor-not-allowed text-gray-type-11'
                            : 'hover:bg-gray-type-7'
                        "
                        @click="nextPage"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          class="w-4 h-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                    <div class="ml-4 text-xs font-medium text-gray-type-8">
                      {{ paginationStartIndex }} -
                      {{
                        Math.min(
                          total,
                          paginationItemsPerPage * pagination.currentPage
                        )
                      }}
                      of {{ total }}
                    </div>
                    <select
                      v-model="pagination.itemsPerPage"
                      class="
                        p-2
                        ml-3
                        text-xs
                        font-medium
                        bg-gray-type-4
                        text-gray-type-8
                        focus:outline-none focus:ring
                      "
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <span class="text-xs font-medium text-gray-type-8"
                      >Rows per page:</span
                    >
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import Spinner from "@/components/layout/Spinner";

export default defineComponent({
  components: { Spinner },
  props: {
    items: {
      type: Array
    },
    fields: {
      type: Array,
      required: true
    },
    loading: Boolean,
    errorLoading: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: 'auto'
    },
    usePagination: {
      type: Boolean,
      default: true
    },
    extraOptions: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['pageChange', 'sizeChange', 'rowClicked'],
  data() {
    return {
      pagination: {
        itemsPerPage: 10,
        currentPage: 1
      },
      tableOptions: null
    };
  },
  watch: {
    'pagination.itemsPerPage' (value, oldValue) {
      if (value !== oldValue && value !== this.tableOptions.itemsPerPage) {
        this.$emit('sizeChange', value);
        this.pagination.currentPage = 1;
        this.tableOptions.itemsPerPage = value;
      }
    },
    'extraOptions.totalSize' (value, oldValue) {
      if (value !== oldValue) {
        this.tableOptions.totalSize = value;
      }
    },
    items (value, old) {
      // console.log({ value, old });
    }
  },
  created() {
    this.initDefaultOptions(this.extraOptions);
  },
  computed: {
    total () {
      return this.tableOptions.serverSide
        ? this.tableOptions.totalSize
        : this.items.length;
    },
    paginationStartIndex () {
      return (
        this.paginationItemsPerPage * this.pagination.currentPage -
        this.paginationItemsPerPage +
        1
      );
    },
    paginationItemsPerPage () {
      return parseInt(this.pagination.itemsPerPage);
    },
    tableItems () {
      if (this.usePagination && !this.tableOptions.serverSide) {
        return this.items.slice(
          this.paginationStartIndex - 1,
          this.paginationStartIndex + this.paginationItemsPerPage - 1
        );
      }
      return this.items;
    },
    paginationTotalPages () {
      return Math.ceil(
        (this.tableOptions.serverSide
          ? this.tableOptions.totalSize
          : this.items.length) / this.paginationItemsPerPage
      );
    },
    paginationIsInLastPage () {
      return this.pagination.currentPage === this.paginationTotalPages;
    },
    paginationIsInFirstPage () {
      return this.pagination.currentPage === 1;
    }
  },
  methods: {
    handleRowClick(item) {
      this.$emit('rowClicked', item);
    },
    initDefaultOptions (options) {
      this.tableOptions = Object.assign(
        {},
        {
          serverSide: false,
          itemsPerPage: 10,
          currentPage: 1,
          totalSize: 0
        },
        options || {}
      );
      this.pagination.currentPage = this.tableOptions.currentPage;
      this.pagination.itemsPerPage = this.tableOptions.itemsPerPage;
    },
    getPropPath (obj, path) {
      if (!path) {
        return;
      }
      const units = path.split(',');
      const vals = [];
      units.forEach((i) => {
        vals.push(this.getProp(obj, i.split('.')));
      });
      return vals.join(' ');
    },
    getProp (obj, props) {
      const prop = props.shift();
      if (!obj[prop] || !props.length) {
        return obj[prop];
      }
      return this.getProp(obj[prop], props);
    },
    prevPage () {
      let page = this.pagination.currentPage - 1;
      if (page < 1) {
        page = 1;
      }
      this.pagination.currentPage = page;
      this.$emit('pageChange', this.pagination.currentPage);
    },
    nextPage () {
      let page = this.pagination.currentPage + 1;
      if (page > this.paginationTotalPages) {
        page = this.paginationTotalPages;
      }
      this.pagination.currentPage = page;
      console.log({ page });
      this.$emit('pageChange', this.pagination.currentPage);
    }
  }
});
</script>
