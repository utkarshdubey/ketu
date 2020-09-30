import { createState } from 'statedrive';

export const parentFileHidden = createState({initialValue: {uploaded: false, fileName: null}});

export const childFileHidden = createState({initialValue: null});