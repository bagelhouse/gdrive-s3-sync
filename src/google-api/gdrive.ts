import { google } from "googleapis"
import { OAuth2Client } from "google-auth-library"
import drive from "googleapis/build/src/apis/drive/v3"
import fs from "fs"


type QueryParams = {
  searchFolder: boolean | undefined,
  folderName: string | undefined,
  searchTrashedItems: boolean | false
}

enum QueryType {
  FOLDER_LIST = "FOLDER_LIST",
  FILE_LIST = "FILE_LIST",
}

type QueryTypeKeys = { [key in QueryType]: boolean }

type FileList = {
  files?: drive.drive_v3.Schema$File[];
  incompleteSearch?: boolean | null;
  kind?: string | null;
  nextPageToken?: string | null;
  folderId?: string | "ALL_FILES"
  folderName?: string | "ALL_FILES"
}


export default class GDriver {

  gDrive: drive.drive_v3.Drive
  queries: Array<QueryParams>
  queryFileData: Array<drive.drive_v3.Schema$File & { queryString: string }>
  queryFolderStrings: Array<string>
  queryFolderData: Array<drive.drive_v3.Schema$FileList & { searchTrashedItems: boolean | false }>
  searchAllFiles: boolean | false


  constructor(params: {
    authConstruct: OAuth2Client
    queries: Array<QueryParams>,
    searchAllFiles?: boolean | false
  }) {
    this.gDrive = google.drive({ version: "v3", auth: params.authConstruct })
    this.queries = params.queries
    this.queryFolderStrings = []
    this.queryFileData = []
    this.queryFolderData = []
    this.searchAllFiles = params.searchAllFiles || false
  }

  fileListConstructor(fileList: FileList, folderId?: string, folderName?: string): FileList {
    if (this.searchAllFiles) {
      return { ...fileList, folderId: "ALL_FILES", folderName: "ALL_FILES" }
    }
    else {
      return { ...fileList, folderId: folderId, folderName: folderName }
    }
  }

  queriesConstructor(queryType: QueryTypeKeys) {
    if (queryType.FOLDER_LIST) {
      this.queries.forEach((query: QueryParams) => {
        this.queryFolderStrings.push(
          `name = "${query.folderName}" 
          and mimeType = "application/vnd.google-apps.folder" 
          and trashed = ${query.searchTrashedItems.toString()}`
        )
      })
    }
    else if (queryType.FILE_LIST) {
      this.queryFolderData.forEach((folder) => {
        if (folder.files) {
          folder.files.forEach((query) => {
            this.queryFileData.push({
              ...query,
              queryString:
                `"${query.id}" in parents 
              and trashed = ${folder.searchTrashedItems.toString()}`
            })
          })
        }
      })
    }
  }

  async listFolders() {
    const queryType = { FOLDER_LIST: true, FILE_LIST: false }
    this.queriesConstructor(queryType)

    try {
      await Promise.all(this.queries.map(async (query, index) => {
        const res = await this.gDrive.files.list({ q: this.queryFolderStrings[index] })
        this.queryFolderData.push({ ...res.data, searchTrashedItems: query.searchTrashedItems })
      }))
    }
    catch (err) {
      console.log(err)
    }
  }

  async listFiles(): Promise<Array<FileList> | undefined> {
    try {
      const results: Array<object> = []
      if (this.searchAllFiles) {
        const res = await this.gDrive.files.list()
        const fileList = this.fileListConstructor(res.data)
        results.push(fileList)
      }
      else {
        await this.listFolders()
        const queryType = { FOLDER_LIST: false, FILE_LIST: true }
        this.queriesConstructor(queryType)
        await Promise.all(this.queryFileData.map(async (query) => {
          const res = await this.gDrive.files.list({ q: query.queryString })
          const fileList = this.fileListConstructor(
            res.data,
            query.id ? query.id : undefined,
            query.name ? query.name : undefined
          )
          results.push(fileList)
        }))
        return results
      }
    }
    catch (err) {
      console.log(err)
    }
  }


  async downLoadFiles(fileList: Array<FileList>) {
    fileList.forEach((folder) => {
      if (folder.files) {
        folder.files.forEach(async (file) => {
          if (file.id) {
            const outDir = `./tmp/${folder.folderName}/`
            if (!fs.existsSync(outDir)) {
              fs.mkdirSync(outDir, { recursive: true })
            }
            console.log(`${outDir}/${file.id}.jpg`)
            const tempDestination = fs.createWriteStream(`${outDir}/${file.id}.jpg`)
            const fileDownload = await this.gDrive.files.get({
              fileId: file.id,
              alt: "media",
            }, { responseType: "stream" })
            fileDownload.data.on("end", function () {
              console.log("Done")
            })
            fileDownload.data.on("error", function (err) {
              console.log("Error during download", err)
            })
            fileDownload.data.pipe(tempDestination)
          }
        })
      }
    })
  }
}
