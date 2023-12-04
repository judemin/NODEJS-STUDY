const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// 멀티스레딩의 경우 exec를 이용해 다른 언어에서 수행하는 것이 좋음
if (isMainThread) { // MainThread
    const threads = new Set();
    threads.add(new Worker(__filename, {
        workerData: { start: 1 },
    }));
    threads.add(new Worker(__filename, {
        workerData: { start: 2 },
    }));

    for (let worker of threads) {
        worker.on('message', (value) => console.log(value, "from worker"));
        worker.on('exit', () => {
            threads.delete(worker);
            if (threads.size === 0) {
                console.log("Exit Worker");
            }
        });
    }
} else { // WorkerThread
    parentPort.on('message', (value) => {
        const data = workerData;
        parentPort.postMessage(data.start + 1);
        parentPort.close();
    });
}