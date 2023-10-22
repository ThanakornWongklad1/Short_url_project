import Swal from 'sweetalert2'
const getAllData = async () => {
    try {
        const res = await fetch(import.meta.env.VITE_ROOT_API + `/api/data`)
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};
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

export { getAllData, copyToClipboard };