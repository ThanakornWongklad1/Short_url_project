<script setup>
import { ref } from "vue";
import isUrl from 'is-url';
import QrcodeVue from 'qrcode.vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'


const router = useRouter()
const host = import.meta.env.VITE_ROOT_API + '/'

const longUrl = ref('')
const addedData = ref('')

const AddData = async (link) => {
    if (isUrl(link)) {
        const res = await fetch(import.meta.env.VITE_ROOT_API + `/api/create-short-url`, {
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
            addedData.value = host + resData?.results
            longUrl.value = ''
            return data;
        } else if (res.status === 400) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'This URL already exists',
                showConfirmButton: false,
                timer: 1500
            })
        }
        longUrl.value = ''
    } else {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Please enter a valid URL',
            showConfirmButton: false,
            timer: 1500
        })
        longUrl.value = ''
    }
}

const copyToClipboard = (text) => {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Copied to clipboard',
        showConfirmButton: false,
        timer: 1500
    })
}

const downloadQR = () => {
    const canvas = document.getElementsByTagName('canvas')[0];
    const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qr-code.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
</script>
 
<template>
    <div class="bg-gradient-to-b from-sky-green to-sky-blue w-full h-screen flex justify-center py-10 text-zinc-800">
        <div class="bg-white w-11/12 bg-opacity-50 rounded-3xl px-20">
            <!-- header -->
            <div class="flex justify-between">
                <div class="text-6xl text-white font-bold mt-20 ">Short URL</div>
                <div class="flex text-3xl text-white font-bold mt-10">
                    <button @click="router.push({ name: 'home' })"
                        class="mx-5 hover:text-amber-200 transition-colors duration-150">Home</button>
                    <button @click="router.push({ name: 'history' })"
                        class="mx-5 hover:text-amber-200 transition-colors duration-150">Your Short URL</button>
                </div>
            </div>
            <!-- content -->
            <div class="flex justify-between">
                <div class="flex-col mt-24">
                    <div class="text-6xl font-bold ml-10 mt-20 text-zinc-800">Paste Your Long URL</div>
                    <div class="text-5xl font-bold ml-10 mt-5 text-white">to Shorten</div>
                    <div class="flex mt-32">
                        <input type="text" @keyup.enter="AddData(longUrl)" placeholder="Paste your link here."
                            class="p-4 w-140 rounded-s-xl" v-model="longUrl">
                        <button @click="AddData(longUrl)"
                            class="bg-zinc-800  text-white p-4 hover:bg-zinc-600 transition-colors duration-150 rounded-e-xl">
                            Shorten
                        </button>
                    </div>
                </div>
                <!-- result -->
                <div class="flex-col mr-16 mt-20" v-if="addedData">
                    <div class="flex justify-center text-3xl font-bold">Your Short URL here!</div>
                    <qrcode-vue v-if="addedData" :value="addedData" :size="250" level="M" class="mx-auto mt-5" />
                    <div class="flex justify-center text-2xl font-bold mt-4">Short URL</div>
                    <a :href="addedData" target="_blank"
                        class="flex justify-center text-xl mt-3 text-blue-800 dark:text-blue-900 hover:underline">{{
                            addedData }}</a>
                    <div class="flex justify-center mt-4">
                        <button class="mr-3 p-3 px-3 rounded-lg bg-white hover:bg-gray-100 transition-colors duration-150"
                            @click="downloadQR()">
                            Download QR
                        </button>
                        <button @click="copyToClipboard(addedData)"
                            class="mr-3 p-3 px-3 rounded-lg bg-white hover:bg-gray-100 transition-colors duration-150">
                            copy link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>