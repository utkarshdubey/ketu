export function UploadButton(props) {
    return (
        <>
           <div class="p-2">
                <button class={`bg-purple-700 hover:bg-purple-500 text-white font-bold px-56 py-12 rounded-lg shadow-2xl`} {...props}>
                    <div class="gg-folder"></div>
                </button>
            </div>
        </>
    )
}