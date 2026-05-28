import cluster from 'cluster'
import os from 'os'

const numCPUs = os.cpus().length

if(cluster.isPrimary){
    console.log(`Master process ${process.pid} is running`)
    console.log(`Forking ${numCPUs} workers...`)

    // spawn one worker per CPU core
    for(let i = 0; i < numCPUs; i++){
        cluster.fork()
    }

    // if a worker dies respawn it
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`)
        cluster.fork()
    })

} else {
    // worker process — run express app
    import('./app.js')
    console.log(`Worker ${process.pid} started`)
}