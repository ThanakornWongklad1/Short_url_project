const getAllData = async () => {
    try {
        const res = await fetch(import.meta.env.VITE_ROOT_API +`/api/data`)
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};

export { getAllData };