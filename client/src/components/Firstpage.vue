<script setup>
import { onMounted, ref } from "vue";
import { getAllData } from "../composable/getData.js";
import isUrl from 'is-url';
import QrcodeVue from 'qrcode.vue'

const data = ref('')
onMounted(async () => {
    data.value = await getAllData()
})

// https://www.shorturl.asia/

const longUrl = ref('')
const addedData = ref('')

const AddData = async (link) => {
    if (isUrl(link)) {
        const res = await fetch(import.meta.env.VITE_ROOT_API +`/api/create-short-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                long_url: link
            })
        })
        if (res.ok) {
            const resData = await res.json();
            addedData.value = link
            data.value = await getAllData()
            return data;
        } else if (res.status === 400) {
            alert('This URL already exists')
        }
        longUrl.value = ''
    } else {
        alert('Please enter a valid URL')
        longUrl.value = ''
    }
}

</script>
 
<template>
    <div class="w-full h-full flex-col">
        <div class="text-5xl text-center mt-32 mb-20">Short URL</div>
        <div class="flex justify-center">
            <input type="text" placeholder="Paste your link." class=" border-2 p-2 w-1/3 rounded-lg" v-model="longUrl">
            <button @click="AddData(longUrl)"
                class="bg-gray-500 text-white px-3 rounded-lg mx-3 hover:bg-gray-400 transition-colors duration-150">
                shrink!
            </button>
        </div>
        <!-- result space -->
        <div class="flex justify-center" v-if="addedData !== ''">
            <!-- QR Code -->
            <div class="p-2 text-center flex-col">
                <div class=" text-lg font-bold">QR-Code</div>
                <!-- dont forgot to change value to shorten link -->
                <qrcode-vue v-if="addedData" :value="addedData" :size="150" level="M" class="mx-auto mt-2" />
            </div>
            <!-- Shorten link -->
            <div class="p-2 mt-12 ml-5">
                <div class="flex-col">
                    <div class="font-bold">
                        Long URL
                    </div>
                    <a :href="addedData" target="_blank"
                        class="font-normal text-blue-600 dark:text-blue-500 hover:underline">
                        {{ addedData }}
                    </a>
                </div>
                <div class="flex-col">
                    <div class="font-bold">
                        Short URL
                    </div>
                    <a :href="addedData" target="_blank"
                        class="font-normal text-blue-600 dark:text-blue-500 hover:underline">
                        {{ addedData }}
                    </a>
                </div>
                <button
                    class="border mt-2 mr-3 p-1 px-3 rounded-lg bg-gray-200 hover:bg-gray-100 transition-colors duration-150">
                    Download QR
                </button>
                <button
                    class="border mt-2 mr-3 p-1 px-3 rounded-lg bg-gray-200 hover:bg-gray-100 transition-colors duration-150">
                    stats
                </button>
            </div>

        </div>
        <!-- history -->
        <div class="w-full flex-col mt-40">
            <div class="grid grid-cols-4 gap-4 justify-center" v-for="shorten in data">
                <a :href="shorten?.long_url" target="_blank"
                    class="mx-3 text-blue-600 dark:text-blue-500 hover:underline">{{ shorten.long_url }}</a>
                <a href="" target="_blank" class="mx-3">{{ shorten.short_url }}</a>
                <div class="mx-3">{{ shorten.clicks }}</div>
                <div class="mx-3">{{ shorten.time }}</div>
            </div>

        </div>

    </div>
</template>
 
<style scoped></style>