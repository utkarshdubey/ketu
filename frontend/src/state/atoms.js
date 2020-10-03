import { createState } from 'statedrive';

export const stepHidden = createState({initialValue: 1});

export const parentFileHidden = createState({initialValue: {uploaded: false, fileName: null}});

export const childFileHidden = createState({initialValue: {uploaded: false, fileName: null}});