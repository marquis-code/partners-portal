<template>
  <main class="">
    <div class="overflow-x-auto rounded-md shadow-md bg-white">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="">
          <tr>
            <th
              v-for="(field, index) in fields"
              :key="index"
              class="
                whitespace-nowrap
                px-4
                py-5
                text-left
                font-medium
                text-gray-900
              "
            >
              {{ field }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            class=""
            v-for="(tableContent, index) in tableContents"
            :key="index"
            :class="[index % 2 == 0 ? 'bg-grays-black-11' : '']"
          >
            <td class="whitespace-nowrap px-4 py-5 text-gray-500">
              {{ tableContent.type }}
            </td>
            <td class="whitespace-nowrap px-4 py-5 text-gray-500">
              {{ tableContent.name }}
            </td>
            <td class="whitespace-nowrap px-4 py-5 text-gray-500">
              {{ tableContent.expiryDate }}
            </td>
            <td class="whitespace-nowrap px-4 py-5 text-gray-500">
              {{ tableContent.status }}
            </td>
            <td class="whitespace-nowrap px-4 py-5 text-gray-500">
              {{ tableContent.dateCreated }}
            </td>
            <td class="whitespace-nowrap px-4 py-5 text-gray-500 pl-9">
              <img src="@/assets/images/actionIcon.svg" />
            </td>
          </tr>
        </tbody>
      </table>
      <div
          class="
            bg-grays-black-11
            px-4
            py-3
            rounded-sm
            shadow-sm
            text-gray-500 text-sm
            w-screen
          "
        >
          <p class="text-sm">Viewing 1 - 3 of {{ tableContents.length + 1 }}</p>
        </div>
    </div>
  </main>
</template>

<script>
export default {
  data () {
    return {
      tableContents: [
        {
          type: 'Vehicle’s license',
          name: 'File001.pdf',
          expiryDate: '20 May 2022',
          status: 'Uploaded',
          dateCreated: '20 May 2022',
          action: ''
        },
        {
          type: 'Central Motor Registry',
          name: 'crm004.pdf',
          expiryDate: '21 May 2022',
          status: 'Uploaded',
          dateCreated: '21 May 2022',
          action: ''
        },
        {
          type: 'Road Worthiness',
          name: 'worthiness_copy004.pdf',
          expiryDate: '21 May 2022',
          status: 'Uploaded',
          dateCreated: '22 May 2022',
          action: ''
        },
        {
          type: 'Proof of Ownership',
          name: 'proof_of_ownership004.pdf',
          expiryDate: '21 May 2022',
          status: 'Uploaded',
          dateCreated: '25 May 2022',
          action: ''
        }
      ],
      fields: [
        'Type',
        'Name',
        'Expiry Date',
        'Status',
        'Date Created',
        'Action'
      ]
    };
  }
};
</script>

<style>
</style>
