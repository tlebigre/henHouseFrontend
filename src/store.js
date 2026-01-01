import { writable } from "svelte/store";

const languageItem = typeof localStorage !== 'undefined' ? localStorage.getItem("lang") : "";
export const language = writable(languageItem);
if( typeof localStorage !== 'undefined')
    language.subscribe(value => localStorage.setItem("lang", value || ""));