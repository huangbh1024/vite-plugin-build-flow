"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vitePluginBuildFlow = void 0;
const child_process_1 = require("child_process");
function vitePluginBuildFlow({ version }) {
    let state = 'success';
    // git 提交记录信息 https://git-scm.com/docs/git-show    https://git-scm.com/docs/git
    let builder = '';
    let commitHash = '';
    let localBranchName = '';
    let branchName = '';
    let commitDate = '';
    try {
        builder = (0, child_process_1.execSync)('git config user.name').toString().trim(); // 生成构建作者
        commitHash = (0, child_process_1.execSync)('git show -s --format=%H').toString().trim(); // 最后一次提交的commit hash
        localBranchName = (0, child_process_1.execSync)('git rev-parse --abbrev-ref HEAD')
            .toString()
            .trim(); // 本地分支名称
        branchName = (0, child_process_1.execSync)(`git rev-parse --abbrev-ref ${localBranchName}@{upstream}`)
            .toString()
            .trim(); // 远程分支名称
        commitDate = new Date((0, child_process_1.execSync)('git show -s --format=%cd').toString()).toLocaleString(); // 最后一次提交的时间
    }
    catch (error) {
        state = 'error';
    }
    const buildDate = new Date().toLocaleString();
    const versionBgColor = {
        success: '#41b883',
        error: '#c41a16',
    };
    const versionStr = `console.groupCollapsed('%c Version %c ${version}%c', 'background:${versionBgColor[state]}; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#35495e ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent')`;
    const branchNameStr = state !== 'error'
        ? `console.log('分支名称. . . . . . . . : ${branchName}')`
        : '';
    const localBranchNameStr = state !== 'error'
        ? `console.log('本地分支. . . . . . . . : ${localBranchName}')`
        : '';
    const commitHashStr = state !== 'error'
        ? `console.log('提交哈希. . . . . . . . : ${commitHash}')`
        : '';
    const commitDateStr = state !== 'error'
        ? `console.log('提交时间. . . . . . . . : ${commitDate}')`
        : '';
    const buildDateStr = `console.log('构建时间. . . . . . . . : ${buildDate}')`;
    const builderStr = state !== 'error'
        ? `console.log('构建人员. . . . . . . . : ${builder}')`
        : '';
    const nodeVersion = (0, child_process_1.execSync)('node -v').toString().trim();
    const nodeVersionStr = `console.log('node版本. . . . . . . . : ${nodeVersion}')`;
    // 生成需要插入html的数据
    const message = `
        ${versionStr}
        ${branchNameStr}
        ${localBranchNameStr}
        ${commitHashStr}
        ${commitDateStr}
        ${buildDateStr}
        ${builderStr}
        ${nodeVersionStr}
        console.groupEnd()
    `;
    return {
        name: 'vite-plugin-build-flow',
        apply: 'build',
        transformIndexHtml() {
            return [
                {
                    tag: 'script',
                    attrs: { defer: true },
                    injectTo: 'body',
                    children: message,
                },
            ];
        },
    };
}
exports.vitePluginBuildFlow = vitePluginBuildFlow;
//# sourceMappingURL=index.js.map