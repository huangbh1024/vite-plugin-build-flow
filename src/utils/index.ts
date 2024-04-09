import { execSync } from 'child_process';

export const dateFormat = (fmt: string, date: Date) => {
  const o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};

export const getGitInfo = () => {
  try {
    const builder = execSync('git config user.name').toString().trim(); // 生成构建作者
    const commitHash = execSync('git show -s --format=%H').toString().trim(); // 最后一次提交的commit hash
    const commitMsg = execSync('git show -s --format=%s').toString().trim(); // 最后一次提交的commit message
    const localBranchName = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim(); // 本地分支名称
    const branchName = execSync(
      `git rev-parse --abbrev-ref ${localBranchName}@{upstream}`
    )
      .toString()
      .trim(); // 远程分支名称
    const commitDate = dateFormat(
      'yyyy-MM-dd hh:mm:ss',
      new Date(execSync('git show -s --format=%cd').toString())
    ); // 最后一次提交的时间
    return {
      builder,
      commitHash,
      commitMsg,
      localBranchName,
      branchName,
      commitDate,
      status: 'success',
    };
  } catch (error) {
    return {
      builder: '',
      commitHash: '',
      commitMsg: '',
      localBranchName: '',
      branchName: '',
      commitDate: '',
      status: 'error',
    };
  }
};
