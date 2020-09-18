export default function Layout(props) {
    if(props.title) {
        document.title = props.title;
    }
    return(
        <>
            <div class="flex flex-col items-center justify-center">
                    {props.children}
            </div>
        </>
    )
}