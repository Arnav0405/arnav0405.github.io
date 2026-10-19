import { internships } from "./experience";
export const experiencePage = 5;
export const toolboxPage = experiencePage + Math.ceil(internships.length / 2) * 2;
export const papersPage = toolboxPage + 2;
export const worksPage = papersPage + 2;
