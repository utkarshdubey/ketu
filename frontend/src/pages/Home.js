import Layout from '../components/Layout';
import { Logo, Subtitle, Button, Footer } from '../components/exports';

export function Home() {
    return(
        <Layout title="Ketu">
            <Logo />
            <Subtitle text="What do you want to do?"/>
            <div id="button-group" class="py-4">
                <Button text="Hide File" redirect="/hide" />
                <Button text="Decrypt File" redirect="/decrypt" />
            </div>
            <div class="py-8">
                <Footer>
                    Made with <span>❤️️</span> by Utkarsh Dubey.
                </Footer>
            </div>
        </Layout>
    )
}