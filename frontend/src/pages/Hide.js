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
            set(parentFileHidden, {uploaded: true, fileName: res.fileName});
        }
    });
}

export function HidePage() {
    const filename = useSharedStateValue(parentFileHidden);
    return(
        <>
        <Layout title="Ketu">
            <Logo />
            <Subtitle text="Select the file you want to hide."/>
            <div class="my-5">
                <UploadButton onClick={openFileDialog} />
            </div>
            <span>{filename.fileName}</span>
            <div class="my-2">
                <Footer>
                    * Should not be large if your image is not big enough.
                </Footer>
            </div>
        </Layout>
        </>
    )
} 