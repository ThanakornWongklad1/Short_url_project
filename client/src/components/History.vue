<script setup>
import { onMounted, onUpdated, ref } from "vue";
import { getAllData,copyToClipboard } from "../composable/getData.js";
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const data = ref('')
const host = import.meta.env.VITE_ROOT_API + '/'
onMounted(async () => {
    data.value = await getAllData()
})
onUpdated(async () => {
    data.value = await getAllData()
})

const deleteData = async (shortId) => {
    const res = await fetch(import.meta.env.VITE_ROOT_API + `/api/data/${shortId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (res.ok) {
        data.value = await getAllData()
    } else {
        console.log('cant delete')
    }
}
const showModalDelete = (shortId) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F59E0B',
        cancelButtonColor: '#EF4444',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteData(shortId)
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
}
const formatDateTime = (date) => {
    const d = new Date(date)
    const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "UTC",
    };
    return d.toLocaleString("en-GB", options);
}
</script>
 
<template>
    <div class="bg-gradient-to-b from-sky-green to-sky-blue w-full h-screen flex justify-center py-10 text-zinc-800">
        <div class="bg-white w-11/12 bg-opacity-50 rounded-3xl px-20">
            <!-- header -->
            <div class="flex justify-between">
                <div class="text-6xl text-white font-bold mt-20 ">My Short URL</div>
                <div class="flex text-3xl text-white font-bold mt-10">
                    <button @click="router.push({ name: 'home' })"
                        class="mx-5 hover:text-amber-200 transition-colors duration-150">Home</button>
                    <button @click="router.push({ name: 'history' })"
                        class="mx-5 hover:text-amber-200 transition-colors duration-150">Your Short URL</button>
                </div>
            </div>
            <div class="flex justify-center mt-16 text-lg font-bold">
                <div class="grid grid-cols-12 w-full mx-10">
                    <div class="col-span-3">Long URL</div>
                    <div class="col-span-2">Short URL</div>
                    <div class="text-center">Clicks</div>
                    <div class="col-span-3 text-center">Time</div>
                    <div class="mx-auto">QR Code</div>
                    <div class="text-center col-span-2">Action</div>
                </div>
            </div>
            <div class="text-center text-3xl text-white my-56" v-if="data === undefined || data.length === 0">
                no data
            </div>
            <div v-else>
                <div class="flex justify-center mt-5 bg-white h-28 rounded-xl shadow-xl" v-for="shorted in data">
                    <div class="grid grid-cols-12 mx-5 w-full">
                        <a :href="shorted.long_url" class="col-span-3 overflow-hidden mr-5 my-auto hover:underline">
                            {{ shorted.long_url }}
                        </a>
                        <a :href="host + shorted.short_url" target="_blank" class="col-span-2 my-auto hover:underline">
                            {{ host + shorted.short_url }}
                        </a>
                        <div class="text-center my-auto">{{ shorted.clicks }}</div>
                        <div class="col-span-3 text-center my-auto">{{ formatDateTime(shorted.time) }}</div>
                        <qrcode-vue v-if="shorted" :value="host + shorted.short_url" :size="80" level="M"
                            class="my-auto mx-auto" />
                        <div class="flex w-56 my-auto justify-center col-span-2">
                            <button @click="copyToClipboard(host + shorted.short_url)"
                                class="px-5 h-12 mx-1 rounded-xl bg-amber-400 hover:bg-amber-300 transition-colors duration-150 text-white">copy</button>
                            <button @click="showModalDelete(shorted.short_url)"
                                class="px-5 h-12 mx-1 rounded-xl bg-red-500 hover:bg-red-400 transition-colors duration-150 text-white">delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>