import { inject, injectable } from 'inversify';
import { FileSystem } from '@theia/filesystem/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import URI from '@theia/core/lib/common/uri';


export interface ReadOnlyObject {
    readOnlyPaths: string[];
}


@injectable()
export class ReadOnlyConfiguration {
    protected readonly READONLYFILEPATH = '.theia';
    protected readonly READONLYFILE = 'hackerrank.json';

    constructor(
        @inject(WorkspaceService) 
        protected readonly workspaceService: WorkspaceService,
        @inject(FileSystem) 
        protected readonly filesystem: FileSystem
    ) { }

    async getConfigFileUri(): Promise<URI | undefined> {
        await this.workspaceService.roots;
        const workspace = this.workspaceService.workspace;
        if (workspace) {
            const uri = new URI(workspace.uri);
            return workspace.isDirectory ? uri.resolve(this.READONLYFILEPATH).resolve(this.READONLYFILE) : uri;
        }
    }

    async getReadOnlyFiles(): Promise<Array<string>> {
        const configUri = await this.getConfigFileUri();
        if (configUri) {
            const readOnlyPaths = await this.getConfigResolve(configUri);
            return new Promise<Array<string>>((res, rej) => {
                res(readOnlyPaths);
            });
        }
        else {
            return new Promise<Array<string>>((res, rej) => {
                res([]);
            });
        }
    }

    async getConfigResolve(rootUri: URI): Promise<Array<string>> {
        const configFilePath = rootUri.toString();
        if (await this.filesystem.exists(configFilePath)) {
            try {
                const fileObject = await this.filesystem.resolveContent(configFilePath, { encoding: 'utf8' });
                const dataContent: ReadOnlyObject = JSON.parse(fileObject.content);
                return Array.isArray(dataContent.readOnlyPaths) ? dataContent.readOnlyPaths : [];
            } catch (err) {
                console.log(err);
                return [];
            }
        } else {
            return [];
        }
    }

    protected getConfigFileUri2(rootDir: URI): string {
        return rootDir.resolve(this.READONLYFILEPATH).resolve(this.READONLYFILE).toString()
    }
}
