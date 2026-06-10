// src/cluster.js
import cluster from 'cluster'
import os from 'os'

const numCPUs = os.cpus().length

if(cluster.isPrimary){
    console.log(`Master process ${process.pid} is running`)
    // on free tier there's only 1 CPU so just fork 1
    const workers = Math.max(1, numCPUs)
    console.log(`Forking ${workers} workers...`)

    for(let i = 0; i < workers; i++){
        cluster.fork()
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`)
        cluster.fork()
    })
} else {
    import('./app.js')
    console.log(`Worker ${process.pid} started`)
}