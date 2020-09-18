import { redirect } from "@hydrophobefireman/ui-lib";

export function Button(props) {
    const handleRedirect = () => {
        if(props.redirect) {
            redirect(props.redirect);
        }
    }
    return (
        <>
            <div class="p-2">
                <button type={props.type} class="bg-purple-700 hover:bg-purple-500 text-white font-bold py-3 rounded" style={{width: '18rem'}} onClick={handleRedirect}>
                    {props.text}
                </button>
            </div>
        </>
    )
}