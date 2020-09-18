export default function Layout(props) {
    if(props.title) {
        document.title = props.title;
    }
    return(
        <>
            <div class="container mx-auto bg-purple-200">
                {props.children}
            </div>
        </>
    )
}