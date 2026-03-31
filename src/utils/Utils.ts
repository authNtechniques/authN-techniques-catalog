import { MarkdownFile } from "@/common/markdown-file";

export default class Utils {

    public static sortMarkdownFiles(file1: MarkdownFile, file2: MarkdownFile) {
        return file1.position - file2.position;
    }

}

