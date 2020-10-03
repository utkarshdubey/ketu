export function UploadButton(props) {
    return (
        <>
           <div class="p-2">
                <button class={props.type === "light" ? `bg-white text-purple-700 font-bold px-56 py-12 rounded-lg shadow-xl hover:shadow-2xl` : `bg-purple-700 hover:bg-purple-500 text-white font-bold px-56 py-12 rounded-lg shadow-2xl`} {...props}>
                    <div class="gg-folder"></div>
                </button>
            </div>
        </>
    )
}