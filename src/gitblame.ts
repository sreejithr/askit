export class GitBlame {

    public static getInstance(repoPath: string, gitBlameProcess: any): GitBlame {
        if (!this.instance) {
            this.instance = new GitBlame(repoPath, gitBlameProcess);
        }
        return this.instance;
    }

    private static instance: GitBlame;
    private _blamed: Object;

    constructor(private repoPath: string, private gitBlameProcess: any) {
        this._blamed = {};
    }

    getBlameInfo(fileName: string): Thenable<any> {
        const self = this;
        return new Promise<any>((resolve, reject) => {

            if (self.needsBlame(fileName)) {
                self.blameFile(self.repoPath, fileName).then((blameInfo) => {
                    (self._blamed as any)[fileName] = blameInfo;
                    resolve(blameInfo);
                }, (err) => {
                    reject(err);
                });
            } else {
                resolve((self._blamed as any)[fileName]);
            }
        });
    }

    needsBlame(fileName: string): boolean {
        return !(fileName in this._blamed);
    }

    blameFile(repo: string, fileName: string): Thenable<Object> {
        const self = this;
        return new Promise<Object>((resolve, reject) => {
            const blameInfo = {
                'lines': {},
                'commits': {}
            };

            self.gitBlameProcess(repo, {
                file: fileName
            }).on('data', (type: any, data: any) => {
                // outputs in Porcelain format.
                if (type === 'line') {
                    (blameInfo as any)['lines'][data.finalLine] = data;
                } else if (type === 'commit' && !(data.hash in blameInfo['commits'])) {
                    (blameInfo as any)['commits'][data.hash] = data;
                }
            }).on('error', (err: any) => {
                reject(err);
            }).on('end', () => {
                resolve(blameInfo);
            });
        });
    }

    dispose() {
        // Nothing to release.
    }
}

