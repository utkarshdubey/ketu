export default function Layout(props) {
    if(props.title) {
        document.title = props.title;
    }
    return(
        <>
            <div class="container mx-auto">
                {props.children}
            </div>
        </>
    )
}