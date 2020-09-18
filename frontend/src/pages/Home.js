import Layout from '../components/Layout';
import { Logo, Subtitle, Button, Footer } from '../components/exports';

export function Home() {
    return(
        <Layout title="Ketu">
            <Logo />
            <Subtitle text="What do you want to do?"/>
            <div id="button-group" class="py-4">
                <Button text="Hide File" />
                <Button text="Show File" />
            </div>
            <div class="py-8">
                <Footer>
                    Made with <span>❤️️</span> by Utkarsh Dubey.
                </Footer>
            </div>
        </Layout>
    )
}