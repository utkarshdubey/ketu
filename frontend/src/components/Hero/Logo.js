import { redirect } from '@hydrophobefireman/ui-lib';

function backToHome() {
    redirect('/');
}

export function Logo() {
    return(
        <>
            <span class="logo py-4" onClick={backToHome}>
                Ketu
            </span>
        </>
    )
}