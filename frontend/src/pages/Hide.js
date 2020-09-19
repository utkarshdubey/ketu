import { useEffect } from '@hydrophobefireman/ui-lib';
import Layout from '../components/Layout';
import { Logo, Subtitle, Button, Footer } from '../components/exports';

export function HidePage() {
    useEffect(() => {
        if(window.isElectron) {
            console.log(window.dialog);
        }
    }, [])
    return(
        <>
        <Layout title="Ketu">
            <Logo />
            <Subtitle text="Upload the file you want to hide."/>
            <button onClick={() => { window.dialog.showOpenDialog({ properties: ['openFile']})}}>bruh</button>
            <div class="py-8">
                <Footer>
                    * Should not be large if your image is not big enough.
                </Footer>
            </div>
        </Layout>
        </>
    )
} 