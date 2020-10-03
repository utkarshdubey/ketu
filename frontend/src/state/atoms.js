import { createState } from 'statedrive';

export const stepHidden = createState({initialValue: 1});

export const stepDecrypt = createState({initialValue: 1});

export const parentFileDecrypt = createState({initialValue: {uploaded: false, fileName: null}});

export const childFileDecrypt = createState({initialValue: {fileName: null}});

export const parentFileHidden = createState({initialValue: {uploaded: false, fileName: null}});

export const childFileHidden = createState({initialValue: {uploaded: false, fileName: null}});