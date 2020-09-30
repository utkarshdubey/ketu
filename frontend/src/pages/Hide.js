import { useState, redirect } from '@hydrophobefireman/ui-lib';
import Layout from '../components/Layout';
import { Logo, Subtitle, Footer, UploadButton } from '../components/exports';
import { set, useSharedStateValue } from 'statedrive';

// Shared State
import { parentFileHidden } from '../state/atoms';

function openFileDialog() {
    window.electron.ipcRenderer.invoke('hideFile').then(res => {
        // console.log(res);
        if(!res.error) {
            set(parentFileHidden, res.fileName);
        }
    });
}

export function HidePage() {
    const filename = useSharedStateValue(parentFileHidden);
    return(
        <>
        <Layout title="Ketu">
            <Logo />
            <Subtitle text="Upload the file you want to hide."/>
            <div class="my-4">
                <UploadButton onClick={openFileDialog} />
            </div>
            <span>{filename}</span>
            <div class="py-8">
                <Footer>
                    * Should not be large if your image is not big enough.
                </Footer>
            </div>
        </Layout>
        </>
    )
} 