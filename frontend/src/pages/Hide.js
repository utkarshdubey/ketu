import { useState, redirect } from '@hydrophobefireman/ui-lib';
import Layout from '../components/Layout';
import { Logo, Subtitle, Footer, UploadButton } from '../components/exports';
import { set, useSharedStateValue } from 'statedrive';

// Shared State
import { parentFileHidden, childFileHidden, stepHidden } from '../state/atoms';

function clearCache() {
    set(parentFileHidden, {uploaded: false, fileName: null});
    set(childFileHidden, {uploaded: false, fileName: null});
    window.electron.ipcRenderer.send('clearHideCache');
}

function openParentFileDialog() {
    window.electron.ipcRenderer.invoke('hideParentFile', {type: 'parentFile'}).then(res => {
        // console.log(res);
        if(!res.error) {
            set(parentFileHidden, {uploaded: true, fileName: res.fileName});
            set(stepHidden, 3);
        }
    });
}

function openChildFileDialog() {
    window.electron.ipcRenderer.invoke('hideChildFile', {type: 'childFile'}).then(res => {
        if(!res.error) {
            set(childFileHidden, {uploaded: true, fileName: res.fileName});
            set(stepHidden, 2)
            // console.log(res);
        }
    })
}

export function HidePage() {
    const parentFile = useSharedStateValue(parentFileHidden);
    const childFile = useSharedStateValue(childFileHidden);

    const step = useSharedStateValue(stepHidden);
    if (step === 0) {
        return <Step0 />;
    } else if (step === 2) {
        return <Step2 file={childFile} />;
    } else if (step === 3) {
        return <Step3 parentFile={parentFile} childFile={childFile} />;
    } else if (step === 4) {
        return <Step4 />
    } else {
        return <Step1 />;
    }
}

function Step0() {
    function handleGoBack() {
        redirect('/');
        set(stepHidden, 1);
    }
    return(
        <Layout title="Ketu | Error">
            <Logo />
            <Subtitle text="Oops! Something went wrong." />
            <div class="my-3">
                <button type="submit" class="bg-purple-700 hover:bg-purple-500 text-white px-24 py-4 rounded-sm shadow-2xl" onClick={handleGoBack}>
                    Go back
                </button>
            </div>
            <div class="my-2">
                <Footer>Maybe your file was too big in size?.</Footer>
            </div>
        </Layout>
    )
}

function Step1() {
    return(
        <Layout title="Ketu | Hide">
            <Logo />
            <Subtitle text="Select the file you want to hide." />
            <div class="my-5">
                <UploadButton onClick={openChildFileDialog} type="light" />
            </div>
            <div class="my-2">
                <Footer>* Should not be large if your image is not big enough.</Footer>
            </div>
        </Layout>
    )
}

function Step2(props) {
    const file = props.file;
    return(
        <Layout title="Ketu | Hide">
            <Logo />
            <h1 class="subtitle px-1">
                Choose a cover image for{" "}
                <span class="text-purple-700">{file.fileName}</span>
            </h1>
            <div class="my-5">
                <UploadButton onClick={openParentFileDialog} />
            </div>
            <div class="my-2">
                <Footer>* Should not be large if your image is not big enough.</Footer>
            </div>
        </Layout>
    )
}

function Step3(props) {
    const { parentFile, childFile } = props;
    const [password, setPassword] = useState("");
    function saveFileDialog(e) {
        e.preventDefault();
        window.electron.ipcRenderer.invoke('saveHiddenFile', {password: password}).then(res => {
            console.log(res);
            if(!res.error) {
                console.log(res.successfull);
                if(res.successfull) {
                    set(stepHidden, 4)
                    clearCache();
                } else {
                    set(stepHidden, 0);
                    clearCache();
                }
                // console.log(res);
            }
        })
    }

    return(
        <Layout title="Ketu | Hide">
            <Logo />
            <h1 class="subtitle px-1">
                Choose options to hide {" "}
                <span class="text-purple-700">{childFile.fileName}</span> in {" "}
                <span class="text-purple-700">{parentFile.fileName}</span>
            </h1>
            <div class="my-5">
                <form onSubmit={saveFileDialog}>
                    <div class="w-full">
                        <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="Password (no spaces)" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div class="my-3">
                        <button type="submit" class="bg-purple-700 hover:bg-purple-500 text-white px-24 py-4 rounded-sm shadow-2xl">
                            Save Image As
                        </button>
                    </div>
                </form>
            </div>
            <div class="my-2">
                <Footer>* Leave the password field blank if you don’t wish to add one.</Footer>
            </div>  
        </Layout>
    )
}


function Step4(){
    function handleGoBack() {
        redirect('/');
        set(stepHidden, 1);
    }
    return(
        <Layout title="Ketu | Hide">
            <Logo />
            <Subtitle text="File was hidden and saved successfully." />
            <div class="my-3">
                <button type="submit" class="bg-purple-700 hover:bg-purple-500 text-white px-24 py-4 rounded-sm shadow-2xl" onClick={handleGoBack}>
                    Go back
                </button>
            </div> 
        </Layout>
    )
}