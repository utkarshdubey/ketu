import { useState, redirect } from '@hydrophobefireman/ui-lib';
import Layout from '../components/Layout';
import { Logo, Subtitle, Footer, UploadButton } from '../components/exports';
import { set, useSharedStateValue } from 'statedrive';

// Shared State
import { parentFileDecrypt, childFileDecrypt, stepDecrypt } from '../state/atoms';

function clearCache() {
    set(parentFileDecrypt, {uploaded: false, fileName: null});
    set(childFileDecrypt, {fileName: null});
    window.electron.ipcRenderer.send('clearDecryptCache');
}

function openParentFileDialog() {
    window.electron.ipcRenderer.invoke('selectParentFileForDecrypting').then(res => {
        if(!res.error){
            set(parentFileDecrypt, {uploaded: true, fileName: res.fileName});
            set(stepDecrypt, 2);
        }
    })
}

export function DecryptPage() {
    const parentFile = useSharedStateValue(parentFileDecrypt);
    const childFile = useSharedStateValue(childFileDecrypt);

    const step = useSharedStateValue(stepDecrypt);

    if (step === 0) {
        return <Step0 parentFile={parentFile} />;
    } else if (step === 2) {
        return <Step2 />;
    } else if (step === 3) {
        return <Step3 parentFile={parentFile} childFile={childFile} />
    } else {
        return <Step1 />;
    }
}

function Step0(props) {
    function handleGoBack() {
        redirect('/');
        set(stepDecrypt, 1);
        clearCache();
    }
    return(
        <Layout title="Ketu | Error">
            <Logo />
            <h1 class="subtitle">
                We searched deep inside {" "} <span class="text-purple-700">{props.parentFile.fileName}</span>. But couldn't find anything.
            </h1>
            <div class="my-3">
                <button type="submit" class="bg-purple-700 hover:bg-purple-500 text-white px-24 py-4 rounded-sm shadow-2xl" onClick={handleGoBack}>
                    Go back
                </button>
            </div>
            <div class="my-2">
                <Footer>Maybe your password was wrong?.</Footer>
            </div>
        </Layout>
    )
}

function Step1() {
    return(
        <Layout title="Ketu | Hide">
            <Logo />
            <Subtitle text="Select the file you want to decrypt." />
            <div class="my-5">
                <UploadButton onClick={openParentFileDialog} />
            </div>
            <div class="my-2">
                <Footer>* Should contain the encrypted file contents.</Footer>
            </div>
        </Layout>
    )
}

function Step2() {
    const [password, setPassword] = useState("");

    function selectDirectoryDialog(e) {
        e.preventDefault();
        if(password == "") {
            console.log(password);
        }
        window.electron.ipcRenderer.invoke('decryptHiddenFile', {password: password}).then(res => {
            console.log(res);
            if(!res.error) {
                console.log(res.successfull);
                if(res.successfull) {
                    set(childFileDecrypt, res.childFile);
                    set(stepDecrypt, 3);
                    clearCache();
                } else {
                    set(stepDecrypt, 0);
                }
                // console.log(res);
            }
        })
    }

    return(
        <Layout title="Ketu | Hide">
            <Logo />
            <h1 class="subtitle px-1">
                Enter the password(if any) required to decrypt.
            </h1>
            <div class="my-5">
                <form onSubmit={selectDirectoryDialog}>
                    <div class="w-full">
                        <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="Password (no spaces)" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div class="my-3">
                        <button type="submit" class="bg-purple-700 hover:bg-purple-500 text-white px-24 py-4 rounded-sm shadow-2xl">
                            Choose folder to extract decrypted file
                        </button>
                    </div>
                </form>
            </div>
            <div class="my-2">
                <Footer>* Leave  the password field blank if there wasn’t one.</Footer>
            </div>
        </Layout>
    )
}

function Step3(){
    function handleGoBack() {
        redirect('/');
        set(stepDecrypt, 1);
    }
    return(
        <Layout title="Ketu | Hide">
            <Logo />
            <Subtitle text="kokok." />
            <div class="my-3">
                <button type="submit" class="bg-purple-700 hover:bg-purple-500 text-white px-24 py-4 rounded-sm shadow-2xl" onClick={handleGoBack}>
                    Go back
                </button>
            </div> 
        </Layout>
    )
}