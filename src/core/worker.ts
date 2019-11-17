// 动态创建webworker
function makeWorker(f: () => any) {
  const pendingJobs = {};
  const worker = new Worker(
    URL.createObjectURL(new Blob([`(${f.toString()})()`]))
  );
  worker.onmessage = data => {
    // 调用resolve，改变Promise状态
    const { sourceUrls, jobId } = data.data;
    pendingJobs[jobId](sourceUrls);
    // 删掉，防止key冲突
    delete pendingJobs[jobId];
  };
  return params =>
    new Promise(resolve => {
      const jobId = String(Math.random());
      pendingJobs[jobId] = resolve;
      worker.postMessage({ jobId, ...params });
    });
}

export { makeWorker };
