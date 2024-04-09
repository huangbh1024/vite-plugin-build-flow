import { Plugin, HtmlTagDescriptor } from 'vite';
import { execSync } from 'child_process';
import { getGitInfo, dateFormat } from './utils/index';
export function vitePluginBuildFlow({ version }: { version: string }): Plugin {
  const {
    branchName,
    builder,
    localBranchName,
    commitDate,
    commitHash,
    status,
  } = getGitInfo();

  const versionBgColor = {
    success: '#41b883',
    error: '#c41a16',
  };
  const versionStr = `console.groupCollapsed('%c Version %c ${version}%c', 'background:${versionBgColor[status]}; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#35495e ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent')`;
  const branchNameStr =
    status !== 'error'
      ? `console.log('分支名称. . . . . . . . : ${branchName}')`
      : '';
  const localBranchNameStr =
    status !== 'error'
      ? `console.log('本地分支. . . . . . . . : ${localBranchName}')`
      : '';
  const commitHashStr =
    status !== 'error'
      ? `console.log('提交哈希. . . . . . . . : ${commitHash}')`
      : '';
  const commitDateStr =
    status !== 'error'
      ? `console.log('提交时间. . . . . . . . : ${commitDate}')`
      : '';
  const buildDateStr = `console.log('构建时间. . . . . . . . : ${dateFormat('yyyy-MM-dd hh:mm:ss', new Date())}')`;
  const builderStr =
    status !== 'error'
      ? `console.log('构建人员. . . . . . . . : ${builder}')`
      : '';

  const nodeVersion = execSync('node -v').toString().trim();
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
    transformIndexHtml(): HtmlTagDescriptor[] {
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
