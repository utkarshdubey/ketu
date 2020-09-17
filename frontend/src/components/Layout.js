export default function Layout(props) {
    return(
        <>
            <div class="container mx-auto">
                {props.children}
            </div>
        </>
    )
}